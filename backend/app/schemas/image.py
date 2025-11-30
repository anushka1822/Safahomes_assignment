from pydantic import BaseModel
from datetime import datetime

class ImageGenerationBase(BaseModel):
    prompt: str
    provider: str = "pollinations"

class ImageGenerationCreate(ImageGenerationBase):
    pass

class ImageGeneration(ImageGenerationBase):
    id: int
    user_id: int
    image_url: str
    created_at: datetime

    class Config:
        from_attributes = True
