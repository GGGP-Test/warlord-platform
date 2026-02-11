'use client';

import { useState } from 'react';
import { validateEmail } from '@/lib/validation';
import { submitEmail } from '@/lib/api';

interface EmailFormProps {
  onSuccess: (email: string) => void;
}

export default function EmailForm({ onSuccess }: EmailFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation (FREE tier)
    const validation = validateEmail(email);
    if (!validation.valid) {
      setError(validation.reason || 'Invalid email');
      return;
    }

    setLoading(true);

    // Backend validation + magic link (FREE → CHEAP → EXPENSIVE cascade)
    const result = await submitEmail(email);

    setLoading(false);

    if (result.success) {
      onSuccess(email);
    } else {
      setError(result.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          Business Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="w-full px-4 py-3 bg-warlord-secondary border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-warlord-accent text-white placeholder-gray-500"
          disabled={loading}
          required
        />
        {error && (
          <p className="mt-2 text-sm text-warlord-error">{error}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-warlord-accent hover:bg-sky-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
      >
        {loading ? 'Verifying...' : 'Get Started'}
      </button>

      <p className="text-xs text-gray-400 text-center">
        We'll send you a magic link to verify your email.
        <br />
        No password needed.
      </p>
    </form>
  );
}
