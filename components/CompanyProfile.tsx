'use client';

import { CompanyProfile as CompanyProfileType } from '@/lib/types';

interface CompanyProfileProps {
  profile: CompanyProfileType;
}

export default function CompanyProfile({ profile }: CompanyProfileProps) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getMethodBadge = (method: string) => {
    const colors = {
      FREE: 'bg-green-900 text-green-300',
      CHEAP: 'bg-blue-900 text-blue-300',
      EXPENSIVE: 'bg-purple-900 text-purple-300',
    };
    return colors[method as keyof typeof colors] || 'bg-gray-700 text-gray-300';
  };

  return (
    <div className="w-full max-w-2xl bg-warlord-secondary border border-gray-700 rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
          <p className="text-gray-400">{profile.industry}</p>
        </div>
        <div className="text-right">
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getMethodBadge(
              profile.extraction_method
            )}`}
          >
            {profile.extraction_method}
          </span>
          <p className="text-xs text-gray-500 mt-1">
            ${profile.extraction_cost.toFixed(4)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-400">Company Size</p>
          <p className="text-white font-medium">{profile.size}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Location</p>
          <p className="text-white font-medium">{profile.location}</p>
        </div>
      </div>

      {profile.products.length > 0 && (
        <div>
          <p className="text-sm text-gray-400 mb-2">Products/Services</p>
          <div className="flex flex-wrap gap-2">
            {profile.products.map((product, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
              >
                {product}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Confidence Score</span>
          <span className={`font-semibold ${getConfidenceColor(profile.confidence)}`}>
            {(profile.confidence * 100).toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
          <div
            className={`h-2 rounded-full ${
              profile.confidence >= 0.8
                ? 'bg-green-400'
                : profile.confidence >= 0.5
                ? 'bg-yellow-400'
                : 'bg-red-400'
            }`}
            style={{ width: `${profile.confidence * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
