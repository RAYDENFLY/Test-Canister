"""
Identity Manager Service - Handles user identity and profile management
Manages user profiles, preferences, and identity verification
"""

import asyncio
import json
from typing import Dict, List, Any, Optional
from datetime import datetime
import hashlib

class IdentityManager:
    """
    Service for managing user identities and profiles
    
    Handles:
    1. User profile storage and retrieval
    2. Identity verification
    3. Preference management
    4. Profile analytics
    """
    
    def __init__(self):
        self.user_profiles: Dict[str, Dict[str, Any]] = {}
        self.verification_records: Dict[str, Dict[str, Any]] = {}
        self.is_initialized = False
    
    async def initialize(self):
        """Initialize identity manager"""
        print("👤 Initializing identity manager...")
        self.is_initialized = True
        print("✅ Identity manager ready")
    
    async def create_user_profile(self, user_id: str, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new user profile"""
        
        profile = {
            "user_id": user_id,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
            "profile_data": profile_data,
            "verification_status": "pending",
            "preferences": {},
            "application_history": [],
            "profile_completeness": self._calculate_profile_completeness(profile_data)
        }
        
        self.user_profiles[user_id] = profile
        
        print(f"✅ Created profile for user: {user_id}")
        
        return {
            "success": True,
            "user_id": user_id,
            "profile_completeness": profile["profile_completeness"]
        }
    
    async def update_user_profile(self, user_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        """Update user profile"""
        
        if user_id not in self.user_profiles:
            return await self.create_user_profile(user_id, updates)
        
        profile = self.user_profiles[user_id]
        
        # Update profile data
        profile["profile_data"].update(updates)
        profile["updated_at"] = datetime.now().isoformat()
        profile["profile_completeness"] = self._calculate_profile_completeness(profile["profile_data"])
        
        print(f"✅ Updated profile for user: {user_id}")
        
        return {
            "success": True,
            "user_id": user_id,
            "profile_completeness": profile["profile_completeness"]
        }
    
    async def get_user_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user profile"""
        
        return self.user_profiles.get(user_id)
    
    async def verify_user_identity(self, user_id: str, verification_data: Dict[str, Any]) -> Dict[str, Any]:
        """Verify user identity"""
        
        verification_id = f"verify_{user_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Mock verification process
        verification_result = {
            "verification_id": verification_id,
            "user_id": user_id,
            "status": "verified",
            "confidence_score": 0.95,
            "verification_method": "profile_analysis",
            "verified_at": datetime.now().isoformat(),
            "verification_data": verification_data
        }
        
        self.verification_records[verification_id] = verification_result
        
        # Update user profile
        if user_id in self.user_profiles:
            self.user_profiles[user_id]["verification_status"] = "verified"
            self.user_profiles[user_id]["verification_id"] = verification_id
        
        print(f"✅ Verified identity for user: {user_id}")
        
        return {
            "success": True,
            "verification_id": verification_id,
            "status": "verified",
            "confidence_score": 0.95
        }
    
    def _calculate_profile_completeness(self, profile_data: Dict[str, Any]) -> float:
        """Calculate profile completeness score"""
        
        required_fields = ["name", "email", "skills", "experience_level"]
        optional_fields = ["bio", "portfolio", "education", "certifications", "location"]
        
        score = 0.0
        
        # Required fields (60% weight)
        required_score = sum(1 for field in required_fields if profile_data.get(field))
        score += (required_score / len(required_fields)) * 0.6
        
        # Optional fields (40% weight)
        optional_score = sum(1 for field in optional_fields if profile_data.get(field))
        score += (optional_score / len(optional_fields)) * 0.4
        
        return round(score, 2)
    
    async def add_application_record(self, user_id: str, application_data: Dict[str, Any]) -> Dict[str, Any]:
        """Add application record to user profile"""
        
        if user_id not in self.user_profiles:
            await self.create_user_profile(user_id, {})
        
        application_record = {
            "application_id": application_data.get("application_id"),
            "job_id": application_data.get("job_id"),
            "job_title": application_data.get("job_title"),
            "platform": application_data.get("platform"),
            "applied_at": datetime.now().isoformat(),
            "status": "submitted"
        }
        
        self.user_profiles[user_id]["application_history"].append(application_record)
        
        return {
            "success": True,
            "application_id": application_record["application_id"]
        }
    
    async def get_user_analytics(self, user_id: str) -> Dict[str, Any]:
        """Get user analytics and insights"""
        
        if user_id not in self.user_profiles:
            return {"error": "User not found"}
        
        profile = self.user_profiles[user_id]
        applications = profile.get("application_history", [])
        
        analytics = {
            "profile_stats": {
                "profile_completeness": profile.get("profile_completeness", 0),
                "verification_status": profile.get("verification_status", "pending"),
                "member_since": profile.get("created_at", ""),
                "last_updated": profile.get("updated_at", "")
            },
            "application_stats": {
                "total_applications": len(applications),
                "applications_this_month": self._count_recent_applications(applications, 30),
                "platforms_used": list(set(app.get("platform") for app in applications)),
                "success_rate": self._calculate_success_rate(applications)
            },
            "skill_insights": self._analyze_user_skills(profile.get("profile_data", {})),
            "recommendations": self._generate_profile_recommendations(profile)
        }
        
        return analytics
    
    def _count_recent_applications(self, applications: List[Dict[str, Any]], days: int) -> int:
        """Count applications in recent days"""
        
        from datetime import timedelta
        
        cutoff_date = datetime.now() - timedelta(days=days)
        recent_count = 0
        
        for app in applications:
            try:
                app_date = datetime.fromisoformat(app.get("applied_at", ""))
                if app_date >= cutoff_date:
                    recent_count += 1
            except:
                continue
        
        return recent_count
    
    def _calculate_success_rate(self, applications: List[Dict[str, Any]]) -> float:
        """Calculate application success rate"""
        
        if not applications:
            return 0.0
        
        successful = sum(1 for app in applications if app.get("status") in ["accepted", "hired"])
        return round(successful / len(applications), 2)
    
    def _analyze_user_skills(self, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze user skills"""
        
        skills = profile_data.get("skills", [])
        
        # Categorize skills
        skill_categories = {
            "blockchain": ["Solidity", "Web3.js", "Ethereum", "Smart Contracts"],
            "frontend": ["React", "Vue", "Angular", "TypeScript"],
            "backend": ["Node.js", "Python", "Java", "PHP"],
            "mobile": ["React Native", "Flutter", "iOS", "Android"]
        }
        
        user_categories = []
        for category, category_skills in skill_categories.items():
            if any(skill in skills for skill in category_skills):
                user_categories.append(category)
        
        return {
            "total_skills": len(skills),
            "skill_categories": user_categories,
            "top_skills": skills[:5],
            "skill_gap_analysis": self._identify_skill_gaps(skills, user_categories)
        }
    
    def _identify_skill_gaps(self, user_skills: List[str], categories: List[str]) -> List[str]:
        """Identify skill gaps for career advancement"""
        
        # Mock skill gap analysis
        recommended_skills = []
        
        if "blockchain" in categories:
            blockchain_advanced = ["Rust", "Move", "ZK-Proofs", "DeFi Protocols"]
            recommended_skills.extend([skill for skill in blockchain_advanced if skill not in user_skills])
        
        if "frontend" in categories:
            frontend_advanced = ["Next.js", "GraphQL", "Testing", "Performance Optimization"]
            recommended_skills.extend([skill for skill in frontend_advanced if skill not in user_skills])
        
        return recommended_skills[:5]  # Top 5 recommendations
    
    def _generate_profile_recommendations(self, profile: Dict[str, Any]) -> List[Dict[str, str]]:
        """Generate profile improvement recommendations"""
        
        recommendations = []
        completeness = profile.get("profile_completeness", 0)
        
        if completeness < 0.8:
            recommendations.append({
                "type": "profile_completion",
                "title": "Complete Your Profile",
                "description": "Add missing information to improve your profile visibility"
            })
        
        if profile.get("verification_status") != "verified":
            recommendations.append({
                "type": "verification",
                "title": "Verify Your Identity",
                "description": "Complete identity verification to increase trust with clients"
            })
        
        applications = profile.get("application_history", [])
        if len(applications) < 5:
            recommendations.append({
                "type": "activity",
                "title": "Apply to More Jobs",
                "description": "Increase your application activity to improve visibility"
            })
        
        return recommendations
    
    async def cleanup(self):
        """Cleanup identity manager resources"""
        
        print("🧹 Cleaning up identity manager...")
        self.is_initialized = False