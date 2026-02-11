'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthLanding() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('warlord_auth_token');
    if (token) {
      // User is authenticated, redirect to dashboard
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-12 animate-fadeIn">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#764ba2] bg-clip-text text-transparent">
            WARLORD
          </h1>
        </div>

        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            Welcome to WARLORD
          </h2>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            Your Supplier Intelligence Platform
          </p>
        </div>

        {/* Button Group */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => router.push('/signup')}
            className="btn-primary w-full py-4 px-6 rounded-xl text-base font-medium"
          >
            Sign Up
          </button>
          
          <button
            onClick={() => router.push('/login')}
            className="w-full py-4 px-6 rounded-xl text-base font-medium transition-all"
            style={{
              background: 'var(--bg-elevated)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'var(--surface-hover)';
              e.currentTarget.style.borderColor = 'var(--border-focus)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'var(--bg-elevated)';
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Sign In
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </main>
  );
}
