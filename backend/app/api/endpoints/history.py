from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import ImageGeneration, User
from app.schemas.image import ImageGeneration as ImageSchema
from app.api.endpoints.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[ImageSchema])
def get_history(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    images = db.query(ImageGeneration).filter(ImageGeneration.user_id == current_user.id).offset(skip).limit(limit).all()
    return images
