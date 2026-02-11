// ============================================
// WARLORD Platform - Shared Types
// ============================================

import { Timestamp } from 'firebase/firestore';

// ============================================
// USER & AUTH TYPES
// ============================================

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  domainVerified: boolean;
  companyId?: string;
  role: 'supplier' | 'buyer';
  bridgeCompleted: boolean;
  onboardingCompleted: boolean;
  createdAt: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

export interface VerificationToken {
  token: string;
  expiresAt: Timestamp | Date;
  used: boolean;
}

// ============================================
// COMPANY TYPES
// ============================================

export interface Company {
  id: string;
  name: string;
  website: string;
  logo?: string;
  products: Product[];
  enrichmentData?: EnrichmentData;
  validationStatus: 'pending' | 'approved' | 'rejected';
  validationReason?: string;
  ownerId: string;
  members?: string[];
  createdAt: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  image?: string;
}

export interface EnrichmentData {
  description?: string;
  employeeCount?: string;
  location?: string;
  linkedin?: string;
  crunchbase?: string;
  funding?: string;
  confidence: number;
  extractionMethod: 'FREE' | 'CHEAP' | 'EXPENSIVE';
  extractionCost: number;
  extractionTimeMs: number;
}

// ============================================
// SUPPLIER TYPES (from backend)
// ============================================

export interface Supplier {
  id: string;
  name: string;
  industry: string;
  location: string;
  website?: string;
  verified?: boolean;
  enrichmentScore?: number;
  enrichmentHistory?: EnrichmentRecord[];
  createdAt: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

export interface EnrichmentRecord {
  timestamp: Timestamp | Date;
  source: 'web' | 'linkedin' | 'crunchbase';
  data: Record<string, any>;
  score: number;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  total: number;
  page: number;
  perPage: number;
  hasMore: boolean;
}

// ============================================
// AUTH API TYPES
// ============================================

export interface SignupRequest {
  email: string;
  password: string;
  companyName: string;
  website: string;
}

export interface SignupResponse {
  status: 'approved' | 'rejected';
  tempToken?: string;
  companyData?: CompanyProfile;
  reason?: string;
}

export interface SigninRequest {
  email: string;
  password: string;
}

export interface SigninResponse {
  authToken: string;
  bridgeCompleted: boolean;
  companyData?: CompanyProfile;
}

export interface BridgeConfirmRequest {
  confirmed: boolean;
  selectedProducts: Product[];
}

export interface BridgeConfirmResponse {
  authToken: string;
  userId: string;
  companyId: string;
}

// ============================================
// COMPANY PROFILE (from AI extraction)
// ============================================

export interface CompanyProfile {
  name: string;
  website: string;
  logo?: string;
  industry?: string;
  size?: 'Small' | 'Medium' | 'Large';
  location?: string;
  products: Product[];
  confidence: number;
  extractionMethod: 'FREE' | 'CHEAP' | 'EXPENSIVE';
  extractionCost: number;
  extractionTimeMs: number;
}

// ============================================
// ONBOARDING TYPES
// ============================================

export interface OnboardingData {
  role: 'supplier' | 'buyer';
  companyDetails: {
    name: string;
    website?: string;
    teamSize?: string;
  };
}

// ============================================
// COST TRACKING TYPES
// ============================================

export interface CostLog {
  method: 'FREE' | 'CHEAP' | 'EXPENSIVE';
  status: 'PASS' | 'FAIL';
  cost: number;
  timeMs: number;
  timestamp: Timestamp | Date;
  metadata?: Record<string, any>;
}

export interface CostStats {
  totalCost: number;
  totalRequests: number;
  avgCost: number;
  byMethod: {
    FREE: {
      count: number;
      pass: number;
      fail: number;
      totalCost: number;
    };
    CHEAP: {
      count: number;
      pass: number;
      fail: number;
      totalCost: number;
    };
    EXPENSIVE: {
      count: number;
      pass: number;
      fail: number;
      totalCost: number;
    };
  };
}
