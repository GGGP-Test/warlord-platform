import * as admin from 'firebase-admin';

admin.initializeApp();

// Export all functions
export { submitEmail } from './submitEmail';
export { verifyEmail } from './verifyEmail';
export { verifyDomain } from './verifyDomain';
export { getCompanyProfile } from './getCompanyProfile';
export { 
  onPendingVerificationCreated, 
  cleanupExpiredVerifications 
} from './sendVerificationEmail';
