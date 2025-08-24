# 🚀 Web3 Job Agent Platform

A comprehensive Web3 job discovery platform powered by **Fetch.ai agents** and **AI chatbot capabilities**, featuring a premium Neo Aura glass morphism design.

## ✨ Features

- **🤖 AI-Powered Job Search** - Powered by Grok API for intelligent job matching
- **🔗 uAgents Integration** - Blockchain-based agent communication
- **🌐 RESTful API** - Clean endpoints for frontend integration
- **💬 Smart Chat Protocol** - Natural language job requests
- **🔍 Intelligent Filtering** - Automatic job requirement parsing
- **📱 Agentverse Ready** - Discoverable on Fetch.ai ecosystem

## 🏗️ Architecture

```
Kelompok-8/
├── ai_chatbot/                 # 🤖 AI Chatbot Service
│   ├── chatbot/                # Core chatbot modules
│   ├── agent.py                # uAgents implementation
│   ├── main.py                 # FastAPI server
│   └── requirements.txt        # Python dependencies
├── icp_contracts/              # ⛓️ ICP Smart Contracts
│   └── src/
│       └── job_contract.mo     # Motoko job management
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** (recommended: 3.12)
- **WSL/Ubuntu** (recommended for development)
- **Git**

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Kelompok-8
```

### 2. Set Up AI Chatbot Service

```bash
# Navigate to chatbot directory
cd ai_chatbot

# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
source .venv/bin/activate  # Linux/Mac
# or
.venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
# Copy environment template
cp env.example .env

# Edit .env with your API keys
nano .env
```

**Required Environment Variables:**
```env
# AI Configuration
MODEL_TYPE=grok
GROK_API_KEY=your_grok_api_key_here

# Server Configuration
PORT=8081

# uAgents Configuration
AGENT_NAME=job_chat_agent
AGENT_SEED=your_unique_agent_seed
MAILBOX_KEY=your_agentverse_mailbox_key
```

### 4. Get API Keys

#### **Grok API Key:**
1. Visit [Grok Console](https://console.groq.com/)
2. Sign up and get your API key
3. Add to `.env` file

#### **Agent Seed:**
```bash
# Generate unique agent seed
python3 generate_agent_seed.py
# Copy the output to your .env file
```

#### **Mailbox Key:**
1. Visit [Agentverse](https://agentverse.ai/)
2. Create account and get mailbox key
3. Add to `.env` file

### 5. Start the Services

#### **Start AI Chatbot Server:**
```bash
# Terminal 1: Start FastAPI server
python3 main.py
```

**Expected Output:**
```
🚀 Starting AI Chatbot Service...
📡 Server will be available at: http://0.0.0.0:8081
🤖 Model type: grok
📊 Health check: http://0.0.0.0:8081/health
💬 Chat endpoint: http://0.0.0.0:8081/chat
```

#### **Start uAgents Service:**
```bash
# Terminal 2: Start uAgents
python3 agent.py
```

**Expected Output:**
```
INFO: Agent address: agent1...
INFO: Mailbox enabled; your agent is discoverable on Agentverse.
```

## 🧪 Testing

### **Test API Endpoints:**

```bash
# Health check
curl http://localhost:8081/health

# Chat with AI
curl -X POST "http://localhost:8081/chat" \
     -H "Content-Type: application/json" \
     -d '{"user_prompt": "I need a Python developer"}'

# Parse job filters
curl -X POST "http://localhost:8081/parse" \
     -H "Content-Type: application/json" \
     -d '{"user_prompt": "Remote React developer, $50-100/hour"}'
```

### **Test uAgents:**
```bash
# Test agent communication
python3 test_client.py
```

## 📚 API Reference

### **Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server health check |
| `POST` | `/chat` | Process job search requests |
| `POST` | `/parse` | Extract job filters from text |

### **Chat Request Format**
```json
{
  "user_prompt": "I need a Python developer for web development",
  "top_k": 5
}
```

### **Response Format**
```json
{
  "message": "I'll help you find a Python developer...",
  "filters": {
    "skills": ["python", "web development"],
    "keywords": ["python", "web"],
    "budget_min": null,
    "budget_max": null,
    "rate_type": null,
    "remote": null,
    "duration_days_max": null,
    "top_k": 5
  },
  "should_fetch_jobs": true
}
```

## 🔧 Configuration

### **Environment Variables**

| Variable | Description | Default |
|----------|-------------|---------|
| `MODEL_TYPE` | AI model provider | `grok` |
| `GROK_API_KEY` | Grok API key | Required |
| `PORT` | Server port | `8081` |
| `AGENT_NAME` | uAgent name | `job_chat_agent` |
| `AGENT_SEED` | Unique agent seed | Required |
| `MAILBOX_KEY` | Agentverse mailbox key | Optional |

### **AI Models**

| Provider | Model | Features |
|----------|-------|----------|
| **Grok** | `llama3-8b-8192` | Fast, lightweight, cost-effective |
| **OpenAI** | `gpt-3.5-turbo` | High quality, cloud-based |

## 🚀 Deployment

### **Production Setup**

1. **Set Production Environment:**
   ```bash
   export DEBUG=false
   export HOST=0.0.0.0
   export PORT=8081
   ```

2. **Use Process Manager:**
   ```bash
   # Install PM2
   npm install -g pm2
   
   # Start services
   pm2 start "python3 main.py" --name "job-chatbot"
   pm2 start "python3 agent.py" --name "job-agent"
   ```

3. **Set Up Reverse Proxy:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:8081;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

## 🐛 Troubleshooting

### **Common Issues**

| Issue | Solution |
|-------|----------|
| **Port already in use** | Change `PORT` in `.env` or kill existing processes |
| **Grok API errors** | Verify `GROK_API_KEY` and account credits |
| **Agent not discoverable** | Check `MAILBOX_KEY` and agent registration |
| **Import errors** | Ensure virtual environment is activated |

### **Debug Mode**

```bash
# Enable debug logging
export DEBUG=true
python3 main.py
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Project Wiki](link-to-wiki)
- **Issues**: [GitHub Issues](link-to-issues)
- **Discord**: [Community Server](link-to-discord)

## 🙏 Acknowledgments

- **Fetch.ai** for uAgents framework
- **Grok** for AI API services
- **Agentverse** for agent discovery

---

**Built with ❤️ by Kelompok-8**

*Ready to revolutionize job discovery with AI and blockchain technology!* 🚀
