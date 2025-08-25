"use client";

import React, { useMemo, useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Application = {
	id: string;
	jobTitle: string;
	company: string;
	appliedDate: string; // ISO date
	status: 'Applied' | 'Interview' | 'Offered' | 'Rejected' | 'Withdrawn';
	notes?: string;
	role?: string;
};

import { createJobActor } from '@/lib/icp';
import { AuthClient } from '@dfinity/auth-client';


export default function ApplicationsPage() {
	const [apps, setApps] = useState<Application[]>([]);
	const [filter, setFilter] = useState<'All'|'Applied'|'Interview'|'Offered'|'Rejected'|'Withdrawn'>('All');
	const [search, setSearch] = useState('');

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const authClient = await AuthClient.create();
				if (!await authClient.isAuthenticated()) return;
				const identity = authClient.getIdentity();
				const host = process.env.NEXT_PUBLIC_DFX_HOST || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://127.0.0.1:8000' : window.location.origin);
				const { HttpAgent } = await import('@dfinity/agent');
				const agent = new HttpAgent({ identity, host });
				try { if (process.env.NODE_ENV !== 'production') await agent.fetchRootKey(); } catch (e) {}
				const actor = await createJobActor({ agent });
				const recs = await actor.getMyApplications();
				// recs expected to be array of ApplicationRecord from canister
				const mapped: Application[] = await Promise.all((recs || []).map(async (r: any) => {
					let applied = '';
					try {
						if (r.applied_at) {
							const n = Number(r.applied_at);
							if (!Number.isNaN(n) && n > 0) {
								const d = new Date(n);
								applied = d.toISOString().slice(0,10);
							}
						}
					} catch (e) {}
					// try to fetch job details for nicer display
					let jobTitle = r.job_title || r.jobTitle || 'Unknown';
					let company = r.company || 'Unknown';
					try {
						const jobRes = await actor.getJob(r.job_id || r.jobId || r.job?.id || '');
						if (jobRes && jobRes[0]) {
							const j = jobRes[0];
							jobTitle = j.title || jobTitle;
							company = j.client ? String(j.client) : (j.client_text || company);
						}
					} catch (e) {
						// ignore
					}
					return {
						id: r.id || String(Math.random()).slice(2),
						jobTitle,
						company,
						appliedDate: applied || (r.applied_at_text || ''),
						status: (r.status && String(r.status)) || 'Applied',
						notes: r.cover_letter || r.notes || '',
						role: r.role || undefined,
					} as Application;
				}));
				if (!mounted) return;
				setApps(mapped);
			} catch (e) {
				console.warn('Failed to fetch applications', e);
			}
		})();
		return () => { mounted = false; };
	}, []);

	const filtered = useMemo(() => {
		return apps.filter(a => {
			if (filter !== 'All' && a.status !== filter) return false;
			const q = search.trim().toLowerCase();
			if (!q) return true;
			return a.jobTitle.toLowerCase().includes(q) || a.company.toLowerCase().includes(q) || (a.notes || '').toLowerCase().includes(q);
		});
	}, [apps, filter, search]);

	function withdraw(id: string) {
		setApps(s => s.map(a => a.id === id ? { ...a, status: 'Withdrawn' } : a));
	}

		function statusClasses(status: Application['status']) {
			switch (status) {
				case 'Interview':
					return 'text-amber-800 bg-amber-100';
				case 'Rejected':
					return 'text-red-700 bg-red-100';
				case 'Offered':
					return 'text-emerald-800 bg-emerald-100';
				case 'Withdrawn':
					return 'text-gray-700 bg-gray-100';
				case 'Applied':
				default:
					return 'text-sky-700 bg-sky-100';
			}
		}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<Sidebar />

			<div className="max-w-8xl ml-0 lg:ml-80 px-4 sm:px-6 lg:px-8">
				<div className="py-6">
					<Card className="p-6 border border-gray-200 bg-white">
						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
							<div>
								<h1 className="text-2xl font-bold">My Applications</h1>
								<p className="text-sm text-gray-500">Track your submitted applications and their status.</p>
							</div>

											<div className="flex items-center gap-3 w-full md:w-auto">
												<input value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setSearch(e.target.value)} placeholder="Search by job or company" className="px-3 py-2 border rounded w-full md:w-64" data-testid="input-search-apps" />
												<select value={filter} onChange={(e: React.ChangeEvent<HTMLSelectElement>)=>setFilter(e.target.value as any)} className="px-3 py-2 border rounded" data-testid="select-filter-apps">
									<option value="All">All</option>
									<option value="Applied">Applied</option>
									<option value="Interview">Interview</option>
									<option value="Offered">Offered</option>
									<option value="Rejected">Rejected</option>
									<option value="Withdrawn">Withdrawn</option>
								</select>
							</div>
						</div>

						<div className="space-y-4">
							{filtered.length === 0 ? (
								<div className="text-center text-gray-600">No applications found.</div>
							) : (
								filtered.map(a => (
									<div key={a.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded" data-testid={`application-${a.id}`}>
										<div className="flex-1">
											<div className="flex items-center gap-3">
												<h3 className="text-lg font-semibold">{a.role || a.jobTitle}</h3>
											</div>
											<div className="text-sm text-gray-500 mt-1">at {a.company}</div>
											<div className="text-sm text-gray-600 mt-1">Applied: {a.appliedDate} • <span className={`font-medium inline-flex items-center gap-2 px-2 py-1 rounded ${statusClasses(a.status)}`} data-testid={`application-status-${a.id}`}>{a.status}</span></div>
											{a.notes && <div className="text-sm text-gray-700 mt-2">{a.notes}</div>}
										</div>

										<div className="mt-3 sm:mt-0 sm:ml-6 flex items-center gap-2">
											{a.status !== 'Withdrawn' && a.status !== 'Offered' && (
												<Button variant="outline" onClick={async () => {
													// attempt to call canister to withdraw or mark withdrawn
													try {
														const authClient = await AuthClient.create();
														if (!await authClient.isAuthenticated()) { window.alert('Please sign in to withdraw'); return; }
														const identity = authClient.getIdentity();
														const host = process.env.NEXT_PUBLIC_DFX_HOST || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://127.0.0.1:8000' : window.location.origin);
														const { HttpAgent } = await import('@dfinity/agent');
														const agent = new HttpAgent({ identity, host });
														try { if (process.env.NODE_ENV !== 'production') await agent.fetchRootKey(); } catch (e) {}
														const actor = await createJobActor({ agent });
														if (actor.withdrawApplication) {
															await actor.withdrawApplication(a.id);
														}
													} catch (e) {
														console.warn('withdraw failed', e);
													}
													// update UI locally
													setApps(s => s.map(x => x.id === a.id ? { ...x, status: 'Withdrawn' } : x));
												}} data-testid={`button-withdraw-${a.id}`}>Withdraw</Button>
											)}
											<Button variant="ghost">View</Button>
										</div>
									</div>
								))
							)}
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}

