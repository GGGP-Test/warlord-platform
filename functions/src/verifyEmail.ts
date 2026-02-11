import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';

/**
 * Verify email token from magic link
 * Marks email as verified and triggers domain verification
 */
export const verifyEmail = functions.https.onRequest(async (req, res) => {
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
    const { token } = req.body;

    if (!token || typeof token !== 'string') {
      res.status(400).json({ success: false, error: 'Token is required' });
      return;
    }

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const db = admin.firestore();
    
    // Find user with this token
    const usersSnapshot = await db
      .collection('users')
      .where('verification_token.token', '==', hashedToken)
      .where('verification_token.used', '==', false)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      res.status(400).json({ success: false, error: 'Invalid or expired token' });
      return;
    }

    const userDoc = usersSnapshot.docs[0];
    const userData = userDoc.data();

    // Check if token is expired
    const expiresAt = userData.verification_token.expires_at.toDate();
    if (expiresAt < new Date()) {
      res.status(400).json({ success: false, error: 'Token has expired' });
      return;
    }

    // Mark email as verified and token as used
    await userDoc.ref.update({
      email_verified: true,
      'verification_token.used': true,
      email_verified_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Trigger domain verification (async)
    const domain = userData.email.split('@')[1];
    // In production, this would be a Cloud Function trigger or pub/sub
    // For now, we'll call it directly in the background
    admin.firestore().collection('verification_queue').add({
      userId: userDoc.id,
      domain,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      userId: userDoc.id,
      email: userData.email,
    });
  } catch (error) {
    console.error('verifyEmail error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});
