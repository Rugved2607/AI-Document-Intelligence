import google.generativeai as genai
from dotenv import load_dotenv
import os
import numpy as np

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def get_embedding(text: str) -> list[float]:
    result = genai.embed_content(
        model="models/gemini-embedding-001",
        content=text
    )
    return result["embedding"]

def cosine_similarity(v1, v2):
    v1, v2 = np.array(v1), np.array(v2)
    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))

if __name__ == "__main__":
    e1 = get_embedding("heart attack")
    e2 = get_embedding("cardiac arrest")
    e3 = get_embedding("cricket match")
    
    print(f"heart attack vs cardiac arrest: {cosine_similarity(e1, e2):.4f}")
    print(f"heart attack vs cricket match:  {cosine_similarity(e1, e3):.4f}")