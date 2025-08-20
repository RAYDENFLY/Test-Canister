"""
Job Formatter Service - Formats and enriches job data
Provides consistent job data formatting and market analytics
"""

from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from collections import defaultdict, Counter
import re

class JobFormatter:
    """
    Service for formatting and enriching job data
    
    Provides:
    1. Consistent job data formatting across platforms
    2. Job enrichment with additional metadata
    3. Market analytics and trends
    4. Salary range normalization
    """
    
    def __init__(self):
        self.skill_categories = {
            "frontend": ["React", "Vue", "Angular", "TypeScript", "JavaScript", "HTML", "CSS"],
            "backend": ["Node.js", "Python", "Java", "PHP", "Ruby", "Go", "Rust"],
            "blockchain": ["Solidity", "Web3.js", "Ethereum", "Smart Contracts", "DeFi", "NFT"],
            "mobile": ["React Native", "Flutter", "iOS", "Android", "Swift", "Kotlin"],
            "devops": ["Docker", "Kubernetes", "AWS", "Azure", "CI/CD", "Jenkins"],
            "database": ["PostgreSQL", "MongoDB", "MySQL", "Redis", "DynamoDB"]
        }
        
        self.experience_levels = {
            "entry": ["junior", "entry", "beginner", "intern", "graduate"],
            "mid": ["mid", "intermediate", "regular", "standard"],
            "senior": ["senior", "lead", "expert", "principal", "staff"],
            "executive": ["director", "vp", "cto", "head", "chief"]
        }
    
    def format_jobs_for_api(self, jobs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Format jobs for API response"""
        
        formatted_jobs = []
        
        for job in jobs:
            formatted_job = self._format_single_job(job)
            formatted_jobs.append(formatted_job)
        
        return formatted_jobs
    
    def _format_single_job(self, job: Dict[str, Any]) -> Dict[str, Any]:
        """Format a single job for consistency"""
        
        return {
            "id": job.get("id", ""),
            "title": job.get("title", ""),
            "description": self._clean_description(job.get("description", "")),
            "budget": self._normalize_budget(job.get("budget", "")),
            "budget_range": self._extract_budget_range(job.get("budget", "")),
            "skills": job.get("skills", []),
            "skill_categories": self._categorize_skills(job.get("skills", [])),
            "source": job.get("source", ""),
            "job_type": job.get("job_type", ""),
            "experience_level": self._normalize_experience_level(job.get("experience_level", "")),
            "location": job.get("location", "Remote"),
            "posted_date": job.get("posted_date", ""),
            "deadline": job.get("deadline"),
            "client_rating": job.get("client_rating"),
            "proposals": job.get("proposals", 0),
            "match_score": job.get("match_score", 0.0),
            "relevance_tags": job.get("relevance_tags", []),
            "scraped_at": job.get("scraped_at", ""),
            "processed_at": job.get("processed_at", ""),
            
            # Enhanced fields
            "urgency": self._calculate_urgency(job),
            "competition_level": self._calculate_competition(job),
            "budget_competitiveness": self._assess_budget_competitiveness(job),
            "estimated_duration": self._estimate_project_duration(job),
            "complexity_score": self._calculate_complexity(job)
        }
    
    def _clean_description(self, description: str) -> str:
        """Clean and format job description"""
        
        if not description:
            return ""
        
        # Remove excessive whitespace
        cleaned = re.sub(r'\s+', ' ', description.strip())
        
        # Limit length for API response
        if len(cleaned) > 500:
            cleaned = cleaned[:497] + "..."
        
        return cleaned
    
    def _normalize_budget(self, budget_str: str) -> str:
        """Normalize budget string format"""
        
        if not budget_str:
            return "Budget not specified"
        
        # Clean up the budget string
        budget_str = budget_str.strip()
        
        # Handle common budget formats
        if "/hr" in budget_str.lower() or "hourly" in budget_str.lower():
            return f"Hourly: {budget_str}"
        elif "fixed" in budget_str.lower() or "$" in budget_str:
            return f"Fixed: {budget_str}"
        else:
            return budget_str
    
    def _extract_budget_range(self, budget_str: str) -> Dict[str, Any]:
        """Extract structured budget information"""
        
        budget_info = {
            "min": 0,
            "max": 0,
            "currency": "USD",
            "type": "unknown"  # hourly, fixed, equity, negotiable
        }
        
        if not budget_str:
            return budget_info
        
        # Determine budget type
        if "/hr" in budget_str.lower() or "hourly" in budget_str.lower():
            budget_info["type"] = "hourly"
        elif "fixed" in budget_str.lower():
            budget_info["type"] = "fixed"
        elif "equity" in budget_str.lower():
            budget_info["type"] = "equity"
        elif "negotiable" in budget_str.lower():
            budget_info["type"] = "negotiable"
        
        # Extract numeric values
        amounts = re.findall(r'\$?(\d+(?:,\d{3})*(?:\.\d{2})?)', budget_str)
        
        if amounts:
            numeric_amounts = [float(amount.replace(',', '')) for amount in amounts]
            budget_info["min"] = min(numeric_amounts)
            budget_info["max"] = max(numeric_amounts)
        
        return budget_info
    
    def _categorize_skills(self, skills: List[str]) -> List[str]:
        """Categorize skills into technology categories"""
        
        categories = []
        skill_set = set(skill.lower() for skill in skills)
        
        for category, category_skills in self.skill_categories.items():
            category_skill_set = set(skill.lower() for skill in category_skills)
            
            if skill_set.intersection(category_skill_set):
                categories.append(category)
        
        return categories
    
    def _normalize_experience_level(self, level: str) -> str:
        """Normalize experience level"""
        
        if not level:
            return "intermediate"
        
        level_lower = level.lower()
        
        for normalized, keywords in self.experience_levels.items():
            if any(keyword in level_lower for keyword in keywords):
                return normalized
        
        return "intermediate"  # Default fallback
    
    def _calculate_urgency(self, job: Dict[str, Any]) -> str:
        """Calculate job urgency level"""
        
        urgency_keywords = ["urgent", "asap", "immediate", "rush", "emergency"]
        deadline = job.get("deadline")
        description = job.get("description", "").lower()
        
        # Check for urgency keywords
        if any(keyword in description for keyword in urgency_keywords):
            return "high"
        
        # Check deadline
        if deadline:
            try:
                deadline_date = datetime.strptime(deadline, '%Y-%m-%d')
                days_until_deadline = (deadline_date - datetime.now()).days
                
                if days_until_deadline <= 7:
                    return "high"
                elif days_until_deadline <= 21:
                    return "medium"
                else:
                    return "low"
            except:
                pass
        
        return "medium"
    
    def _calculate_competition(self, job: Dict[str, Any]) -> str:
        """Calculate competition level based on proposals"""
        
        proposals = job.get("proposals", 0)
        
        if proposals <= 5:
            return "low"
        elif proposals <= 15:
            return "medium"
        else:
            return "high"
    
    def _assess_budget_competitiveness(self, job: Dict[str, Any]) -> str:
        """Assess if budget is competitive"""
        
        budget_range = self._extract_budget_range(job.get("budget", ""))
        max_budget = budget_range.get("max", 0)
        budget_type = budget_range.get("type", "unknown")
        
        if budget_type == "hourly":
            if max_budget >= 100:
                return "very_competitive"
            elif max_budget >= 50:
                return "competitive"
            elif max_budget >= 25:
                return "fair"
            else:
                return "low"
        elif budget_type == "fixed":
            if max_budget >= 5000:
                return "very_competitive"
            elif max_budget >= 2000:
                return "competitive"
            elif max_budget >= 500:
                return "fair"
            else:
                return "low"
        
        return "unknown"
    
    def _estimate_project_duration(self, job: Dict[str, Any]) -> str:
        """Estimate project duration based on description and budget"""
        
        description = job.get("description", "").lower()
        budget_range = self._extract_budget_range(job.get("budget", ""))
        max_budget = budget_range.get("max", 0)
        
        # Duration keywords
        duration_keywords = {
            "short": ["quick", "simple", "small", "minor", "basic"],
            "medium": ["moderate", "standard", "regular", "typical"],
            "long": ["complex", "large", "comprehensive", "extensive", "advanced"]
        }
        
        for duration, keywords in duration_keywords.items():
            if any(keyword in description for keyword in keywords):
                return duration
        
        # Estimate based on budget (for fixed projects)
        if budget_range.get("type") == "fixed":
            if max_budget >= 5000:
                return "long"
            elif max_budget >= 1000:
                return "medium"
            else:
                return "short"
        
        return "medium"
    
    def _calculate_complexity(self, job: Dict[str, Any]) -> float:
        """Calculate job complexity score (0-1)"""
        
        score = 0.0
        description = job.get("description", "").lower()
        skills = job.get("skills", [])
        
        # Complexity keywords
        complex_keywords = [
            "architecture", "scalable", "enterprise", "microservices",
            "advanced", "expert", "senior", "lead", "complex",
            "integration", "api", "system", "infrastructure"
        ]
        
        keyword_matches = sum(1 for keyword in complex_keywords if keyword in description)
        score += min(keyword_matches / 5, 0.4)  # Max 0.4 from keywords
        
        # Number of skills
        score += min(len(skills) / 10, 0.3)  # Max 0.3 from skills count
        
        # Budget consideration
        budget_range = self._extract_budget_range(job.get("budget", ""))
        max_budget = budget_range.get("max", 0)
        
        if budget_range.get("type") == "fixed" and max_budget >= 3000:
            score += 0.2
        elif budget_range.get("type") == "hourly" and max_budget >= 75:
            score += 0.2
        
        # Experience level
        experience = job.get("experience_level", "")
        if experience in ["senior", "expert"]:
            score += 0.1
        
        return min(score, 1.0)
    
    async def enrich_job_details(self, job: Dict[str, Any]) -> Dict[str, Any]:
        """Enrich job with additional details and context"""
        
        enriched = self._format_single_job(job)
        
        # Add market context
        enriched["market_context"] = await self._get_market_context(job)
        
        # Add similar jobs count
        enriched["similar_jobs_count"] = await self._count_similar_jobs(job)
        
        # Add skill demand info
        enriched["skill_demand"] = self._analyze_skill_demand(job.get("skills", []))
        
        return enriched
    
    async def _get_market_context(self, job: Dict[str, Any]) -> Dict[str, Any]:
        """Get market context for the job"""
        
        # Mock market context - replace with real market data
        return {
            "average_budget": "$2,500",
            "typical_duration": "2-4 weeks",
            "demand_level": "high",
            "competition_trend": "increasing"
        }
    
    async def _count_similar_jobs(self, job: Dict[str, Any]) -> int:
        """Count similar jobs in the market"""
        
        # Mock similar jobs count
        return 15
    
    def _analyze_skill_demand(self, skills: List[str]) -> Dict[str, Any]:
        """Analyze demand for specific skills"""
        
        # Mock skill demand analysis
        demand_levels = {}
        
        for skill in skills[:5]:  # Analyze top 5 skills
            # Simple mock logic
            if skill.lower() in ["react", "typescript", "solidity", "web3"]:
                demand_levels[skill] = "very_high"
            elif skill.lower() in ["javascript", "node.js", "python"]:
                demand_levels[skill] = "high"
            else:
                demand_levels[skill] = "medium"
        
        return {
            "skill_demand_levels": demand_levels,
            "trending_skills": ["Solidity", "React", "TypeScript", "Web3.js"],
            "market_saturation": "moderate"
        }
    
    async def generate_market_analytics(self) -> Dict[str, Any]:
        """Generate comprehensive market analytics"""
        
        # Mock market analytics - replace with real data analysis
        return {
            "total_jobs_analyzed": 1250,
            "trending_technologies": [
                {"name": "Solidity", "growth": "+45%", "avg_budget": "$3,200"},
                {"name": "React", "growth": "+23%", "avg_budget": "$2,800"},
                {"name": "TypeScript", "growth": "+34%", "avg_budget": "$2,600"},
                {"name": "Web3.js", "growth": "+67%", "avg_budget": "$3,500"}
            ],
            "budget_trends": {
                "hourly_rates": {
                    "blockchain_dev": {"min": 75, "max": 150, "avg": 110},
                    "frontend_dev": {"min": 40, "max": 100, "avg": 65},
                    "fullstack_dev": {"min": 55, "max": 125, "avg": 85}
                },
                "fixed_projects": {
                    "avg_budget": 2850,
                    "median_budget": 2200,
                    "budget_distribution": {
                        "under_1k": "25%",
                        "1k_5k": "45%",
                        "5k_10k": "20%",
                        "over_10k": "10%"
                    }
                }
            },
            "platform_insights": {
                "upwork": {
                    "total_jobs": 580,
                    "avg_budget": "$2,950",
                    "competition_level": "high"
                },
                "fiverr": {
                    "total_opportunities": 320,
                    "avg_price": "$1,200",
                    "competition_level": "medium"
                },
                "freelancer": {
                    "total_projects": 350,
                    "avg_budget": "$2,100",
                    "competition_level": "medium"
                }
            },
            "skill_demand_forecast": {
                "next_quarter": {
                    "high_demand": ["Solidity", "Rust", "React", "TypeScript"],
                    "emerging": ["Move", "Sui", "Aptos", "StarkNet"],
                    "declining": ["jQuery", "PHP", "WordPress"]
                }
            },
            "geographic_trends": {
                "remote_percentage": 78,
                "top_client_locations": [
                    "United States (35%)",
                    "United Kingdom (15%)",
                    "Canada (12%)",
                    "Australia (8%)"
                ]
            },
            "generated_at": datetime.now().isoformat()
        }