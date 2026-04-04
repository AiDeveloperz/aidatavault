'use client';

interface Props {
  onReset?: () => void;
}

export default function Header({ onReset }: Props) {
  return (
    <header
      className="w-full sticky top-0 z-50"
      style={{
        background: 'rgba(6,6,10,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={onReset}
          className="flex items-center gap-2.5"
          style={{ background: 'none', border: 'none', cursor: onReset ? 'pointer' : 'default', padding: 0 }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--accent)', boxShadow: '0 0 16px rgba(124,58,237,0.5)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <span className="font-black text-lg tracking-tight" style={{ color: 'var(--text-primary)' }}>
            DataVault
          </span>
          <span
            className="badge badge-violet"
            style={{ fontSize: '10px', padding: '2px 7px', letterSpacing: '0.05em' }}
          >
            OSINT
          </span>
        </button>

        {/* Nav items */}
        <nav className="flex items-center gap-4">
          <span className="badge badge-success" style={{ fontSize: '11px' }}>
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: 'var(--success)', display: 'inline-block', marginRight: '4px' }}
            />
            Live
          </span>
          <span
            className="text-xs px-3 py-1 rounded-full"
            style={{
              background: 'rgba(239,68,68,0.08)',
              color: 'var(--danger)',
              border: '1px solid rgba(239,68,68,0.2)',
              fontSize: '11px',
            }}
          >
            Research Use Only
          </span>
        </nav>
      </div>
    </header>
  );
}
