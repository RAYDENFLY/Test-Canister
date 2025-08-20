"""
Backend Agent Entry Point
Main server for backend agent services and Fetch.ai coordination
"""

import asyncio
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import app as api_app
from agents.coordinator import CoordinatorAgent
from agents.upwork_agent import FetchAIUpworkAgent
from agents.fiverr_agent import FiverrAgent

# Main FastAPI application
app = FastAPI(
    title="DecentWork Backend Agent",
    description="Backend agent system for Web3 job platform",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes
app.mount("/", api_app)

# Global agent instances
coordinator = None
upwork_agent = None
fiverr_agent = None

@app.on_event("startup")
async def startup_event():
    """Initialize all backend agents"""
    global coordinator, upwork_agent, fiverr_agent
    
    print("🚀 Starting Backend Agent System...")
    
    # Initialize coordinator
    coordinator = CoordinatorAgent("main_coordinator")
    
    # Initialize platform agents
    upwork_agent = FetchAIUpworkAgent()
    fiverr_agent = FiverrAgent("fiverr_agent_main", "main_coordinator")
    
    # Start agents in background
    asyncio.create_task(coordinator.start_coordination())
    asyncio.create_task(upwork_agent.start_agent())
    asyncio.create_task(fiverr_agent.start_monitoring())
    
    print("✅ Backend Agent System ready")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup all agents"""
    global coordinator, upwork_agent, fiverr_agent
    
    print("🛑 Shutting down Backend Agent System...")
    
    if coordinator:
        await coordinator.stop_coordination()
    
    if upwork_agent:
        await upwork_agent.stop_agent()
    
    if fiverr_agent:
        await fiverr_agent.stop_monitoring()
    
    print("✅ Backend Agent System shutdown complete")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )