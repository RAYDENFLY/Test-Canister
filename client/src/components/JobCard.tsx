'use client';

import { MapPin, Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';

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

interface JobCardProps {
  job: Job;
  variant?: 'full' | 'compact';
}

export default function JobCard({ job, variant = 'full' }: JobCardProps) {
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-xl p-4 hover-glow"
      >
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-sm font-semibold text-gray-100 truncate">{job.title}</h4>
          <span className="text-xs text-gray-400 ml-2">{job.source}</span>
        </div>
        <p className="text-sm text-green-400 font-medium mb-2">{job.budget}</p>
        <div className="flex flex-wrap gap-1">
          {job.skills.map((skill) => (
            <span key={skill} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
              {skill}
            </span>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 hover-glow"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-100 mb-1">{job.title}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{job.clientLocation || 'Remote'}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{job.duration || '1-3 months'}</span>
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-green-400">{job.budget}</div>
          <div className="flex items-center space-x-1 text-sm text-gray-400">
            <Star className="w-4 h-4 text-yellow-400" />
            <span>{job.rating}</span>
          </div>
        </div>
      </div>
      
      {job.description && (
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{job.description}</p>
      )}
      
      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills.map((skill) => (
          <span key={skill} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
            {skill}
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded">{job.source}</span>
        <button className="gradient-primary px-4 py-2 rounded-lg text-white text-sm font-medium hover:scale-105 transition-transform">
          View Details
        </button>
      </div>
    </motion.div>
  );
}
