"use client";

import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { connectPlug, createJobActor, connectInternetIdentity, savePendingApplication, createIdentityActor } from '@/lib/icp';
import { AuthClient } from '@dfinity/auth-client';

type Props = {
  open: boolean;
  job: any;
  onClose: () => void;
};

export default function ApplyModal({ open, job, onClose }: Props) {
  const [cover, setCover] = useState(`Hi, I'm interested in ${job?.title || ''} at ${job?.company || ''}.`);
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function submit() {
    if (!open) return null;
    setLoading(true);
    try {
      // AuthClient (Internet Identity) - prefer gateway URL when available
      let actor: any = undefined;
      let usedAgent: any = undefined;
      let submitted = false;
      try {
        const authClient = await AuthClient.create();
        if (await authClient.isAuthenticated()) {
          const envHost = process.env.NEXT_PUBLIC_DFX_HOST || '';
          const jobGatewayUrl = process.env.NEXT_PUBLIC_JOB_GATEWAY_URL || '';
          const isMainnet = !envHost || envHost.includes('ic0.app');
          let host = isMainnet ? 'https://ic0.app' : envHost;
          // If a gateway-style URL is provided for jobs, prefer it on local/dev
          if (!isMainnet && jobGatewayUrl) host = jobGatewayUrl;
          const identity = authClient.getIdentity();
          const { HttpAgent } = await import('@dfinity/agent');
          const agent = new HttpAgent({ identity, host });
          try { if (process.env.NODE_ENV !== 'production') await agent.fetchRootKey(); } catch {}
          actor = await createJobActor({ agent });
          usedAgent = agent;
          // Get profile
          let name = '', email = '', role = '', avatar = '';
          try {
            const identityActor = await createIdentityActor({ agent });
            const profile = await identityActor.getMyProfile?.();
            name = profile?.name ? String(profile.name) : '';
            email = profile?.email ? String(profile.email) : '';
            role = profile?.role ? String(profile.role) : '';
            avatar = profile?.avatar !== undefined && profile?.avatar !== null ? String(profile.avatar) : '';
          } catch {}
          const safeJobId = String(job.id || '');
          const safeCover = String(cover || '');
          const safeBudget = String(budget || '');
          if (actor.submitApplicationWithProfile) {
            await actor.submitApplicationWithProfile(safeJobId, safeCover, safeBudget, name, email, role, avatar);
          } else {
            await actor.submitApplication(safeJobId, safeCover, safeBudget);
          }
          window.location.href = '/dashboard/applications';
          submitted = true;
          setLoading(false);
          return;
        }
      } catch {}
      if (submitted) return;

      // 3. Plug
      const plugRes = await connectPlug();
      if (plugRes.ok && plugRes.actor) {
        actor = plugRes.actor;
        usedAgent = plugRes.agent;
      } else {
        // 4. Internet Identity popup
        try {
          const origin = typeof window !== 'undefined' ? window.location.origin : '';
          const resp = await fetch(`/api/ii?origin=${encodeURIComponent(origin)}&redirect=/ii-callback&no_redirect=true&use_public=1`);
          if (resp.ok) {
            const body = await resp.json();
            const iiUrl = body?.url;
            if (iiUrl) {
              try {
                const features = 'noopener,noreferrer,width=600,height=800';
                const win = window.open(iiUrl, 'ii_popup', features);
                if (!win) {
                  const a = document.createElement('a');
                  a.href = iiUrl;
                  a.target = '_blank';
                  a.rel = 'noopener noreferrer';
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                } else {
                  try { win.focus(); } catch {}
                }
                try { savePendingApplication({ jobId: job.id, cover: cover || '', budget: budget || '' }); } catch {}
                window.alert('Opened Internet Identity in a new window to complete authentication. Your application is saved locally and will be submitted after sign-in.');
                setLoading(false);
                return;
              } catch {}
            }
          }
        } catch {}
        // 5. Anonymous fallback
        const envHost = typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_DFX_HOST || '') : '';
        const host = envHost && envHost.trim() !== ''
          ? envHost
          : (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
            ? 'http://127.0.0.1:8000'
            : window.location.origin);
        const { HttpAgent } = await import('@dfinity/agent');
        let anonAgent;
        try {
          new URL(host);
          anonAgent = new HttpAgent({ host });
        } catch {
          window.alert('Invalid replica host URL. Please set NEXT_PUBLIC_DFX_HOST or run the local replica.');
          setLoading(false);
          return;
        }
        try { if (process.env.NODE_ENV !== 'production') await anonAgent.fetchRootKey(); } catch {}
        actor = await createJobActor({ agent: anonAgent });
        usedAgent = anonAgent;
        window.alert('You are not connected with ICP/Plug. Your application will be submitted anonymously to the canister.');
      }
      // 6. Profile snapshot if possible
      let name = '', email = '', role = '', avatar = '';
      try {
        const identityActor = await createIdentityActor({ agent: usedAgent || (actor as any)?._agent });
        const profile = await identityActor.getMyProfile?.();
        name = profile?.name ? String(profile.name) : '';
        email = profile?.email ? String(profile.email) : '';
        role = profile?.role ? String(profile.role) : '';
        avatar = profile?.avatar !== undefined && profile?.avatar !== null ? String(profile.avatar) : '';
      } catch {}
      const safeJobId = String(job.id || '');
      const safeCover = String(cover || '');
      const safeBudget = String(budget || '');
      if (actor && actor.submitApplicationWithProfile) {
        await actor.submitApplicationWithProfile(safeJobId, safeCover, safeBudget, name, email, role, avatar);
      } else if (actor) {
        await actor.submitApplication(safeJobId, safeCover, safeBudget);
      }
      window.location.href = '/dashboard/applications';
    } catch (err) {
      console.error('submit failed', err);
      window.alert('Failed to submit application: ' + String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <React.Fragment>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <div className="relative w-full max-w-xl mx-4 bg-white rounded-lg shadow-lg border border-gray-200 p-6 z-60">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Apply to {job?.title}</h3>
            <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100">
              <X size={18} />
            </button>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium">Cover letter</label>
            <textarea value={cover} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCover(e.target.value)} rows={6} className="w-full p-3 border rounded resize-none" />
            <div>
              <label className="text-sm font-medium">Proposed budget</label>
              <input value={budget} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBudget(e.target.value)} placeholder="e.g. 1500" className="w-40 mt-2 p-2 border rounded" />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button onClick={submit} disabled={loading}>
              <span className="inline-flex items-center gap-2"><Send size={16} /> {loading ? 'Submitting...' : 'Submit Application'}</span>
            </Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
