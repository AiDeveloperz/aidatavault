'use client';

import { useState } from 'react';
import type { SearchResult } from '@/app/page';

interface Props {
  searchResult: SearchResult;
  onPaymentComplete: () => void;
  onBack: () => void;
}

interface PaymentSession {
  orderId: string;
  upiUrl: string;
  qrUrl: string;
  amount: string;
  currency: string;
}

const API_URL        = process.env.NEXT_PUBLIC_API_URL        || '';
const PAYMENT_AMOUNT = process.env.NEXT_PUBLIC_PAYMENT_AMOUNT || '100';

export default function PaymentPanel({ searchResult, onPaymentComplete, onBack }: Props) {
  const [step, setStep]       = useState<'info' | 'paying' | 'verifying'>('info');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [session, setSession] = useState<PaymentSession | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // ── Initiate payment ────────────────────────────────────────────────────────
  const initiatePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/payment/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${searchResult.token}`,
        },
        body: JSON.stringify({ searchId: searchResult.searchId, token: searchResult.token }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to initiate payment'); return; }
      setSession(data);
      setStep('paying');
    } catch {
      setError('Network error — check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Open UPI intent (mobile deep-link) ─────────────────────────────────────
  const openUpiApp = () => {
    if (session?.upiUrl) window.location.href = session.upiUrl;
  };

  // ── Verify payment ──────────────────────────────────────────────────────────
  const verifyPayment = async () => {
    setLoading(true);
    setError(null);
    setStep('verifying');
    try {
      const res = await fetch(`${API_URL}/api/payment/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${searchResult.token}`,
        },
        body: JSON.stringify({ searchId: searchResult.searchId, token: searchResult.token }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        onPaymentComplete();
        return;
      }

      setError(data.message || 'Payment not confirmed yet. Wait a few seconds and try again.');
      setStep('paying');
      setRetryCount(c => c + 1);
    } catch {
      setError('Network error during verification.');
      setStep('paying');
    } finally {
      setLoading(false);
    }
  };

  // ── UI ──────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full fade-in-up">

      {/* ── Result summary card ───────────────────────────────────────────────── */}
      <div className="card p-6 mb-5 glow-violet" style={{ borderColor: 'rgba(124,58,237,0.3)' }}>

        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              Intelligence Results Found
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Results locked behind payment
            </p>
          </div>
          <span className="badge badge-violet">🔒 Premium Data</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Records Found', value: searchResult.resultCount, icon: '📁' },
            { label: 'Leak Sources',  value: searchResult.leakCount,   icon: '💦' },
            { label: 'Data Source',   value: searchResult.source || 'Multiple', icon: '💾' },
          ].map((stat, i) => (
            <div key={i} className="card-elevated p-4 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl font-black" style={{ color: 'var(--accent-light)' }}>{stat.value}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── STEP: info ────────────────────────────────────────────────────── */}
        {step === 'info' && (
          <div className="space-y-4">
            {searchResult.availableFields && searchResult.availableFields.length > 0 && (
              <div className="p-4 rounded-xl mb-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--accent-light)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  Available Data Fields
                </p>
                <div className="flex flex-wrap gap-2">
                  {searchResult.availableFields.map((field, idx) => (
                    <span key={idx} className="px-2 py-1 text-xs rounded-md border" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}>
                      {field}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div
              className="p-4 rounded-xl flex items-center gap-3"
              style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}
            >
              <span className="text-2xl">🔓</span>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                  Unlock Full Data Package
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Gain instant access to all discovered records and intelligence points
                </p>
              </div>
              <div className="ml-auto text-right flex-shrink-0">
                <div className="text-2xl font-black" style={{ color: 'var(--accent-light)' }}>
                  ₹{PAYMENT_AMOUNT}
                </div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>one-time</div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="btn-secondary flex-1" onClick={onBack} disabled={loading}>
                ← New Search
              </button>
              <button
                id="pay-btn"
                className="btn-primary"
                style={{ flex: 2 }}
                onClick={initiatePayment}
                disabled={loading}
              >
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing...</>
                  : <>💳 Pay ₹{PAYMENT_AMOUNT} via UPI</>
                }
              </button>
            </div>
          </div>
        )}

        {/* ── STEP: paying ─────────────────────────────────────────────────── */}
        {step === 'paying' && session && (
          <div className="space-y-5 fade-in-up">

            {/* Amount badge */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                Scan QR or tap button to pay
              </p>
              <div
                className="px-3 py-1 rounded-full text-sm font-black"
                style={{ background: 'rgba(16,185,129,0.12)', color: 'var(--success)', border: '1px solid rgba(16,185,129,0.25)' }}
              >
                ₹{session.amount} INR
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center gap-3">
              <div
                className="rounded-2xl p-3 relative"
                style={{ background: 'white', boxShadow: '0 0 40px rgba(124,58,237,0.2)' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={session.qrUrl}
                  alt="UPI QR Code"
                  width={240}
                  height={240}
                  style={{ display: 'block', borderRadius: '8px' }}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-black"
                    style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                  >
                    ₹
                  </div>
                </div>
              </div>
              <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                PhonePe · GPay · Paytm · BHIM — any UPI app works
              </p>
            </div>

            {/* UPI intent button */}
            <button
              id="upi-intent-btn"
              onClick={openUpiApp}
              className="w-full rounded-xl py-3 font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #00b9f1 0%, #0066cc 100%)',
                color: 'white',
                boxShadow: '0 4px 20px rgba(0,102,204,0.3)',
              }}
            >
              <span className="text-lg">📱</span>
              Open UPI App Directly
            </button>

            {/* Info notice */}
            <div
              className="rounded-xl p-4"
              style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}
            >
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                ℹ Payment is auto-detected. Once you pay, click <strong>"I've Paid"</strong> below — it confirms automatically within seconds.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button className="btn-secondary flex-1" onClick={() => setStep('info')}>
                ← Back
              </button>
              <button
                id="verify-payment-btn"
                className="btn-success"
                style={{ flex: 2 }}
                onClick={verifyPayment}
                disabled={loading}
              >
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Verifying...</>
                  : <>✅ I've Paid — Verify {retryCount > 0 ? `(retry ${retryCount})` : ''}</>
                }
              </button>
            </div>

            {retryCount > 0 && (
              <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                Payment takes 5–10 seconds to register. Keep trying every few seconds.
              </p>
            )}
          </div>
        )}

        {/* ── STEP: verifying ──────────────────────────────────────────────── */}
        {step === 'verifying' && (
          <div className="text-center py-8 fade-in-up">
            <div className="w-12 h-12 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              Checking payment status...
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Auto-detected via Paytm for Business
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            className="mt-3 p-3 rounded-lg text-sm"
            style={{ background: 'var(--danger-glow)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--danger)' }}
          >
            ⚠ {error}
          </div>
        )}
      </div>

      {/* Security notice */}
      <div className="flex items-center justify-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        256-bit encrypted · Results expire in 24h · Auto-verified via Paytm notifications
      </div>
    </div>
  );
}
