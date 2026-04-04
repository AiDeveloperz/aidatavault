'use client';

interface Props {
	onReset?: () => void;
}

export default function Header() {
	return (
		<header className="sticky top-0 z-50 h-16 px-8 flex items-center justify-between border-b border-white/5 bg-[#06060a]/80 backdrop-blur-md w-full mx-auto py-8">
			{/* Left Section */}
			<div className="flex items-center gap-3">
				{/* Logo Icon */}
				<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30">
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#9f67f5"
						strokeWidth="2.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
					</svg>
				</div>
				<div className="flex items-center space-x-0 tracking-tight">
					<h2 className="text-white text-xl font-bold">Data</h2>
					<h2 className="text-violet-500 text-xl font-bold">Vault</h2>
				</div>
			</div>

			{/* Right Section */}
			<div className="sm:flex items-center gap-3 hidden">
				<span className="badge badge-success hidden sm:inline-flex">
					<div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
					Live System
				</span>
				<span className="badge badge-violet">Research Use Only</span>
			</div>
		</header>
	);
}
