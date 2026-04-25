from dotenv import load_dotenv
import os

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

GEMINI_EMBED_MODEL = "models/gemini-embedding-2"
GROQ_LLM_MODEL = "llama-3.3-70b-versatile"
GROQ_LLM_MODEL = "llama-3.3-70b-versatile"

CHROMA_DB_PATH = "./chroma_db"
CHUNK_SIZE = 500
CHUNK_OVERLAP = 100
TOP_K_CHUNKS = 10