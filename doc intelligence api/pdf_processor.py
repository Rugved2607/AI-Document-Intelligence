from pypdf import PdfReader
from config import CHUNK_OVERLAP, CHUNK_SIZE

def extract_text(File_Path : str) -> str:
    text = ""
    reader = PdfReader(File_Path)
    for page in reader.pages:
        text += page.extract_text()
    
    return text

def split_into_chunks(text, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    start = 0
    chunks = []
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start = end - overlap
    return chunks

if __name__ == "__main__":
    text = extract_text(File_Path="/Users/rugveddeshpande/Downloads/CS_2026_Syllabus.pdf")
    chunks = split_into_chunks(text=text)
    print(f"Number of Chunks: {len(chunks)}" )
    print(f"\nChunk 2 : {chunks[1]}")
    print(f"\nChunk 3: {chunks[2]}")