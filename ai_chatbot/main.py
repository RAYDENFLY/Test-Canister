import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from chatbot.handlers import handle_chat, Filters, ChatResult

load_dotenv()

app = FastAPI(title="AI Chatbot Service (Grok + OpenAI)")

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

if __name__ == "__main__":
    import uvicorn
    
    # Get configuration from environment variables
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8081"))
    debug = os.getenv("DEBUG", "false").lower() == "true"
    
    print(f"🚀 Starting AI Chatbot Service...")
    print(f"📡 Server will be available at: http://{host}:{port}")
    print(f"🔧 Debug mode: {debug}")
    print(f"🤖 Model type: {os.getenv('MODEL_TYPE', 'grok')}")
    print(f"📊 Health check: http://{host}:{port}/health")
    print(f"💬 Chat endpoint: http://{host}:{port}/chat")
    print("=" * 50)
    
    # Start the server
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=debug,
        log_level="info"
    )
