'use client';

import { useState } from 'react';

interface Props {
	onSearch: (q: string) => void;
	loading?: boolean;
}

export default function SearchBar({ onSearch, loading = false }: Props) {
	const [value, setValue] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = value.trim();
		if (!trimmed) return;
		onSearch(trimmed);
	};

	return (
		<form onSubmit={handleSubmit} className="w-full">
			<div
				className="card glow-violet p-2 flex gap-2 items-center"
				style={{ borderColor: 'rgba(124,58,237,0.3)' }}
			>
				{/* Search icon */}
				<div
					className="shrink-0 w-10 h-10 flex items-center justify-center"
					style={{ color: 'var(--text-muted)' }}
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<circle cx="11" cy="11" r="8" />
						<path d="m21 21-4.35-4.35" />
					</svg>
				</div>

				<input
					id="search-input"
					type="text"
					className="flex-1 bg-transparent border-0 outline-none text-base text-sm"
					style={{
						color: 'var(--text-primary)',
						fontFamily: 'Inter, sans-serif',
						fontSize: '16px',
					}}
					placeholder="Phone Number with country code (e.g. +919876543210), E-mail or Aadhaar Number"
					value={value}
					onChange={(e) => setValue(e.target.value)}
					disabled={loading}
					autoFocus
					autoComplete="off"
					spellCheck="false"
				/>
			</div>

			<div className="flex items-center justify-center py-2 ">
				<button
					id="search-btn"
					type="submit"
					className="btn-primary shrink-0 cursor-pointer"
					disabled={loading || !value.trim()}
					style={{ borderRadius: '8px', padding: '10px 22px' }}
				>
					{loading ? (
						<>
							<span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
							Searching...
						</>
					) : (
						'Search'
					)}
				</button>
			</div>

			<p
				className="mt-3 text-center text-xs"
				style={{ color: 'var(--text-muted)' }}
			>
				Supports email addresses and phone numbers with country code (E.164
				format)
			</p>
		</form>
	);
}
