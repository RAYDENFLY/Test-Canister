'use client';

import { motion } from 'framer-motion';

const skills = [
  { name: 'React Development', match: 95, color: 'bg-green-400' },
  { name: 'Web3 Integration', match: 89, color: 'bg-blue-400' },
  { name: 'TypeScript', match: 87, color: 'bg-purple-400' },
];

export default function MatchingPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
      className="glass rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold text-gray-100 mb-4">AI Matching Preview</h3>
      <div className="space-y-3">
        {skills.map((skill) => (
          <div key={skill.name} className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${skill.color}`}></div>
            <span className="text-sm text-gray-300">{skill.name}</span>
            <span className={`text-xs ml-auto ${skill.color.replace('bg-', 'text-')}`}>
              {skill.match}% match
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
