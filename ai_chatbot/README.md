# AI Chatbot Service

A simple AI chatbot backend service built with FastAPI and LangChain, supporting **OpenAI**, **HuggingFace**, and **Ollama** models.

## 🚀 **Recommended: Ollama (Free & Local)**

**Ollama** is the recommended option because it's:
- ✅ **Completely free** - No API costs
- ✅ **Runs locally** - Your data stays private
- ✅ **High quality models** - Mistral, Llama2, CodeLlama, etc.
- ✅ **Easy setup** - Simple installation and usage

## Directory Structure

```
ai_chatbot/
├── chatbot/                    # Core chatbot modules
│   ├── __init__.py            # Package initialization
│   ├── model.py               # LLM initialization & conversation chains
│   ├── handlers.py            # Chat request handling & user management
│   └── fetch_agent_client.py  # FetchAI integration stub
├── main.py                    # FastAPI entry point
├── start_chatbot.py           # Startup script
├── test_chatbot.py            # Test script
├── requirements.txt           # Python dependencies
├── env.example                # Environment variables template
└── README.md                  # This file
```

## Features

- **Multi-model support**: OpenAI GPT models, HuggingFace models, or **Ollama local models**
- **Conversation memory**: Maintains context per user
- **RESTful API**: Clean endpoints for chat interactions
- **User tracking**: Monitor user activity and conversation statistics
- **FetchAI integration**: Stub for future FetchAI backend integration
- **Modular architecture**: Clean separation of concerns

## Quick Start

### Option 1: Ollama (Recommended - Free & Local)

1. **Install Ollama**:
   ```bash
   # Windows: Download from https://ollama.ai/
   # macOS: brew install ollama
   # Linux: curl -fsSL https://ollama.ai/install.sh | sh
   ```

2. **Start Ollama and pull a model**:
   ```bash
   ollama serve
   # In another terminal:
   ollama pull mistral
   ```

3. **Install Python dependencies**:
   ```bash
   cd ai_chatbot
   pip install -r requirements.txt
   ```

4. **Start the service**:
   ```bash
   python start_chatbot.py
   ```

### Option 2: OpenAI or HuggingFace

1. **Install dependencies**:
   ```bash
   cd ai_chatbot
   pip install -r requirements.txt
   ```

2. **Set up environment variables**:
   ```bash
   cp env.example .env
   # Edit .env with your API keys
   ```

3. **Start the service**:
   ```bash
   python start_chatbot.py
   ```

## API Endpoints

- `POST /chat` - Send a chat message
- `GET /health` - Health check
- `GET /users/{user_id}/stats` - Get user statistics
- `DELETE /users/{user_id}/conversation` - Clear user conversation
- `GET /system/status` - Get system status

## Environment Variables

- `MODEL_TYPE`: Choose between "ollama" (default), "openai", or "huggingface"
- `OLLAMA_MODEL`: Model name (default: "mistral")
- `OLLAMA_BASE_URL`: Ollama server URL (default: "http://localhost:11434")
- `OPENAI_API_KEY`: Your OpenAI API key (if using OpenAI)
- `HUGGINGFACEHUB_API_TOKEN`: Your HuggingFace token (if using HuggingFace)
- `HOST`: Server host (default: 0.0.0.0)
- `PORT`: Server port (default: 8000)
- `DEBUG`: Enable debug mode (default: false)

## Ollama Models

Popular free models you can use:

```bash
# General purpose
ollama pull mistral      # Fast, good quality
ollama pull llama2       # Meta's Llama 2
ollama pull codellama    # Great for coding

# Specialized
ollama pull neural-chat  # Good conversation
ollama pull dolphin-phi  # Microsoft's Phi model
```

## Example Usage

```bash
# Test the chat endpoint
curl -X POST "http://localhost:8000/chat" \
     -H "Content-Type: application/json" \
     -d '{
       "user_id": "user123",
       "message": "Hello, how are you?"
     }'

# Check system status
curl "http://localhost:8000/system/status"
```

## Development

The service is organized into modular components:

- **`chatbot/model.py`**: Handles LLM initialization and conversation chains
- **`chatbot/handlers.py`**: Manages chat requests and user interactions
- **`chatbot/fetch_agent_client.py`**: Stub for FetchAI integration
- **`main.py`**: FastAPI application and endpoint definitions

## Testing

Run the comprehensive test suite to verify all endpoints work correctly:

```bash
python test_chatbot.py
```

## Troubleshooting

### Ollama Issues

1. **"Cannot connect to Ollama server"**:
   ```bash
   # Make sure Ollama is running
   ollama serve
   ```

2. **"Model not found"**:
   ```bash
   # Pull the model first
   ollama pull mistral
   ```

3. **Slow responses**: Try a smaller model like `mistral:7b` instead of `llama2:70b`

## License

This project is licensed under the MIT License.
