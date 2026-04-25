import chromadb
from google import genai
from google.genai import types
from config import GEMINI_API_KEY, GEMINI_EMBED_MODEL, TOP_K_CHUNKS



# Gemini client
gemini_client = genai.Client(api_key=GEMINI_API_KEY)

# ChromaDB client
chroma_client = chromadb.PersistentClient(path="./chroma_db")

def get_embedding(text: str, is_query: bool = False) -> list[float]:
    task = "RETRIEVAL_QUERY" if is_query else "RETRIEVAL_DOCUMENT"
    result = gemini_client.models.embed_content(
        model=GEMINI_EMBED_MODEL,
        contents=text,
        config=types.EmbedContentConfig(task_type=task)
    )
    return result.embeddings[0].values

def store_chunks(doc_id: str, chunks: list[str]):
    collection = chroma_client.get_or_create_collection(name=doc_id)  # ChromaDB
    embeddings = [get_embedding(chunk) for chunk in chunks]
    collection.add(
        documents=chunks,
        embeddings=embeddings,
        ids=[f"{doc_id}_{i}" for i in range(len(chunks))]
    )
    print(f"Stored {len(chunks)} chunks for doc: {doc_id}")

def retrieve_chunks(doc_id: str, query: str, n: int = TOP_K_CHUNKS) -> list[str]:
    collection = chroma_client.get_or_create_collection(name=doc_id)  # ChromaDB
    query_embedding = get_embedding(query, is_query=True)
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n
    )
    return results["documents"][0]

if __name__ == "__main__":
    test_chunks = [
        "The patient suffered a heart attack due to blocked arteries.",
        "Cricket match was cancelled due to rain.",
        "Cardiac arrest requires immediate CPR and defibrillation.",
        "The stock market crashed by 500 points today.",
        "Heart disease is the leading cause of death worldwide."
    ]

    # First store
    store_chunks("test_doc", test_chunks)

    # Then retrieve
    results = retrieve_chunks("test_doc", "what happens during a heart attack?")
    print("\nTop 3 relevant chunks:")
    for i, chunk in enumerate(results):
        print(f"\n{i+1}. {chunk}")