import { Resend } from 'resend';
import * as functions from 'firebase-functions';

// API key: env (local / GCP env) or Firebase config (set by GitHub Actions before deploy)
function getResendApiKey(): string | undefined {
  return process.env.RESEND_API_KEY || (functions.config().resend?.api_key as string | undefined);
}

const apiKey = getResendApiKey();
const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const fromName = process.env.RESEND_FROM_NAME || 'WARLORD';

const resend = apiKey ? new Resend(apiKey) : null;

/**
 * Build the standard verification email HTML (shared by magic link and signup verification).
 */
function verificationEmailHtml(verificationLink: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0F172A; color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f9fafb; }
        .button { display: inline-block; padding: 12px 30px; background: #38BDF8; color: white !important; text-decoration: none; border-radius: 6px; font-weight: bold; }
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
          <p>Click the button below to verify your email address and continue:</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" class="button">Verify Email</a>
          </p>
          <p style="color: #666; font-size: 14px;">
            Or copy and paste this link into your browser:<br>
            <a href="${verificationLink}">${verificationLink}</a>
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
  `;
}

/**
 * Send magic link verification email (used by submitEmail flow).
 * Uses Resend with RESEND_API_KEY.
 */
export async function sendMagicLink(to: string, magicLink: string): Promise<void> {
  if (!resend || !apiKey) {
    console.warn('Resend API key not configured - email not sent');
    throw new Error('Email service not configured');
  }

  const { error } = await resend.emails.send({
    from: `${fromName} <${fromEmail}>`,
    to: [to],
    subject: 'Verify your email - WARLORD',
    text: `Click this link to verify your email: ${magicLink}\n\nThis link expires in 24 hours.`,
    html: verificationEmailHtml(magicLink),
  });

  if (error) {
    console.error('Resend error:', error);
    throw new Error(error.message || 'Failed to send email');
  }
  console.log(`Verification email sent to ${to}`);
}

/**
 * Send signup verification email (used by sendVerificationEmail callable).
 * Uses Resend with RESEND_API_KEY.
 */
export async function sendVerificationEmail(to: string, verificationLink: string): Promise<void> {
  if (!resend || !apiKey) {
    console.warn('Resend API key not configured - email not sent');
    throw new Error('Email service not configured');
  }

  const { error } = await resend.emails.send({
    from: `${fromName} <${fromEmail}>`,
    to: [to],
    subject: 'Verify your email - WARLORD',
    text: `Click this link to verify your email: ${verificationLink}\n\nThis link expires in 24 hours.`,
    html: verificationEmailHtml(verificationLink),
  });

  if (error) {
    console.error('Resend error:', error);
    throw new Error(error.message || 'Failed to send verification email');
  }
  console.log(`Signup verification email sent to ${to}`);
}
