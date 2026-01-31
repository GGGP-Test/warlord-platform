/**
 * TypeScript types for WARLORD platform
 */

export interface User {
  id: string;
  email: string;
  email_verified: boolean;
  domain_verified: boolean;
  created_at: Date;
  company_profile?: CompanyProfile;
}

export interface CompanyProfile {
  name: string;
  industry: string;
  size: 'Small' | 'Medium' | 'Large';
  location: string;
  products: string[];
  confidence: number; // 0-1
  extraction_method: 'FREE' | 'CHEAP' | 'EXPENSIVE';
  extraction_cost: number;
  extraction_time_ms: number;
}

export interface VerificationToken {
  token: string; // hashed
  expires_at: Date;
  used: boolean;
}

export interface CostLog {
  method: 'FREE' | 'CHEAP' | 'EXPENSIVE';
  status: 'PASS' | 'FAIL';
  cost: number;
  timeMs: number;
  timestamp: Date;
}
