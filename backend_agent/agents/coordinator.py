"""
Coordinator Agent - Central Agent for Multi-Platform Job Coordination
Manages communication between different job scraping agents and provides unified job feed
"""

import asyncio
import json
from typing import Dict, List, Any, Optional, Set
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from collections import defaultdict

@dataclass
class JobData:
    """Unified job data structure"""
    id: str
    title: str
    description: str
    budget: str
    skills: List[str]
    source: str  # upwork, fiverr, freelancer, etc.
    job_type: str  # hourly, fixed, gig, buyer_request
    client_rating: Optional[float]
    posted_date: str
    deadline: Optional[str]
    location: str
    experience_level: str
    match_score: float = 0.0
    relevance_tags: List[str] = None
    scraped_at: str = ""
    processed_at: str = ""
    
    def __post_init__(self):
        if self.relevance_tags is None:
            self.relevance_tags = []
    
    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

class CoordinatorAgent:
    """
    Central coordinator for all job scraping agents
    
    Responsibilities:
    1. Receive job data from multiple agent sources
    2. Deduplicate and normalize job listings
    3. Calculate relevance scores and rankings
    4. Provide unified job feed to frontend
    5. Manage agent performance and health monitoring
    6. Handle user preferences and filtering
    """
    
    def __init__(self, agent_address: str):
        self.agent_address = agent_address
        self.is_running = False
        self.connected_agents: Dict[str, Dict[str, Any]] = {}
        self.job_database: Dict[str, JobData] = {}
        self.user_preferences: Dict[str, Dict[str, Any]] = {}
        self.performance_metrics: Dict[str, Dict[str, Any]] = defaultdict(dict)
        
        # Configuration
        self.max_jobs_per_source = 100
        self.job_retention_days = 7
        self.min_relevance_score = 0.6
        
    async def start_coordination(self):
        """Start the coordination service"""
        self.is_running = True
        print(f"🎯 Coordinator Agent {self.agent_address} starting...")
        
        # Start background tasks
        await asyncio.gather(
            self._job_processing_loop(),
            self._health_monitoring_loop(),
            self._cleanup_loop()
        )
    
    async def stop_coordination(self):
        """Stop the coordination service"""
        self.is_running = False
        print(f"🛑 Coordinator Agent {self.agent_address} stopped")
    
    async def register_agent(self, agent_id: str, agent_info: Dict[str, Any]):
        """Register a new scraping agent"""
        self.connected_agents[agent_id] = {
            **agent_info,
            "registered_at": datetime.now().isoformat(),
            "last_heartbeat": datetime.now().isoformat(),
            "status": "active",
            "jobs_contributed": 0,
            "errors_count": 0
        }
        
        print(f"✅ Agent {agent_id} registered successfully")
    
    async def receive_jobs(self, agent_id: str, jobs_data: List[Dict[str, Any]]):
        """Receive job data from a scraping agent"""
        
        if agent_id not in self.connected_agents:
            print(f"❌ Unknown agent {agent_id} trying to send jobs")
            return
        
        print(f"📥 Receiving {len(jobs_data)} jobs from {agent_id}")
        
        # Update agent heartbeat
        self.connected_agents[agent_id]["last_heartbeat"] = datetime.now().isoformat()
        
        processed_jobs = []
        
        for job_dict in jobs_data:
            try:
                # Convert to JobData object
                job = self._normalize_job_data(job_dict, agent_id)
                
                # Check for duplicates
                if not self._is_duplicate(job):
                    # Calculate relevance score
                    job.match_score = self._calculate_relevance_score(job)
                    
                    if job.match_score >= self.min_relevance_score:
                        job.processed_at = datetime.now().isoformat()
                        self.job_database[job.id] = job
                        processed_jobs.append(job)
                
            except Exception as e:
                print(f"❌ Error processing job from {agent_id}: {e}")
                self.connected_agents[agent_id]["errors_count"] += 1
        
        # Update agent statistics
        self.connected_agents[agent_id]["jobs_contributed"] += len(processed_jobs)
        self.connected_agents[agent_id]["last_job_batch"] = len(jobs_data)
        
        print(f"✅ Processed {len(processed_jobs)} valid jobs from {agent_id}")
        
        # Update performance metrics
        await self._update_performance_metrics(agent_id, len(jobs_data), len(processed_jobs))
    
    def _normalize_job_data(self, job_dict: Dict[str, Any], source_agent: str) -> JobData:
        """Normalize job data from different sources into unified format"""
        
        # Handle different source formats
        if "upwork" in source_agent:
            return self._normalize_upwork_job(job_dict)
        elif "fiverr" in source_agent:
            return self._normalize_fiverr_job(job_dict)
        else:
            return self._normalize_generic_job(job_dict)
    
    def _normalize_upwork_job(self, job_dict: Dict[str, Any]) -> JobData:
        """Normalize Upwork job data"""
        return JobData(
            id=job_dict.get("id", ""),
            title=job_dict.get("title", ""),
            description=job_dict.get("description", ""),
            budget=job_dict.get("budget", ""),
            skills=job_dict.get("skills", []),
            source="upwork",
            job_type=job_dict.get("job_type", "unknown"),
            client_rating=job_dict.get("client_rating"),
            posted_date=job_dict.get("posted_date", ""),
            deadline=job_dict.get("deadline"),
            location=job_dict.get("client_location", "Remote"),
            experience_level=job_dict.get("experience_level", "intermediate"),
            scraped_at=job_dict.get("scraped_at", "")
        )
    
    def _normalize_fiverr_job(self, job_dict: Dict[str, Any]) -> JobData:
        """Normalize Fiverr job/request data"""
        
        # Handle both gigs and buyer requests
        if job_dict.get("opportunity_type") == "buyer_request":
            return JobData(
                id=job_dict.get("id", ""),
                title=job_dict.get("title", ""),
                description=job_dict.get("description", ""),
                budget=job_dict.get("budget", ""),
                skills=job_dict.get("skills_needed", []),
                source="fiverr",
                job_type="buyer_request",
                client_rating=None,
                posted_date=job_dict.get("posted_date", ""),
                deadline=job_dict.get("expires_date"),
                location=job_dict.get("buyer_location", "Remote"),
                experience_level="intermediate",
                scraped_at=job_dict.get("scraped_at", "")
            )
        else:
            return JobData(
                id=job_dict.get("id", ""),
                title=job_dict.get("title", ""),
                description=job_dict.get("description", ""),
                budget=job_dict.get("price_range", ""),
                skills=job_dict.get("skills_required", []),
                source="fiverr",
                job_type="gig",
                client_rating=job_dict.get("rating"),
                posted_date=job_dict.get("posted_date", ""),
                deadline=None,
                location="Remote",
                experience_level="intermediate",
                scraped_at=job_dict.get("scraped_at", "")
            )
    
    def _normalize_generic_job(self, job_dict: Dict[str, Any]) -> JobData:
        """Normalize generic job data"""
        return JobData(
            id=job_dict.get("id", f"generic_{datetime.now().timestamp()}"),
            title=job_dict.get("title", ""),
            description=job_dict.get("description", ""),
            budget=job_dict.get("budget", ""),
            skills=job_dict.get("skills", []),
            source=job_dict.get("source", "unknown"),
            job_type=job_dict.get("job_type", "unknown"),
            client_rating=job_dict.get("client_rating"),
            posted_date=job_dict.get("posted_date", ""),
            deadline=job_dict.get("deadline"),
            location=job_dict.get("location", "Remote"),
            experience_level=job_dict.get("experience_level", "intermediate"),
            scraped_at=job_dict.get("scraped_at", "")
        )
    
    def _is_duplicate(self, job: JobData) -> bool:
        """Check if job is a duplicate based on title and description similarity"""
        
        for existing_job in self.job_database.values():
            # Simple duplicate detection based on title similarity
            if (self._similarity_score(job.title, existing_job.title) > 0.8 and
                job.source != existing_job.source):
                return True
        
        return False
    
    def _similarity_score(self, text1: str, text2: str) -> float:
        """Calculate similarity score between two text strings"""
        
        # Simple word-based similarity
        words1 = set(text1.lower().split())
        words2 = set(text2.lower().split())
        
        if not words1 or not words2:
            return 0.0
        
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        
        return len(intersection) / len(union) if union else 0.0
    
    def _calculate_relevance_score(self, job: JobData) -> float:
        """Calculate relevance score for a job"""
        
        score = 0.0
        
        # Web3/Blockchain keywords in title and description
        web3_keywords = [
            "blockchain", "web3", "ethereum", "solidity", "smart contract",
            "defi", "nft", "crypto", "dapp", "polygon", "rust blockchain"
        ]
        
        text_content = f"{job.title} {job.description}".lower()
        keyword_matches = sum(1 for keyword in web3_keywords if keyword in text_content)
        score += min(keyword_matches / 3, 1.0) * 0.4
        
        # Relevant skills
        relevant_skills = [
            "React", "TypeScript", "JavaScript", "Node.js", "Python",
            "Solidity", "Rust", "Web3.js", "Smart Contracts", "DeFi"
        ]
        
        skill_matches = set(job.skills) & set(relevant_skills)
        score += len(skill_matches) / max(len(relevant_skills), 1) * 0.3
        
        # Budget consideration (higher budget = higher score)
        if self._extract_budget_value(job.budget) >= 1000:
            score += 0.2
        elif self._extract_budget_value(job.budget) >= 500:
            score += 0.1
        
        # Client rating (if available)
        if job.client_rating and job.client_rating >= 4.5:
            score += 0.1
        
        return min(score, 1.0)
    
    def _extract_budget_value(self, budget_str: str) -> float:
        """Extract numeric value from budget string"""
        
        import re
        
        # Look for dollar amounts
        matches = re.findall(r'\$?(\d+(?:,\d{3})*(?:\.\d{2})?)', budget_str)
        
        if matches:
            # Take the highest value found
            values = [float(match.replace(',', '')) for match in matches]
            return max(values)
        
        return 0.0
    
    async def get_jobs_for_user(self, user_id: str, filters: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """Get filtered and ranked jobs for a specific user"""
        
        if filters is None:
            filters = {}
        
        # Get user preferences
        user_prefs = self.user_preferences.get(user_id, {})
        
        # Filter jobs based on preferences and filters
        filtered_jobs = []
        
        for job in self.job_database.values():
            if self._matches_user_criteria(job, user_prefs, filters):
                filtered_jobs.append(job)
        
        # Sort by relevance score and recency
        filtered_jobs.sort(key=lambda x: (x.match_score, x.posted_date), reverse=True)
        
        # Limit results
        max_results = filters.get("limit", 50)
        return [job.to_dict() for job in filtered_jobs[:max_results]]
    
    def _matches_user_criteria(self, job: JobData, user_prefs: Dict[str, Any], filters: Dict[str, Any]) -> bool:
        """Check if job matches user criteria"""
        
        # Check minimum relevance score
        if job.match_score < filters.get("min_score", self.min_relevance_score):
            return False
        
        # Check skills preference
        if "skills" in user_prefs:
            user_skills = set(user_prefs["skills"])
            job_skills = set(job.skills)
            if not job_skills.intersection(user_skills):
                return False
        
        # Check source preference
        if "sources" in filters and job.source not in filters["sources"]:
            return False
        
        # Check job type preference
        if "job_types" in filters and job.job_type not in filters["job_types"]:
            return False
        
        return True
    
    async def update_user_preferences(self, user_id: str, preferences: Dict[str, Any]):
        """Update user preferences for job recommendations"""
        
        self.user_preferences[user_id] = {
            **self.user_preferences.get(user_id, {}),
            **preferences,
            "updated_at": datetime.now().isoformat()
        }
        
        print(f"✅ Updated preferences for user {user_id}")
    
    async def _job_processing_loop(self):
        """Background loop for job processing and optimization"""
        
        while self.is_running:
            try:
                # Rerank jobs periodically
                await self._rerank_jobs()
                
                # Update relevance tags
                await self._update_relevance_tags()
                
                await asyncio.sleep(300)  # Run every 5 minutes
                
            except Exception as e:
                print(f"❌ Job processing loop error: {e}")
                await asyncio.sleep(60)
    
    async def _health_monitoring_loop(self):
        """Monitor agent health and performance"""
        
        while self.is_running:
            try:
                current_time = datetime.now()
                
                for agent_id, agent_info in self.connected_agents.items():
                    last_heartbeat = datetime.fromisoformat(agent_info["last_heartbeat"])
                    
                    # Check if agent is stale
                    if (current_time - last_heartbeat).seconds > 600:  # 10 minutes
                        agent_info["status"] = "stale"
                        print(f"⚠️ Agent {agent_id} appears to be stale")
                    else:
                        agent_info["status"] = "active"
                
                await asyncio.sleep(120)  # Check every 2 minutes
                
            except Exception as e:
                print(f"❌ Health monitoring error: {e}")
                await asyncio.sleep(60)
    
    async def _cleanup_loop(self):
        """Cleanup old job data"""
        
        while self.is_running:
            try:
                cutoff_date = datetime.now() - timedelta(days=self.job_retention_days)
                
                jobs_to_remove = []
                for job_id, job in self.job_database.items():
                    job_date = datetime.fromisoformat(job.posted_date)
                    if job_date < cutoff_date:
                        jobs_to_remove.append(job_id)
                
                # Remove old jobs
                for job_id in jobs_to_remove:
                    del self.job_database[job_id]
                
                if jobs_to_remove:
                    print(f"🧹 Cleaned up {len(jobs_to_remove)} old jobs")
                
                await asyncio.sleep(3600)  # Run every hour
                
            except Exception as e:
                print(f"❌ Cleanup loop error: {e}")
                await asyncio.sleep(300)
    
    async def _rerank_jobs(self):
        """Rerank jobs based on updated criteria"""
        
        for job in self.job_database.values():
            job.match_score = self._calculate_relevance_score(job)
    
    async def _update_relevance_tags(self):
        """Update relevance tags for jobs"""
        
        for job in self.job_database.values():
            job.relevance_tags = self._generate_relevance_tags(job)
    
    def _generate_relevance_tags(self, job: JobData) -> List[str]:
        """Generate relevance tags for a job"""
        
        tags = []
        
        text_content = f"{job.title} {job.description}".lower()
        
        # Technology tags
        if any(keyword in text_content for keyword in ["react", "frontend", "ui"]):
            tags.append("frontend")
        
        if any(keyword in text_content for keyword in ["solidity", "smart contract", "blockchain"]):
            tags.append("blockchain")
        
        if any(keyword in text_content for keyword in ["defi", "yield", "amm"]):
            tags.append("defi")
        
        if any(keyword in text_content for keyword in ["nft", "erc-721", "erc-1155"]):
            tags.append("nft")
        
        # Experience level tags
        if job.experience_level:
            tags.append(f"level_{job.experience_level}")
        
        # Budget tags
        budget_value = self._extract_budget_value(job.budget)
        if budget_value >= 5000:
            tags.append("high_budget")
        elif budget_value >= 1000:
            tags.append("medium_budget")
        else:
            tags.append("low_budget")
        
        return tags
    
    async def _update_performance_metrics(self, agent_id: str, total_jobs: int, processed_jobs: int):
        """Update performance metrics for an agent"""
        
        metrics = self.performance_metrics[agent_id]
        
        metrics["total_jobs_received"] = metrics.get("total_jobs_received", 0) + total_jobs
        metrics["total_jobs_processed"] = metrics.get("total_jobs_processed", 0) + processed_jobs
        metrics["success_rate"] = metrics["total_jobs_processed"] / max(metrics["total_jobs_received"], 1)
        metrics["last_update"] = datetime.now().isoformat()
    
    def get_coordinator_stats(self) -> Dict[str, Any]:
        """Get coordinator statistics"""
        
        return {
            "coordinator_address": self.agent_address,
            "status": "active" if self.is_running else "inactive",
            "connected_agents": len(self.connected_agents),
            "total_jobs": len(self.job_database),
            "active_agents": len([a for a in self.connected_agents.values() if a["status"] == "active"]),
            "performance_metrics": dict(self.performance_metrics),
            "job_sources": list(set(job.source for job in self.job_database.values())),
            "average_relevance_score": sum(job.match_score for job in self.job_database.values()) / max(len(self.job_database), 1)
        }


# Main execution
async def main():
    """Main function to run coordinator agent"""
    
    coordinator = CoordinatorAgent("coordinator_agent_001")
    
    try:
        print("🚀 Starting Coordinator Agent...")
        await coordinator.start_coordination()
        
    except KeyboardInterrupt:
        print("⏹️ Stopping Coordinator Agent...")
        await coordinator.stop_coordination()
    except Exception as e:
        print(f"💥 Coordinator Agent crashed: {e}")

if __name__ == "__main__":
    asyncio.run(main())