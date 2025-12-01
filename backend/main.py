from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.endpoints import auth, images, history
from app.db.base import Base
from app.db.session import engine

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json")

# CORS
origins = [
    "http://localhost:5173",  # Vite default
    "http://localhost:3000",
    "https://safahomes-assignment.vercel.app/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(images.router, prefix=f"{settings.API_V1_STR}/images", tags=["images"])
app.include_router(history.router, prefix=f"{settings.API_V1_STR}/history", tags=["history"])

@app.get("/")
def root():
    return {"message": "Welcome to Safahomes API"}
