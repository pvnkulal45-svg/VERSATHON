from fastapi import FastAPI

from .database import Base, engine
from .documents import router as documents_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="LearnFlow API")

app.include_router(documents_router)


@app.get("/")
def root():
    return {"message": "LearnFlow API is running"}


@app.get("/health")
def health():
    return {"status": "ok", "service": "LearnFlow API"}