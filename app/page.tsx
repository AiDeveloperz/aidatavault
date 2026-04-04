'use client';

import { useState, useCallback } from 'react';
import SearchBar from '@/components/SearchBar';
import LoadingState from '@/components/LoadingState';
import PaymentPanel from '@/components/PaymentPanel';
import ResultsTable from '@/components/ResultsTable';
import Header from '@/components/Header';
import Disclaimer from '@/components/Disclaimer';

// ── State machine types ──────────────────────────────────────────────────────
export type AppState =
	| 'IDLE'
	| 'LOADING'
	| 'PRE_PAYMENT'
	| 'VALIDATION'
	| 'RESULTS';

export interface SearchResult {
	searchId: string;
	resultCount: number;
	leakCount: number;
	source: string;
	token: string;
}

export interface ResultData {
	summary: Record<string, any>;
	records: Array<{ field: string; value: string; source: string }>;
	source: string;
	description: string;
	csv: string;
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function Home() {
	const [appState, setAppState] = useState<AppState>('IDLE');
	const [query, setQuery] = useState('');
	const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
	const [resultData, setResultData] = useState<ResultData | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleSearch = useCallback(async (q: string) => {
		setQuery(q);
		setError(null);
		setAppState('LOADING');

		try {
			const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
			const res = await fetch(`${API_BASE}/api/search`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ query: q }),
			});

			const data = await res.json();
			if (!res.ok || data.resultCount === 0) {
				setError(
					'Site may be under maintenance, try after sometime or contact devloper.',
				);
				setAppState('IDLE');
				return;
			}

			setSearchResult({
				searchId: data.searchId,
				resultCount: data.resultCount,
				leakCount: data.leakCount,
				source: data.source,
				token: data.token,
			});
			setAppState('PRE_PAYMENT');
		} catch (err) {
			setError(
				'Site may be under maintenance, try after sometime or contact devloper.',
			);
			setAppState('IDLE');
		}
	}, []);

	const handlePaymentComplete = useCallback(async () => {
		if (!searchResult) return;
		setError(null);

		try {
			const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
			const res = await fetch(
				`${API_BASE}/api/results/${searchResult.searchId}`,
				{
					headers: { Authorization: `Bearer ${searchResult.token}` },
				},
			);

			const data = await res.json();
			if (!res.ok || !data.records || data.records.length === 0) {
				setError(
					'Site may be under maintenance, try after sometime or contact devloper.',
				);
				return;
			}

			setResultData(data);
			setAppState('RESULTS');
		} catch (err) {
			setError(
				'Site may be under maintenance, try after sometime or contact devloper.',
			);
		}
	}, [searchResult]);

	const handleReset = useCallback(() => {
		setAppState('IDLE');
		setQuery('');
		setSearchResult(null);
		setResultData(null);
		setError(null);
	}, []);

	return (
		<div className="w-full flex flex-col items-center justify-start px-4 pb-20 mt-16 md:mt-24">
			{/* Hero + Search — always visible in IDLE */}
			{appState === 'IDLE' && (
				<div className="w-full max-w-2xl fade-in-up">
					{/* Hero text */}
					<div className="text-center mb-12">
						<div className="inline-flex items-center justify-center gap-2 mb-6 p-1 pr-4 rounded-full border border-white/5 bg-white/2">
							<span className="badge badge-violet ml-1">v2.0 Beta</span>
							<span className="text-xs text-(--text-secondary) font-medium tracking-wide">
								Advanced OSINT Intelligence
							</span>
						</div>
						<h1 className="text-5xl flex flex-col items-center gap-2 md:text-6xl font-black text-glow mb-6 tracking-tight">
							<span>Data Valut</span>
							<span className="text-violet-500 ml-8">Intelligence</span>
						</h1>
						<p className=" md:text-xl text-(--text-secondary) max-w-x2l mx-auto leading-none flex flex-col gap-2">
							<span className="text-[14px] font-medium">
								Search accross breach intelligence databased for security
								research
							</span>
							<span className="text-[14px] font-medium">
								Enter the phone number (with country code) or Email address
							</span>
						</p>
					</div>

					{/* Search Bar Wrapper */}
					<div className="relative z-10 mx-auto w-full max-w-xl">
						<div className="absolute -inset-1 bg-linear-to-r from-violet-600/30 to-indigo-600/30 rounded-2xl blur-xl opacity-50"></div>
						<div className="relative">
							<SearchBar onSearch={handleSearch} loading={false} />
						</div>
					</div>

					{error && (
						<div className="mt-6 p-4 rounded-xl text-sm border bg-(--danger-glow) border-red-500/30 text-(--danger) flex items-center justify-center gap-2">
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<circle cx="12" cy="12" r="10" />
								<line x1="12" y1="8" x2="12" y2="12" />
								<line x1="12" y1="16" x2="12.01" y2="16" />
							</svg>
							{error}
						</div>
					)}

					<div className="mt-10 max-w-xl mx-auto text-center">
						<Disclaimer />
					</div>

					{/* Contact */}
					<div className="mt-16 sm:mt-24 max-w-sm mx-auto text-center p-6 rounded-2xl border border-white/5 bg-white/1">
						<p className="text-xs font-semibold uppercase tracking-widest mb-2 text-(--text-muted)">
							Developer Contact
						</p>
						<p className="text-sm font-medium mb-4 text-(--text-primary)">
							Support, Connect & Collaborate
						</p>
						<a
							href="mailto:abdulazizindia@proton.me"
							className="inline-flex items-center justify-center gap-2 text-sm px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-(--accent-light)"
						>
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<rect x="2" y="4" width="20" height="16" rx="2" />
								<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
							</svg>
							abdulazizindia@proton.me
						</a>
					</div>
				</div>
			)}

			{/* LOADING state */}
			{appState === 'LOADING' && (
				<div className="w-full max-w-2xl mt-12 fade-in-up">
					<LoadingState query={query} />
				</div>
			)}

			{/* PRE_PAYMENT state */}
			{appState === 'PRE_PAYMENT' && searchResult && (
				<div className="w-full max-w-2xl mt-8 fade-in-up md:mt-12">
					<PaymentPanel
						searchResult={searchResult}
						onPaymentComplete={handlePaymentComplete}
						onBack={handleReset}
					/>
					{error && (
						<div className="mt-6 p-4 rounded-xl text-sm border bg-(--danger-glow) border-red-500/30 text-(--danger)">
							⚠ {error}
						</div>
					)}
				</div>
			)}

			{/* RESULTS state */}
			{appState === 'RESULTS' && resultData && searchResult && (
				<div className="w-full max-w-5xl mt-8 fade-in-up">
					<ResultsTable
						data={resultData}
						query={query}
						searchResult={searchResult}
						onNewSearch={handleReset}
					/>
				</div>
			)}
		</div>
	);
}
