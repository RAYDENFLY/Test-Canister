'use client';

import { DollarSign, Target, Briefcase, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-100">Total Earnings</h3>
            <DollarSign className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-100">$12,450</p>
            <p className="text-sm text-green-400 mt-1">+15.2% from last month</p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-100">Success Rate</h3>
            <Target className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-100">94.5%</p>
            <p className="text-sm text-blue-400 mt-1">+2.1% from last month</p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-100">Active Projects</h3>
            <Briefcase className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-100">8</p>
            <p className="text-sm text-purple-400 mt-1">+3 from last month</p>
          </div>
        </motion.div>
      </div>
      
      {/* Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-gray-100 mb-6">Performance Overview</h3>
        <div className="h-64 flex items-center justify-center glass-strong rounded-xl">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Chart visualization will be implemented here</p>
            <p className="text-sm text-gray-500 mt-2">Integration with recharts or similar library</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
