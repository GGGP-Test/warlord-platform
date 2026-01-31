import * as sgMail from '@sendgrid/mail';

// Initialize SendGrid
const apiKey = process.env.SENDGRID_API_KEY;
if (apiKey) {
  sgMail.setApiKey(apiKey);
}

/**
 * Send magic link verification email
 * Cost: EXPENSIVE ($0.001 per email via SendGrid)
 */
export async function sendMagicLink(to: string, magicLink: string): Promise<void> {
  if (!apiKey) {
    console.warn('SendGrid API key not configured - email not sent');
    throw new Error('Email service not configured');
  }

  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL || 'noreply@warlord.ai',
    subject: 'Verify your email - WARLORD',
    text: `Click this link to verify your email: ${magicLink}\n\nThis link expires in 24 hours.`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0F172A; color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 30px; background: #38BDF8; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>WARLORD</h1>
            <p>Supplier Intelligence Platform</p>
          </div>
          <div class="content">
            <h2>Verify Your Email</h2>
            <p>Click the button below to verify your email address and continue your onboarding:</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${magicLink}" class="button">Verify Email</a>
            </p>
            <p style="color: #666; font-size: 14px;">
              Or copy and paste this link into your browser:<br>
              <a href="${magicLink}">${magicLink}</a>
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              This link expires in 24 hours.
            </p>
          </div>
          <div class="footer">
            <p>If you didn't request this email, you can safely ignore it.</p>
            <p>&copy; 2026 WARLORD. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`Magic link sent to ${to}`);
  } catch (error) {
    console.error('SendGrid error:', error);
    throw error;
  }
}
