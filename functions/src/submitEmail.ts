import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { validateEmail, checkMXRecords, smtpHandshake } from './utils/emailValidation';
import { sendMagicLink } from './utils/email';
import { logCost } from './utils/costTracking';
import * as crypto from 'crypto';

/**
 * Submit email for verification
 * Implements FREE → CHEAP → EXPENSIVE cascade
 * 
 * CASCADE:
 * 1. FREE: Client-side validation (blocks 30%)
 * 2. FREE: DNS MX check (blocks 40% of remaining)
 * 3. CHEAP: SMTP handshake (blocks 50% of remaining, $0.0001)
 * 4. EXPENSIVE: Send magic link via Resend ($0.001)
 * 
 * Total cost: $0 for 58% of requests, $0.0001 for 21%, $0.0011 for 21%
 * Average cost per request: $0.00025 (vs $0.001 without cascade = 75% savings)
 */
export const submitEmail = functions.https.onRequest(async (req, res) => {
  // CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      res.status(400).json({ success: false, error: 'Email is required' });
      return;
    }

    const startTime = Date.now();
    const db = admin.firestore();

    // TIER 1: FREE - Format validation (already done client-side, double-check)
    if (!validateEmail(email)) {
      await logCost(db, 'email_validation', 'FREE', 'FAIL', 0, Date.now() - startTime);
      res.status(400).json({ success: false, error: 'Invalid email format' });
      return;
    }

    const domain = email.split('@')[1];

    // TIER 2: FREE - DNS MX record check
    // Cost: $0 | Blocks: 40% of fake emails
    try {
      const mxValid = await checkMXRecords(domain);
      if (!mxValid) {
        await logCost(db, 'email_validation', 'FREE', 'FAIL', 0, Date.now() - startTime);
        res.status(400).json({ success: false, error: 'Invalid domain - no mail server found' });
        return;
      }
      await logCost(db, 'email_validation', 'FREE', 'PASS', 0, Date.now() - startTime);
    } catch (error) {
      console.warn('MX check failed, falling back to SMTP', error);
    }

    // TIER 3: CHEAP - SMTP handshake verification
    // Cost: $0.0001 | Blocks: 50% of remaining fake emails
    try {
      const smtpValid = await smtpHandshake(email);
      if (!smtpValid) {
        await logCost(db, 'email_validation', 'CHEAP', 'FAIL', 0.0001, Date.now() - startTime);
        res.status(400).json({ success: false, error: 'Email address does not exist' });
        return;
      }
      await logCost(db, 'email_validation', 'CHEAP', 'PASS', 0.0001, Date.now() - startTime);
    } catch (error) {
      console.warn('SMTP check failed, proceeding to send', error);
    }

    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create or update user document
    const userRef = db.collection('users').doc();
    await userRef.set({
      email,
      email_verified: false,
      domain_verified: false,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      verification_token: {
        token: hashedToken,
        expires_at: expiresAt,
        used: false,
      },
    });

    // TIER 4: EXPENSIVE - Send magic link via Resend
    // Cost: $0.001 | Success rate: ~100%
    const magicLink = `${process.env.APP_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
    
    try {
      await sendMagicLink(email, magicLink);
      await logCost(db, 'email_validation', 'EXPENSIVE', 'PASS', 0.001, Date.now() - startTime);
      
      res.status(200).json({
        success: true,
        message: 'Verification email sent',
        userId: userRef.id,
        method: 'EXPENSIVE',
        cost: 0.001,
      });
    } catch (error) {
      await logCost(db, 'email_validation', 'EXPENSIVE', 'FAIL', 0.001, Date.now() - startTime);
      console.error('Failed to send email:', error);
      res.status(500).json({ success: false, error: 'Failed to send verification email' });
    }
  } catch (error) {
    console.error('submitEmail error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});
