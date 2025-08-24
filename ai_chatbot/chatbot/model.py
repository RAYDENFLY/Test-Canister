import os
from langchain_groq import ChatGroq

def get_llm():
    model_type = os.getenv("MODEL_TYPE", "grok").lower()
    
    if model_type == "grok":
        # Grok API - lightweight and fast
        api_key = os.getenv("GROK_API_KEY")
        if not api_key:
            raise ValueError("GROK_API_KEY environment variable is required for Grok")
        
        model_name = os.getenv("GROK_MODEL", "llama3-8b-8192")
        return ChatGroq(
            groq_api_key=api_key,
            model_name=model_name,
            temperature=0.2
        )
    
    elif model_type == "openai":
        # OpenAI - cloud-based
        from langchain_openai import ChatOpenAI
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is required for OpenAI")
        
        model_name = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
        return ChatOpenAI(
            openai_api_key=api_key,
            model_name=model_name,
            temperature=0.2
        )
    
    else:
        raise ValueError(f"Unsupported MODEL_TYPE: {model_type}. Use 'grok' (recommended) or 'openai'")
