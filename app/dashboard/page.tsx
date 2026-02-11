'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('warlord_auth_token');
    if (!token) {
      router.push('/');
    }
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-2xl p-12 text-center animate-fadeIn">
        <div
          className="text-4xl font-bold mb-6 bg-gradient-to-r from-[#3B82F6] to-[#764ba2] bg-clip-text"
          style={{ WebkitTextFillColor: 'transparent' }}
        >
          WARLORD
        </div>
        <h1 className="text-3xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Dashboard
        </h1>
        <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
          Welcome to your supplier intelligence dashboard.
        </p>
        <div
          className="p-6 rounded-xl"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
        >
          <p style={{ color: 'var(--text-secondary)' }}>
            Dashboard features coming soon...
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </main>
  );
}
