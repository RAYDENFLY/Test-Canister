'use client';

import { motion } from 'framer-motion';

export default function ReputationScore() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="glass rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold text-gray-100 mb-4">Reputation Score</h3>
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-blue-500 mb-4">
          <span className="text-2xl font-bold text-white">95</span>
        </div>
        <p className="text-sm text-gray-400">Excellent standing</p>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Completion Rate</span>
            <span className="text-gray-100">98%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Client Satisfaction</span>
            <span className="text-gray-100">4.9/5</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Response Time</span>
            <span className="text-gray-100">{'< 2h'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
