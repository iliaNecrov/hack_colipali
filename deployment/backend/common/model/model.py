from typing import cast
from colpali_engine.models import ColQwen2Processor
from colpali_engine.utils.torch_utils import get_torch_device
from peft import LoraConfig
from transformers.models.qwen2_vl import Qwen2VLProcessor
import torch

from common.model.qwen import ColQwen2ForRAG

model_name = "vidore/colqwen2-v1.0"
device = get_torch_device("auto")

print(f"Using device: {device}")

lora_config = LoraConfig.from_pretrained(model_name)

# Load the processors
processor_retrieval = cast(ColQwen2Processor, ColQwen2Processor.from_pretrained(model_name))
processor_generation = cast(Qwen2VLProcessor, Qwen2VLProcessor.from_pretrained(lora_config.base_model_name_or_path))

# Load the model with the loaded pre-trained adapter for retrieval
model = cast(
    ColQwen2ForRAG,
    ColQwen2ForRAG.from_pretrained(
        model_name,
        torch_dtype=torch.bfloat16,
        device_map=get_torch_device(),
    ),
)