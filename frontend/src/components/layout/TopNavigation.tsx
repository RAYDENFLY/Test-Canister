"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// ...existing code...
import { Button } from '@/components/ui/button';
import { connectPlug, connectInternetIdentity, getMyProfile, updateProfile, createIdentityActor, setPasswordOnCanister } from '@/lib/icp';
import { hashPassword } from '@/lib/crypto';

export default function TopNavigation() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    bio: '',
    skills: '',
    portfolioUrl: '',
    location: '',
    experienceLevel: '',
  role: '',
  password: '',
  confirmPassword: ''
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [navName, setNavName] = useState('User');
  const [navUsername, setNavUsername] = useState('user');
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showCreateConfirm, setShowCreateConfirm] = useState(false);

  // createForm initialized with password fields above
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [k: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Keep component local state minimal; auth handled via helpers in /src/lib/icp

  // --- validation helpers ---
  const NAME_MAX = 100;
  const BIO_MAX = 300;

  function normalizeEmail(raw: string) {
    if (!raw) return raw;
    const s = raw.trim().toLowerCase();
    // remove +tag in local part: user+tag@example.com -> user@example.com
    const parts = s.split('@');
    if (parts.length !== 2) return s;
    const local = parts[0].split('+')[0];
    return `${local}@${parts[1]}`;
  }

  function validateField(name: string, value: string) {
    if (name === 'name') {
      if (!value || value.trim().length < 2) return 'Name is required (min 2 chars)';
      if (value.length > NAME_MAX) return `Name must be ≤ ${NAME_MAX} characters`;
      return '';
    }
    if (name === 'email') {
      const norm = normalizeEmail(value);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!norm || !emailRegex.test(norm)) return 'Valid email is required';
      return '';
    }
    if (name === 'bio') {
      if (value.length > BIO_MAX) return `Bio must be ≤ ${BIO_MAX} characters`;
      return '';
    }
    if (name === 'password') {
      if (!value || value.length < 8) return 'Password must be at least 8 characters';
      return '';
    }
    if (name === 'confirmPassword') {
      const pw = (createForm as any).password || '';
      if (value !== pw) return 'Passwords do not match';
      return '';
    }
    return '';
  }

  useEffect(() => {
    // validate whole form to enable/disable submit button
    const errors: { [k: string]: string } = {};
    ['name', 'email', 'bio'].forEach((k) => {
      const v = (createForm as any)[k] || '';
      const e = validateField(k, v);
      if (e) errors[k] = e;
    });
  // password validations
  const pw = (createForm as any).password || '';
  const cpw = (createForm as any).confirmPassword || '';
  const pwErr = validateField('password', pw);
  const cpwErr = validateField('confirmPassword', cpw);
  if (pwErr) errors.password = pwErr;
  if (cpwErr) errors.confirmPassword = cpwErr;
    setFormErrors((prev) => ({ ...prev, ...errors }));
    setIsFormValid(Object.keys(errors).length === 0);
  }, [createForm]);

  // restore authentication state from localStorage
  useEffect(() => {
    try {
      const v = localStorage.getItem('cv:isAuthenticated');
      if (v === '1') setIsAuthenticated(true);
    } catch (e) {}
    try {
      const raw = localStorage.getItem('cv:profile') || localStorage.getItem('cv:pendingProfile');
      if (raw) {
        const p = JSON.parse(raw);
        if (p) {
          setNavName(p.name || 'User');
          setNavUsername(p.username || (p.email ? String(p.email).split('@')[0] : 'user'));
        }
      }
    } catch (e) {}
  }, []);

  // persist auth state
  useEffect(() => {
    try {
      if (isAuthenticated) localStorage.setItem('cv:isAuthenticated', '1');
      else localStorage.removeItem('cv:isAuthenticated');
    } catch (e) {}
  }, [isAuthenticated]);

  function handleChange(field: string, raw: string) {
    const value = field === 'email' ? normalizeEmail(raw) : raw;
    setCreateForm((s) => ({ ...s, [field]: value }));
    setTouched((t) => ({ ...t, [field]: true }));
    // per-field immediate validation
    const err = validateField(field, value);
    setFormErrors((prev) => ({ ...prev, [field]: err }));
  }

  return (
  <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-60" data-testid="top-navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <img
                src="/careerverse-logo.png"
                alt="CareerVerse"
                className="w-8 h-8"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                  ((e.currentTarget.nextElementSibling) as HTMLElement).style.display = 'flex';
                }}
              />
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center" style={{display: 'none'}}>
                <span className="text-white font-bold text-sm">CV</span>
              </div>
              <span className="text-xl font-bold text-gray-900">CareerVerse</span>
            </Link>
          </div>

          {/* Navigation Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/jobs" className="text-gray-700 hover:text-blue-600 font-medium transition-colors" data-testid="nav-jobs">
              Job Board
            </Link>
            <Link href="/analytics" className="text-gray-700 hover:text-blue-600 font-medium transition-colors" data-testid="nav-analytics">
              Analytics
            </Link>
            <Link href="/docs" className="text-gray-700 hover:text-blue-600 font-medium transition-colors" data-testid="nav-docs">
              Docs
            </Link>
          </div>

          {/* Login/Profile */}
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      {/* If authenticated, show Dashboard link instead of Login */}
                      {isAuthenticated ? (
                        <Link href="/dashboard" data-testid="button-dashboard" className="inline-flex items-center space-x-2 px-3 py-1 border rounded hover:bg-gray-50">
                          <span className="inline-flex w-6 h-6 rounded-full bg-gray-200 items-center justify-center text-sm text-gray-700">{(() => { const parts = (navName || 'U').split(' ').filter(Boolean); if (parts.length <= 1) return (parts[0]||'U').slice(0,1).toUpperCase(); return (parts[0].slice(0,1)+parts[1].slice(0,1)).toUpperCase(); })()}</span>
                          <span>{navUsername}</span>
                        </Link>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => {
                            // Open the login modal only; II flow is started from the modal's II button.
                            console.debug('[Login] open modal');
                            setIsLoginOpen(!isLoginOpen);
                          }}
                          className="flex items-center space-x-2"
                          data-testid="button-login"
                          data-tid="login-button"
                        >
                          {/* simplified avatar to avoid typing conflicts with Radix Avatar props */}
                          <span className="inline-flex w-6 h-6 rounded-full bg-gray-200 items-center justify-center text-sm text-gray-700">{(() => { const parts = (navName || 'U').split(' ').filter(Boolean); if (parts.length <= 1) return (parts[0]||'U').slice(0,1).toUpperCase(); return (parts[0].slice(0,1)+parts[1].slice(0,1)).toUpperCase(); })()}</span>
                          <span>Login</span>
                        </Button>
                      )}
              
              {/* Login Dropdown */}
                {isLoginOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-70 pointer-events-auto" data-testid="login-dropdown">
                  <h3 className="text-lg font-semibold mb-4">Sign In</h3>
                  <div className="space-y-3">
                    <input 
                      type="email" 
                      placeholder="Email" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      data-testid="input-email"
                    />
                    <input 
                      type="password" 
                      placeholder="Password" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      data-testid="input-password"
                    />
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" data-testid="button-signin" onClick={async ()=>{
                          console.debug('[SignIn] clicked');
                          // Try Plug first; if not available, redirect to Internet Identity via /api/ii
                          console.debug('[SignIn] clicked');
                          try {
                            const r = await connectPlug();
                            console.debug('[SignIn] after connectPlug', r);
                            if (r.ok && (r as any).actor) {
                              const a = (r as any).actor;
                              const profile = await getMyProfile(a);
                              setIsAuthenticated(true);
                              if (profile && profile.length > 0) {
                                window.location.href = '/dashboard';
                              } else {
                                const name = (document.querySelector('[data-testid="input-email"]') as HTMLInputElement)?.value || '';
                                await updateProfile({ name: name || 'Unnamed', email: name || '', bio: '', skills: [], portfolioUrl: '', location: '', experienceLevel: '' }, a);
                                window.location.href = '/dashboard';
                              }
                              return;
                            }
                          } catch (err) {
                            console.debug('connectPlug error', err);
                          }

                          // fallback: redirect to Internet Identity authorize via server route
                          // include the app canister id so II shows the correct app URL
                          // Let the server-side route pick the app canister from NEXT_PUBLIC_APP_CANISTER_ID
                          try {
                            const origin = typeof window !== 'undefined' ? window.location.origin : '';
                            const resp = await fetch(`/api/ii?origin=${encodeURIComponent(origin)}&no_redirect=true`);
                            if (resp.ok) {
                              const body = await resp.json();
                              const url = body?.url || `/api/ii?origin=${encodeURIComponent(origin)}`;
                              // open II authorize in a popup so the current tab isn't redirected
                              window.open(url, '_blank', 'noopener,noreferrer');
                            } else {
                              // fallback: open the server route in a new tab instead of navigating current tab
                              const origin = typeof window !== 'undefined' ? window.location.origin : '';
                              const target = `/api/ii?origin=${encodeURIComponent(origin)}`;
                              window.open(target, '_blank', 'noopener,noreferrer');
                            }
                          } catch (e) {
                            // If anything goes wrong, open the server route in a new tab as a last resort
                            const origin = typeof window !== 'undefined' ? window.location.origin : '';
                            const target = `/api/ii?origin=${encodeURIComponent(origin)}`;
                            window.open(target, '_blank', 'noopener,noreferrer');
                          }
                        }}>
                          Sign In
                        </Button>
                    <Button variant="outline" className="w-full" data-testid="button-signup" onClick={() => {
                      console.debug('[Signup] open create modal');
                      setIsCreateOpen(true);
                    }}>
                      Create Account
                    </Button>
                    <Button className="w-full mt-2" variant="outline" data-testid="button-ii-login" onClick={() => {
                      console.debug('[II Login] clicked');
                      (async () => {
                        try {
                          // Try to use AuthClient to start the Internet Identity flow directly.
                          const { AuthClient } = await import('@dfinity/auth-client');
                          const authClient = await AuthClient.create();

                          // Prefer a configured local II canister if provided via env; otherwise use the public identity provider.
                          const envIi = (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_II_CANISTER_ID) ? String(process.env.NEXT_PUBLIC_II_CANISTER_ID).trim() : '';
                          let identityProviderUrl: string;
                          if (envIi) {
                            // Local Internet Identity is typically served on port 4943 by the replica frontend
                            identityProviderUrl = `http://127.0.0.1:8000/?canisterId=${encodeURIComponent(envIi)}`;
                          } else {
                            // Use the hosted Internet Identity service
                            identityProviderUrl = 'https://identity.ic0.app/#authorize';
                          }

                          // Use ii-callback as the post-login redirect path so the app can finalize pending writes
                          const origin = typeof window !== 'undefined' ? window.location.origin : '';
                          const redirectPath = '/ii-callback';

                          // Start the login flow. This will redirect the current tab to II (official flow).
                          await authClient.login({
                            // Use public Internet Identity provider as requested
                            identityProvider: 'https://identity.ic0.app',
                            onSuccess: async () => {
                              try {
                                // Log principal for debugging per user's snippet
                                try {
                                  const identity = authClient.getIdentity();
                                  console.log('Principal:', identity.getPrincipal().toText());
                                } catch (e) {
                                  console.debug('failed to read identity after login', e);
                                }

                                // Mark local session and navigate to callback which will finalize pending writes
                                try { localStorage.setItem('cv:isAuthenticated', '1'); } catch (e) {}
                                window.location.href = redirectPath;
                              } catch (e) {
                                // If setting storage/navigation fails, fallback to reloading
                                window.location.reload();
                              }
                            },
                            // onError isn't provided by library; handle thrown exceptions below
                          });

                          // If login returns without redirect (rare), ensure we land on the callback
                          setTimeout(() => { if (typeof window !== 'undefined' && window.location.pathname !== redirectPath) { window.location.href = redirectPath; } }, 2000);
                          return;
                        } catch (err) {
                          console.debug('AuthClient.login failed or not available, falling back to popup II route', err);
                        }

                        // Fallback: ask server to return an authorize URL and open in a popup (no_redirect)
                        try {
                          const origin = typeof window !== 'undefined' ? window.location.origin : '';
                          const redirectPath = '/ii-callback';
                          const resp = await fetch(`/api/ii?origin=${encodeURIComponent(origin)}&redirect=${encodeURIComponent(redirectPath)}&no_redirect=true`);
                          if (resp.ok) {
                            const body = await resp.json();
                            const url = body?.url || `/api/ii?origin=${encodeURIComponent(origin)}&redirect=${encodeURIComponent(redirectPath)}`;
                            window.open(url, '_blank', 'noopener,noreferrer');
                          } else {
                            const origin = typeof window !== 'undefined' ? window.location.origin : '';
                            const target = `/api/ii?origin=${encodeURIComponent(origin)}&redirect=${encodeURIComponent(redirectPath)}`;
                            window.open(target, '_blank', 'noopener,noreferrer');
                          }
                        } catch (err) {
                          const origin = typeof window !== 'undefined' ? window.location.origin : '';
                          const redirectPath = '/ii-callback';
                          const target = `/api/ii?origin=${encodeURIComponent(origin)}&redirect=${encodeURIComponent(redirectPath)}`;
                          window.open(target, '_blank', 'noopener,noreferrer');
                        }
                      })();
                    }}>
                      Login dengan Internet Identity
                    </Button>
                  </div>
                </div>
              )}
              {/* Create Account Modal */}
              {isCreateOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-70 pointer-events-auto" data-testid="create-account-modal">
                  <h3 className="text-lg font-semibold mb-3">Create Account</h3>
                  <div className="space-y-2">
                    <div>
                      <input
                        disabled={isSubmitting}
                        value={createForm.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleChange('name', e.target.value)}
                        onBlur={()=>setTouched(t=>({...t, name: true}))}
                        placeholder="Full name"
                        className="w-full px-3 py-2 border rounded"
                        data-testid="create-name"
                        aria-invalid={!!formErrors.name}
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <div className="text-red-600">{touched.name && formErrors.name ? formErrors.name : ' '}</div>
                        <div>{(createForm.name || '').length}/{NAME_MAX}</div>
                      </div>
                    </div>

                    <div>
                      <input
                        disabled={isSubmitting}
                        value={createForm.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleChange('email', e.target.value)}
                        onBlur={()=>setTouched(t=>({...t, email: true}))}
                        placeholder="Email"
                        className="w-full px-3 py-2 border rounded"
                        data-testid="create-email"
                        aria-invalid={!!formErrors.email}
                      />
                      <div className="text-sm text-red-600">{touched.email && formErrors.email ? formErrors.email : ' '}</div>
                    </div>

                    <input disabled={isSubmitting} value={createForm.skills} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleChange('skills', e.target.value)} placeholder="Skills (comma separated)" className="w-full px-3 py-2 border rounded" data-testid="create-skills" />
                    <input disabled={isSubmitting} value={(createForm as any).role} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleChange('role', e.target.value)} placeholder="Role (e.g. Frontend Engineer / UI UX)" className="w-full px-3 py-2 border rounded" data-testid="create-role" />
                    <input disabled={isSubmitting} value={createForm.portfolioUrl} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleChange('portfolioUrl', e.target.value)} placeholder="Portfolio URL" className="w-full px-3 py-2 border rounded" data-testid="create-portfolio" />
                    <input disabled={isSubmitting} value={createForm.location} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleChange('location', e.target.value)} placeholder="Location" className="w-full px-3 py-2 border rounded" data-testid="create-location" />
                    <input disabled={isSubmitting} value={createForm.experienceLevel} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleChange('experienceLevel', e.target.value)} placeholder="Experience level" className="w-full px-3 py-2 border rounded" data-testid="create-experience" />

                    <div className="relative">
                      <input
                        type={showCreatePassword ? 'text' : 'password'}
                        disabled={isSubmitting}
                        value={(createForm as any).password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleChange('password', e.target.value)}
                        placeholder="Password"
                        className="w-full px-3 py-2 border rounded"
                        data-testid="create-password"
                      />
                      <button type="button" onClick={() => setShowCreatePassword(s => !s)} className="absolute right-2 top-2 text-sm text-gray-500" data-testid="toggle-create-password">{showCreatePassword ? 'Hide' : 'Show'}</button>
                      <div className="text-sm text-red-600">{touched.password && formErrors.password ? formErrors.password : ' '}</div>
                    </div>

                    <div className="relative">
                      <input
                        type={showCreateConfirm ? 'text' : 'password'}
                        disabled={isSubmitting}
                        value={(createForm as any).confirmPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>)=>handleChange('confirmPassword', e.target.value)}
                        placeholder="Confirm password"
                        className="w-full px-3 py-2 border rounded"
                        data-testid="create-confirm-password"
                      />
                      <button type="button" onClick={() => setShowCreateConfirm(s => !s)} className="absolute right-2 top-2 text-sm text-gray-500" data-testid="toggle-create-confirm">{showCreateConfirm ? 'Hide' : 'Show'}</button>
                      <div className="text-sm text-red-600">{touched.confirmPassword && formErrors.confirmPassword ? formErrors.confirmPassword : ' '}</div>
                    </div>

                    <div>
                      <textarea
                        disabled={isSubmitting}
                        value={createForm.bio}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)=>handleChange('bio', e.target.value)}
                        onBlur={()=>setTouched(t=>({...t, bio: true}))}
                        placeholder="Short bio"
                        className="w-full px-3 py-2 border rounded"
                        data-testid="create-bio"
                        rows={4}
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <div className="text-red-600">{touched.bio && formErrors.bio ? formErrors.bio : ' '}</div>
                        <div>{(createForm.bio || '').length}/{BIO_MAX}</div>
                      </div>
                    </div>

                    {errorMessage && <div className="text-sm text-red-600">{errorMessage}</div>}
                    {successMessage && <div className="text-sm text-green-600">{successMessage}</div>}
                    <div className="flex space-x-2">
                      <Button className="flex-1" data-testid="create-submit" onClick={async ()=>{
                        // client-side validation already runs on-change; ensure final check
                        setFormErrors({});
                        setErrorMessage(null);
                        setSuccessMessage(null);

                        const errors: { [k: string]: string } = {};
                        const nameErr = validateField('name', createForm.name);
                        const emailErr = validateField('email', createForm.email);
                        const pwErr = validateField('password', (createForm as any).password || '');
                        const cpwErr = validateField('confirmPassword', (createForm as any).confirmPassword || '');
                        if (nameErr) errors.name = nameErr;
                        if (emailErr) errors.email = emailErr;
                        if (pwErr) errors.password = pwErr;
                        if (cpwErr) errors.confirmPassword = cpwErr;
                        if (Object.keys(errors).length > 0) {
                          setFormErrors(errors);
                          setTouched({ name: true, email: true, password: true, confirmPassword: true });
                          return;
                        }

                        setIsSubmitting(true);
                        try {
                          const skills = createForm.skills ? createForm.skills.split(',').map(s=>s.trim()).filter(Boolean) : [];
                          // hash password client-side
                          const pw = (createForm as any).password || '';
                          const hashed = await hashPassword(pw);
                          const hashedText = typeof hashed === 'string' ? hashed : (hashed.encoded || hashed.hash || JSON.stringify(hashed));

                          // Try to use Plug to get an authenticated actor and persist profile+password
                          try {
                            const r = await connectPlug();
                            if (r.ok && (r as any).actor) {
                              const a = (r as any).actor;
                              await updateProfile({ name: createForm.name || 'Unnamed', email: createForm.email || '', bio: createForm.bio || '', skills, portfolioUrl: createForm.portfolioUrl || '', location: createForm.location || '', experienceLevel: createForm.experienceLevel || '', role: (createForm as any).role || '' }, a);
                              await setPasswordOnCanister(hashedText, a);
                              setSuccessMessage('Account created and password saved (canister). Redirecting...');
                              setIsAuthenticated(true);
                              setTimeout(()=>{ window.location.href = '/dashboard'; }, 800);
                              return;
                            }
                          } catch (err) {
                            console.debug('plug or canister update failed', err);
                          }

                          // Fallback when Plug isn't available:
                          // - persist the pending profile and hashed password locally so the II callback
                          //   (or a later session) can finalize saving to the canister
                          // - mark the user as locally authenticated and redirect to dashboard so UX
                          //   continues without forcing an immediate II popup.
                          try {
                            const pendingProfile = {
                              name: createForm.name || 'Unnamed',
                              email: createForm.email || '',
                              bio: createForm.bio || '',
                              skills,
                              portfolioUrl: createForm.portfolioUrl || '',
                              location: createForm.location || '',
                              experienceLevel: createForm.experienceLevel || '',
                              role: (createForm as any).role || ''
                            } as any;
                            localStorage.setItem('cv:pendingProfile', JSON.stringify(pendingProfile));
                            localStorage.setItem('cv:pendingPasswordHash', hashedText);
                          } catch (e) {
                            console.debug('failed to persist pending profile locally', e);
                          }

                          setSuccessMessage('Account created locally — complete Internet Identity later to finalize canister write. Redirecting to dashboard...');
                          setIsAuthenticated(true);
                          setTimeout(()=>{ window.location.href = '/dashboard'; }, 600);
                        } catch (err:any) {
                          console.debug('create account error', err);
                          setErrorMessage(typeof err === 'string' ? err : (err?.message || 'Failed to create account'));
                        } finally {
                          setIsSubmitting(false);
                        }
                      }} disabled={isSubmitting || !isFormValid} aria-busy={isSubmitting}>
                        {isSubmitting ? 'Creating...' : 'Create'}
                      </Button>
                      <Button variant="ghost" className="flex-1" data-testid="create-cancel" onClick={()=>{ setIsCreateOpen(false); }}>Cancel</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
