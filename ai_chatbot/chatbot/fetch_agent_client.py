"""
Fetch Agent Client - API Client to Backend Agent
Communicates with Fetch.ai agents for job data retrieval
"""

import aiohttp
import asyncio
from typing import Dict, List, Any, Optional
from datetime import datetime

class FetchAgentClient:
    """Client for communicating with Fetch.ai backend agents"""
    
    def __init__(self, backend_url: str = "http://localhost:8000"):
        self.backend_url = backend_url
        self.session: Optional[aiohttp.ClientSession] = None
        
    async def _get_session(self) -> aiohttp.ClientSession:
        """Get or create aiohttp session"""
        if self.session is None or self.session.closed:
            self.session = aiohttp.ClientSession()
        return self.session
    
    async def get_relevant_jobs(self, user_profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Fetch relevant jobs from backend agent based on user profile
        
        Args:
            user_profile: User skills, experience, preferences
            
        Returns:
            List of matching job opportunities
        """
        
        try:
            session = await self._get_session()
            
            payload = {
                "skills": user_profile.get("skills", []),
                "experience_level": user_profile.get("experience_level", "mid"),
                "location_preference": user_profile.get("location", "remote"),
                "salary_min": user_profile.get("salary_min", 0),
                "job_types": user_profile.get("job_types", ["full-time", "contract"])
            }
            
            async with session.post(
                f"{self.backend_url}/api/jobs/recommendations",
                json=payload,
                timeout=aiohttp.ClientTimeout(total=10)
            ) as response:
                
                if response.status == 200:
                    data = await response.json()
                    return data.get("jobs", [])
                else:
                    print(f"Backend API error: {response.status}")
                    return self._get_fallback_jobs(user_profile)
                    
        except Exception as e:
            print(f"Error connecting to backend agent: {e}")
            return self._get_fallback_jobs(user_profile)
    
    async def trigger_job_search(self, search_params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Trigger a new job search via Fetch.ai agents
        
        Args:
            search_params: Search criteria and filters
            
        Returns:
            Search operation status and results
        """
        
        try:
            session = await self._get_session()
            
            async with session.post(
                f"{self.backend_url}/api/search/trigger",
                json=search_params,
                timeout=aiohttp.ClientTimeout(total=15)
            ) as response:
                
                if response.status == 200:
                    return await response.json()
                else:
                    return {
                        "status": "error",
                        "message": f"Search trigger failed: {response.status}"
                    }
                    
        except Exception as e:
            return {
                "status": "error", 
                "message": f"Connection error: {str(e)}"
            }
    
    async def get_agent_status(self) -> Dict[str, Any]:
        """
        Get status of all active Fetch.ai agents
        
        Returns:
            Dictionary with agent statuses and performance metrics
        """
        
        try:
            session = await self._get_session()
            
            async with session.get(
                f"{self.backend_url}/api/agents/status",
                timeout=aiohttp.ClientTimeout(total=5)
            ) as response:
                
                if response.status == 200:
                    return await response.json()
                else:
                    return self._get_fallback_agent_status()
                    
        except Exception as e:
            print(f"Error getting agent status: {e}")
            return self._get_fallback_agent_status()
    
    async def submit_job_application(self, job_id: str, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Submit job application through agents
        
        Args:
            job_id: Target job identifier
            user_data: User profile and application data
            
        Returns:
            Application submission result
        """
        
        try:
            session = await self._get_session()
            
            payload = {
                "job_id": job_id,
                "applicant_data": user_data,
                "timestamp": datetime.now().isoformat()
            }
            
            async with session.post(
                f"{self.backend_url}/api/applications/submit",
                json=payload,
                timeout=aiohttp.ClientTimeout(total=10)
            ) as response:
                
                return {
                    "status": "success" if response.status == 200 else "error",
                    "data": await response.json() if response.status == 200 else None,
                    "message": "Application submitted successfully" if response.status == 200 else f"Submission failed: {response.status}"
                }
                
        except Exception as e:
            return {
                "status": "error",
                "message": f"Application submission error: {str(e)}"
            }
    
    def _get_fallback_jobs(self, user_profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Fallback job data when backend is unavailable"""
        
        skills = user_profile.get("skills", ["React", "TypeScript"])
        
        return [
            {
                "id": "job_001",
                "title": "Senior React Developer",
                "company": "Web3 Innovations",
                "location": "Remote",
                "budget": "$85,000 - $120,000",
                "skills": ["React", "TypeScript", "Web3.js"],
                "match_score": 95,
                "source": "Upwork",
                "description": "Build cutting-edge DeFi applications",
                "posted_date": "2024-08-20"
            },
            {
                "id": "job_002", 
                "title": "Blockchain Engineer",
                "company": "DeFi Protocol Labs",
                "location": "San Francisco, CA (Remote OK)",
                "budget": "$100,000 - $150,000",
                "skills": ["Solidity", "Rust", "Web3"],
                "match_score": 88,
                "source": "AngelList",
                "description": "Develop smart contracts for DeFi protocols",
                "posted_date": "2024-08-19"
            },
            {
                "id": "job_003",
                "title": "Full Stack Web3 Developer",
                "company": "NFT Marketplace",
                "location": "Remote", 
                "budget": "$90,000 - $130,000",
                "skills": ["Next.js", "Solidity", "IPFS"],
                "match_score": 92,
                "source": "Crypto Jobs List",
                "description": "Build NFT trading platform features", 
                "posted_date": "2024-08-18"
            }
        ]
    
    def _get_fallback_agent_status(self) -> Dict[str, Any]:
        """Fallback agent status when backend is unavailable"""
        
        return {
            "agents": {
                "upwork_agent": {
                    "status": "offline",
                    "last_active": "2024-08-20T10:00:00Z",
                    "jobs_scraped": 0,
                    "success_rate": 0.0
                },
                "freelancer_agent": {
                    "status": "offline", 
                    "last_active": "2024-08-20T10:00:00Z",
                    "jobs_scraped": 0,
                    "success_rate": 0.0
                },
                "coordinator_agent": {
                    "status": "offline",
                    "last_active": "2024-08-20T10:00:00Z",
                    "total_jobs": 0
                }
            },
            "overall_status": "degraded",
            "message": "Running on fallback data - backend agents unavailable"
        }
    
    async def close(self):
        """Close the aiohttp session"""
        if self.session and not self.session.closed:
            await self.session.close()


class AgentCommunicator:
    """High-level communicator for Fetch.ai agent interactions"""
    
    def __init__(self):
        self.client = FetchAgentClient()
        
    async def request_job_recommendations(self, user_profile: Dict[str, Any], count: int = 10) -> List[Dict[str, Any]]:
        """Request personalized job recommendations"""
        
        jobs = await self.client.get_relevant_jobs(user_profile)
        
        # Filter and sort by match score
        filtered_jobs = [job for job in jobs if job.get("match_score", 0) >= 70]
        sorted_jobs = sorted(filtered_jobs, key=lambda x: x.get("match_score", 0), reverse=True)
        
        return sorted_jobs[:count]
    
    async def start_background_search(self, search_criteria: Dict[str, Any]) -> bool:
        """Start background job search via agents"""
        
        result = await self.client.trigger_job_search(search_criteria)
        return result.get("status") == "success"
    
    async def get_search_results(self, search_id: str) -> Dict[str, Any]:
        """Get results from a background search"""
        
        try:
            session = await self.client._get_session()
            
            async with session.get(
                f"{self.client.backend_url}/api/search/{search_id}/results"
            ) as response:
                
                if response.status == 200:
                    return await response.json()
                else:
                    return {"status": "error", "message": "Search results not found"}
                    
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    async def cleanup(self):
        """Cleanup resources"""
        await self.client.close()