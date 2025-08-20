import { Link, useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  Briefcase, 
  MessageCircle, 
  TrendingUp, 
  User 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Job Board', href: '/jobs', icon: Briefcase },
  { name: 'AI Assistant', href: '/chat', icon: MessageCircle },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  { name: 'Profile', href: '/profile', icon: User },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="fixed left-6 top-6 bottom-6 w-64 glass rounded-2xl p-6 z-50 animate-fade-in">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold gradient-text">DecentWork</h1>
        <p className="text-xs text-gray-400 mt-1">Web3 Job Agent Platform</p>
      </div>
      
      {/* Navigation */}
      <nav className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center space-x-3 p-3 rounded-xl transition-all duration-200',
                'hover:bg-white/8 hover:translate-x-1',
                isActive 
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border-l-3 border-blue-500 text-white' 
                  : 'text-gray-300 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      {/* Bottom Section */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full gradient-primary p-0.5">
              <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-100 truncate">Alex Chen</p>
              <p className="text-xs text-gray-400 truncate">Web3 Developer</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
