/**
 * API Client - Frontend API client for consuming backend services
 * Handles communication with AI chatbot and backend agent APIs
 */

class APIClient {
  constructor() {
    this.backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
    this.chatbotUrl = process.env.REACT_APP_CHATBOT_URL || 'http://localhost:8001';
  }

  // Generic request handler
  async request(url, options = {}) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Backend Agent API calls
  async getJobRecommendations(userProfile) {
    return this.request(`${this.backendUrl}/api/jobs/recommendations`, {
      method: 'POST',
      body: JSON.stringify(userProfile),
    });
  }

  async triggerJobSearch(searchParams) {
    return this.request(`${this.backendUrl}/api/search/trigger`, {
      method: 'POST',
      body: JSON.stringify(searchParams),
    });
  }

  async getSearchResults(searchId) {
    return this.request(`${this.backendUrl}/api/search/${searchId}/results`);
  }

  async getAgentStatus() {
    return this.request(`${this.backendUrl}/api/agents/status`);
  }

  async updateUserPreferences(userId, preferences) {
    return this.request(`${this.backendUrl}/api/users/${userId}/preferences`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, ...preferences }),
    });
  }

  async submitJobApplication(applicationData) {
    return this.request(`${this.backendUrl}/api/applications/submit`, {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  }

  async getJobDetails(jobId) {
    return this.request(`${this.backendUrl}/api/jobs/${jobId}`);
  }

  async getMarketAnalytics() {
    return this.request(`${this.backendUrl}/api/analytics/market`);
  }

  // AI Chatbot API calls
  async sendChatMessage(userId, message, userProfile = {}) {
    return this.request(`${this.chatbotUrl}/api/chat/message`, {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        message: message,
        user_profile: userProfile,
      }),
    });
  }

  async getJobRecommendationsFromAI(userProfile, count = 10) {
    return this.request(`${this.chatbotUrl}/api/recommendations/jobs`, {
      method: 'POST',
      body: JSON.stringify({
        user_profile: userProfile,
        count: count,
      }),
    });
  }

  async getSkillAdvice(currentSkills, targetRole = 'web3_developer', experienceLevel = 'mid') {
    return this.request(`${this.chatbotUrl}/api/advice/skills`, {
      method: 'POST',
      body: JSON.stringify({
        current_skills: currentSkills,
        target_role: targetRole,
        experience_level: experienceLevel,
      }),
    });
  }

  // WebSocket connection for real-time chat
  connectChatWebSocket(userId, onMessage, onError) {
    const wsUrl = `${this.chatbotUrl.replace('http', 'ws')}/ws/${userId}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('Chat WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('Chat WebSocket error:', error);
      if (onError) onError(error);
    };

    ws.onclose = () => {
      console.log('Chat WebSocket disconnected');
    };

    return ws;
  }

  // Health checks
  async checkBackendHealth() {
    try {
      return await this.request(`${this.backendUrl}/api/health`);
    } catch (error) {
      return { status: 'error', error: error.message };
    }
  }

  async checkChatbotHealth() {
    try {
      return await this.request(`${this.chatbotUrl}/api/health`);
    } catch (error) {
      return { status: 'error', error: error.message };
    }
  }

  // Utility methods
  async getAllData(userId, userProfile) {
    try {
      const [
        jobRecommendations,
        agentStatus,
        marketAnalytics,
        aiRecommendations,
      ] = await Promise.all([
        this.getJobRecommendations(userProfile),
        this.getAgentStatus(),
        this.getMarketAnalytics(),
        this.getJobRecommendationsFromAI(userProfile),
      ]);

      return {
        success: true,
        data: {
          jobRecommendations,
          agentStatus,
          marketAnalytics,
          aiRecommendations,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Mock data fallbacks (for development)
  getMockJobRecommendations() {
    return {
      success: true,
      jobs: [
        {
          id: 'mock_job_001',
          title: 'Senior React Developer',
          company: 'Web3 Startup',
          budget: '$5,000 - $8,000',
          skills: ['React', 'TypeScript', 'Web3.js'],
          match_score: 0.95,
          source: 'upwork',
          location: 'Remote',
          posted_date: '2024-08-20',
        },
        {
          id: 'mock_job_002',
          title: 'Blockchain Engineer',
          company: 'DeFi Protocol',
          budget: '$100 - $150/hr',
          skills: ['Solidity', 'Rust', 'Smart Contracts'],
          match_score: 0.88,
          source: 'freelancer',
          location: 'Remote',
          posted_date: '2024-08-19',
        },
      ],
      total_count: 2,
    };
  }

  getMockAgentStatus() {
    return {
      success: true,
      coordinator: {
        status: 'active',
        total_jobs: 156,
        connected_agents: 3,
      },
      agents: {
        upwork_agent: { status: 'active', jobs_found: 89 },
        fiverr_agent: { status: 'active', jobs_found: 43 },
        freelancer_agent: { status: 'active', jobs_found: 24 },
      },
    };
  }
}

// Export singleton instance
const apiClient = new APIClient();
export default apiClient;