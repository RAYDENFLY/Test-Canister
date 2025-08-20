"""
Scraping Service - Orchestrates job scraping across platforms
Manages scraping agents and search operations
"""

import asyncio
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
import json

@dataclass
class SearchOperation:
    """Data structure for search operations"""
    search_id: str
    keywords: List[str]
    platforms: List[str]
    filters: Dict[str, Any]
    started_at: str
    status: str  # started, running, completed, failed
    results: List[Dict[str, Any]] = None
    completion_time: Optional[str] = None
    error_message: Optional[str] = None
    
    def __post_init__(self):
        if self.results is None:
            self.results = []

class ScrapingService:
    """
    Central service for managing job scraping operations
    
    Coordinates multiple scraping agents and search requests
    """
    
    def __init__(self):
        self.active_searches: Dict[str, SearchOperation] = {}
        self.search_history: List[SearchOperation] = []
        self.is_initialized = False
        
        # Platform configurations
        self.platform_configs = {
            "upwork": {
                "rate_limit": 30,  # seconds between requests
                "max_results": 50,
                "timeout": 300
            },
            "fiverr": {
                "rate_limit": 60,  # seconds between requests
                "max_results": 30,
                "timeout": 400
            },
            "freelancer": {
                "rate_limit": 45,
                "max_results": 40,
                "timeout": 350
            }
        }
    
    async def initialize(self):
        """Initialize scraping service"""
        print("🔍 Initializing scraping service...")
        
        # Initialize platform connections
        await self._initialize_platforms()
        
        self.is_initialized = True
        print("✅ Scraping service ready")
    
    async def start_targeted_search(self, search_id: str, keywords: List[str], 
                                  platforms: List[str], filters: Dict[str, Any]):
        """Start a targeted job search across specified platforms"""
        
        if not self.is_initialized:
            await self.initialize()
        
        # Create search operation
        search_op = SearchOperation(
            search_id=search_id,
            keywords=keywords,
            platforms=platforms,
            filters=filters,
            started_at=datetime.now().isoformat(),
            status="started"
        )
        
        self.active_searches[search_id] = search_op
        
        print(f"🚀 Starting targeted search: {search_id}")
        print(f"📋 Keywords: {', '.join(keywords)}")
        print(f"🌐 Platforms: {', '.join(platforms)}")
        
        # Start search in background
        asyncio.create_task(self._execute_search(search_op))
        
        return {
            "search_id": search_id,
            "status": "started",
            "estimated_duration": "2-5 minutes"
        }
    
    async def _execute_search(self, search_op: SearchOperation):
        """Execute the actual search operation"""
        
        try:
            search_op.status = "running"
            all_results = []
            
            # Search each platform
            for platform in search_op.platforms:
                platform_results = await self._search_platform(
                    platform=platform,
                    keywords=search_op.keywords,
                    filters=search_op.filters
                )
                
                all_results.extend(platform_results)
                
                # Respect rate limits
                config = self.platform_configs.get(platform, {})
                rate_limit = config.get("rate_limit", 30)
                await asyncio.sleep(rate_limit)
            
            # Process and deduplicate results
            processed_results = await self._process_search_results(all_results)
            
            # Update search operation
            search_op.results = processed_results
            search_op.status = "completed"
            search_op.completion_time = datetime.now().isoformat()
            
            print(f"✅ Search {search_op.search_id} completed: {len(processed_results)} jobs found")
            
            # Move to history
            self.search_history.append(search_op)
            if search_op.search_id in self.active_searches:
                del self.active_searches[search_op.search_id]
            
        except Exception as e:
            search_op.status = "failed"
            search_op.error_message = str(e)
            search_op.completion_time = datetime.now().isoformat()
            
            print(f"❌ Search {search_op.search_id} failed: {e}")
    
    async def _search_platform(self, platform: str, keywords: List[str], 
                             filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Search a specific platform for jobs"""
        
        print(f"🔍 Searching {platform} for keywords: {', '.join(keywords)}")
        
        if platform == "upwork":
            return await self._search_upwork(keywords, filters)
        elif platform == "fiverr":
            return await self._search_fiverr(keywords, filters)
        elif platform == "freelancer":
            return await self._search_freelancer(keywords, filters)
        else:
            print(f"⚠️ Unknown platform: {platform}")
            return []
    
    async def _search_upwork(self, keywords: List[str], filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Search Upwork platform"""
        
        # Mock Upwork search results
        results = []
        
        for keyword in keywords[:3]:  # Limit to 3 keywords
            mock_jobs = [
                {
                    "id": f"upwork_{keyword}_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{i}",
                    "title": f"Expert {keyword.title()} Developer Needed",
                    "description": f"Looking for experienced {keyword} developer to build innovative solutions. Must have 3+ years experience.",
                    "budget": "$2,000 - $5,000",
                    "skills": [keyword.title(), "JavaScript", "React", "Node.js"],
                    "client_rating": 4.8,
                    "posted_date": datetime.now().strftime('%Y-%m-%d'),
                    "deadline": (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d'),
                    "proposals": 5 + i,
                    "client_location": "United States",
                    "job_type": "fixed",
                    "experience_level": "expert",
                    "source": "upwork",
                    "scraped_at": datetime.now().isoformat()
                }
                for i in range(2)  # 2 jobs per keyword
            ]
            
            results.extend(mock_jobs)
        
        # Simulate search delay
        await asyncio.sleep(3)
        
        print(f"📋 Found {len(results)} jobs on Upwork")
        return results
    
    async def _search_fiverr(self, keywords: List[str], filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Search Fiverr platform"""
        
        # Mock Fiverr search results
        results = []
        
        for keyword in keywords[:2]:  # Limit to 2 keywords for Fiverr
            mock_gigs = [
                {
                    "id": f"fiverr_{keyword}_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{i}",
                    "title": f"I will develop {keyword} applications",
                    "description": f"Professional {keyword} development service with 5+ years experience. Quality guaranteed.",
                    "price_range": "$500 - $3,000",
                    "skills_required": [keyword.title(), "Programming", "Development"],
                    "seller_level": "Level 2",
                    "rating": 4.9,
                    "reviews_count": 150 + i * 10,
                    "delivery_time": "5-7 days",
                    "category": "Programming & Tech",
                    "source": "fiverr",
                    "opportunity_type": "gig",
                    "posted_date": datetime.now().strftime('%Y-%m-%d'),
                    "scraped_at": datetime.now().isoformat()
                }
                for i in range(2)  # 2 gigs per keyword
            ]
            
            results.extend(mock_gigs)
        
        # Simulate search delay
        await asyncio.sleep(4)
        
        print(f"📋 Found {len(results)} opportunities on Fiverr")
        return results
    
    async def _search_freelancer(self, keywords: List[str], filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Search Freelancer platform"""
        
        # Mock Freelancer search results
        results = []
        
        for keyword in keywords[:2]:  # Limit to 2 keywords
            mock_projects = [
                {
                    "id": f"freelancer_{keyword}_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{i}",
                    "title": f"{keyword.title()} Development Project",
                    "description": f"Need experienced {keyword} developer for long-term project. Remote work available.",
                    "budget": f"${1000 + i*500} - ${3000 + i*1000}",
                    "skills": [keyword.title(), "Software Development", "Programming"],
                    "bids": 8 + i,
                    "avg_bid": f"${2000 + i*300}",
                    "posted_date": datetime.now().strftime('%Y-%m-%d'),
                    "project_type": "Fixed Price",
                    "employer_location": "Australia",
                    "source": "freelancer",
                    "scraped_at": datetime.now().isoformat()
                }
                for i in range(2)  # 2 projects per keyword
            ]
            
            results.extend(mock_projects)
        
        # Simulate search delay
        await asyncio.sleep(3)
        
        print(f"📋 Found {len(results)} projects on Freelancer")
        return results
    
    async def _process_search_results(self, raw_results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Process and deduplicate search results"""
        
        # Simple deduplication based on title similarity
        processed_results = []
        seen_titles = set()
        
        for result in raw_results:
            title_key = result.get("title", "").lower().strip()
            
            # Skip if title is too similar to existing ones
            if not any(self._title_similarity(title_key, seen) > 0.8 for seen in seen_titles):
                # Add relevance score
                result["relevance_score"] = self._calculate_relevance(result)
                
                # Add processing metadata
                result["processed_at"] = datetime.now().isoformat()
                
                processed_results.append(result)
                seen_titles.add(title_key)
        
        # Sort by relevance score
        processed_results.sort(key=lambda x: x.get("relevance_score", 0), reverse=True)
        
        return processed_results
    
    def _title_similarity(self, title1: str, title2: str) -> float:
        """Calculate similarity between two titles"""
        
        words1 = set(title1.split())
        words2 = set(title2.split())
        
        if not words1 or not words2:
            return 0.0
        
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        
        return len(intersection) / len(union) if union else 0.0
    
    def _calculate_relevance(self, result: Dict[str, Any]) -> float:
        """Calculate relevance score for a search result"""
        
        score = 0.0
        
        # Keywords in title (high weight)
        title = result.get("title", "").lower()
        web3_keywords = ["blockchain", "web3", "solidity", "smart contract", "defi", "nft"]
        title_matches = sum(1 for keyword in web3_keywords if keyword in title)
        score += min(title_matches / 3, 1.0) * 0.4
        
        # Budget consideration
        budget_str = result.get("budget", "")
        if "$2000" in budget_str or "$3000" in budget_str or "$5000" in budget_str:
            score += 0.3
        elif "$1000" in budget_str:
            score += 0.2
        
        # Source platform bonus
        source = result.get("source", "")
        if source in ["upwork", "freelancer"]:
            score += 0.2
        elif source == "fiverr":
            score += 0.1
        
        # Recent posting bonus
        posted_date = result.get("posted_date", "")
        if posted_date == datetime.now().strftime('%Y-%m-%d'):
            score += 0.1
        
        return min(score, 1.0)
    
    async def get_search_results(self, search_id: str) -> Optional[Dict[str, Any]]:
        """Get results from a search operation"""
        
        # Check active searches first
        if search_id in self.active_searches:
            search_op = self.active_searches[search_id]
            return {
                "search_id": search_id,
                "status": search_op.status,
                "jobs": search_op.results,
                "completion_time": search_op.completion_time,
                "error": search_op.error_message
            }
        
        # Check search history
        for search_op in self.search_history:
            if search_op.search_id == search_id:
                return {
                    "search_id": search_id,
                    "status": search_op.status,
                    "jobs": search_op.results,
                    "completion_time": search_op.completion_time,
                    "error": search_op.error_message
                }
        
        return None
    
    async def submit_application(self, job: Dict[str, Any], applicant_data: Dict[str, Any], 
                               cover_letter: Optional[str] = None) -> Dict[str, Any]:
        """Submit job application through appropriate platform agent"""
        
        source = job.get("source", "unknown")
        
        print(f"📤 Submitting application to {source} for job: {job.get('title', 'Unknown')}")
        
        # Route to appropriate platform handler
        if source == "upwork":
            return await self._submit_upwork_application(job, applicant_data, cover_letter)
        elif source == "fiverr":
            return await self._submit_fiverr_application(job, applicant_data, cover_letter)
        elif source == "freelancer":
            return await self._submit_freelancer_application(job, applicant_data, cover_letter)
        else:
            raise ValueError(f"Unknown platform: {source}")
    
    async def _submit_upwork_application(self, job: Dict[str, Any], applicant_data: Dict[str, Any], 
                                       cover_letter: Optional[str]) -> Dict[str, Any]:
        """Submit application to Upwork"""
        
        # Mock Upwork application submission
        await asyncio.sleep(2)  # Simulate API call
        
        application_id = f"upwork_app_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        return {
            "success": True,
            "application_id": application_id,
            "platform": "upwork",
            "job_id": job.get("id"),
            "submitted_at": datetime.now().isoformat(),
            "status": "submitted"
        }
    
    async def _submit_fiverr_application(self, job: Dict[str, Any], applicant_data: Dict[str, Any], 
                                       cover_letter: Optional[str]) -> Dict[str, Any]:
        """Submit application to Fiverr"""
        
        # Mock Fiverr application submission
        await asyncio.sleep(2)
        
        application_id = f"fiverr_app_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        return {
            "success": True,
            "application_id": application_id,
            "platform": "fiverr",
            "job_id": job.get("id"),
            "submitted_at": datetime.now().isoformat(),
            "status": "submitted"
        }
    
    async def _submit_freelancer_application(self, job: Dict[str, Any], applicant_data: Dict[str, Any], 
                                           cover_letter: Optional[str]) -> Dict[str, Any]:
        """Submit application to Freelancer"""
        
        # Mock Freelancer application submission
        await asyncio.sleep(2)
        
        application_id = f"freelancer_app_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        return {
            "success": True,
            "application_id": application_id,
            "platform": "freelancer",
            "job_id": job.get("id"),
            "submitted_at": datetime.now().isoformat(),
            "status": "submitted"
        }
    
    async def get_service_stats(self) -> Dict[str, Any]:
        """Get scraping service statistics"""
        
        return {
            "is_initialized": self.is_initialized,
            "active_searches": len(self.active_searches),
            "completed_searches": len(self.search_history),
            "supported_platforms": list(self.platform_configs.keys()),
            "platform_configs": self.platform_configs,
            "search_operations": {
                "active": [
                    {
                        "search_id": op.search_id,
                        "status": op.status,
                        "started_at": op.started_at,
                        "platforms": op.platforms
                    }
                    for op in self.active_searches.values()
                ],
                "recent_completed": [
                    {
                        "search_id": op.search_id,
                        "status": op.status,
                        "completed_at": op.completion_time,
                        "results_count": len(op.results)
                    }
                    for op in self.search_history[-5:]  # Last 5 completed
                ]
            }
        }
    
    async def _initialize_platforms(self):
        """Initialize connections to job platforms"""
        
        print("🌐 Initializing platform connections...")
        
        # Mock platform initialization
        for platform in self.platform_configs:
            print(f"  ✅ {platform.title()} connection established")
            await asyncio.sleep(0.5)  # Simulate connection setup
    
    async def cleanup(self):
        """Cleanup scraping service resources"""
        
        print("🧹 Cleaning up scraping service...")
        
        # Cancel active searches
        for search_op in self.active_searches.values():
            search_op.status = "cancelled"
        
        self.active_searches.clear()
        self.is_initialized = False
        
        print("✅ Scraping service cleanup complete")