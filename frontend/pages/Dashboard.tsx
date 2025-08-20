/**
 * Dashboard Page - Main dashboard for DecentWork platform
 * Moved from client/src/app/page.tsx for better organization
 */

import StatCard from '../components/StatCard';
import ActivityFeed from '../components/ActivityFeed';

export default function Dashboard() {
  const stats = [
    {
      title: "Active Jobs",
      value: "156",
      change: "+12%",
      trend: "up" as const,
      description: "Available opportunities"
    },
    {
      title: "Applications Sent", 
      value: "23",
      change: "+5%",
      trend: "up" as const,
      description: "This month"
    },
    {
      title: "Success Rate",
      value: "68%",
      change: "+8%", 
      trend: "up" as const,
      description: "Application success"
    },
    {
      title: "Earnings",
      value: "$12,450",
      change: "+15%",
      trend: "up" as const,
      description: "Total this year"
    }
  ];

  const activities = [
    {
      type: "application",
      title: "Applied to Senior React Developer",
      company: "Web3 Startup",
      time: "2 hours ago",
      status: "pending"
    },
    {
      type: "interview",
      title: "Interview scheduled",
      company: "DeFi Protocol",
      time: "1 day ago", 
      status: "upcoming"
    },
    {
      type: "offer",
      title: "Job offer received",
      company: "NFT Marketplace",
      time: "3 days ago",
      status: "action_required"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="glass rounded-2xl p-8 mb-6 bg-gradient-to-r from-blue-500/10 to-purple-600/10 animate-slide-up">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Welcome to DecentWork
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          Your AI-powered Web3 job discovery platform
        </p>
        <div className="flex gap-4">
          <button className="btn-primary">
            Find New Jobs
          </button>
          <button className="btn-secondary">
            View Applications
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <ActivityFeed activities={activities} />
        </div>

        {/* Quick Actions */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200 text-left">
              <div className="font-medium">Update Profile</div>
              <div className="text-sm text-gray-400">Keep your skills current</div>
            </button>
            <button className="w-full p-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200 text-left">
              <div className="font-medium">AI Job Match</div>
              <div className="text-sm text-gray-400">Get personalized recommendations</div>
            </button>
            <button className="w-full p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200 text-left">
              <div className="font-medium">Skill Assessment</div>
              <div className="text-sm text-gray-400">Validate your expertise</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}