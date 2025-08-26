import React, { useState, useEffect } from 'react';
import ProfileSettings from './ProfileSettings';
import Link from 'next/link';
import { Home, Briefcase, User, Settings, LogOut } from 'lucide-react';

export default function Sidebar() {
  const [editing, setEditing] = useState(false);
  const [userName, setUserName] = useState('User Name');
  const [userEmail, setUserEmail] = useState('@username');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cv:profile') || localStorage.getItem('cv:pendingProfile');
      if (raw) {
        const p = JSON.parse(raw);
        if (p) {
          setUserName(p.name || 'User Name');
          setUserEmail(p.email || '@username');
          setUserRole(p.role || '');
        }
      }
    } catch (e) {
      // ignore
    }
    // also listen for storage events so other windows/tabs or the II callback
    // can update the sidebar immediately when pending items are flushed
    function onStorage(e: StorageEvent) {
      if (e.key && (e.key.startsWith('cv:') || e.key === 'cv:isAuthenticated')) {
        try {
          const raw = localStorage.getItem('cv:profile') || localStorage.getItem('cv:pendingProfile');
          if (raw) {
            const p = JSON.parse(raw);
            setUserName(p.name || 'User Name');
            setUserEmail(p.email || '@username');
            setUserRole(p.role || '');
          } else {
            // cleared
            setUserName('User Name');
            setUserEmail('@username');
            setUserRole('');
          }
        } catch (err) { /* ignore */ }
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
  <aside className="w-72 bg-white border-r border-gray-200 min-h-screen p-6 lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:z-40" data-testid="dashboard-sidebar">
      <div className="flex flex-col items-start space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold">
            {(() => {
              const parts = (userName || 'U').split(' ').filter(Boolean);
              const initials = parts.length === 0 ? 'U' : (parts.length === 1 ? parts[0].slice(0,1) : (parts[0].slice(0,1) + parts[1].slice(0,1)));
              return initials.toUpperCase();
            })()}
          </div>
          <div>
            <p className="font-semibold">{userName}</p>
            <p className="text-xs text-gray-500">{userEmail}</p>
            {userRole ? <div className="text-xs text-gray-600">{userRole}</div> : null}
          </div>
        </div>

        <div className="w-full">
          <nav className="mt-4 space-y-1">
            <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50" data-testid="nav-dashboard">
              <Home className="w-4 h-4 text-gray-600" />
              <span>Dashboard</span>
            </Link>
            <Link href="/dashboard/jobboard" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50" data-testid="nav-jobboard">
              <Briefcase className="w-4 h-4 text-gray-600" />
              <span>Job Board</span>
            </Link>
            <Link href="/dashboard/profile" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50" data-testid="nav-profile">
              <User className="w-4 h-4 text-gray-600" />
              <span>Profile</span>
            </Link>
            <Link href="/dashboard/applications" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50" data-testid="nav-applications">
              <Briefcase className="w-4 h-4 text-gray-600" />
              <span>My Applications</span>
            </Link>
            <Link href="/dashboard/settings" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50" data-testid="nav-settings">
              <Settings className="w-4 h-4 text-gray-600" />
              <span>Settings</span>
            </Link>
            <a href="#" onClick={async (e: React.MouseEvent<HTMLAnchorElement>)=>{
              e.preventDefault();
              try {
                // attempt to disconnect Plug if present
                // @ts-ignore
                const plug = (window as any).ic?.plug;
                if (plug && typeof plug.disconnect === 'function') {
                  try { await plug.disconnect(); } catch (err) { console.debug('plug disconnect failed', err); }
                }
              } catch (err) {}
              try {
                localStorage.removeItem('cv:isAuthenticated');
                localStorage.removeItem('cv:profile');
                localStorage.removeItem('cv:pendingProfile');
                localStorage.removeItem('cv:pendingPasswordHash');
              } catch (err) {}
              // redirect to home
              if (typeof window !== 'undefined') window.location.href = '/';
            }} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50 text-red-600" data-testid="nav-logout">
              <LogOut className="w-4 h-4 text-red-600" />
              <span>Logout</span>
            </a>
          </nav>
        </div>

        <div className="mt-auto w-full">
          <div className="text-xs text-gray-500">Account</div>
          <div className="text-sm">Free tier</div>
        </div>
      </div>

      {editing && (
        <div className="mt-6" data-testid="profile-settings-panel">
          <ProfileSettings />
        </div>
      )}
    </aside>
  );
}
