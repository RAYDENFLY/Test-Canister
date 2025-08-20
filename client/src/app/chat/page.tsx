'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, User, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/api_client';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your AI job assistant. I can help you find jobs, analyze opportunities, optimize your profile, and answer questions about the Web3 job market. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      type: 'assistant',
      content: '...',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const response = await apiClient.sendChat(inputValue);
      
      // Remove typing indicator and add real response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== 'typing');
        return [...filtered, {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: response.reply,
          timestamp: new Date()
        }];
      });
    } catch (error) {
      // Remove typing indicator and add error message
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== 'typing');
        return [...filtered, {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: "Sorry, I'm having trouble responding right now. Please try again.",
          timestamp: new Date()
        }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass rounded-2xl h-[600px] flex flex-col">
      {/* Chat Header */}
      <div className="border-b border-white/10 p-6">
        <div className="flex items-center space-x-4">
          <div className="gradient-primary rounded-full p-3">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-100">AI Job Assistant</h3>
            <p className="text-sm text-gray-400">Powered by Fetch.ai • Online</p>
          </div>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        <div className="space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start space-x-3 ${
                message.type === 'user' ? 'justify-end' : ''
              }`}
            >
              {message.type === 'assistant' && (
                <div className="glass rounded-full p-2 mt-1">
                  <Bot className="w-4 h-4 text-blue-400" />
                </div>
              )}
              <div
                className={`rounded-2xl p-4 max-w-md ${
                  message.type === 'user'
                    ? 'gradient-primary text-white rounded-tr-sm'
                    : 'glass rounded-tl-sm text-gray-100'
                }`}
              >
                {message.id === 'typing' ? (
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
              </div>
              {message.type === 'user' && (
                <div className="gradient-primary rounded-full p-2 mt-1">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Chat Input */}
      <div className="border-t border-white/10 p-6">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything about jobs, skills, or opportunities..."
              disabled={isLoading}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pr-12 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="absolute right-2 top-2 gradient-primary rounded-md p-2 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
