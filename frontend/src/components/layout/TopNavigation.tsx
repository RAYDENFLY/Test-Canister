"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default function TopNavigation() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50" data-testid="top-navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <img 
                src="/careerverse-logo.png" 
                alt="CareerVerse"
                className="w-8 h-8"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                  ((e.currentTarget.nextElementSibling) as HTMLElement).style.display = 'flex';
                }}
              />
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center" style={{display: 'none'}}>
                <span className="text-white font-bold text-sm">CV</span>
              </div>
              <span className="text-xl font-bold text-gray-900">CareerVerse</span>
            </Link>
          </div>

          {/* Navigation Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/jobs" className="text-gray-700 hover:text-blue-600 font-medium transition-colors" data-testid="nav-jobs">
              Job Board
            </Link>
            <Link href="/analytics" className="text-gray-700 hover:text-blue-600 font-medium transition-colors" data-testid="nav-analytics">
              Analytics
            </Link>
            <Link href="/docs" className="text-gray-700 hover:text-blue-600 font-medium transition-colors" data-testid="nav-docs">
              Docs
            </Link>
          </div>

          {/* Login/Profile */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button 
                variant="outline" 
                onClick={() => setIsLoginOpen(!isLoginOpen)}
                className="flex items-center space-x-2"
                data-testid="button-login"
              >
                <Avatar className="w-6 h-6">
                  <AvatarImage src="" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <span>Login</span>
              </Button>
              
              {/* Login Dropdown */}
              {isLoginOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4" data-testid="login-dropdown">
                  <h3 className="text-lg font-semibold mb-4">Sign In</h3>
                  <div className="space-y-3">
                    <input 
                      type="email" 
                      placeholder="Email" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      data-testid="input-email"
                    />
                    <input 
                      type="password" 
                      placeholder="Password" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      data-testid="input-password"
                    />
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" data-testid="button-signin">
                      Sign In
                    </Button>
                    <Button variant="outline" className="w-full" data-testid="button-signup">
                      Create Account
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
