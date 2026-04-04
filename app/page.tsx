'use client';

import { useState, useCallback } from 'react';
import SearchBar from '@/components/SearchBar';
import LoadingState from '@/components/LoadingState';
import PaymentPanel from '@/components/PaymentPanel';
import ResultsTable from '@/components/ResultsTable';
import Header from '@/components/Header';
import Disclaimer from '@/components/Disclaimer';

// ── State machine types ──────────────────────────────────────────────────────
export type AppState = 'IDLE' | 'LOADING' | 'PRE_PAYMENT' | 'VALIDATION' | 'RESULTS';

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Search failed. Please try again.');
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
      setError('Network error. Please check your connection.');
      setAppState('IDLE');
    }
  }, []);

  const handlePaymentComplete = useCallback(async () => {
    if (!searchResult) return;
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/results/${searchResult.searchId}`, {
        headers: { Authorization: `Bearer ${searchResult.token}` },
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to fetch results.');
        return;
      }

      setResultData(data);
      setAppState('RESULTS');
    } catch (err) {
      setError('Failed to retrieve results. Please try again.');
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
    <div className="min-h-screen flex flex-col">
      <Header onReset={appState !== 'IDLE' ? handleReset : undefined} />

      <main className="flex-1 flex flex-col items-center justify-start px-4 pb-16">

        {/* Hero + Search — always visible in IDLE */}
        {appState === 'IDLE' && (
          <div className="w-full max-w-2xl mt-24 fade-in-up">
            {/* Hero text */}
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="badge badge-violet">🔒 Security Research</span>
                <span className="badge badge-info">OSINT Intelligence</span>
              </div>
              <h1 className="text-5xl font-black text-glow mb-4" style={{ color: 'var(--text-primary)' }}>
                DataVault Intelligence
              </h1>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                Search across breach intelligence databases for security research.<br />
                Enter an email address or phone number to get started.
              </p>
            </div>
            <SearchBar onSearch={handleSearch} loading={false} />
            {error && (
              <div className="mt-4 p-4 rounded-xl text-sm" style={{ background: 'var(--danger-glow)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--danger)' }}>
                ⚠ {error}
              </div>
            )}
            <Disclaimer />
            {/* Contact */}
            <div
              className="mt-6 rounded-2xl p-5"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
                Contact Developer
              </p>
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                Support, Connect &amp; Collaborate
              </p>
              <div className="flex flex-col gap-2 mt-3">
                <a
                  href="mailto:abdulazizindia@proton.me"
                  className="flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
                  style={{ color: 'var(--accent-light)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  abdulazizindia@proton.me
                </a>
              </div>
            </div>
          </div>
        )}

        {/* LOADING state */}
        {appState === 'LOADING' && (
          <div className="w-full max-w-2xl mt-24 fade-in-up">
            <LoadingState query={query} />
          </div>
        )}

        {/* PRE_PAYMENT state */}
        {appState === 'PRE_PAYMENT' && searchResult && (
          <div className="w-full max-w-2xl mt-16 fade-in-up">
            <PaymentPanel
              searchResult={searchResult}
              onPaymentComplete={handlePaymentComplete}
              onBack={handleReset}
            />
            {error && (
              <div className="mt-4 p-4 rounded-xl text-sm" style={{ background: 'var(--danger-glow)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--danger)' }}>
                ⚠ {error}
              </div>
            )}
          </div>
        )}

        {/* RESULTS state */}
        {appState === 'RESULTS' && resultData && searchResult && (
          <div className="w-full max-w-5xl mt-10 fade-in-up">
            <ResultsTable
              data={resultData}
              query={query}
              searchResult={searchResult}
              onNewSearch={handleReset}
            />
          </div>
        )}
      </main>
    </div>
  );
}
