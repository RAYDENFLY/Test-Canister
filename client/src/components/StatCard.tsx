'use client';

import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  Icon: LucideIcon;
  accent: 'primary' | 'secondary' | 'purple' | 'orange';
  delay?: number;
}

const accentStyles = {
  primary: 'gradient-primary',
  secondary: 'gradient-secondary',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
};

export default function StatCard({ 
  title, 
  value, 
  change, 
  Icon, 
  accent, 
  delay = 0 
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="glass rounded-2xl p-6 hover-glow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`${accentStyles[accent]} rounded-lg p-3`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <span className="text-xs text-green-400 font-medium">{change}</span>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-100">{value}</h3>
        <p className="text-sm text-gray-400">{title}</p>
      </div>
    </motion.div>
  );
}
