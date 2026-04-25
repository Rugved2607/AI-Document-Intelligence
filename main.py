from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
import shutil
import os
import uuid
from rag import answer_question
from pdf_processor import extract_text, split_into_chunks
from vector_store import store_chunks
from pypdf import PdfReader

app = FastAPI(
    title="Document Intelligence API",
    version="1.0.0"
)

class QueryRequest(BaseModel):
    doc_id: str
    question: str

@app.get("/")
def health():
    return {"status": "running"}

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDFs accepted")
    
    doc_id = str(uuid.uuid4())[:8]

    temp_path = f"temp_{doc_id}.pdf"
    with open(temp_path,"wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    extract = extract_text(temp_path)
    split = split_into_chunks(extract)
    store_chunks(doc_id=doc_id,chunks=split)
    os.remove(temp_path)

    return {"doc_id": doc_id, "chunks_processed": len(split)}
 
    


@app.post("/query")
async def query(request: QueryRequest):

    if not request.question:
        raise HTTPException(status_code=400, detail="Missing required input field")
    
    answer = answer_question(request.doc_id, request.question)
    return {"answer":f"{answer}"}