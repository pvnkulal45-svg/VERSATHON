from fastapi import FastAPI

from .database import Base, engine
from .models import Document, Topic
from .documents import router as documents_router
from .topics import router as topics_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="LearnFlow API")

app.include_router(documents_router)
app.include_router(topics_router)


@app.get("/")
def root():
    return {"message": "LearnFlow API is running"}


@app.get("/health")
def health():
    return {"status": "ok", "service": "LearnFlow API"}