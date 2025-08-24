"use client";

import { useState } from 'react';

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your AI career assistant powered by Fetch.ai agents. I can help you find job opportunities, optimize your profile, and negotiate terms. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: getAIResponse(inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('job') || input.includes('opportunity')) {
      return "I found several opportunities that match your profile! Based on your skills in blockchain and AI, I recommend checking out the Senior Blockchain Engineer position at DeFi Solutions ($140k-$200k) and the AI Research Scientist role at Fetch.ai Labs ($160k-$220k). Would you like me to analyze the requirements and help you tailor your application?";
    }
    
    if (input.includes('salary') || input.includes('negotiate')) {
      return "I can help you negotiate better terms! Based on current market data and your experience level, you have strong leverage. The average salary for your skillset is 15% higher than the initial offer. I can draft a negotiation strategy and handle the initial discussions with the employer's AI agent.";
    }
    
    if (input.includes('profile') || input.includes('optimize')) {
      return "Let me analyze your profile... I notice you could strengthen your blockchain certifications and add more recent project examples. Your AI/ML skills are excellent! I recommend highlighting your experience with multi-agent systems and adding Solidity to your tech stack. This could increase your match rate by 40%.";
    }
    
    return "That's an interesting question! As your AI agent, I can help with job matching, salary negotiations, profile optimization, and career planning in the decentralized economy. I work with other AI agents across the CareerVerse network to find the best opportunities for you. What specific area would you like to focus on?";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4" data-testid="ai-assistant-title">
            AI Career Assistant
          </h1>
          <p className="text-xl text-gray-600">
            Powered by Fetch.ai agents for intelligent job matching and career guidance
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm h-[600px] flex flex-col">
          {/* Chat Header */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">AI</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900" data-testid="ai-agent-name">
                  CareerVerse AI Agent
                </h3>
                <p className="text-sm text-green-600">● Online</p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" data-testid="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                data-testid={`message-${message.id}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg" data-testid="typing-indicator">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about jobs, salary negotiation, profile optimization..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                data-testid="input-chat-message"
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                data-testid="button-send-message"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <button 
            onClick={() => setInputMessage("Find me job opportunities in blockchain")}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
            data-testid="quick-action-jobs"
          >
            <h3 className="font-semibold text-gray-900 mb-2">🔍 Find Jobs</h3>
            <p className="text-sm text-gray-600">Search for opportunities matching your skills</p>
          </button>
          
          <button 
            onClick={() => setInputMessage("Help me optimize my profile")}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
            data-testid="quick-action-profile"
          >
            <h3 className="font-semibold text-gray-900 mb-2">⚡ Optimize Profile</h3>
            <p className="text-sm text-gray-600">Get AI-powered profile recommendations</p>
          </button>
          
          <button 
            onClick={() => setInputMessage("Negotiate salary for my next offer")}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
            data-testid="quick-action-negotiate"
          >
            <h3 className="font-semibold text-gray-900 mb-2">💰 Salary Negotiation</h3>
            <p className="text-sm text-gray-600">Get help with compensation discussions</p>
          </button>
        </div>
      </div>
    </div>
  );
}