'use client';

export default function Disclaimer() {
  return (
    <div
      className="mt-10 p-4 rounded-xl text-xs text-center"
      style={{
        background: 'rgba(239,68,68,0.04)',
        border: '1px solid rgba(239,68,68,0.12)',
        color: 'var(--text-muted)',
        lineHeight: 1.7,
      }}
    >
      <strong style={{ color: 'var(--danger)', display: 'block', marginBottom: '4px' }}>
        ⚠ Legal Disclaimer
      </strong>
      This platform is intended exclusively for authorized security researchers, penetration testers, and
      cybersecurity professionals. By using this service, you confirm that you have the legal right to
      query the provided data subject. Unauthorized access to personal data may violate GDPR, India's
      DPDP Act, IT Act 2000 (Section 43/66), and other applicable laws. Search results are for
      investigative purposes only and must not be used for fraud, harassment, or identity theft.
    </div>
  );
}
