from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from .database import get_db
from .models import Topic

router = APIRouter(
    prefix="/documents",
    tags=["Topics"]
)


class TopicCreate(BaseModel):
    name: str
    description: str | None = None


# GET topics for a document
@router.get("/{document_id}/topics")
def get_topics(
    document_id: int,
    db: Session = Depends(get_db)
):
    topics = (
        db.query(Topic)
        .filter(Topic.document_id == document_id)
        .all()
    )

    return {
        "document_id": document_id,
        "topics": [
            {
                "id": topic.id,
                "name": topic.name,
                "description": topic.description
            }
            for topic in topics
        ]
    }


# POST topics for a document
@router.post("/{document_id}/topics")
def create_topics(
    document_id: int,
    topics: list[TopicCreate],
    db: Session = Depends(get_db)
):
    created_topics = []

    for topic_data in topics:
        topic = Topic(
            name=topic_data.name,
            description=topic_data.description,
            document_id=document_id
        )

        db.add(topic)
        created_topics.append(topic)

    db.commit()

    for topic in created_topics:
        db.refresh(topic)

    return {
        "document_id": document_id,
        "topics": [
            {
                "id": topic.id,
                "name": topic.name,
                "description": topic.description
            }
            for topic in created_topics
        ]
    }