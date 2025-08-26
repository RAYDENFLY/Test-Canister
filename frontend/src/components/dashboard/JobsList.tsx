import React from 'react';
import { Card } from '@/components/ui/card';

const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp AI",
      description: "Build next-generation decentralized applications using React and Web3 technologies.",
      salary: "$120,000 - $180,000",
      skills: ["React", "TypeScript", "Web3", "Solidity"],
      rating: 4.8,
      location: "Remote",
      postedDate: "2 days ago"
    },
    {
      id: 2,
      title: "Blockchain Engineer",
      company: "DeFi Solutions",
      description: "Design and implement smart contracts for decentralized finance applications.",
      salary: "$140,000 - $200,000", 
      skills: ["Solidity", "Rust", "ICP", "Smart Contracts"],
      rating: 4.9,
      location: "San Francisco, CA",
      postedDate: "1 day ago"
    },
    {
      id: 3,
      title: "AI/ML Research Scientist",
      company: "Fetch.ai Labs",
      description: "Research and develop autonomous agents for decentralized marketplaces.",
      salary: "$160,000 - $220,000",
      skills: ["Python", "TensorFlow", "Multi-Agent Systems", "Fetch.ai"],
      rating: 4.7,
      location: "Cambridge, UK",
      postedDate: "3 days ago"
    },
    {
      id: 4,
      title: "Product Designer",
      company: "Web3 Studios",
      description: "Design intuitive interfaces for decentralized applications and blockchain tools.",
      salary: "$90,000 - $130,000",
      skills: ["Figma", "UI/UX", "Web3", "Design Systems"],
      rating: 4.6,
      location: "Remote",
      postedDate: "1 week ago"
    }
  ];

export default function JobsList() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Job Board</h2>
        <div className="text-sm text-gray-500">{jobs.length} openings</div>
      </div>
      <div className="grid gap-4">
        {jobs.map(job => (
          <Card key={job.id} className="p-4 border border-gray-200 hover:shadow" data-testid={`job-${job.id}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{job.title}</div>
                <div className="text-xs text-gray-500">{job.company} • {job.location}</div>
              </div>
              <div className="text-xs text-gray-400">{job.posted}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
