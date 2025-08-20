export interface Job {
  title: string;
  budget: string;
  skills: string[];
  rating: number;
  source: string;
  description?: string;
  clientLocation?: string;
  duration?: string;
}

export interface ChatResponse {
  reply: string;
}

const mockJobs: Job[] = [
  {
    title: "Senior React Developer",
    budget: "$5,000 - $8,000",
    skills: ["React", "TypeScript", "GraphQL"],
    rating: 4.9,
    source: "Upwork",
    description: "Looking for an experienced React developer to build a modern e-commerce platform with advanced features.",
    clientLocation: "United States",
    duration: "3-6 months"
  },
  {
    title: "Blockchain Smart Contract Developer",
    budget: "$75-100/hr",
    skills: ["Solidity", "Web3", "Ethereum"],
    rating: 4.8,
    source: "Freelancer",
    description: "Need a skilled blockchain developer to create and deploy smart contracts for our DeFi project.",
    clientLocation: "United Kingdom",
    duration: "2-4 months"
  },
  {
    title: "Full Stack Web3 Engineer",
    budget: "$6,000 - $10,000",
    skills: ["Next.js", "Solidity", "IPFS"],
    rating: 4.7,
    source: "Upwork",
    description: "Building a decentralized social media platform. Looking for someone with experience in Web3 technologies.",
    clientLocation: "Canada",
    duration: "4-8 months"
  },
  {
    title: "AI Agent Integrator",
    budget: "$80-120/hr",
    skills: ["Python", "AI/ML", "Fetch.ai"],
    rating: 4.9,
    source: "Toptal",
    description: "Integrate AI agents into existing platform using Fetch.ai framework for autonomous job matching.",
    clientLocation: "Germany",
    duration: "1-3 months"
  },
  {
    title: "Frontend Developer - DeFi Dashboard",
    budget: "$4,000 - $7,000",
    skills: ["React", "Web3.js", "Chart.js"],
    rating: 4.6,
    source: "Upwork",
    description: "Create a beautiful and functional dashboard for DeFi portfolio management with real-time data visualization.",
    clientLocation: "Australia",
    duration: "2-3 months"
  },
  {
    title: "Golang Backend Developer",
    budget: "$90-110/hr",
    skills: ["Go", "PostgreSQL", "Docker"],
    rating: 4.8,
    source: "Freelancer",
    description: "Develop high-performance backend services for cryptocurrency trading platform with microservices architecture.",
    clientLocation: "Singapore",
    duration: "3-5 months"
  }
];

const quickRecommendations: Job[] = [
  {
    title: "Golang Backend Developer",
    budget: "$90-110/hr",
    skills: ["Go", "PostgreSQL", "Docker"],
    rating: 4.8,
    source: "Freelancer"
  },
  {
    title: "AI Agent Integrator",
    budget: "$80-120/hr",
    skills: ["Python", "AI/ML", "Fetch.ai"],
    rating: 4.9,
    source: "Toptal"
  },
  {
    title: "React + ICP Auth Developer",
    budget: "$70-95/hr",
    skills: ["React", "TypeScript", "ICP"],
    rating: 4.7,
    source: "Upwork"
  }
];

export const apiClient = {
  async getQuickRecommendations(): Promise<Job[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return quickRecommendations;
  },
  
  async getAllJobs(): Promise<Job[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockJobs;
  },
  
  async sendChat(prompt: string): Promise<ChatResponse> {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple AI responses based on keywords
    let response = "I'd be happy to help you with that! ";
    
    if (prompt.toLowerCase().includes('job') || prompt.toLowerCase().includes('find')) {
      response += "I can help you find relevant job opportunities. Based on your skills in React, TypeScript, and Web3, I see some great matches in our database. Would you like me to show you the top recommendations?";
    } else if (prompt.toLowerCase().includes('skill') || prompt.toLowerCase().includes('improve')) {
      response += "To improve your profile and attract better opportunities, I recommend highlighting your Web3 experience and completing some certification courses. Your current skills are in high demand!";
    } else if (prompt.toLowerCase().includes('rate') || prompt.toLowerCase().includes('price')) {
      response += "Based on your experience level and skill set, your current rate of $85/hour is competitive. Similar developers in your area are charging between $70-120/hour for Web3 projects.";
    } else {
      response += `You asked: "${prompt}". Let me analyze this and provide you with relevant insights about the job market and opportunities that match your profile.`;
    }
    
    return { reply: response };
  }
};
