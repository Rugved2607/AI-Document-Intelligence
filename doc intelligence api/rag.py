from groq import Groq
from dotenv import load_dotenv
from vector_store import retrieve_chunks, store_chunks
from config import GROQ_API_KEY, GROQ_LLM_MODEL

load_dotenv()

groq_client = Groq(api_key=GROQ_API_KEY)

def answer_question(doc_id: str, question: str) -> str:
    # Step 1: Retrieve relevant chunks
    chunks = retrieve_chunks(doc_id, question)
    
    # Step 2: Build context
    context = "\n\n".join(chunks)
    
    # Step 3: Build prompt
    prompt = f"""You are a precise document assistant. Your job is to answer questions based strictly on the provided context.

Rules:
- Answer using ONLY the information in the context below. Do not use outside knowledge.
- Answer fully and completely — include all relevant details needed to properly address the question.
- Do not explain your reasoning, show comparisons, or reveal your thought process.
- If the answer requires counting or comparing items, do so internally and return only the final result.
- If the answer cannot be found in the context, respond exactly with: "I couldn't find this in the document."


Context:
{context}

Question: {question}

Answer:"""

    # Step 4: Send to Groq
    response = groq_client.chat.completions.create(
        model=GROQ_LLM_MODEL,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    
    return response.choices[0].message.content


if __name__ == "__main__":

    test_chunks = [
        "The patient suffered a heart attack due to blocked arteries.",
        "Cricket match was cancelled due to rain.",
        "Cardiac arrest requires immediate CPR and defibrillation.",
        "The stock market crashed by 500 points today.",
        "Heart disease is the leading cause of death worldwide."
    ]

    store_chunks("test_doc", test_chunks)

    answer = answer_question("test_doc", "what causes a heart attack?")
    print(f"Answer 1: {answer}")

    answer2 = answer_question("test_doc", "who won the world cup?")
    print(f"Answer 2: {answer2}")