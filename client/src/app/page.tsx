'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, DollarSign, Star, TrendingUp, Loader2 } from 'lucide-react';
import StatCard from '@/components/StatCard';
import ActivityFeed from '@/components/ActivityFeed';
import ReputationScore from '@/components/ReputationScore';
import MatchingPreview from '@/components/MatchingPreview';
import JobCard from '@/components/JobCard';
import { apiClient, Job } from '@/lib/api_client';

export default function Dashboard() {
  const [recommendations, setRecommendations] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    try {
      const jobs = await apiClient.getQuickRecommendations();
      setRecommendations(jobs);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-strong rounded-2xl p-8"
      >
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-100 mb-4">
            Welcome back, <span className="gradient-text">Alex</span>
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Your AI-powered job agent is working around the clock to find the perfect opportunities for you.
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span>Fetch.ai Agent Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span>ICP Identity Verified</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Jobs"
          value={127}
          change="+12%"
          Icon={Briefcase}
          accent="primary"
          delay={0.1}
        />
        <StatCard
          title="Average Rate"
          value="$85/hr"
          change="+8%"
          Icon={DollarSign}
          accent="secondary"
          delay={0.2}
        />
        <StatCard
          title="Success Rate"
          value="4.9"
          change="+5%"
          Icon={Star}
          accent="purple"
          delay={0.3}
        />
        <StatCard
          title="AI Matches"
          value={23}
          change="+18%"
          Icon={TrendingUp}
          accent="orange"
          delay={0.4}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>
        <div className="space-y-6">
          <ReputationScore />
          <MatchingPreview />
        </div>
      </div>

      {/* Quick Recommendations */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-100">AI Recommendations</h3>
          <button
            onClick={handleGetRecommendations}
            disabled={isLoading}
            className="gradient-primary px-4 py-2 rounded-lg text-white font-medium hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? 'Getting Recommendations...' : 'Get Quick Recommendations'}
          </button>
        </div>
        
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {recommendations.map((job, index) => (
              <JobCard key={index} job={job} variant="compact" />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
