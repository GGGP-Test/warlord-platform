import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

/**
 * Get company profile extraction status
 * Used by frontend to poll for verification completion
 */
export const getCompanyProfile = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      res.status(400).json({ success: false, error: 'userId is required' });
      return;
    }

    const db = admin.firestore();
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    const userData = userDoc.data();

    res.status(200).json({
      success: true,
      email_verified: userData?.email_verified || false,
      domain_verified: userData?.domain_verified || false,
      company_profile: userData?.company_profile || null,
    });
  } catch (error) {
    console.error('getCompanyProfile error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});
