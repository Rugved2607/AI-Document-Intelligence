# 📄 AI Document Intelligence

A full-stack RAG (Retrieval-Augmented Generation) application that lets you upload any PDF and ask natural language questions about it. Built with a FastAPI backend and React frontend.

**Live Demo:** [doc-intelligence-frontend.vercel.app](https://doc-intelligence-frontend.vercel.app)

---

## 🏗️ Architecture

```
User uploads PDF
      ↓
FastAPI backend receives file
      ↓
PDF extracted → split into chunks
      ↓
Each chunk embedded via Gemini Embeddings
      ↓
Vectors stored in Qdrant Cloud
      ↓
User asks a question
      ↓
Question embedded → similarity search → top chunks retrieved
      ↓
Chunks + question sent to Groq LLaMA 3.3 70B
      ↓
Answer returned to React frontend
```

---

## 📁 Project Structure

```
├── doc-intelligence-api/        # FastAPI backend
│   ├── main.py                  # API routes (/upload, /query)
│   ├── rag.py                   # RAG pipeline (retrieval + generation)
│   ├── vector_store.py          # Qdrant vector DB operations
│   ├── pdf_processor.py         # PDF extraction and chunking
│   ├── config.py                # Environment configuration
│   ├── Dockerfile               # Container setup
│   └── requirements.txt
│
└── doc-intelligence-frontend/   # React frontend
    ├── src/
    │   └── App.jsx              # Main UI component
    ├── package.json
    └── vite.config.js
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | FastAPI + Uvicorn |
| Embeddings | Google Gemini (`gemini-embedding-2`) |
| Vector Database | Qdrant Cloud |
| LLM | Groq — LLaMA 3.3 70B Versatile |
| Frontend | React + Vite + Tailwind CSS |
| Deployment | Render (backend) · Vercel (frontend) |
| Containerization | Docker |

---

## 🚀 Running Locally

### Backend

```bash
cd doc-intelligence-api
python -m venv venv
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
```

Create a `.env` file:
```
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
QDRANT_URL=your_qdrant_cluster_url
QDRANT_API_KEY=your_qdrant_key
```

Run:
```bash
uvicorn main:app --reload
```

API docs available at `http://localhost:8000/docs`

### Frontend

```bash
cd doc-intelligence-frontend
npm install
npm run dev
```

Update `API_URL` in `src/App.jsx` to `http://localhost:8000` for local development.

---

## 🔌 API Endpoints

### `POST /upload`
Upload a PDF document for processing.

**Request:** `multipart/form-data` with a `file` field (PDF only)

**Response:**
```json
{
  "doc_id": "a1b2c3d4",
  "chunks_processed": 42,
  "message": "Document processed successfully"
}
```

### `POST /query`
Ask a question about an uploaded document.

**Request:**
```json
{
  "doc_id": "a1b2c3d4",
  "question": "What are the main topics covered?"
}
```

**Response:**
```json
{
  "answer": "The document covers..."
}
```

---

## 🌐 Deployment

| Service | Platform | URL |
|---|---|---|
| Backend API | Render | `https://ai-document-intelligence-gqsg.onrender.com` |
| Frontend | Vercel | `https://doc-intelligence-frontend.vercel.app` |

> **Note:** The Render free tier spins down after 15 minutes of inactivity. The first request after inactivity may take 30-60 seconds to respond.

---

## ⚙️ Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google AI Studio API key (for embeddings) |
| `GROQ_API_KEY` | Groq API key (for LLM generation) |
| `QDRANT_URL` | Qdrant Cloud cluster URL |
| `QDRANT_API_KEY` | Qdrant Cloud API key |

---

## 👤 Author

**Rugved Sandeep Deshpande**
Electronics and Telecommunication Engineering, Mumbai

[GitHub](https://github.com/Rugved2607) · [LinkedIn](https://linkedin.com/in/rugved-deshpande)
