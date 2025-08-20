"""
Upwork Agent - Fetch.ai Agent for Upwork Job Scraping
Autonomous agent that monitors and scrapes job listings from Upwork
"""

import asyncio
import aiohttp
import json
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from fetchai.ledger.api import LedgerApi
from fetchai.ledger.crypto import Entity, Address

@dataclass
class JobListing:
    """Data structure for job listings"""
    id: str
    title: str
    description: str
    budget: str
    skills: List[str]
    client_rating: float
    posted_date: str
    deadline: Optional[str]
    proposals: int
    client_location: str
    job_type: str  # hourly, fixed
    experience_level: str
    source: str = "upwork"
    scraped_at: str = ""
    
    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

class UpworkAgent:
    """
    Fetch.ai agent for autonomous Upwork job scraping
    
    This agent:
    1. Monitors Upwork for new job postings
    2. Filters jobs based on Web3/blockchain criteria
    3. Extracts structured job data
    4. Communicates findings to coordinator agent
    """
    
    def __init__(self, agent_address: str, coordinator_address: str):
        self.agent_address = agent_address
        self.coordinator_address = coordinator_address
        self.is_running = False
        self.last_scan_time = None
        self.jobs_found = []
        self.scan_interval = 300  # 5 minutes
        
        # Upwork search parameters
        self.search_keywords = [
            "blockchain", "web3", "ethereum", "solidity", "smart contract",
            "defi", "nft", "cryptocurrency", "dapp", "rust blockchain",
            "react web3", "typescript blockchain", "polygon", "binance smart chain"
        ]
        
        self.skill_filters = [
            "React", "TypeScript", "JavaScript", "Node.js", "Python",
            "Solidity", "Rust", "Go", "Web3.js", "Ethers.js",
            "Smart Contracts", "Blockchain", "DeFi", "NFT"
        ]
        
    async def start_monitoring(self):
        """Start the autonomous monitoring process"""
        self.is_running = True
        print(f"🤖 Upwork Agent {self.agent_address} starting monitoring...")
        
        while self.is_running:
            try:
                await self._scan_upwork_jobs()
                await self._process_found_jobs()
                await self._send_results_to_coordinator()
                await asyncio.sleep(self.scan_interval)
                
            except Exception as e:
                print(f"❌ Upwork Agent error: {e}")
                await asyncio.sleep(60)  # Wait 1 minute before retrying
    
    async def stop_monitoring(self):
        """Stop the monitoring process"""
        self.is_running = False
        print(f"🛑 Upwork Agent {self.agent_address} stopped")
    
    async def _scan_upwork_jobs(self):
        """Scan Upwork for new job listings"""
        print(f"🔍 Scanning Upwork for jobs... ({datetime.now().strftime('%H:%M:%S')})")
        
        found_jobs = []
        
        # Simulate Upwork API calls (replace with actual Upwork API integration)
        for keyword in self.search_keywords[:3]:  # Limit to 3 keywords per scan
            jobs = await self._fetch_jobs_by_keyword(keyword)
            found_jobs.extend(jobs)
        
        # Remove duplicates based on job ID
        unique_jobs = {job.id: job for job in found_jobs}
        self.jobs_found = list(unique_jobs.values())
        
        print(f"📋 Found {len(self.jobs_found)} unique jobs")
        self.last_scan_time = datetime.now()
    
    async def _fetch_jobs_by_keyword(self, keyword: str) -> List[JobListing]:
        """Fetch jobs for a specific keyword (mock implementation)"""
        
        # Mock job data - replace with actual Upwork API calls
        mock_jobs = [
            JobListing(
                id=f"upwork_{keyword}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                title=f"Senior {keyword.title()} Developer",
                description=f"Looking for experienced developer with {keyword} expertise. Build cutting-edge applications using modern technologies.",
                budget="$5,000 - $10,000",
                skills=self._get_relevant_skills(keyword),
                client_rating=4.8,
                posted_date=datetime.now().strftime('%Y-%m-%d'),
                deadline=(datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d'),
                proposals=5,
                client_location="United States",
                job_type="fixed",
                experience_level="expert",
                scraped_at=datetime.now().isoformat()
            ),
            JobListing(
                id=f"upwork_{keyword}_hourly_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                title=f"{keyword.title()} Consultant",
                description=f"Need ongoing {keyword} consultation and development support. Long-term project with growth potential.",
                budget="$75 - $120/hr",
                skills=self._get_relevant_skills(keyword),
                client_rating=4.9,
                posted_date=datetime.now().strftime('%Y-%m-%d'),
                deadline=None,
                proposals=2,
                client_location="Remote",
                job_type="hourly",
                experience_level="intermediate",
                scraped_at=datetime.now().isoformat()
            )
        ]
        
        # Simulate API delay
        await asyncio.sleep(1)
        
        return mock_jobs
    
    def _get_relevant_skills(self, keyword: str) -> List[str]:
        """Get relevant skills based on keyword"""
        skill_mapping = {
            "blockchain": ["Solidity", "Web3.js", "Ethereum", "Smart Contracts"],
            "web3": ["React", "TypeScript", "Web3.js", "MetaMask Integration"],
            "ethereum": ["Solidity", "Hardhat", "Truffle", "OpenZeppelin"],
            "solidity": ["Smart Contracts", "Ethereum", "DeFi", "Security Auditing"],
            "smart contract": ["Solidity", "Rust", "Vyper", "Contract Testing"],
            "defi": ["Solidity", "Yield Farming", "AMM", "Liquidity Protocols"],
            "nft": ["ERC-721", "ERC-1155", "IPFS", "Metadata Standards"],
            "rust blockchain": ["Rust", "Substrate", "Polkadot", "Solana"],
            "react web3": ["React", "Web3.js", "Ethers.js", "DApp Development"]
        }
        
        base_skills = skill_mapping.get(keyword.lower(), ["JavaScript", "Node.js"])
        return base_skills + ["Git", "API Integration"]
    
    async def _process_found_jobs(self):
        """Process and enrich found jobs"""
        processed_jobs = []
        
        for job in self.jobs_found:
            # Calculate relevance score
            relevance_score = self._calculate_relevance_score(job)
            
            if relevance_score >= 0.7:  # Only keep highly relevant jobs
                # Enrich job data
                enriched_job = await self._enrich_job_data(job)
                processed_jobs.append(enriched_job)
        
        self.jobs_found = processed_jobs
        print(f"✅ Processed {len(processed_jobs)} relevant jobs")
    
    def _calculate_relevance_score(self, job: JobListing) -> float:
        """Calculate job relevance score based on skills and keywords"""
        score = 0.0
        
        # Score based on skills match
        matching_skills = set(job.skills) & set(self.skill_filters)
        skill_score = len(matching_skills) / max(len(self.skill_filters), 1)
        score += skill_score * 0.6
        
        # Score based on title/description keywords
        text_content = f"{job.title} {job.description}".lower()
        keyword_matches = sum(1 for keyword in self.search_keywords if keyword in text_content)
        keyword_score = min(keyword_matches / 3, 1.0)  # Normalize to max 1.0
        score += keyword_score * 0.4
        
        return min(score, 1.0)
    
    async def _enrich_job_data(self, job: JobListing) -> JobListing:
        """Enrich job data with additional information"""
        
        # Add match score and other computed fields
        job.scraped_at = datetime.now().isoformat()
        
        # Could add more enrichment here:
        # - Client verification status
        # - Historical budget analysis
        # - Skill demand trends
        # - Competition analysis
        
        return job
    
    async def _send_results_to_coordinator(self):
        """Send found jobs to coordinator agent"""
        if not self.jobs_found:
            return
        
        try:
            # Convert jobs to serializable format
            jobs_data = [job.to_dict() for job in self.jobs_found]
            
            # Send to coordinator (mock implementation)
            message = {
                "agent": "upwork_agent",
                "timestamp": datetime.now().isoformat(),
                "job_count": len(jobs_data),
                "jobs": jobs_data,
                "scan_duration": "30s",
                "next_scan": (datetime.now() + timedelta(seconds=self.scan_interval)).isoformat()
            }
            
            print(f"📤 Sending {len(jobs_data)} jobs to coordinator")
            
            # In real implementation, this would use Fetch.ai messaging protocol
            await self._mock_send_to_coordinator(message)
            
        except Exception as e:
            print(f"❌ Error sending to coordinator: {e}")
    
    async def _mock_send_to_coordinator(self, message: Dict[str, Any]):
        """Mock implementation of sending message to coordinator"""
        
        # This would be replaced with actual Fetch.ai agent communication
        print(f"📡 Message sent to coordinator: {message['job_count']} jobs")
        
        # Simulate network delay
        await asyncio.sleep(0.5)
    
    def get_agent_stats(self) -> Dict[str, Any]:
        """Get agent statistics"""
        return {
            "agent_address": self.agent_address,
            "status": "active" if self.is_running else "inactive",
            "last_scan": self.last_scan_time.isoformat() if self.last_scan_time else None,
            "jobs_found_last_scan": len(self.jobs_found),
            "scan_interval_seconds": self.scan_interval,
            "keywords_monitored": len(self.search_keywords),
            "skills_filtered": len(self.skill_filters)
        }


# Fetch.ai Agent Protocol Integration
class FetchAIUpworkAgent:
    """Fetch.ai protocol wrapper for Upwork agent"""
    
    def __init__(self, private_key: str = None):
        self.entity = Entity() if not private_key else Entity.from_hex(private_key)
        self.address = Address(self.entity)
        self.upwork_agent = UpworkAgent(str(self.address), "coordinator_address")
        
    async def register_agent(self):
        """Register agent on Fetch.ai network"""
        print(f"🌐 Registering Upwork Agent on Fetch.ai network...")
        print(f"📍 Agent Address: {self.address}")
        
        # In real implementation, register with Fetch.ai Agent Land
        # and set up message handlers
        
    async def start_agent(self):
        """Start the Fetch.ai agent"""
        await self.register_agent()
        await self.upwork_agent.start_monitoring()
        
    async def stop_agent(self):
        """Stop the Fetch.ai agent"""
        await self.upwork_agent.stop_monitoring()


# Main execution
async def main():
    """Main function to run Upwork agent"""
    
    agent = FetchAIUpworkAgent()
    
    try:
        print("🚀 Starting Upwork Agent...")
        await agent.start_agent()
        
    except KeyboardInterrupt:
        print("⏹️ Stopping Upwork Agent...")
        await agent.stop_agent()
    except Exception as e:
        print(f"💥 Agent crashed: {e}")

if __name__ == "__main__":
    asyncio.run(main())