const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Resend } = require('resend');

admin.initializeApp();

/**
 * Cloud Function to send verification email
 * Triggered by HTTP POST request from signup page
 */
exports.sendVerificationEmail = functions.https.onCall(async (data, context) => {
  try {
    const { email, verificationCode } = data;

    // Validate input
    if (!email || !verificationCode) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Email and verification code are required'
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Invalid email format'
      );
    }

    // Get Resend API key from Firebase config
    const resendApiKey = functions.config().resend.api_key;
    
    if (!resendApiKey) {
      console.error('Resend API key not configured');
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Email service not configured'
      );
    }

    // Initialize Resend with API key
    const resend = new Resend(resendApiKey);

    // Construct verification link
    const verificationLink = `https://warlord-1cbe3.web.app/auth/verify.html?code=${verificationCode}&email=${encodeURIComponent(email)}`;

    // Send email via Resend
    const { data: resendData, error } = await resend.emails.send({
      from: 'Galactly <onboarding@resend.dev>', // Use resend.dev for testing, replace with your domain later
      to: [email],
      subject: 'Verify Your Email - Galactly',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f5f7fa;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="padding: 48px 48px 24px; text-align: center;">
                      <div style="width: 80px; height: 80px; margin: 0 auto 24px; background: linear-gradient(135deg, #3B5998 0%, #2E4A7C 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 40px; color: white;">✓</span>
                      </div>
                      <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #1a1d29; letter-spacing: -0.5px;">Verify Your Email</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 0 48px 48px;">
                      <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #64748b;">
                        Welcome to Galactly! Please verify your email address by clicking the button below:
                      </p>
                      
                      <!-- Button -->
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td align="center" style="padding: 16px 0;">
                            <a href="${verificationLink}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #3B5998 0%, #2E4A7C 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(59, 89, 152, 0.3);">
                              Verify Email Address
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 24px 0 0; font-size: 14px; line-height: 1.6; color: #94a3b8;">
                        Or copy and paste this link into your browser:<br>
                        <a href="${verificationLink}" style="color: #3B5998; word-break: break-all;">${verificationLink}</a>
                      </p>
                      
                      <p style="margin: 24px 0 0; font-size: 14px; line-height: 1.6; color: #94a3b8;">
                        This link will expire in 24 hours.
                      </p>
                      
                      <p style="margin: 24px 0 0; font-size: 14px; line-height: 1.6; color: #94a3b8;">
                        If you didn't create an account with Galactly, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 24px 48px; background-color: #f8fafc; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px;">
                      <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
                        © 2026 Galactly. All rights reserved.
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Failed to send email: ' + error.message
      );
    }

    console.log('Email sent successfully:', resendData);

    return {
      success: true,
      message: 'Verification email sent successfully',
      emailId: resendData.id
    };

  } catch (error) {
    console.error('Error in sendVerificationEmail:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError(
      'internal',
      'An unexpected error occurred: ' + error.message
    );
  }
});
