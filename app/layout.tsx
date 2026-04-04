import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';

export const metadata: Metadata = {
	title: 'DataVault — Intelligence Search Platform',
	description:
		'Search leaked data for security research purposes. Powered by advanced breach intelligence databases.',
	keywords: [
		'osint',
		'breach intelligence',
		'security research',
		'data lookup',
	],
	robots: 'noindex, nofollow',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&family=JetBrains+Mono:wght@400;500&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body className="min-h-screen flex flex-col mx-auto w-full">
				<Header />
				<main className="flex-1">{children}</main>
			</body>
		</html>
	);
}
