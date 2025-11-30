from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import ImageGeneration, User
from app.schemas.image import ImageGenerationCreate, ImageGeneration as ImageGenerationSchema
from app.api.endpoints.auth import get_current_user
from app.services.image_service import generate_image

router = APIRouter()

@router.post("/generate", response_model=ImageGenerationSchema)
def generate_image_endpoint(
    image_in: ImageGenerationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    image_url = generate_image(image_in.prompt, image_in.provider)
    
    db_image = ImageGeneration(
        user_id=current_user.id,
        prompt=image_in.prompt,
        image_url=image_url,
        provider=image_in.provider
    )
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image
