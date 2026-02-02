'use client';

export default function OnboardingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-3xl p-12 animate-fadeIn">
        <div
          className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-[#3B82F6] to-[#764ba2] bg-clip-text"
          style={{ WebkitTextFillColor: 'transparent' }}
        >
          WARLORD
        </div>
        
        <h1 className="text-3xl font-semibold mb-3 text-center" style={{ color: 'var(--text-primary)' }}>
          AI-Powered Onboarding
        </h1>
        <p className="text-center mb-12" style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
          Let our AI guide you through setting up your supplier profile
        </p>

        <div
          className="p-8 rounded-2xl mb-8"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'var(--accent-subtle)' }}
            >
              <span style={{ fontSize: '24px' }}>🤖</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                AI Onboarding Assistant
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                Coming soon
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)' }}
              >
                ✓
              </div>
              <div>
                <h3 className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                  Profile Setup
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                  AI will help you complete your company profile
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)' }}
              >
                ✓
              </div>
              <div>
                <h3 className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                  Capabilities Assessment
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                  Define your manufacturing and supply capabilities
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)' }}
              >
                ✓
              </div>
              <div>
                <h3 className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                  Buyer Matching
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                  Get connected with buyers looking for your products
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            The AI onboarding assistant is being built and will be available soon.
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
