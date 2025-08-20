"""
AI Chatbot Entry Point
Main server for AI-powered job recommendation chatbot
"""

import asyncio
import uvicorn
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Any, Optional
import json
from datetime import datetime

from chatbot.handlers import ChatHandler, IntentClassifier, ResponseFormatter
from chatbot.model import JobRecommendationAI, ConversationManager
from chatbot.fetch_agent_client import FetchAgentClient, AgentCommunicator

app = FastAPI(
    title="DecentWork AI Chatbot",
    description="AI-powered chatbot for Web3 job recommendations",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global instances
chat_handler = ChatHandler()
intent_classifier = IntentClassifier()
agent_communicator = AgentCommunicator()

# Pydantic models
class ChatMessage(BaseModel):
    user_id: str
    message: str
    user_profile: Optional[Dict[str, Any]] = {}

class JobRecommendationRequest(BaseModel):
    user_profile: Dict[str, Any]
    count: Optional[int] = 10

class SkillAdviceRequest(BaseModel):
    current_skills: List[str]
    target_role: Optional[str] = "web3_developer"
    experience_level: Optional[str] = "mid"

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]

    async def send_personal_message(self, message: str, user_id: str):
        if user_id in self.active_connections:
            websocket = self.active_connections[user_id]
            await websocket.send_text(message)

manager = ConnectionManager()

@app.get("/")
async def root():
    return {
        "service": "DecentWork AI Chatbot",
        "version": "1.0.0",
        "status": "active",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/chat/message")
async def process_chat_message(chat_message: ChatMessage):
    """Process a chat message and return AI response"""
    
    try:
        response = await chat_handler.process_message(
            user_id=chat_message.user_id,
            message=chat_message.message,
            user_profile=chat_message.user_profile
        )
        
        return {
            "success": True,
            "response": response["response"],
            "metadata": response.get("metadata", {}),
            "timestamp": response["timestamp"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat processing error: {str(e)}")

@app.post("/api/recommendations/jobs")
async def get_job_recommendations(request: JobRecommendationRequest):
    """Get personalized job recommendations"""
    
    try:
        jobs = await agent_communicator.request_job_recommendations(
            user_profile=request.user_profile,
            count=request.count
        )
        
        return {
            "success": True,
            "jobs": jobs,
            "total_count": len(jobs),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation error: {str(e)}")

@app.post("/api/advice/skills")
async def get_skill_advice(request: SkillAdviceRequest):
    """Get personalized skill development advice"""
    
    try:
        # Mock skill analysis - replace with actual AI logic
        recommended_skills = [
            "Solidity", "Rust", "Web3.js", "React", "TypeScript",
            "Smart Contracts", "DeFi Protocols", "NFT Development"
        ]
        
        advice = ResponseFormatter.format_skill_advice(
            skills=recommended_skills,
            user_level=request.experience_level
        )
        
        return {
            "success": True,
            "advice": advice,
            "recommended_skills": recommended_skills[:5],
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Skill advice error: {str(e)}")

@app.get("/api/agents/status")
async def get_agent_status():
    """Get status of all backend agents"""
    
    try:
        status = await agent_communicator.client.get_agent_status()
        return {
            "success": True,
            "agent_status": status,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent status error: {str(e)}")

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    """WebSocket endpoint for real-time chat"""
    
    await manager.connect(websocket, user_id)
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Process the message
            response = await chat_handler.process_message(
                user_id=user_id,
                message=message_data.get("message", ""),
                user_profile=message_data.get("user_profile", {})
            )
            
            # Send response back
            await websocket.send_text(json.dumps({
                "type": "chat_response",
                "response": response["response"],
                "metadata": response.get("metadata", {}),
                "timestamp": response["timestamp"]
            }))
            
    except WebSocketDisconnect:
        manager.disconnect(user_id)
    except Exception as e:
        await websocket.send_text(json.dumps({
            "type": "error",
            "message": f"WebSocket error: {str(e)}",
            "timestamp": datetime.now().isoformat()
        }))
        manager.disconnect(user_id)

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    
    return {
        "status": "healthy",
        "service": "ai_chatbot",
        "timestamp": datetime.now().isoformat(),
        "components": {
            "chat_handler": "active",
            "agent_communicator": "active",
            "backend_connection": "checking..."
        }
    }

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    print("🤖 AI Chatbot service starting up...")
    print("📡 Connecting to backend agents...")
    
@app.on_event("shutdown") 
async def shutdown_event():
    """Cleanup on shutdown"""
    print("🤖 AI Chatbot service shutting down...")
    await agent_communicator.cleanup()

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )