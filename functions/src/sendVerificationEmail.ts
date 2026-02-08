import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as sgMail from '@sendgrid/mail';

// Initialize SendGrid (API key will be set via environment variable)
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

// Your verified sender email from SendGrid
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@galactly.com';
const APP_URL = process.env.APP_URL || 'https://site--warlord-platform--vz4ftkwrzdfs.code.run';

interface PendingVerification {
  email: string;
  password: string;
  verificationCode: string;
  createdAt: admin.firestore.Timestamp;
  expiresAt: admin.firestore.Timestamp;
}

/**
 * Cloud Function that triggers when a new document is created in pendingVerifications
 * Sends verification email to the user
 */
export const onPendingVerificationCreated = functions.firestore
  .document('pendingVerifications/{email}')
  .onCreate(async (snap, context) => {
    const data = snap.data() as PendingVerification;
    const { email, verificationCode } = data;

    // Construct verification link
    const verificationLink = `${APP_URL}/auth/verify?code=${verificationCode}&email=${encodeURIComponent(email)}`;

    console.log(`Sending verification email to: ${email}`);
    console.log(`Verification link: ${verificationLink}`);

    // If SendGrid is not configured, just log the link
    if (!SENDGRID_API_KEY) {
      console.warn('⚠️ SENDGRID_API_KEY not set. Email not sent.');
      console.log(`📧 Verification link for ${email}: ${verificationLink}`);
      return null;
    }

    // Email template
    const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #3B5998 0%, #2E4A7C 100%);">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Verify Your Email</h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #2d3748; font-size: 16px; line-height: 1.6;">
                Hi there! 👋
              </p>
              <p style="margin: 0 0 20px; color: #2d3748; font-size: 16px; line-height: 1.6;">
                Thanks for signing up for <strong>Galactly</strong>! We're excited to have you on board.
              </p>
              <p style="margin: 0 0 30px; color: #2d3748; font-size: 16px; line-height: 1.6;">
                To complete your registration, please verify your email address by clicking the button below:
              </p>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${verificationLink}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #3B5998 0%, #2E4A7C 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(59, 89, 152, 0.3);">
                      Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 20px; color: #718096; font-size: 14px; line-height: 1.6;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin: 0 0 20px; padding: 12px; background-color: #f7fafc; border-radius: 6px; color: #4a5568; font-size: 13px; word-break: break-all; font-family: monospace;">
                ${verificationLink}
              </p>
              
              <p style="margin: 30px 0 0; color: #718096; font-size: 14px; line-height: 1.6;">
                This link will expire in <strong>24 hours</strong>.
              </p>
              <p style="margin: 10px 0 0; color: #718096; font-size: 14px; line-height: 1.6;">
                If you didn't create an account with us, you can safely ignore this email.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f7fafc; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #a0aec0; font-size: 12px; line-height: 1.5; text-align: center;">
                © ${new Date().getFullYear()} Galactly. All rights reserved.
              </p>
              <p style="margin: 10px 0 0; color: #a0aec0; font-size: 12px; line-height: 1.5; text-align: center;">
                Need help? Contact us at <a href="mailto:support@galactly.com" style="color: #3B5998; text-decoration: none;">support@galactly.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const emailText = `
Hi there!

Thanks for signing up for Galactly!

To complete your registration, please verify your email address by clicking this link:
${verificationLink}

This link will expire in 24 hours.

If you didn't create an account with us, you can safely ignore this email.

© ${new Date().getFullYear()} Galactly. All rights reserved.
    `;

    // Send email via SendGrid
    const msg = {
      to: email,
      from: FROM_EMAIL,
      subject: '✉️ Verify your email address - Galactly',
      text: emailText,
      html: emailHtml,
    };

    try {
      await sgMail.send(msg);
      console.log(`✅ Verification email sent successfully to ${email}`);
      return null;
    } catch (error: any) {
      console.error('❌ Error sending verification email:', error);
      if (error.response) {
        console.error('SendGrid error:', error.response.body);
      }
      throw new functions.https.HttpsError(
        'internal',
        'Failed to send verification email',
        error.message
      );
    }
  });

/**
 * Scheduled function to clean up expired verifications
 * Runs every day at midnight
 */
export const cleanupExpiredVerifications = functions.pubsub
  .schedule('0 0 * * *')
  .timeZone('UTC')
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();
    const db = admin.firestore();

    try {
      // Query expired verifications
      const expiredDocs = await db
        .collection('pendingVerifications')
        .where('expiresAt', '<', now)
        .get();

      if (expiredDocs.empty) {
        console.log('No expired verifications to clean up');
        return null;
      }

      // Delete expired verifications
      const batch = db.batch();
      expiredDocs.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log(`✅ Cleaned up ${expiredDocs.size} expired verifications`);
      return null;
    } catch (error) {
      console.error('❌ Error cleaning up expired verifications:', error);
      return null;
    }
  });
