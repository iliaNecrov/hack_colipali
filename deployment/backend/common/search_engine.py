import torch
import time
from qdrant_client import QdrantClient
from qdrant_client.http import models
from tqdm import tqdm
from datasets import Dataset
from typing import List, Dict, Any
from colpali_engine.models import ColPali, ColPaliProcessor
import stamina


class VectorDbEngine:
    """Engine to manage vector database interactions with Qdrant."""

    qdrant_client = QdrantClient(url="http://localhost:6333/")

    def __init__(self, data: List[Dict[str, Any]], colpali_model, colpali_processor, collection_name: str):
        """
        Initialize the vector database engine.

        Args:
            data: List of data entries to be indexed.
            colpali_model: Model for generating image embeddings.
            colpali_processor: Processor for handling image data.
            collection_name: Name of the Qdrant collection.
        """
        self.dataset = Dataset.from_list(data)
        self.colpali_model = colpali_model
        self.colpali_processor = colpali_processor
        self.collection_name = collection_name
        self._create_collection()
        self._create_vector_storage()
        self._update_collection()

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

                # Process and encode images
                with torch.no_grad():
                    batch_images = self.colpali_processor.process_images(images).to(
                        self.colpali_model.device
                    )
                    image_embeddings = self.colpali_model(**batch_images)

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

    model_name = "davanstrien/finetune_colpali_v1_2-ufo-4bit"
    processor_name = "vidore/colpaligemma-3b-pt-448-base"

    def __init__(self, data: List[Dict[str, Any]], collection_name: str = "documents"):
        """
        Initialize the search engine.

        Args:
            data: List of data entries to be processed.
            collection_name: Name of the Qdrant collection.
        """
        self.colpali_model = ColPali.from_pretrained(
            self.model_name,
            torch_dtype=torch.bfloat16,
            device_map="cuda:0",
        )
        self.colpali_processor = ColPaliProcessor.from_pretrained(self.processor_name)
        super().__init__(data, self.colpali_model, self.colpali_processor, collection_name)

    def query(self, text: str) -> List[models.PointStruct]:
        """
        Query the Qdrant collection with a text.

        Args:
            text: Query text to search against the collection.

        Returns:
            List of points matching the query.
        """
        with torch.no_grad():
            batch_query = self.colpali_processor.process_queries([text]).to(
                self.colpali_model.device
            )
            query_embedding = self.colpali_model(**batch_query)

        multivector_query = query_embedding[0].cpu().float().numpy().tolist()

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

        return search_result.points
