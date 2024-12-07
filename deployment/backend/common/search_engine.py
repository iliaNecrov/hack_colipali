import torch
import time
from qdrant_client import QdrantClient
from qdrant_client.http import models
from tqdm import tqdm
from datasets import Dataset
from typing import List, Dict, Any
import stamina
from PIL import Image

from common.model import processor_retrieval, processor_generation, model


def scale_image(image: Image.Image, new_height: int = 1024) -> Image.Image:
    """
    Scale an image to a new height while maintaining the aspect ratio.
    """
    width, height = image.size
    aspect_ratio = width / height
    new_width = int(new_height * aspect_ratio)

    scaled_image = image.resize((new_width, new_height))

    return scaled_image


class VectorDbEngine:
    """Engine to manage vector database interactions with Qdrant."""

    qdrant_client = QdrantClient(url="http://qdrant:6333/")

    def __init__(self, data: List[Dict[str, Any]], collection_name: str):
        """
        Initialize the vector database engine.

        Args:
            data: List of data entries to be indexed.
            collection_name: Name of the Qdrant collection.
        """
        self.dataset = Dataset.from_list(data)
        self.collection_name = collection_name
        try:
            self._create_collection()
            self._create_vector_storage()
            self._update_collection()
        except:
            pass

    def _create_collection(self):
        """Create a collection in Qdrant with specific storage configurations."""
        self.qdrant_client.create_collection(
            collection_name=self.collection_name,
            on_disk_payload=True,  # Store the payload on disk
            vectors_config=models.VectorParams(
                size=128,
                distance=models.Distance.COSINE,
                on_disk=True,  # Move original vectors to disk
                multivector_config=models.MultiVectorConfig(
                    comparator=models.MultiVectorComparator.MAX_SIM
                ),
                quantization_config=models.BinaryQuantization(
                    binary=models.BinaryQuantizationConfig(
                        always_ram=True  # Keep only quantized vectors in RAM
                    ),
                ),
            ),
        )

    @stamina.retry(on=Exception, attempts=3)
    def _upsert_to_qdrant(self, batch: List[models.PointStruct]) -> bool:
        """Upsert a batch of data points to the Qdrant collection."""
        try:
            self.qdrant_client.upsert(
                collection_name=self.collection_name,
                points=batch,
                wait=False,
            )
        except Exception as e:
            print(f"Error during upsert: {e}")
            return False
        return True

    def _update_collection(self):
        """Update the collection with optimization configurations."""
        self.qdrant_client.update_collection(
            collection_name=self.collection_name,
            optimizer_config=models.OptimizersConfigDiff(indexing_threshold=10),
        )

    def _create_vector_storage(self, batch_size: int = 4):
        """Create vector storage for the dataset and upload points to Qdrant."""
        # Use tqdm to create a progress bar
        with tqdm(total=len(self.dataset), desc="Indexing Progress") as pbar:
            for i in range(0, len(self.dataset), batch_size):
                batch = self.dataset[i:i + batch_size]
                images = batch["image"]

                # images = [scale_image(image, new_height=256) for image in images]

                batch_images = processor_retrieval.process_images(images).to(model.device)
                # Process and encode images
                model.enable_retrieval()
                with torch.no_grad():
                    image_embeddings = model.forward(**batch_images)

                # Prepare points for Qdrant
                points = []
                for j, embedding in enumerate(image_embeddings):
                    multivector = embedding.cpu().float().numpy().tolist()
                    points.append(
                        models.PointStruct(
                            id=i + j,
                            vector=multivector,
                            payload={
                                "name": batch["name"][j],
                                "text": batch["text"][j],
                                "page": batch["page"][j],
                            },
                        ),
                    )

                # Upload points to Qdrant
                try:
                    self._upsert_to_qdrant(points)
                except Exception as e:
                    print(f"Error during upsert: {e}")
                    continue

                # Update the progress bar
                pbar.update(batch_size)


class SearchEngine(VectorDbEngine):
    """Search engine for querying vector data from Qdrant."""

    def __init__(self, data: List[Dict[str, Any]], collection_name: str):
        """
        Initialize the search engine.

        Args:
            data: List of data entries to be processed.
            collection_name: Name of the Qdrant collection.
        """

        self.data = data

        super().__init__(self.data, collection_name)

    @staticmethod
    def _get_conversation(image):
        conversation = [
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                    },
                    {
                        "type": "text",
                        "text": "Answer the following question using the input image: {}".format(image),
                    },
                ],
            }
        ]
        return conversation

    def query(self, text: str) -> List:
        """
        Query the Qdrant collection with a text.

        Args:
            text: Query text to search against the collection.

        Returns:
            List of points matching the query.
        """

        batch_queries = processor_retrieval.process_queries([text]).to(model.device)
        model.enable_retrieval()
        with torch.no_grad():
            query_embeddings = model.forward(**batch_queries)

        multivector_query = query_embeddings[0].cpu().float().numpy().tolist()

        start_time = time.time()
        search_result = self.qdrant_client.query_points(
            collection_name=self.collection_name,
            query=multivector_query,
            limit=3,
            timeout=100,
            search_params=models.SearchParams(
                quantization=models.QuantizationSearchParams(
                    ignore=False,
                    rescore=True,
                    oversampling=2.0,
                )
            ),
        )
        end_time = time.time()

        elapsed_time = end_time - start_time
        print(f"Search completed in {elapsed_time:.4f} seconds")

        return [self.dataset[search_point.id] for search_point in search_result.points]

    def get_answer(self, text: str) -> str:
        search_points = self.query(text)
        conversation = self._get_conversation(text)
        text_prompt = processor_generation.apply_chat_template(conversation, add_generation_prompt=True)

        images = []
        for image_info in search_points:
            images.append(image_info["image"])
            break

        images = [scale_image(image, new_height=256) for image in images]

        inputs_generation = processor_generation(
            text=[text_prompt],
            images=images,
            padding=True,
            return_tensors="pt",
        ).to(model.device)

        # Generate the RAG response
        model.enable_generation()
        output_ids = model.generate(**inputs_generation, max_new_tokens=128)

        # Ensure that only the newly generated token IDs are retained from output_ids
        generated_ids = [output_ids[len(input_ids):] for input_ids, output_ids in
                         zip(inputs_generation.input_ids, output_ids)]

        # Decode the RAG response
        output_text = processor_generation.batch_decode(
            generated_ids,
            skip_special_tokens=True,
            clean_up_tokenization_spaces=True)

        return output_text
