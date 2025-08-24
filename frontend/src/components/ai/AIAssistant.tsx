"use client";

import { useState, useEffect } from 'react';
import { apiClient, ChatRequest, ChatResponse } from '@/lib/api';

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  filters?: any; // Job filters from API response
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your AI career assistant powered by Fetch.ai agents and Grok AI. I can help you find job opportunities, optimize your profile, and analyze job requirements. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  // Check API connection on component mount
  useEffect(() => {
    checkAPIConnection();
  }, []);

  const checkAPIConnection = async () => {
    setConnectionStatus('checking');
    try {
      const connected = await apiClient.testConnection();
      setIsConnected(connected);
      setConnectionStatus(connected ? 'connected' : 'disconnected');
      
      if (connected) {
        console.log('✅ Connected to AI chatbot API');
      } else {
        console.log('❌ Failed to connect to AI chatbot API');
      }
    } catch (error) {
      setIsConnected(false);
      setConnectionStatus('disconnected');
      console.error('❌ Error checking API connection:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Send request to real AI chatbot API
      const chatRequest: ChatRequest = {
        user_prompt: inputMessage,
        top_k: 5
      };

      const response: ChatResponse = await apiClient.chat(chatRequest);
      
      const aiResponse: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: response.message,
        timestamp: new Date(),
        filters: response.filters
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback response if API fails
      const errorMessage: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: "I'm sorry, I'm having trouble connecting to my AI services right now. Please check if the backend server is running on port 8081, or try again later.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
    // Auto-send after a short delay
    setTimeout(() => {
      if (action === inputMessage) {
        sendMessage();
      }
    }, 100);
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'checking':
        return 'Checking connection...';
      case 'connected':
        return 'Connected to AI Backend';
      case 'disconnected':
        return 'Disconnected from AI Backend';
      default:
        return 'Unknown status';
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'checking':
        return 'bg-yellow-500';
      case 'connected':
        return 'bg-green-500';
      case 'disconnected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4" data-testid="ai-assistant-title">
            AI Career Assistant
          </h1>
          <p className="text-xl text-gray-600">
            Powered by Fetch.ai agents and Grok AI for intelligent job matching and career guidance
          </p>
          
          {/* API Connection Status */}
          <div className="mt-4 flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getConnectionStatusColor()}`}></div>
            <span className={`text-sm ${
              connectionStatus === 'connected' ? 'text-green-600' : 
              connectionStatus === 'checking' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {getConnectionStatusText()}
            </span>
            {connectionStatus === 'disconnected' && (
              <button 
                onClick={checkAPIConnection}
                className="ml-2 text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Retry Connection
              </button>
            )}
          </div>
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
                <p className={`text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                  {isConnected ? '● Online' : '● Offline'}
                </p>
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
                  
                  {/* Show job filters if available */}
                  {message.filters && message.type === 'ai' && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">📋 Parsed Job Requirements:</p>
                      <div className="text-xs text-gray-700 space-y-1">
                        {message.filters.skills.length > 0 && (
                          <div><strong>Skills:</strong> {message.filters.skills.join(', ')}</div>
                        )}
                        {message.filters.keywords.length > 0 && (
                          <div><strong>Keywords:</strong> {message.filters.keywords.join(', ')}</div>
                        )}
                        {message.filters.budget_min && message.filters.budget_max && (
                          <div><strong>Budget:</strong> ${message.filters.budget_min}-${message.filters.budget_max}</div>
                        )}
                        {message.filters.remote !== null && (
                          <div><strong>Remote:</strong> {message.filters.remote ? 'Yes' : 'No'}</div>
                        )}
                      </div>
                    </div>
                  )}
                  
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
                disabled={!isConnected}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isTyping || !isConnected}
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
            onClick={() => handleQuickAction("Find me job opportunities in blockchain and AI")}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
            data-testid="quick-action-jobs"
            disabled={!isConnected}
          >
            <h3 className="font-semibold text-gray-900 mb-2">🔍 Find Jobs</h3>
            <p className="text-sm text-gray-600">Search for opportunities matching your skills</p>
          </button>
          
          <button 
            onClick={() => handleQuickAction("Help me optimize my profile for web3 development")}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
            data-testid="quick-action-profile"
            disabled={!isConnected}
          >
            <h3 className="font-semibold text-gray-900 mb-2">⚡ Optimize Profile</h3>
            <p className="text-sm text-gray-600">Get AI-powered profile recommendations</p>
          </button>
          
          <button 
            onClick={() => handleQuickAction("Analyze job requirements for Python developer positions")}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
            data-testid="quick-action-negotiate"
            disabled={!isConnected}
          >
            <h3 className="font-semibold text-gray-900 mb-2">📋 Job Analysis</h3>
            <p className="text-sm text-gray-600">Get detailed job requirement analysis</p>
          </button>
        </div>
      </div>
    </div>
  );
}