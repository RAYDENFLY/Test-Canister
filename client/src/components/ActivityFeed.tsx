'use client';

import { Search, CheckCircle, MessageSquare, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const activities = [
  {
    id: 1,
    type: 'search',
    message: 'AI Agent found 3 new matching jobs',
    time: '2 minutes ago',
    icon: Search,
    color: 'gradient-primary'
  },
  {
    id: 2,
    type: 'success',
    message: 'Successfully applied to "React Developer" position',
    time: '15 minutes ago',
    icon: CheckCircle,
    color: 'bg-green-500'
  },
  {
    id: 3,
    type: 'message',
    message: 'Client responded to your proposal',
    time: '1 hour ago',
    icon: MessageSquare,
    color: 'bg-purple-500'
  },
  {
    id: 4,
    type: 'alert',
    message: 'New job alert: "Blockchain Developer" matches your skills',
    time: '3 hours ago',
    icon: Bell,
    color: 'bg-orange-500'
  },
];

export default function ActivityFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="glass rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold text-gray-100 mb-4">Recent Activity</h3>
      <div className="space-y-4 max-h-64 overflow-y-auto custom-scrollbar">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-3 p-3 glass rounded-lg">
              <div className={`${activity.color} rounded-full p-2 mt-1`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-100">{activity.message}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
