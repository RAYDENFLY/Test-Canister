import React from 'react';
import { Card } from '@/components/ui/card';
import jobs from '@/lib/jobs';

export default function FeaturedJobs() {
  const featured = jobs.slice(0, 3);

  const truncate = (text: string, n = 120) => (text.length > n ? text.slice(0, n).trim() + '…' : text);

  return (
    <div data-testid="featured-jobs">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Featured Jobs</h2>
        <a href="/dashboard/jobboard" className="text-sm text-blue-600">See all jobs</a>
      </div>

      <div className="grid gap-4">
        {featured.map(job => (
          <Card key={job.id} className="p-4 border border-gray-200 hover:shadow" data-testid={`featured-job-${job.id}`}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-sm font-medium text-gray-900">{job.title}</div>
                <div className="text-xs text-blue-600 font-medium">{job.company}</div>
                <div className="text-xs text-gray-500">{job.location} • {job.postedDate}</div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-yellow-500">⭐</span>
                <span className="text-gray-700 font-medium">{job.rating}</span>
              </div>
            </div>

            <p className="text-gray-600 mb-3 text-sm" data-testid={`featured-description-${job.id}`}>
              {truncate(job.description || '', 140)}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {job.skills?.slice(0, 5).map((skill: string, idx: number) => (
                <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs" data-testid={`featured-skill-${job.id}-${idx}`}>
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 space-x-4">
                <span data-testid={`featured-salary-${job.id}`}>💰 {job.salary}</span>
                <span data-testid={`featured-location-${job.id}`}>📍 {job.location}</span>
              </div>
              <a href="/dashboard/jobboard" className="text-sm inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700" data-testid={`featured-view-${job.id}`}>
                View Jobs
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
