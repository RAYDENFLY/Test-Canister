import os
from langchain_ollama import ChatOllama

MODEL_NAME = os.getenv("OLLAMA_MODEL", "gemma:2b")

def get_llm():
    # Pre-req:
    #   1) ollama serve
    #   2) ollama pull mistral
    return ChatOllama(model=MODEL_NAME, temperature=0.2)
