'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifiedPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Redirect to onboarding AI or dashboard
          router.push('/onboarding');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-12 text-center animate-fadeIn">
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '2px solid rgba(34, 197, 94, 0.3)',
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--success)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        {/* Logo */}
        <div
          className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#3B82F6] to-[#764ba2] bg-clip-text"
          style={{ WebkitTextFillColor: 'transparent' }}
        >
          WARLORD
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Verification Successful!
        </h1>
        <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
          Your business has been verified and approved.
        </p>

        {/* Info Box */}
        <div
          className="p-6 rounded-xl mb-8 text-left"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
        >
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            What happens next?
          </h2>
          <ul className="space-y-2" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            <li className="flex items-start gap-2">
              <span style={{ color: 'var(--success)' }}>✓</span>
              <span>Our AI will guide you through the onboarding process</span>
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: 'var(--success)' }}>✓</span>
              <span>Set up your supplier profile and capabilities</span>
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: 'var(--success)' }}>✓</span>
              <span>Get matched with buyers looking for your products</span>
            </li>
          </ul>
        </div>

        {/* Countdown */}
        <div className="mb-6">
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Redirecting to onboarding in <span className="font-semibold" style={{ color: 'var(--accent-primary)' }}>{countdown}</span> seconds...
          </p>
        </div>

        {/* Manual Continue Button */}
        <button
          onClick={() => router.push('/onboarding')}
          className="btn-primary w-full py-4 px-6 rounded-xl text-base font-medium"
        >
          Continue to Onboarding
        </button>
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
