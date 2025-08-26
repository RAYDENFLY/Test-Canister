"use client";

import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardStats from '@/components/dashboard/DashboardStats';
import FeaturedJobs from '@/components/dashboard/FeaturedJobs';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:pl-80">
        <main>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Career Dashboard</h1>
              <div className="text-sm text-gray-500">Welcome back</div>
            </div>

            <DashboardStats />
            <FeaturedJobs />
          </div>
        </main>
      </div>
    </div>
  );
}
