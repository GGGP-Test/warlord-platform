import * as functions from 'firebase-functions';
import { sendVerificationEmail as sendVerificationEmailMail } from './utils/email';

/**
 * Callable Cloud Function: send signup verification email via Resend.
 * Called from the signup page after saving pendingVerifications to Firestore.
 * Request: { email: string, verificationLink: string }
 */
export const sendVerificationEmail = functions.https.onCall(
  async (data, context) => {
    let { email, verificationLink, verificationCode } = data ?? {};

    // Support both verificationLink and verificationCode for backward compatibility
    if (!verificationLink && verificationCode) {
      verificationLink = `https://warlord-1cbe3.web.app/auth/verify.html?code=${verificationCode}&email=${encodeURIComponent(email)}`;
    }

    if (!email || typeof email !== 'string') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing or invalid email'
      );
    }

    if (!verificationLink || typeof verificationLink !== 'string') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing or invalid verificationLink'
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
