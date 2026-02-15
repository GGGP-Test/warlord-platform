import crypto from 'crypto';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/server/firebaseAdmin';
import { sendVerificationEmail } from '@/lib/server/email';

const PENDING_TTL_MS = 24 * 60 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_RESENDS = 5;
const VERIFY_REDIRECT_BASE = process.env.SIGNUP_REDIRECT_BASE_URL || 'http://localhost:3000';

function withCors(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
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
    const pendingId = String(body?.pendingId || '').trim();
    if (!pendingId) return withCors(NextResponse.json({ ok: false, code: 'PENDING_ID_REQUIRED' }, { status: 400 }));

    const ref = adminDb.collection('pendingSignups').doc(pendingId);
    const snap = await ref.get();

    if (!snap.exists) return withCors(NextResponse.json({ ok: false, code: 'NOT_FOUND' }, { status: 404 }));

    const data = snap.data()!;
    if (data.status !== 'pending') return withCors(NextResponse.json({ ok: false, code: 'ALREADY_VERIFIED' }, { status: 409 }));

    const lastResendAt = data.lastResendAt?.toDate?.();
    if (lastResendAt && Date.now() - lastResendAt.getTime() < RESEND_COOLDOWN_MS) {
      return withCors(NextResponse.json({ ok: false, code: 'RATE_LIMITED' }, { status: 429 }));
    }

    const resendCount = Number(data.resendCount || 0);
    if (resendCount >= MAX_RESENDS) {
      return withCors(NextResponse.json({ ok: false, code: 'MAX_RESENDS_REACHED' }, { status: 429 }));
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenDigest = hashToken(token);

    await ref.update({
      tokenHash: tokenDigest,
      tokenExpiresAt: Timestamp.fromMillis(Date.now() + PENDING_TTL_MS),
      resendCount: resendCount + 1,
      lastResendAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    await sendVerificationEmail(String(data.email), buildVerifyLink(pendingId, token));

    return withCors(NextResponse.json({ ok: true }, { status: 200 }));
  } catch (error) {
    console.error('resendSignup error:', error);
    return withCors(NextResponse.json({ ok: false, code: 'INTERNAL_ERROR' }, { status: 500 }));
  }
}
