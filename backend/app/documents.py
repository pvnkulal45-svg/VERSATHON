from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from ai.pdf_extractor import extract_text_from_pdf

from .database import get_db
from .models import Document


router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)


UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Validate file type
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )

    # Create file path
    file_path = UPLOAD_DIR / file.filename

    # Read and save uploaded PDF
    contents = await file.read()
    file_path.write_bytes(contents)

    # Extract text using P4's PDF extractor
    try:
        extracted_text = extract_text_from_pdf(str(file_path))
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to extract PDF text: {str(exc)}"
        )

    # Create database record
    document = Document(
        filename=file.filename,
        file_path=str(file_path),
        extracted_text=extracted_text,
        status="processed"
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    # Return document information
    return {
        "document_id": document.id,
        "filename": document.filename,
        "status": document.status,
        "text": document.extracted_text
    }