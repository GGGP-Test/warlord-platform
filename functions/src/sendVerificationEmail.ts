import * as functions from 'firebase-functions';
import { sendVerificationEmail as sendVerificationEmailMail } from './utils/email';

/**
 * Callable Cloud Function: send signup verification email via Resend.
 * Called from the signup page after saving pendingVerifications to Firestore.
 * Request: { email: string, verificationLink: string }
 */
export const sendVerificationEmail = functions.https.onCall(
  async (data, context) => {
    const { email, verificationLink } = data ?? {};

    if (!email || typeof email !== 'string' || !verificationLink || typeof verificationLink !== 'string') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing or invalid email or verificationLink'
      );
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid email format');
    }

    try {
      await sendVerificationEmailMail(email, verificationLink);
      return { success: true };
    } catch (error) {
      console.error('sendVerificationEmail failed:', error);
      throw new functions.https.HttpsError(
        'internal',
        error instanceof Error ? error.message : 'Failed to send verification email'
      );
    }
  }
);
