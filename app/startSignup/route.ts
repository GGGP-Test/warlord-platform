import crypto from 'crypto';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/server/firebaseAdmin';
import { sendVerificationEmail } from '@/lib/server/email';

const PENDING_TTL_MS = 24 * 60 * 60 * 1000;
const VERIFY_REDIRECT_BASE = process.env.SIGNUP_REDIRECT_BASE_URL || 'http://localhost:3000';

const PERSONAL_DOMAINS = new Set([
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
  'aol.com', 'icloud.com', 'mail.com', 'protonmail.com',
  'yandex.com', 'zoho.com', 'gmx.com', 'inbox.com',
  'googlemail.com', 'ymail.com', 'live.com', 'msn.com',
  'me.com', 'mac.com', 'pm.me', 'fastmail.com', 'hey.com',
]);

function withCors(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

function extractDomain(email: string): string | null {
  const match = String(email || '').trim().toLowerCase().match(/@([^@\s]+)$/);
  return match ? match[1] : null;
}

function isBusinessEmail(email: string): boolean {
  const domain = extractDomain(email);
  return Boolean(domain && !PERSONAL_DOMAINS.has(domain));
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

function buildVerifyLink(pendingId: string, token: string): string {
  return `${VERIFY_REDIRECT_BASE}/verify?pendingId=${encodeURIComponent(pendingId)}&token=${encodeURIComponent(token)}`;
}

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}

export async function GET() {
  return withCors(NextResponse.json({ ok: false, code: 'METHOD_NOT_ALLOWED' }, { status: 405 }));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body?.email || '').trim().toLowerCase();
    const provider = body?.provider === 'google' ? 'google' : 'password';
    const password = provider === 'password' ? String(body?.password || '') : null;

    if (!email) return withCors(NextResponse.json({ ok: false, code: 'EMAIL_REQUIRED' }, { status: 400 }));
    if (!isBusinessEmail(email)) return withCors(NextResponse.json({ ok: false, code: 'INVALID_EMAIL' }, { status: 400 }));
    if (provider === 'password' && (!password || password.length < 6)) {
      return withCors(NextResponse.json({ ok: false, code: 'INVALID_PASSWORD' }, { status: 400 }));
    }

    const domain = extractDomain(email)!;
    const pendingId = crypto.randomUUID();
    const token = crypto.randomBytes(32).toString('hex');
    const tokenDigest = hashToken(token);
    const now = Date.now();
    const expiresAt = Timestamp.fromMillis(now + PENDING_TTL_MS);
    const pendingRef = adminDb.collection('pendingSignups').doc(pendingId);
    const claimRef = adminDb.collection('domainClaims').doc(domain);

    const passwordData = provider === 'password' && password ? hashPassword(password) : null;

    await adminDb.runTransaction(async (tx) => {
      const claimSnap = await tx.get(claimRef);
      if (claimSnap.exists) {
        const data = claimSnap.data() || {};
        const status = String(data.status || '').toLowerCase();
        const claimExpiry = data.pendingExpiresAt?.toDate?.();
        if (status === 'verified') throw new Error('DOMAIN_TAKEN');
        if (status === 'pending' && claimExpiry && claimExpiry.getTime() > Date.now()) {
          throw new Error('PENDING');
        }
      }

      tx.set(pendingRef, {
        email,
        domain,
        provider,
        passwordHash: passwordData?.hash || null,
        passwordSalt: passwordData?.salt || null,
        tokenHash: tokenDigest,
        tokenExpiresAt: expiresAt,
        status: 'pending',
        resendCount: 0,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        requestIp: req.ip || null,
      });

      tx.set(claimRef, {
        domain,
        status: 'pending',
        pendingId,
        pendingBy: email,
        pendingExpiresAt: expiresAt,
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
    });

    await sendVerificationEmail(email, buildVerifyLink(pendingId, token));

    return withCors(NextResponse.json({ ok: true, pendingId }, { status: 200 }));
  } catch (error) {
    const code = error instanceof Error ? error.message : 'INTERNAL_ERROR';
    if (code === 'DOMAIN_TAKEN' || code === 'PENDING') {
      return withCors(NextResponse.json({ ok: false, code }, { status: 409 }));
    }

    console.error('startSignup error:', error);
    return withCors(NextResponse.json({ ok: false, code: 'INTERNAL_ERROR' }, { status: 500 }));
  }
}
