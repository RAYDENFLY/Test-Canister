/**
 * Sidebar Component - Navigation sidebar for DecentWork platform
 * Moved from client/src/components/Sidebar.tsx for better organization
 */

import { Link, useLocation } from 'wouter';
import { 
  Home, 
  Briefcase, 
  MessageSquare, 
  BarChart3, 
  User, 
  Settings,
  LogOut
} from 'lucide-react';
import { cn } from '../lib/utils';

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Jobs', href: '/jobs', icon: Briefcase },
  { name: 'AI Chat', href: '/chat', icon: MessageSquare },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Profile', href: '/profile', icon: User },
];

const bottomItems = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Logout', href: '/logout', icon: LogOut },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="glass rounded-2xl p-4 h-[calc(100vh-2rem)] flex flex-col animate-slide-right">
      {/* Logo */}
      <div className="flex items-center space-x-3 p-4 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-lg">D</span>
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            DecentWork
          </h1>
          <p className="text-xs text-gray-400">Web3 Job Platform</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center space-x-3 p-3 rounded-xl transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
              )}
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="space-y-2 mt-auto">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center space-x-3 p-3 rounded-xl transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
              )}
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}