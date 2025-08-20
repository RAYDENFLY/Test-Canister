"""
Fiverr Agent - Fetch.ai Agent for Fiverr Job Opportunities
Autonomous agent that monitors Fiverr gigs and client requests
"""

import asyncio
import aiohttp
import json
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict

@dataclass
class FiverrGig:
    """Data structure for Fiverr gig opportunities"""
    id: str
    title: str
    description: str
    category: str
    subcategory: str
    price_range: str
    seller_level: str
    rating: float
    reviews_count: int
    delivery_time: str
    skills_required: List[str]
    keywords: List[str]
    posted_date: str
    source: str = "fiverr"
    opportunity_type: str = "gig"  # gig, buyer_request
    scraped_at: str = ""
    
    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

@dataclass 
class BuyerRequest:
    """Data structure for Fiverr buyer requests"""
    id: str
    title: str
    description: str
    budget: str
    delivery_days: int
    skills_needed: List[str]
    buyer_location: str
    posted_date: str
    expires_date: str
    offers_count: int
    category: str
    source: str = "fiverr"
    opportunity_type: str = "buyer_request"
    scraped_at: str = ""
    
    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

class FiverrAgent:
    """
    Fetch.ai agent for autonomous Fiverr opportunity scanning
    
    This agent:
    1. Monitors Fiverr for Web3/blockchain gigs
    2. Scans buyer requests for relevant opportunities
    3. Analyzes market trends and pricing
    4. Reports findings to coordinator agent
    """
    
    def __init__(self, agent_address: str, coordinator_address: str):
        self.agent_address = agent_address
        self.coordinator_address = coordinator_address
        self.is_running = False
        self.last_scan_time = None
        self.gigs_found = []
        self.buyer_requests_found = []
        self.scan_interval = 600  # 10 minutes (Fiverr has stricter rate limits)
        
        # Fiverr search parameters
        self.categories = [
            "programming-tech/blockchain-cryptocurrency",
            "programming-tech/web-programming", 
            "programming-tech/desktop-applications",
            "programming-tech/mobile-apps"
        ]
        
        self.search_keywords = [
            "blockchain", "smart contract", "web3", "ethereum", "solidity",
            "defi", "nft", "crypto", "dapp", "token", "polygon", "bsc"
        ]
        
        self.skill_keywords = [
            "React", "JavaScript", "TypeScript", "Node.js", "Python",
            "Solidity", "Rust", "Web3.js", "Ethereum", "Smart Contracts",
            "Blockchain Development", "DeFi", "NFT Development"
        ]
    
    async def start_monitoring(self):
        """Start the autonomous monitoring process"""
        self.is_running = True
        print(f"🤖 Fiverr Agent {self.agent_address} starting monitoring...")
        
        while self.is_running:
            try:
                await self._scan_fiverr_gigs()
                await self._scan_buyer_requests()
                await self._analyze_opportunities()
                await self._send_results_to_coordinator()
                await asyncio.sleep(self.scan_interval)
                
            except Exception as e:
                print(f"❌ Fiverr Agent error: {e}")
                await asyncio.sleep(120)  # Wait 2 minutes before retrying
    
    async def stop_monitoring(self):
        """Stop the monitoring process"""
        self.is_running = False
        print(f"🛑 Fiverr Agent {self.agent_address} stopped")
    
    async def _scan_fiverr_gigs(self):
        """Scan Fiverr for relevant gigs"""
        print(f"🔍 Scanning Fiverr gigs... ({datetime.now().strftime('%H:%M:%S')})")
        
        found_gigs = []
        
        # Scan each category
        for category in self.categories:
            gigs = await self._fetch_gigs_by_category(category)
            found_gigs.extend(gigs)
        
        # Remove duplicates
        unique_gigs = {gig.id: gig for gig in found_gigs}
        self.gigs_found = list(unique_gigs.values())
        
        print(f"📋 Found {len(self.gigs_found)} relevant gigs")
    
    async def _fetch_gigs_by_category(self, category: str) -> List[FiverrGig]:
        """Fetch gigs for a specific category (mock implementation)"""
        
        # Mock gig data - replace with actual Fiverr API calls
        mock_gigs = [
            FiverrGig(
                id=f"fiverr_gig_{category.split('/')[-1]}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                title="I will develop smart contracts and DeFi protocols",
                description="Professional blockchain developer with 5+ years experience. Specializing in Solidity, Web3 integration, and DeFi protocols.",
                category=category.split('/')[0],
                subcategory=category.split('/')[-1] if '/' in category else category,
                price_range="$500 - $5,000",
                seller_level="Level 2",
                rating=4.9,
                reviews_count=127,
                delivery_time="3-7 days",
                skills_required=["Solidity", "Web3.js", "Smart Contracts", "DeFi"],
                keywords=self._extract_keywords_from_category(category),
                posted_date=datetime.now().strftime('%Y-%m-%d'),
                scraped_at=datetime.now().isoformat()
            ),
            FiverrGig(
                id=f"fiverr_gig_react_{category.split('/')[-1]}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                title="I will build responsive React Web3 applications",
                description="Expert React developer specializing in Web3 integration. Build modern DApps with wallet connection and blockchain interaction.",
                category=category.split('/')[0],
                subcategory=category.split('/')[-1] if '/' in category else category,
                price_range="$300 - $2,000",
                seller_level="Level 1",
                rating=4.7,
                reviews_count=89,
                delivery_time="5-10 days",
                skills_required=["React", "TypeScript", "Web3.js", "MetaMask"],
                keywords=["react", "web3", "dapp", "frontend"],
                posted_date=datetime.now().strftime('%Y-%m-%d'),
                scraped_at=datetime.now().isoformat()
            )
        ]
        
        # Simulate API delay
        await asyncio.sleep(2)
        
        return mock_gigs
    
    async def _scan_buyer_requests(self):
        """Scan Fiverr buyer requests"""
        print(f"🔍 Scanning buyer requests...")
        
        found_requests = []
        
        # Mock buyer request data
        mock_requests = [
            BuyerRequest(
                id=f"fiverr_request_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                title="Need Smart Contract Developer for NFT Marketplace",
                description="Looking for experienced Solidity developer to create smart contracts for NFT marketplace. Must have experience with ERC-721 standards.",
                budget="$1,000 - $3,000",
                delivery_days=14,
                skills_needed=["Solidity", "Smart Contracts", "NFT", "ERC-721"],
                buyer_location="United States",
                posted_date=datetime.now().strftime('%Y-%m-%d'),
                expires_date=(datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d'),
                offers_count=3,
                category="Programming & Tech",
                scraped_at=datetime.now().isoformat()
            ),
            BuyerRequest(
                id=f"fiverr_request_defi_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                title="DeFi Protocol Development - Yield Farming",
                description="Seeking blockchain developer to build yield farming protocol. Need expertise in Solidity, DeFi mechanisms, and security best practices.",
                budget="$2,500 - $5,000",
                delivery_days=21,
                skills_needed=["Solidity", "DeFi", "Yield Farming", "Security Auditing"],
                buyer_location="United Kingdom",
                posted_date=datetime.now().strftime('%Y-%m-%d'),
                expires_date=(datetime.now() + timedelta(days=10)).strftime('%Y-%m-%d'),
                offers_count=1,
                category="Programming & Tech",
                scraped_at=datetime.now().isoformat()
            )
        ]
        
        self.buyer_requests_found = mock_requests
        print(f"📋 Found {len(self.buyer_requests_found)} buyer requests")
    
    def _extract_keywords_from_category(self, category: str) -> List[str]:
        """Extract relevant keywords from category"""
        category_keywords = {
            "blockchain-cryptocurrency": ["blockchain", "crypto", "smart contract", "defi"],
            "web-programming": ["react", "javascript", "web3", "frontend"],
            "desktop-applications": ["electron", "desktop", "cross-platform"],
            "mobile-apps": ["react native", "mobile", "ios", "android"]
        }
        
        for cat_key, keywords in category_keywords.items():
            if cat_key in category:
                return keywords
        
        return ["programming", "development"]
    
    async def _analyze_opportunities(self):
        """Analyze found opportunities for relevance and market insights"""
        
        # Filter gigs by relevance
        relevant_gigs = []
        for gig in self.gigs_found:
            relevance_score = self._calculate_gig_relevance(gig)
            if relevance_score >= 0.6:
                relevant_gigs.append(gig)
        
        # Filter buyer requests by relevance
        relevant_requests = []
        for request in self.buyer_requests_found:
            relevance_score = self._calculate_request_relevance(request)
            if relevance_score >= 0.7:
                relevant_requests.append(request)
        
        self.gigs_found = relevant_gigs
        self.buyer_requests_found = relevant_requests
        
        print(f"✅ Filtered to {len(relevant_gigs)} relevant gigs and {len(relevant_requests)} relevant requests")
    
    def _calculate_gig_relevance(self, gig: FiverrGig) -> float:
        """Calculate relevance score for a gig"""
        score = 0.0
        
        # Check for Web3/blockchain keywords
        text_content = f"{gig.title} {gig.description}".lower()
        keyword_matches = sum(1 for keyword in self.search_keywords if keyword in text_content)
        score += min(keyword_matches / 3, 1.0) * 0.4
        
        # Check for required skills
        skill_matches = set(gig.skills_required) & set(self.skill_keywords)
        score += len(skill_matches) / max(len(self.skill_keywords), 1) * 0.4
        
        # Rating and review factors
        if gig.rating >= 4.5 and gig.reviews_count >= 50:
            score += 0.2
        
        return min(score, 1.0)
    
    def _calculate_request_relevance(self, request: BuyerRequest) -> float:
        """Calculate relevance score for a buyer request"""
        score = 0.0
        
        # Check for Web3/blockchain keywords
        text_content = f"{request.title} {request.description}".lower()
        keyword_matches = sum(1 for keyword in self.search_keywords if keyword in text_content)
        score += min(keyword_matches / 2, 1.0) * 0.5
        
        # Check for needed skills
        skill_matches = set(request.skills_needed) & set(self.skill_keywords)
        score += len(skill_matches) / max(len(self.skill_keywords), 1) * 0.3
        
        # Budget consideration (higher budget = more attractive)
        if "$1000" in request.budget or "$2000" in request.budget or "$3000" in request.budget:
            score += 0.2
        
        return min(score, 1.0)
    
    async def _send_results_to_coordinator(self):
        """Send found opportunities to coordinator agent"""
        
        if not self.gigs_found and not self.buyer_requests_found:
            return
        
        try:
            # Prepare data for coordinator
            message = {
                "agent": "fiverr_agent",
                "timestamp": datetime.now().isoformat(),
                "gigs_count": len(self.gigs_found),
                "requests_count": len(self.buyer_requests_found),
                "gigs": [gig.to_dict() for gig in self.gigs_found],
                "buyer_requests": [req.to_dict() for req in self.buyer_requests_found],
                "scan_duration": "45s",
                "next_scan": (datetime.now() + timedelta(seconds=self.scan_interval)).isoformat()
            }
            
            print(f"📤 Sending {len(self.gigs_found)} gigs and {len(self.buyer_requests_found)} requests to coordinator")
            
            # Send to coordinator (mock implementation)
            await self._mock_send_to_coordinator(message)
            
        except Exception as e:
            print(f"❌ Error sending to coordinator: {e}")
    
    async def _mock_send_to_coordinator(self, message: Dict[str, Any]):
        """Mock implementation of sending message to coordinator"""
        print(f"📡 Message sent to coordinator: {message['gigs_count']} gigs, {message['requests_count']} requests")
        await asyncio.sleep(0.5)
    
    def get_agent_stats(self) -> Dict[str, Any]:
        """Get agent statistics"""
        return {
            "agent_address": self.agent_address,
            "status": "active" if self.is_running else "inactive",
            "last_scan": self.last_scan_time.isoformat() if self.last_scan_time else None,
            "gigs_found_last_scan": len(self.gigs_found),
            "requests_found_last_scan": len(self.buyer_requests_found),
            "scan_interval_seconds": self.scan_interval,
            "categories_monitored": len(self.categories),
            "keywords_monitored": len(self.search_keywords)
        }


# Main execution
async def main():
    """Main function to run Fiverr agent"""
    
    fiverr_agent = FiverrAgent("fiverr_agent_001", "coordinator_agent_001")
    
    try:
        print("🚀 Starting Fiverr Agent...")
        await fiverr_agent.start_monitoring()
        
    except KeyboardInterrupt:
        print("⏹️ Stopping Fiverr Agent...")
        await fiverr_agent.stop_monitoring()
    except Exception as e:
        print(f"💥 Fiverr Agent crashed: {e}")

if __name__ == "__main__":
    asyncio.run(main())