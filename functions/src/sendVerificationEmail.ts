import * as functions from 'firebase-functions';
import { sendVerificationEmail as sendVerificationEmailMail, getAppUrl } from './utils/email';
import { validateEmail, checkMXRecords } from './utils/emailValidation';
import cors from 'cors';

const corsHandler = cors({ origin: true });

/**
 * HTTP Request Cloud Function: send signup verification email via Resend.
 * Called from the signup page after saving pendingVerifications to Firestore.
 * Request Body: { email: string, verificationLink?: string, verificationCode?: string }
 */
export const sendVerificationEmail = functions.https.onRequest(async (req, res) => {
  return corsHandler(req, res, async () => {
    // Only allow POST requests
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    let { email, verificationCode } = req.body ?? {};

    console.log(`sendVerificationEmail called for ${email}`);

    if (!email || typeof email !== 'string') {
      res.status(400).json({ error: 'Missing or invalid email' });
      return;
    }

    if (!verificationCode || typeof verificationCode !== 'string') {
      res.status(400).json({ error: 'Missing or invalid verificationCode' });
      return;
    }

    // Construct verification link on backend for security
    const verificationLink = `${getAppUrl()}/auth/verify?code=${verificationCode}&email=${encodeURIComponent(email)}`;

    // Validation cascade
    // 1. Format and provider check
    if (!validateEmail(email)) {
      res.status(400).json({ error: 'Invalid email format or personal provider' });
      return;
    }

    // 2. DNS MX record check
    const domain = email.split('@')[1];
    try {
      const mxValid = await checkMXRecords(domain);
      if (!mxValid) {
        res.status(400).json({ error: 'Invalid domain - no mail server found' });
        return;
      }
    } catch (mxError) {
      console.warn('MX check failed, proceeding anyway:', mxError);
    }

    try {
      await sendVerificationEmailMail(email, verificationLink);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('sendVerificationEmail failed:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Failed to send verification email'
      });
    }
  });
});
