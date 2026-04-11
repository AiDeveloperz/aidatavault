'use client';

import Image from 'next/image';

interface Props {
	onReset?: () => void;
}

export default function Header() {
	return (
		<header className="sticky top-0 z-50 h-16 px-8 flex items-center justify-between border-b border-white/5 bg-[#06060a]/80 backdrop-blur-md w-full mx-auto py-8">
			{/* Left Section */}
			<div className="flex items-center gap-3">
				{/* Logo Icon */}
				<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 overflow-hidden">
					<Image 
            src="/logo.png" 
            alt="Data Vault Logo" 
            width={24} 
            height={24} 
            className="object-contain" 
            priority
          />
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
