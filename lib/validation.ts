/**
 * Email and domain validation utilities
 * Following FREE → CHEAP → EXPENSIVE cascade principle
 */

// Blocked email providers (FREE tier)
const BLOCKED_PROVIDERS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'aol.com',
  'icloud.com',
  'protonmail.com',
  'mail.com',
  'zoho.com',
];

// Common disposable email domains (FREE tier)
const DISPOSABLE_DOMAINS = [
  'tempmail.com',
  'guerrillamail.com',
  'mailinator.com',
  '10minutemail.com',
  'throwaway.email',
  'temp-mail.org',
];

/**
 * Validate email format (FREE)
 * Cost: $0
 * Blocks: ~30% of invalid submissions
 */
export function isValidEmailFormat(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if email is from blocked provider (FREE)
 * Cost: $0
 * Blocks: ~60% of non-business emails
 */
export function isBusinessEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return !BLOCKED_PROVIDERS.includes(domain);
}

/**
 * Check if email is from disposable provider (FREE)
 * Cost: $0
 * Blocks: ~5% of spam submissions
 */
export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return DISPOSABLE_DOMAINS.includes(domain);
}

/**
 * Extract domain from email
 */
export function extractDomain(email: string): string {
  return email.split('@')[1]?.toLowerCase() || '';
}

/**
 * Comprehensive email validation (client-side)
 * Returns { valid: boolean, reason?: string }
 */
export function validateEmail(email: string): { valid: boolean; reason?: string } {
  if (!isValidEmailFormat(email)) {
    return { valid: false, reason: 'Invalid email format' };
  }

  if (!isBusinessEmail(email)) {
    return { valid: false, reason: 'Please use a business email address' };
  }

  if (isDisposableEmail(email)) {
    return { valid: false, reason: 'Disposable email addresses are not allowed' };
  }

  return { valid: true };
}
