import React from 'react';
import { Card } from '@/components/ui/card';

export default function DashboardStats() {
  const stats = [
    { id: 'roles', label: 'Open Roles', value: '24' },
    { id: 'companies', label: 'Companies Hiring', value: '12' },
    { id: 'applicants', label: 'Active Applicants', value: '1.2k' },
    { id: 'response', label: 'Avg Response Time', value: '48 hrs' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" data-testid="dashboard-stats">
      {stats.map(s => (
        <Card key={s.id} className="p-4 border border-gray-200 rounded-lg bg-white">
          <div className="text-sm text-gray-500">{s.label}</div>
          <div className="text-2xl font-bold mt-2">{s.value}</div>
        </Card>
      ))}
    </div>
  );
}
