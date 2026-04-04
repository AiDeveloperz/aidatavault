'use client';

import { useState, useMemo } from 'react';
import type { ResultData, SearchResult } from '@/app/page';

interface Props {
  data: ResultData;
  query: string;
  searchResult: SearchResult;
  onNewSearch: () => void;
}

// Fields to highlight specially
const SENSITIVE_FIELDS = ['Password', 'ID / Document'];

export default function ResultsTable({ data, query, searchResult, onNewSearch }: Props) {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [filter, setFilter] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const filtered = useMemo(() => {
    let rows = [...data.records];
    if (filter) {
      const q = filter.toLowerCase();
      rows = rows.filter(r =>
        r.field.toLowerCase().includes(q) ||
        r.value.toLowerCase().includes(q) ||
        r.source.toLowerCase().includes(q)
      );
    }
    if (sortField) {
      rows.sort((a, b) => {
        const av = (a as any)[sortField] || '';
        const bv = (b as any)[sortField] || '';
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return rows;
  }, [data.records, filter, sortField, sortDir]);

  const downloadCSV = () => {
    const blob = new Blob([data.csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `datavault_${query.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `datavault_${query.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyCell = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 1500);
  };

  return (
    <div className="fade-in-up">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="badge badge-success">✅ Data Unlocked</span>
            <span className="badge badge-violet">{data.records.length} records</span>
          </div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Intelligence Report
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Query: <span className="mono" style={{ color: 'var(--accent-light)' }}>{query}</span>
            &nbsp;·&nbsp;Source: <span style={{ color: 'var(--text-secondary)' }}>{data.source}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button id="download-csv-btn" className="btn-secondary" onClick={downloadCSV}>
            ⬇ CSV
          </button>
          <button id="download-json-btn" className="btn-secondary" onClick={downloadJSON}>
            ⬇ JSON
          </button>
          <button className="btn-primary" onClick={onNewSearch}>
            + New Search
          </button>
        </div>
      </div>

      {/* Description */}
      {data.description && (
        <div
          className="card p-4 mb-5 text-sm"
          style={{ color: 'var(--text-secondary)', borderColor: 'rgba(124,58,237,0.15)', lineHeight: 1.7 }}
        >
          <p className="text-xs font-bold mb-2" style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
            SOURCE DESCRIPTION
          </p>
          {data.description}
        </div>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total Records', value: searchResult.resultCount, color: 'var(--accent-light)' },
          { label: 'Leak Sources', value: searchResult.leakCount, color: 'var(--warning)' },
          { label: 'Data Fields', value: data.records.length, color: 'var(--success)' },
          { label: 'Data Source', value: data.source, color: 'var(--info)' },
        ].map((s, i) => (
          <div key={i} className="card-elevated p-4">
            <div className="text-xs mb-1" style={{ color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
              {s.label.toUpperCase()}
            </div>
            <div className="text-lg font-bold truncate" style={{ color: s.color }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2"
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className="input-field"
            style={{ paddingLeft: '36px', paddingTop: '10px', paddingBottom: '10px', fontSize: '13px' }}
            placeholder="Filter results..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
        <span className="text-xs" style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
          {filtered.length} of {data.records.length}
        </span>
      </div>

      {/* Data table */}
      <div className="card overflow-hidden" style={{ borderColor: 'rgba(124,58,237,0.15)' }}>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                {['field', 'value', 'source'].map(col => (
                  <th
                    key={col}
                    onClick={() => handleSort(col)}
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                  >
                    <span className="flex items-center gap-1">
                      {col.toUpperCase()}
                      {sortField === col && (
                        <span style={{ color: 'var(--accent)' }}>{sortDir === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </span>
                  </th>
                ))}
                <th>COPY</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No results match your filter.
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => {
                  const isSensitive = SENSITIVE_FIELDS.includes(row.field);
                  const cellKey = `${i}_${row.field}`;
                  return (
                    <tr key={i} className="slide-in" style={{ animationDelay: `${i * 30}ms` }}>
                      <td>
                        <span
                          className="badge"
                          style={{
                            background: isSensitive ? 'var(--danger-glow)' : 'var(--accent-glow)',
                            color: isSensitive ? 'var(--danger)' : 'var(--accent-light)',
                            border: `1px solid ${isSensitive ? 'rgba(239,68,68,0.3)' : 'rgba(124,58,237,0.3)'}`,
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '11px',
                          }}
                        >
                          {row.field}
                        </span>
                      </td>
                      <td className="mono" style={{ color: 'var(--text-primary)', maxWidth: '300px', wordBreak: 'break-all' }}>
                        {row.value}
                      </td>
                      <td>
                        <span className="badge badge-info" style={{ fontSize: '11px' }}>
                          {row.source}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => copyCell(row.value, cellKey)}
                          className="btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '11px' }}
                        >
                          {copiedField === cellKey ? '✓ Copied' : 'Copy'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer notice */}
      <div className="mt-6 text-xs text-center" style={{ color: 'var(--text-muted)' }}>
        ⚠ Results expire in 24 hours · For authorized security research only
      </div>
    </div>
  );
}
