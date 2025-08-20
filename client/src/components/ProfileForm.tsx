'use client';

import { useState } from 'react';
import { Camera, User } from 'lucide-react';

const defaultSkills = ['React', 'TypeScript', 'Web3', 'Next.js', 'Solidity'];

export default function ProfileForm() {
  const [formData, setFormData] = useState({
    displayName: 'Alex Chen',
    email: 'alex.chen@example.com',
    location: 'San Francisco, CA',
    hourlyRate: '$85/hour',
    bio: 'Experienced Web3 developer with 5+ years in React and blockchain technologies. Specialized in building decentralized applications and smart contract integration.',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="glass rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-100 mb-8">Profile Settings</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full gradient-primary p-1">
                <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                  <User className="w-10 h-10 text-gray-400" />
                </div>
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 gradient-primary rounded-full p-2 hover:scale-105 transition-transform"
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-100">Profile Photo</h3>
              <p className="text-sm text-gray-400">Update your profile picture</p>
            </div>
          </div>
          
          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Hourly Rate
              </label>
              <input
                type="text"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Skills
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {defaultSkills.map((skill) => (
                <span key={skill} className="gradient-primary px-3 py-1 rounded-full text-xs text-white">
                  {skill}
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add new skills..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell potential clients about yourself..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6">
            <button
              type="button"
              className="px-6 py-3 border border-white/20 rounded-lg text-gray-300 hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="gradient-primary px-6 py-3 rounded-lg text-white font-medium hover:scale-105 transition-transform"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
