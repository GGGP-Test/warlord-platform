'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import EmailForm from '@/components/EmailForm';

export default function LandingPage() {
  const router = useRouter();
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const handleEmailSuccess = (email: string) => {
    setSubmittedEmail(email);
    router.push(`/verify-email?email=${encodeURIComponent(email)}`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-4xl w-full space-y-12 text-center">
        {/* Hero Section */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            <span className="text-white">WARLORD</span>
            <br />
            <span className="text-warlord-accent">Supplier Intelligence</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            AI-powered supplier verification and market intelligence.
            <br />
            Know your suppliers before you engage.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-6 text-left">
          <div className="bg-warlord-secondary border border-gray-700 rounded-lg p-6">
            <div className="text-warlord-accent text-2xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold mb-2">Instant Verification</h3>
            <p className="text-gray-400 text-sm">
              AI-powered company verification in seconds, not days.
            </p>
          </div>

          <div className="bg-warlord-secondary border border-gray-700 rounded-lg p-6">
            <div className="text-warlord-accent text-2xl mb-3">🎯</div>
            <h3 className="text-lg font-semibold mb-2">Market Intelligence</h3>
            <p className="text-gray-400 text-sm">
              Real-time data on suppliers, competitors, and market trends.
            </p>
          </div>

          <div className="bg-warlord-secondary border border-gray-700 rounded-lg p-6">
            <div className="text-warlord-accent text-2xl mb-3">💰</div>
            <h3 className="text-lg font-semibold mb-2">Cost-Optimized</h3>
            <p className="text-gray-400 text-sm">
              Smart cascade: FREE → CHEAP → EXPENSIVE. Pay only when needed.
            </p>
          </div>
        </div>

        {/* Email Form */}
        <div className="flex flex-col items-center space-y-4">
          <EmailForm onSuccess={handleEmailSuccess} />
          
          <p className="text-sm text-gray-500">
            By continuing, you agree to our{' '}
            <a href="/terms" className="text-warlord-accent hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-warlord-accent hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>

        {/* Social Proof Placeholder */}
        <div className="pt-12 border-t border-gray-800">
          <p className="text-sm text-gray-500 mb-4">Trusted by B2B teams at</p>
          <div className="flex justify-center items-center space-x-8 opacity-50">
            <div className="text-gray-600 font-semibold">Company A</div>
            <div className="text-gray-600 font-semibold">Company B</div>
            <div className="text-gray-600 font-semibold">Company C</div>
          </div>
        </div>
      </div>
    </main>
  );
}
