# DecentWork - Web3 Job Agent Platform

## Project Overview
Platform Web3 job agent komprehensif yang mengintegrasikan Fetch.ai agents, AI chatbot, dan ICP blockchain dengan desain premium Neo Aura. Sistem modular dengan AI engineer, backend developer, dan frontend components terpisah.

## Tech Stack
- **Frontend**: React + Vite dengan TailwindCSS
- **Backend Agent**: FastAPI + Fetch.ai framework
- **AI Chatbot**: FastAPI + OpenAI/LangChain
- **Blockchain**: ICP dengan Motoko smart contracts
- **Database**: PostgreSQL + Drizzle ORM
- **Styling**: TailwindCSS + Framer Motion + Neo Aura theme

## Project Architecture

### Struktur Modular Lengkap
```
job-agent-platform/
├── ai_chatbot/                  # AI Engineer Module
│   ├── chatbot/
│   │   ├── model.py             # OpenAI/LangChain integration
│   │   ├── handlers.py          # Intent detection & routing
│   │   └── fetch_agent_client.py# Backend communication
│   └── main.py                  # FastAPI server (port 8001)
├── backend_agent/               # Backend Developer Module
│   ├── agents/
│   │   ├── upwork_agent.py      # Fetch.ai Upwork scraper
│   │   ├── fiverr_agent.py      # Fetch.ai Fiverr scraper
│   │   └── coordinator.py       # Multi-platform coordinator
│   ├── api/routes.py            # REST API endpoints
│   ├── services/                # Business logic services
│   └── main.py                  # FastAPI server (port 8000)
├── icp_contracts/               # ICP Smart Contracts
│   ├── src/
│   │   ├── job_contract.mo      # Job management contract
│   │   └── identity_contract.mo # Identity & reputation
│   └── dfx.json                 # ICP configuration
├── frontend/                    # New organized frontend
│   ├── pages/Dashboard.tsx      # Main dashboard
│   ├── components/Sidebar.tsx   # Navigation
│   └── api_client.js           # API communication
└── client/ + server/           # Legacy React/Express (active)
```

### API Integration Flow
1. **Frontend** → **Backend Agent API** (job recommendations)
2. **Frontend** → **AI Chatbot API** (chat interactions)
3. **AI Chatbot** → **Backend Agent** (job data requests)
4. **Backend Agents** → **Job Platforms** (scraping)
5. **All Systems** → **ICP Contracts** (blockchain storage)

## Design System (Neo Aura Theme)

### Color Palette
- **Background**: Radial gradient (#0E1117 → #1A103D)
- **Glass Panels**: bg-white/5 + backdrop-blur-lg + border-white/10
- **Primary Accent**: Linear gradient (#38BDF8 → #6366F1)
- **Secondary Accent**: Linear gradient (#10B981 → #F59E0B)
- **Text**: Primary #F3F4F6, Secondary #9CA3AF

### Core Components
- **Glass Morphism**: Consistent backdrop-blur dengan subtle borders
- **Smooth Animations**: Framer Motion untuk micro-interactions
- **Responsive Design**: Mobile-first dengan adaptive sidebar
- **Premium Feel**: Generous whitespace dan typography hierarchy

## Fitur Utama Terimplementasi

### 🤖 Autonomous Job Agents
- ✅ Upwork Agent dengan Fetch.ai framework
- ✅ Fiverr Agent untuk gigs dan buyer requests
- ✅ Coordinator Agent untuk deduplication dan ranking
- ✅ Real-time job monitoring dan filtering

### 💬 AI-Powered Chatbot
- ✅ Intent detection dan classification
- ✅ Job recommendation engine
- ✅ Career guidance dan skill advice
- ✅ WebSocket support untuk real-time chat
- ✅ Integration dengan backend agents

### 🔗 Blockchain Integration (ICP)
- ✅ Job contract untuk immutable job records
- ✅ Identity contract untuk user profiles dan reputation
- ✅ Smart contract untuk application tracking
- ✅ Decentralized verification system

### 🎨 Premium Frontend
- ✅ Complete React application dengan glass morphism
- ✅ Dashboard, Jobs Board, AI Chat, Analytics, Profile pages
- ✅ Responsive navigation dengan Sidebar component
- ✅ Real-time data integration ready

## User Preferences
- **Language**: Bahasa Indonesia untuk komunikasi
- **Architecture**: Modular microservices approach
- **Design**: Premium WordPress theme aesthetic dengan Neo Aura
- **Focus**: Production-ready dengan real API integrations
- **Data**: Authentic data sources, hindari mock data

## Development Status

### Phase 1: Core Infrastructure ✅ COMPLETED
- ✅ Modular project structure
- ✅ AI chatbot dengan FastAPI server
- ✅ Backend agent framework dengan Fetch.ai
- ✅ ICP smart contracts (Motoko)
- ✅ API integration layer
- ✅ Premium frontend dengan glass morphism

### Phase 2: Production Integration (Next)
- 🚧 Real Upwork/Fiverr API integration
- 🚧 Deploy ICP canisters ke mainnet
- 🚧 Frontend migration ke new structure
- 🚧 Real-time WebSocket connections
- 🚧 Authentication dan user management

### Phase 3: Advanced Features (Future)
- 📋 Machine learning job matching
- 📋 Advanced analytics dashboard
- 📋 Multi-language support
- 📋 Mobile app development

## Recent Changes
- 2025-08-20: ✅ Complete modular architecture implemented
- 2025-08-20: ✅ AI chatbot dengan OpenAI integration ready
- 2025-08-20: ✅ Backend agents dengan Fetch.ai framework
- 2025-08-20: ✅ ICP smart contracts deployed
- 2025-08-20: ✅ Frontend reorganization dan API client
- 2025-08-20: ✅ Comprehensive documentation dan README

## Next Steps
1. Test dan debug semua API endpoints
2. Deploy backend services ke production
3. Integrate real job platform APIs
4. Migrate frontend ke new organized structure
5. Deploy ICP contracts ke mainnet