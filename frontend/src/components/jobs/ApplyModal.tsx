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
    setLoading(true);
    try {
      // Try Plug first
      const plugRes = await connectPlug();
      let actor: any;
      let usedAgent: any = undefined;
      if (plugRes.ok && plugRes.actor) {
        actor = plugRes.actor;
        usedAgent = plugRes.agent;
      } else {
        // No Plug: try to open Internet Identity in a popup (no redirect). If that isn't desired
        // the anon submission below will still work.
        try {
          const origin = typeof window !== 'undefined' ? window.location.origin : '';
          // Request server to return a final II url instead of redirecting the current tab
          const resp = await fetch(`/api/ii?origin=${encodeURIComponent(origin)}&redirect=/ii-callback&no_redirect=true`);
          if (resp.ok) {
            const body = await resp.json();
            const iiUrl = body?.url;
            if (iiUrl) {
              // open popup and let the user complete II flow there
              window.open(iiUrl, '_blank', 'noopener,noreferrer');
              // save pending application locally so when the user returns/callback finishes we can flush
              try { savePendingApplication({ jobId: job.id, cover: cover || '', budget: budget || '' }); } catch (e) {}
              window.alert('Opened Internet Identity in a new window to complete authentication. Your application is saved locally and will be submitted after sign-in.');
              setLoading(false);
              return;
            }
          }
        } catch (e) {
          console.debug('II popup attempt failed, falling back to anonymous submission', e);
        }

        // Fallback: submit anonymously without redirecting to Internet Identity.
        // This will store the application in the canister with applicant == anonymous principal.
        const envHost = typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_DFX_HOST || '') : '';
        const host = envHost && envHost.trim() !== ''
          ? envHost
          : (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
            ? 'http://127.0.0.1:8000'
            : window.location.origin);

        const { HttpAgent } = await import('@dfinity/agent');
        try {
          // validate host
          new URL(host);
        } catch (urlErr) {
          console.error('Invalid host for anonymous HttpAgent:', { host, urlErr });
          window.alert('Invalid replica host URL. Please set NEXT_PUBLIC_DFX_HOST or run the local replica.');
          setLoading(false);
          return;
        }

        let anonAgent;
        try {
          anonAgent = new HttpAgent({ host }); // no identity => anonymous
        } catch (e) {
          console.error('Failed to construct anonymous HttpAgent with host=', host, e);
          window.alert('Could not create network agent for anonymous submission.');
          setLoading(false);
          return;
        }
        try { if (process.env.NODE_ENV !== 'production') await anonAgent.fetchRootKey(); } catch (e) {}
        actor = await createJobActor({ agent: anonAgent });
        // mark usedAgent so identityActor attempts below won't assume an authenticated identity
        usedAgent = anonAgent;
        // Inform user that this will be an anonymous submission
        window.alert('You are not connected with ICP/Plug. Your application will be submitted anonymously to the canister.');
      }

      // Attempt to include profile snapshot if we can read it from the identity canister
      try {
  const identityActor = await createIdentityActor({ agent: usedAgent || (actor as any)?._agent });
        const profile = await identityActor.getMyProfile?.();
        const name = profile?.name || '';
        const email = profile?.email || '';
        const role = profile?.role || '';
        const avatar = profile?.avatar || null;
        if (actor.submitApplicationWithProfile) {
          await actor.submitApplicationWithProfile(job.id, cover || '', String(budget || ''), name, email, role, avatar);
        } else {
          await actor.submitApplication(job.id, cover || '', String(budget || ''));
        }
      } catch (e) {
        // fallback to original submit if anything fails
        await actor.submitApplication(job.id, cover || '', String(budget || ''));
      }
      // navigate to applications
      window.location.href = '/dashboard/applications';
    } catch (err) {
      console.error('submit failed', err);
      // keep modal open and show simple inline error
      window.alert('Failed to submit application: ' + String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
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
  );
}
