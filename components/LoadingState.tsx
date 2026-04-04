'use client';

interface Props {
  query: string;
}

export default function LoadingState({ query }: Props) {
  return (
    <div className="flex flex-col items-center gap-8">
      {/* Pulsing orb */}
      <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
        <div
          className="absolute inset-0 rounded-full pulse-ring"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)' }}
        />
        <div
          className="absolute inset-4 rounded-full pulse-ring"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.5) 0%, transparent 70%)', animationDelay: '0.3s' }}
        />
        <div
          className="relative w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: 'var(--accent)', boxShadow: '0 0 30px rgba(124,58,237,0.6)' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
      </div>

      {/* Status text */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Querying Intelligence Sources
        </h2>
        <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
          Searching for: <span className="mono" style={{ color: 'var(--accent-light)' }}>{query}</span>
        </p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          This may take up to 30 seconds...
        </p>
      </div>

      {/* Step indicators */}
      <div className="w-full max-w-sm card p-5 space-y-3">
        {[
          { label: 'Connecting to secure data bridge', done: true },
          { label: 'Querying breach database', done: true, active: true },
          { label: 'Processing results', done: false },
          { label: 'Preparing summary', done: false },
        ].map((step, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs"
              style={{
                background: step.done
                  ? (step.active ? 'var(--accent)' : 'rgba(16,185,129,0.2)')
                  : 'var(--bg-elevated)',
                border: `1px solid ${step.done ? (step.active ? 'var(--accent)' : 'var(--success)') : 'var(--border)'}`,
              }}
            >
              {step.done && !step.active && (
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="var(--success)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
              {step.active && (
                <span className="w-2 h-2 rounded-full bg-white animate-ping" style={{ display: 'block' }} />
              )}
            </div>
            <span
              className="text-sm"
              style={{ color: step.active ? 'var(--text-primary)' : step.done ? 'var(--success)' : 'var(--text-muted)' }}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
