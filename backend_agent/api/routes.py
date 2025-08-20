"""
REST API Routes for Backend Agent
FastAPI endpoints for job data and agent management
"""

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Any, Optional
import asyncio
from datetime import datetime

from ..agents.coordinator import CoordinatorAgent
from ..services.scraper import ScrapingService
from ..services.job_formatter import JobFormatter
from ..services.identity_manager import IdentityManager
from .icp_integration import ICPIntegration

app = FastAPI(
    title="DecentWork Backend Agent API",
    description="API for Web3 job agent backend services",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global instances
coordinator_agent = CoordinatorAgent("backend_coordinator_001")
scraping_service = ScrapingService()
job_formatter = JobFormatter()
identity_manager = IdentityManager()
icp_integration = ICPIntegration()

# Pydantic models
class JobRecommendationRequest(BaseModel):
    skills: List[str]
    experience_level: str = "mid"
    location_preference: str = "remote"
    salary_min: Optional[int] = 0
    job_types: List[str] = ["full-time", "contract"]

class SearchTriggerRequest(BaseModel):
    keywords: List[str]
    platforms: List[str] = ["upwork", "fiverr"]
    max_results: int = 50
    filters: Optional[Dict[str, Any]] = {}

class UserPreferencesRequest(BaseModel):
    user_id: str
    skills: List[str]
    experience_level: str
    preferred_budget: Optional[str] = None
    preferred_sources: List[str] = []

class JobApplicationRequest(BaseModel):
    job_id: str
    applicant_data: Dict[str, Any]
    cover_letter: Optional[str] = None

@app.get("/")
async def root():
    return {
        "service": "DecentWork Backend Agent",
        "version": "1.0.0",
        "status": "active",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/jobs/recommendations")
async def get_job_recommendations(request: JobRecommendationRequest):
    """Get personalized job recommendations"""
    
    try:
        # Create user profile from request
        user_profile = {
            "skills": request.skills,
            "experience_level": request.experience_level,
            "location": request.location_preference,
            "salary_min": request.salary_min
        }
        
        # Get filtered jobs from coordinator
        jobs = await coordinator_agent.get_jobs_for_user(
            user_id="api_user",  # Could be extracted from auth
            filters={
                "job_types": request.job_types,
                "limit": 20
            }
        )
        
        # Format jobs for response
        formatted_jobs = job_formatter.format_jobs_for_api(jobs)
        
        return {
            "success": True,
            "jobs": formatted_jobs,
            "total_count": len(formatted_jobs),
            "recommendations_based_on": {
                "skills": request.skills,
                "experience_level": request.experience_level
            },
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation error: {str(e)}")

@app.post("/api/search/trigger")
async def trigger_job_search(request: SearchTriggerRequest, background_tasks: BackgroundTasks):
    """Trigger new job search across platforms"""
    
    try:
        search_id = f"search_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Start background search
        background_tasks.add_task(
            scraping_service.start_targeted_search,
            search_id=search_id,
            keywords=request.keywords,
            platforms=request.platforms,
            filters=request.filters
        )
        
        return {
            "success": True,
            "search_id": search_id,
            "status": "started",
            "estimated_completion": "2-5 minutes",
            "platforms": request.platforms,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search trigger error: {str(e)}")

@app.get("/api/search/{search_id}/results")
async def get_search_results(search_id: str):
    """Get results from a background search"""
    
    try:
        results = await scraping_service.get_search_results(search_id)
        
        if not results:
            return {
                "success": False,
                "message": "Search not found or still in progress",
                "search_id": search_id
            }
        
        return {
            "success": True,
            "search_id": search_id,
            "status": results.get("status", "unknown"),
            "jobs": results.get("jobs", []),
            "total_found": len(results.get("jobs", [])),
            "completion_time": results.get("completion_time"),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search results error: {str(e)}")

@app.get("/api/agents/status")
async def get_agents_status():
    """Get status of all backend agents"""
    
    try:
        coordinator_stats = coordinator_agent.get_coordinator_stats()
        scraping_stats = await scraping_service.get_service_stats()
        
        return {
            "success": True,
            "coordinator": coordinator_stats,
            "scraping_service": scraping_stats,
            "agents": coordinator_stats.get("connected_agents", 0),
            "total_jobs": coordinator_stats.get("total_jobs", 0),
            "system_health": "healthy",
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent status error: {str(e)}")

@app.post("/api/users/{user_id}/preferences")
async def update_user_preferences(user_id: str, request: UserPreferencesRequest):
    """Update user preferences for job recommendations"""
    
    try:
        preferences = {
            "skills": request.skills,
            "experience_level": request.experience_level,
            "preferred_budget": request.preferred_budget,
            "preferred_sources": request.preferred_sources
        }
        
        await coordinator_agent.update_user_preferences(user_id, preferences)
        
        # Store in identity manager
        await identity_manager.update_user_profile(user_id, preferences)
        
        return {
            "success": True,
            "user_id": user_id,
            "preferences_updated": preferences,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Preferences update error: {str(e)}")

@app.post("/api/applications/submit")
async def submit_job_application(request: JobApplicationRequest):
    """Submit job application through agents"""
    
    try:
        # Validate job exists
        jobs = await coordinator_agent.get_jobs_for_user("system")
        target_job = next((job for job in jobs if job["id"] == request.job_id), None)
        
        if not target_job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        # Process application through appropriate agent
        application_result = await scraping_service.submit_application(
            job=target_job,
            applicant_data=request.applicant_data,
            cover_letter=request.cover_letter
        )
        
        # Store application record in ICP
        icp_result = await icp_integration.store_application_record({
            "job_id": request.job_id,
            "applicant_id": request.applicant_data.get("user_id"),
            "application_date": datetime.now().isoformat(),
            "status": "submitted"
        })
        
        return {
            "success": True,
            "application_id": application_result.get("application_id"),
            "job_id": request.job_id,
            "status": "submitted",
            "icp_record": icp_result.get("record_id"),
            "estimated_response_time": "1-3 business days",
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Application submission error: {str(e)}")

@app.get("/api/jobs/{job_id}")
async def get_job_details(job_id: str):
    """Get detailed information about a specific job"""
    
    try:
        # Get job from coordinator
        all_jobs = await coordinator_agent.get_jobs_for_user("system", {"limit": 1000})
        job = next((j for j in all_jobs if j["id"] == job_id), None)
        
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        # Enrich with additional data
        enriched_job = await job_formatter.enrich_job_details(job)
        
        return {
            "success": True,
            "job": enriched_job,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Job details error: {str(e)}")

@app.get("/api/analytics/market")
async def get_market_analytics():
    """Get market analytics and trends"""
    
    try:
        analytics = await job_formatter.generate_market_analytics()
        
        return {
            "success": True,
            "analytics": analytics,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analytics error: {str(e)}")

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    
    return {
        "status": "healthy",
        "service": "backend_agent_api",
        "coordinator_running": coordinator_agent.is_running,
        "timestamp": datetime.now().isoformat(),
        "components": {
            "coordinator": "active",
            "scraping_service": "active",
            "job_formatter": "active",
            "identity_manager": "active",
            "icp_integration": "active"
        }
    }

# Event handlers
@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    print("🚀 Backend Agent API starting up...")
    
    # Start coordinator in background
    asyncio.create_task(coordinator_agent.start_coordination())
    
    # Initialize services
    await scraping_service.initialize()
    await identity_manager.initialize()
    await icp_integration.initialize()
    
    print("✅ Backend Agent API ready")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    print("🛑 Backend Agent API shutting down...")
    
    await coordinator_agent.stop_coordination()
    await scraping_service.cleanup()
    await identity_manager.cleanup()
    await icp_integration.cleanup()
    
    print("✅ Backend Agent API shutdown complete")

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return {"error": "Resource not found", "status_code": 404}

@app.exception_handler(500)
async def internal_server_error_handler(request, exc):
    return {"error": "Internal server error", "status_code": 500}