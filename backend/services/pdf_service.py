import os
import re
from pypdf import PdfReader

class ScannedPdfError(Exception):
    pass

class UnsupportedFileError(Exception):
    pass

def clean_extracted_text(text: str) -> str:
    if not text:
        return ""
    # Normalize newline sequences
    text = text.replace('\r\n', '\n').replace('\r', '\n')
    # Remove excessive blank lines (more than 2 consecutive newlines)
    text = re.sub(r'\n{3,}', '\n\n', text)
    # Remove excessive inline spaces
    lines = [re.sub(r'[ \t]+', ' ', line).strip() for line in text.split('\n')]
    cleaned = '\n'.join(lines).strip()
    return cleaned

def extract_text_from_file(filepath: str):
    """
    Extracts text from PDF or TXT file.
    Returns tuple: (extracted_text, page_count)
    Raises ScannedPdfError if PDF text is empty/unreadable.
    Raises UnsupportedFileError if file extension is not supported.
    """
    ext = os.path.splitext(filepath)[1].lower()
    
    if ext == '.txt':
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            cleaned = clean_extracted_text(content)
            if not cleaned or len(cleaned) < 10:
                raise ScannedPdfError("The uploaded text file is empty or unreadable.")
            return cleaned, 1
        except Exception as e:
            if isinstance(e, ScannedPdfError):
                raise e
            raise ScannedPdfError(f"Error reading TXT file: {str(e)}")
            
    elif ext == '.pdf':
        try:
            reader = PdfReader(filepath)
            total_pages = len(reader.pages)
            if total_pages == 0:
                raise ScannedPdfError("Unable to extract readable text from this PDF. Please upload a text-based PDF.")
            
            extracted_pages = []
            for i, page in enumerate(reader.pages):
                page_text = page.extract_text()
                if page_text:
                    extracted_pages.append(page_text)
                    
            combined_text = "\n\n".join(extracted_pages)
            cleaned = clean_extracted_text(combined_text)
            
            # Check if text length is insufficient (scanned/image-only PDF)
            if not cleaned or len(cleaned.strip()) < 50:
                raise ScannedPdfError("Unable to extract readable text from this PDF. Please upload a text-based PDF.")
                
            return cleaned, total_pages
        except Exception as e:
            if isinstance(e, ScannedPdfError):
                raise e
            raise ScannedPdfError(f"Unable to extract readable text from this PDF. Please upload a text-based PDF.")
    else:
        raise UnsupportedFileError(f"Unsupported file format '{ext}'. Please upload a .pdf or .txt file.")

def chunk_text(text: str, max_chunk_size: int = 3500, overlap: int = 300) -> list:
    """
    Splits large text into manageable chunks based on paragraph breaks.
    """
    if len(text) <= max_chunk_size:
        return [text]
        
    paragraphs = text.split('\n\n')
    chunks = []
    current_chunk = []
    current_length = 0
    
    for p in paragraphs:
        p_len = len(p)
        if current_length + p_len + 2 > max_chunk_size and current_chunk:
            chunks.append("\n\n".join(current_chunk))
            # Start new chunk with overlap if possible
            current_chunk = [p]
            current_length = p_len
        else:
            current_chunk.append(p)
            current_length += p_len + 2
            
    if current_chunk:
        chunks.append("\n\n".join(current_chunk))
        
    return chunks
