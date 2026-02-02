'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  const showAlert = (message: string, type: string) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('warlord_auth_token', data.token);
        localStorage.setItem('warlord_user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        showAlert(data.message || 'Invalid credentials', 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      showAlert('Network error. Please check your connection.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const oauthUrl = `/api/auth/google/authorize?redirect_uri=${window.location.origin}/auth/callback`;
    window.location.href = oauthUrl;
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-[480px] p-12 animate-fadeIn">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="text-sm flex items-center gap-1 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onMouseOver={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            ← Back
          </Link>
          <div
            className="text-2xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#764ba2] bg-clip-text"
            style={{ WebkitTextFillColor: 'transparent' }}
          >
            WARLORD
          </div>
        </div>

        <h1 className="text-3xl font-semibold mb-2 text-center" style={{ color: 'var(--text-primary)' }}>
          Welcome back
        </h1>
        <p className="text-center mb-8" style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Sign in to your account
        </p>

        {alert.show && (
          <div
            className="p-4 rounded-xl mb-6"
            style={{
              background: alert.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
              border: `1px solid ${alert.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
              color: alert.type === 'error' ? 'var(--error)' : 'var(--success)',
            }}
          >
            {alert.message}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          className="w-full p-4 rounded-xl font-medium flex items-center justify-center gap-2 mb-6 transition-all"
          style={{ background: 'white', border: '1px solid var(--border)', fontSize: '15px' }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'var(--surface-hover)';
            e.currentTarget.style.borderColor = 'var(--border-focus)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.borderColor = 'var(--border)';
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
            <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-4 my-8" style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          or
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Email
            </label>
            <div
              className="flex items-center rounded-xl px-4 transition-all"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
            >
              <span className="mr-2" style={{ color: 'var(--text-muted)' }}>📧</span>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@company.com"
                required
                className="flex-1 py-4 bg-transparent border-none outline-none"
                style={{ fontSize: '15px' }}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Password
            </label>
            <div
              className="flex items-center rounded-xl px-4 transition-all"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
            >
              <span className="mr-2" style={{ color: 'var(--text-muted)' }}>🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
                required
                className="flex-1 py-4 bg-transparent border-none outline-none"
                style={{ fontSize: '15px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 p-1"
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                👁
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center gap-2" style={{ fontSize: '14px' }}>
              <input type="checkbox" className="rounded" />
              <span style={{ color: 'var(--text-secondary)' }}>Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-sm font-medium" style={{ color: 'var(--accent-primary)' }}>
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-4 px-6 rounded-xl text-base font-medium"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Don't have an account?{' '}
          <Link href="/signup" className="font-medium" style={{ color: 'var(--accent-primary)' }}>
            Sign up
          </Link>
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
