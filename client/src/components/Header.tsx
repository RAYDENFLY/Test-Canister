import { useLocation } from 'wouter';
import { Bell } from 'lucide-react';

const pageInfo: Record<string, { title: string; subtitle: string }> = {
  '/': {
    title: 'Dashboard',
    subtitle: 'Welcome back, ready to find your next opportunity?'
  },
  '/jobs': {
    title: 'Job Board',
    subtitle: 'Discover amazing opportunities that match your skills'
  },
  '/chat': {
    title: 'AI Assistant',
    subtitle: 'Get personalized job recommendations and career advice'
  },
  '/analytics': {
    title: 'Analytics',
    subtitle: 'Track your performance and earnings over time'
  },
  '/profile': {
    title: 'Profile',
    subtitle: 'Manage your professional information and settings'
  },
};

export default function Header() {
  const [location] = useLocation();
  const currentPage = pageInfo[location] || pageInfo['/'];

  return (
    <header className="glass rounded-2xl p-4 mb-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-100">{currentPage.title}</h2>
          <p className="text-sm text-gray-400">{currentPage.subtitle}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="glass rounded-lg px-3 py-1.5">
            <span className="text-xs font-medium gradient-text">MVP • Fetch.ai Integration</span>
          </div>
          <button className="glass rounded-lg p-2 hover-glow">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
