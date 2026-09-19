import pypdf
import os

def extract_text(pdf_path: str) -> str:
    """Extracts all text from a given PDF file."""
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"File not found: {pdf_path}")

    reader = pypdf.PdfReader(pdf_path)
    full_text = []

    for index, page in enumerate(reader.pages):
        page_text = page.extract_text()
        if page_text:
            full_text.append(f"--- Page {index + 1} ---\n{page_text}")

    return "\n\n".join(full_text)

if __name__ == "__main__":
    target_pdf = "REPORT.pdf"
    
    print(f"Attempting to extract text from: {target_pdf}\n")
    try:
        result = extract_text(target_pdf)
        if result.strip():
            print("=== EXTRACTED TEXT START ===")
            print(result)
            print("=== EXTRACTED TEXT END ===")
            print("\n✅ Real PDF extraction test PASSED!")
        else:
            print("⚠️ Warning: PDF processed, but no text was found.")
    except Exception as e:
        print(f"❌ Extraction failed: {e}")