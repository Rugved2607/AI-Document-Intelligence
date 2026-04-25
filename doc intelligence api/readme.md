# Document Intelligence API

A RAG-based REST API that accepts PDFs and answers natural language queries using semantic search.

## Tech Stack
- FastAPI + Uvicorn
- ChromaDB (vector store)
- Gemini Embeddings (text-embedding-2)
- Groq LLaMA 3.3 70B (answer generation)
- Docker

## Run Locally
1. Clone the repo
2. Create `.env` with `GEMINI_API_KEY` and `GROQ_API_KEY`
3. `pip install -r requirements.txt`
4. `uvicorn main:app --reload`
5. Visit `http://localhost:8000/docs`

## API Endpoints

### POST /upload
Upload a PDF document.
- Input: PDF file
- Output: `doc_id`, `chunks_processed`

### POST /query
Ask a question about an uploaded document.
- Input: `doc_id`, `question`
- Output: `answer`

## Architecture
PDF → Extract Text → Chunk → Gemini Embeddings → ChromaDB
Query → Embed → Similarity Search → Top Chunks → Groq LLM → Answer