'use client';

import { useState } from 'react';
import { verifyAccessCode } from '@/app/actions';

interface AccessGateProps {
	onAccessGranted: () => void;
}

export default function AccessGate({ onAccessGranted }: AccessGateProps) {
	const [code, setCode] = useState('');
	const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'ERROR'>('IDLE');
	const [errorMsg, setErrorMsg] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!code.trim()) return;

		setStatus('LOADING');
		setErrorMsg('');

		try {
			const isValid = await verifyAccessCode(code);
			if (isValid) {
				// Store in local storage to keep them logged in
				localStorage.setItem('dv_access', 'true');
				localStorage.setItem('dv_access_code', code.trim().toUpperCase());
				// Let parent know
				onAccessGranted();
			} else {
				setStatus('ERROR');
				setErrorMsg('Invalid Access Code');
			}
		} catch (err) {
			setStatus('ERROR');
			setErrorMsg('Failed to verify code. Try again later.');
		}
	};

	return (
		<div className="w-full flex flex-col items-center justify-center px-4 min-h-[50vh] fade-in-up">
			<div className="w-full max-w-md relative z-10">
				<div className="absolute -inset-1 bg-linear-to-r from-violet-600/30 to-indigo-600/30 rounded-2xl blur-xl opacity-50"></div>
				<div className="relative p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl text-center shadow-2xl">
					<div className="inline-flex items-center justify-center gap-2 mb-6 p-3 rounded-full border border-white/5 bg-white/5 shadow-inner">
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							className="text-violet-400"
						>
							<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
							<path d="M7 11V7a5 5 0 0 1 10 0v4" />
						</svg>
					</div>

					<h2 className="text-3xl font-black text-glow mb-2 tracking-tight">
						Access Restricted
					</h2>
					<p className="text-sm font-medium text-(--text-secondary) mb-8">
						This platform is Invite Only. Please enter your valid Access Code to
						continue.
					</p>

					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<div>
							<input
								type="text"
								value={code}
								onChange={(e) => setCode(e.target.value.toUpperCase())}
								placeholder="e.g. DV-XXXXXX"
								className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center text-white placeholder:text-white/30 font-mono tracking-widest outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all uppercase"
								disabled={status === 'LOADING'}
								autoComplete="off"
								spellCheck="false"
							/>
						</div>
						
						{status === 'ERROR' && (
							<div className="text-xs text-red-400 font-medium bg-red-400/10 py-2 rounded-lg border border-red-400/20">
								{errorMsg}
							</div>
						)}

						<button
							type="submit"
							disabled={status === 'LOADING' || !code.trim()}
							className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center font-medium"
						>
							{status === 'LOADING' ? (
								<svg
									className="animate-spin h-5 w-5 text-white"
									viewBox="0 0 24 24"
									fill="none"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
									></path>
								</svg>
							) : (
								'Unlock Terminal'
							)}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
