import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WARLORD - Supplier Intelligence Platform',
  description: 'AI-powered supplier verification and market intelligence for B2B businesses',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-warlord-primary text-white">{children}</body>
    </html>
  );
}
