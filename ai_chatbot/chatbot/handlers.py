"""
Chat Handlers and Intent Detection
Processes user inputs and routes to appropriate AI responses
"""

import asyncio
from typing import Dict, Any, Optional
from datetime import datetime
from .model import JobRecommendationAI, ConversationManager
from .fetch_agent_client import FetchAgentClient

class ChatHandler:
    """Main chat handler that processes user messages"""
    
    def __init__(self):
        self.ai_model = JobRecommendationAI()
        self.conversation_manager = ConversationManager()
        self.fetch_client = FetchAgentClient()
        
    async def process_message(self, user_id: str, message: str, user_profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process incoming chat message and generate response
        
        Args:
            user_id: Unique user identifier
            message: User's chat message
            user_profile: User's profile data (skills, experience, etc.)
            
        Returns:
            Dictionary with response and metadata
        """
        
        # Add user message to conversation history
        self.conversation_manager.add_message(user_id, {
            "type": "user",
            "content": message,
            "user_id": user_id
        })
        
        # Get conversation context
        context = self.conversation_manager.get_context(user_id)
        context.update(user_profile)
        
        try:
            # Process message with AI model
            ai_response = await self.ai_model.process_chat_message(message, context)
            
            # Check if we need to fetch real job data
            if self._requires_job_data(message):
                job_data = await self.fetch_client.get_relevant_jobs(user_profile)
                ai_response = self._enhance_response_with_jobs(ai_response, job_data)
            
            # Add AI response to conversation history
            self.conversation_manager.add_message(user_id, {
                "type": "assistant", 
                "content": ai_response,
                "user_id": user_id
            })
            
            return {
                "response": ai_response,
                "type": "text",
                "timestamp": datetime.now().isoformat(),
                "metadata": {
                    "intent": self.ai_model._detect_intent(message),
                    "confidence": 0.9,
                    "processing_time": "1.2s"
                }
            }
            
        except Exception as e:
            # Fallback response for errors
            error_response = "I'm experiencing some technical difficulties. Let me help you with basic job search instead."
            
            self.conversation_manager.add_message(user_id, {
                "type": "assistant",
                "content": error_response, 
                "user_id": user_id,
                "error": True
            })
            
            return {
                "response": error_response,
                "type": "error",
                "timestamp": datetime.now().isoformat(),
                "metadata": {
                    "error": str(e),
                    "fallback": True
                }
            }
    
    def _requires_job_data(self, message: str) -> bool:
        """Check if message requires fetching real job data"""
        job_keywords = [
            "show me jobs", "find jobs", "job listings", 
            "opportunities", "positions", "hiring",
            "latest jobs", "new jobs", "job board"
        ]
        
        return any(keyword in message.lower() for keyword in job_keywords)
    
    def _enhance_response_with_jobs(self, ai_response: str, job_data: list) -> str:
        """Enhance AI response with real job data"""
        if not job_data:
            return ai_response
        
        job_summary = "\\n\\n📋 **Latest Opportunities**:\\n"
        
        for i, job in enumerate(job_data[:3], 1):
            job_summary += f"""
{i}. **{job.get('title', 'N/A')}** at {job.get('company', 'Company')}
   💰 {job.get('budget', 'Competitive salary')} | 📍 {job.get('location', 'Remote')}
   🏷️ {', '.join(job.get('skills', [])[:3])}
"""
        
        return ai_response + job_summary + "\\n\\nWould you like more details about any of these positions?"


class IntentClassifier:
    """Classifies user intents for better response routing"""
    
    INTENTS = {
        "job_search": {
            "keywords": ["job", "position", "work", "opportunity", "hiring", "employment"],
            "patterns": ["find me", "show me", "looking for", "search for"]
        },
        "skill_development": {
            "keywords": ["skill", "learn", "improve", "training", "course", "certification"],
            "patterns": ["how to", "best way", "learn about", "improve my"]
        },
        "career_advice": {
            "keywords": ["career", "path", "growth", "advice", "guidance", "roadmap"],
            "patterns": ["what should", "how can I", "career path", "next step"]
        },
        "salary_info": {
            "keywords": ["salary", "pay", "compensation", "wage", "income", "money"],
            "patterns": ["how much", "salary range", "pay scale", "earning potential"]
        },
        "company_info": {
            "keywords": ["company", "startup", "employer", "team", "culture", "benefits"],
            "patterns": ["tell me about", "what's it like", "company culture"]
        }
    }
    
    def classify(self, message: str) -> Dict[str, float]:
        """
        Classify message intent with confidence scores
        
        Returns:
            Dictionary mapping intent names to confidence scores
        """
        message_lower = message.lower()
        scores = {}
        
        for intent, config in self.INTENTS.items():
            score = 0.0
            
            # Score based on keywords
            keyword_matches = sum(1 for keyword in config["keywords"] if keyword in message_lower)
            score += keyword_matches * 0.3
            
            # Score based on patterns  
            pattern_matches = sum(1 for pattern in config["patterns"] if pattern in message_lower)
            score += pattern_matches * 0.5
            
            # Normalize score
            max_possible = len(config["keywords"]) * 0.3 + len(config["patterns"]) * 0.5
            if max_possible > 0:
                score = min(score / max_possible, 1.0)
            
            scores[intent] = score
        
        return scores
    
    def get_primary_intent(self, message: str) -> str:
        """Get the highest confidence intent"""
        scores = self.classify(message)
        if not scores:
            return "general"
        
        primary_intent = max(scores.items(), key=lambda x: x[1])
        
        # Return primary intent if confidence > 0.3, otherwise general
        return primary_intent[0] if primary_intent[1] > 0.3 else "general"


class ResponseFormatter:
    """Formats AI responses for different contexts and platforms"""
    
    @staticmethod
    def format_job_list(jobs: list, format_type: str = "chat") -> str:
        """Format job listings for display"""
        if not jobs:
            return "No matching jobs found at the moment."
        
        if format_type == "chat":
            formatted = "🎯 **Top Job Matches:**\\n\\n"
            
            for i, job in enumerate(jobs[:5], 1):
                formatted += f"""**{i}. {job.get('title', 'N/A')}**
🏢 {job.get('company', 'Company')}
💰 {job.get('budget', 'Competitive')}
📍 {job.get('location', 'Remote')}  
🏷️ {', '.join(job.get('skills', [])[:4])}
⭐ Match: {job.get('match_score', 85)}%

"""
            
            return formatted
        
        return "Job data formatted for: " + format_type
    
    @staticmethod  
    def format_skill_advice(skills: list, user_level: str = "mid") -> str:
        """Format skill development advice"""
        if not skills:
            return "I'd be happy to help you develop new skills!"
        
        advice = f"🚀 **Skill Development for {user_level.title()}-Level:**\\n\\n"
        
        priority_skills = skills[:3]
        emerging_skills = skills[3:6] if len(skills) > 3 else []
        
        if priority_skills:
            advice += "**🎯 Priority Skills:**\\n"
            for skill in priority_skills:
                advice += f"• {skill} - High demand in current market\\n"
        
        if emerging_skills:
            advice += "\\n**📈 Emerging Technologies:**\\n"
            for skill in emerging_skills:
                advice += f"• {skill} - Growing opportunity\\n"
        
        advice += "\\n💡 **Tip**: Focus on one skill at a time for maximum impact!"
        
        return advice