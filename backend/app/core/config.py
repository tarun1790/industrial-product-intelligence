import os
from pydantic import BaseModel
import torch

class Settings(BaseModel):
    PROJECT_NAME: str = "ProductIQ — Industrial Product Intelligence Engine"
    API_V1_STR: str = "/api/v1"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # GPU / Device configuration
    DEVICE: str = "cuda" if torch.cuda.is_available() else "cpu"
    CUDA_NAME: str = torch.cuda.get_device_name(0) if torch.cuda.is_available() else "None"
    
settings = Settings()
