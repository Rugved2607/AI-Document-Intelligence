from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from google import genai
from google.genai import types
from dotenv import load_dotenv
import os
import uuid

load_dotenv()

gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
qdrant_client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY")
)

VECTOR_SIZE = 3072  # gemini-embedding-2 dimension

def get_embedding(text: str, is_query: bool = False) -> list[float]:
    task = "RETRIEVAL_QUERY" if is_query else "RETRIEVAL_DOCUMENT"
    result = gemini_client.models.embed_content(
        model="models/gemini-embedding-2",
        contents=text,
        config=types.EmbedContentConfig(task_type=task)
    )
    return result.embeddings[0].values

def ensure_collection(doc_id: str):
    collections = [c.name for c in qdrant_client.get_collections().collections]
    if doc_id not in collections:
        qdrant_client.create_collection(
            collection_name=doc_id,
            vectors_config=VectorParams(size=VECTOR_SIZE, distance=Distance.COSINE)
        )

def store_chunks(doc_id: str, chunks: list[str]):
    ensure_collection(doc_id)
    points = []
    for i, chunk in enumerate(chunks):
        embedding = get_embedding(chunk)
        points.append(PointStruct(
            id=str(uuid.uuid4()),
            vector=embedding,
            payload={"text": chunk}
        ))
    qdrant_client.upsert(collection_name=doc_id, points=points)
    print(f"Stored {len(chunks)} chunks for doc: {doc_id}")

def retrieve_chunks(doc_id: str, query: str, n: int = 10) -> list[str]:
    ensure_collection(doc_id)

    query_embedding = get_embedding(query, is_query=True)

    results = qdrant_client.query_points(
        collection_name=doc_id,
        query=query_embedding,
        limit=n
    )

    return [point.payload["text"] for point in results.points]
