import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from chatbot.handlers import handle_chat, Filters, ChatResult

load_dotenv()

app = FastAPI(title="AI Chatbot Service (REST + Ollama)")

origins = [o.strip() for o in os.getenv("CORS_ALLOW_ORIGINS", "*").split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    user_prompt: str
    top_k: int = 5

@app.post("/chat", response_model=ChatResult)
def chat(req: ChatRequest):
    result = handle_chat(req.user_prompt)
    if req.top_k and req.top_k != result.filters.top_k:
        result.filters.top_k = req.top_k
    return result

@app.post("/parse", response_model=Filters)
def parse(req: ChatRequest):
    res = handle_chat(req.user_prompt)
    if req.top_k and req.top_k != res.filters.top_k:
        res.filters.top_k = req.top_k
    return res.filters

@app.get("/health")
def health():
    return {"ok": True}
