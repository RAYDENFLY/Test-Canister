"use client";

import React from 'react';
import JobBoard from '@/components/jobs/JobBoard';
import Sidebar from '@/components/dashboard/Sidebar';

export default function JobBoardPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
        <Sidebar />
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <JobBoard />
      </div>
    </div>
  );
}
