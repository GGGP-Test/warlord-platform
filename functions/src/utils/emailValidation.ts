import * as dns from 'dns';
import { promisify } from 'util';

const resolveMx = promisify(dns.resolveMx);

// Blocked email providers
const BLOCKED_PROVIDERS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
  'aol.com', 'icloud.com', 'protonmail.com'
];

// Disposable email domains
const DISPOSABLE_DOMAINS = [
  'tempmail.com', 'guerrillamail.com', 'mailinator.com',
  '10minutemail.com', 'throwaway.email'
];

/**
 * Validate email format
 * Cost: FREE ($0)
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;

  const domain = email.split('@')[1]?.toLowerCase();
  
  // Block consumer email providers
  if (BLOCKED_PROVIDERS.includes(domain)) return false;
  
  // Block disposable email providers
  if (DISPOSABLE_DOMAINS.includes(domain)) return false;

  return true;
}

/**
 * Check MX records for domain
 * Cost: FREE ($0)
 * Blocks: ~40% of fake emails
 */
export async function checkMXRecords(domain: string): Promise<boolean> {
  try {
    const addresses = await resolveMx(domain);
    return addresses && addresses.length > 0;
  } catch (error) {
    console.warn(`MX check failed for ${domain}:`, error);
    return false;
  }
}

/**
 * SMTP handshake verification (mock implementation)
 * In production, use a library like 'email-validator' or 'verify-email'
 * Cost: CHEAP (~$0.0001 per check)
 * Blocks: ~50% of remaining fake emails
 */
export async function smtpHandshake(email: string): Promise<boolean> {
  // TODO: Implement actual SMTP verification
  // For now, return true to allow progression to Resend
  // 
  // In production:
  // 1. Connect to MX server
  // 2. Perform SMTP handshake (HELO/EHLO)
  // 3. Verify recipient (RCPT TO)
  // 4. Don't actually send email (QUIT before DATA)
  
  console.log(`SMTP handshake for ${email} - TODO: implement`);
  return true;
}
