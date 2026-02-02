'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface CompanyData {
  name: string;
  website: string;
  logo?: string;
  products?: Array<{
    name: string;
    image: string;
    description?: string;
  }>;
}

export default function BridgePage() {
  const router = useRouter();
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('warlord_company_data');
    if (storedData) {
      setCompanyData(JSON.parse(storedData));
    } else {
      router.push('/signup');
    }
  }, [router]);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/confirm-company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('warlord_temp_token')}`,
        },
      });

      if (response.ok) {
        router.push('/verified');
      }
    } catch (error) {
      console.error('Confirmation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotMyCompany = () => {
    localStorage.removeItem('warlord_temp_token');
    localStorage.removeItem('warlord_company_data');
    router.push('/signup');
  };

  if (!companyData) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-xl" style={{ color: 'var(--text-secondary)' }}>Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-3xl p-12 animate-fadeIn">
        <div className="text-center mb-8">
          <div
            className="text-3xl font-bold mb-3 bg-gradient-to-r from-[#3B82F6] to-[#764ba2] bg-clip-text"
            style={{ WebkitTextFillColor: 'transparent' }}
          >
            WARLORD
          </div>
          <h1 className="text-3xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            Is this your company?
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Please confirm we found the right information
          </p>
        </div>

        {/* Company Info Card */}
        <div
          className="p-8 rounded-2xl mb-8"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-start gap-6 mb-6">
            {companyData.logo && (
              <div
                className="w-24 h-24 rounded-xl flex items-center justify-center overflow-hidden"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <Image
                  src={companyData.logo}
                  alt={companyData.name}
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                {companyData.name}
              </h2>
              <a
                href={companyData.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base"
                style={{ color: 'var(--accent-primary)' }}
              >
                {companyData.website}
              </a>
            </div>
          </div>

          {/* Products Section */}
          {companyData.products && companyData.products.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
                Your Products
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {companyData.products.map((product, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 rounded-xl"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                  >
                    <div
                      className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0"
                      style={{ background: 'var(--bg-primary)' }}
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium mb-1 truncate" style={{ color: 'var(--text-primary)' }}>
                        {product.name}
                      </h4>
                      {product.description && (
                        <p className="text-sm line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                          {product.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="btn-primary flex-1 py-4 px-6 rounded-xl text-base font-medium"
          >
            {isLoading ? 'Confirming...' : 'Yes, this is my company'}
          </button>
          <button
            onClick={handleNotMyCompany}
            disabled={isLoading}
            className="flex-1 py-4 px-6 rounded-xl text-base font-medium transition-all"
            style={{
              background: 'var(--bg-elevated)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
            }}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = 'var(--surface-hover)';
                e.currentTarget.style.borderColor = 'var(--border-focus)';
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'var(--bg-elevated)';
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          >
            No, try again
          </button>
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
