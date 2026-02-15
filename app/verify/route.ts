import crypto from 'crypto';
import { FieldValue } from 'firebase-admin/firestore';
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/server/firebaseAdmin';

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

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}

export async function POST() {
  return withCors(NextResponse.json({ ok: false, code: 'METHOD_NOT_ALLOWED' }, { status: 405 }));
}

export async function GET(req: NextRequest) {
  const pendingId = String(req.nextUrl.searchParams.get('pendingId') || '').trim();
  const token = String(req.nextUrl.searchParams.get('token') || '').trim();

  if (!pendingId || !token) {
    return withCors(new NextResponse('Missing verification params', { status: 400 }));
  }

  const pendingRef = adminDb.collection('pendingSignups').doc(pendingId);

  try {
    const pendingSnap = await pendingRef.get();
    if (!pendingSnap.exists) return withCors(new NextResponse('Invalid verification link', { status: 400 }));

    const pending = pendingSnap.data()!;
    const tokenHashValue = hashToken(token);
    const tokenExpiresAt = pending.tokenExpiresAt?.toDate?.();

    if (pending.status !== 'pending' || pending.tokenHash !== tokenHashValue || !tokenExpiresAt || tokenExpiresAt.getTime() < Date.now()) {
      return withCors(new NextResponse('Invalid or expired verification link', { status: 400 }));
    }

    const email = String(pending.email);
    const domain = String(pending.domain);

    let uid: string;
    try {
      const existing = await adminAuth.getUserByEmail(email);
      uid = existing.uid;
      await adminAuth.updateUser(uid, { emailVerified: true });
    } catch {
      const created = await adminAuth.createUser({
        email,
        emailVerified: true,
        password: crypto.randomBytes(24).toString('base64url'),
      });
      uid = created.uid;
    }

    const companyRef = adminDb.collection('companies').doc(domain);
    const claimRef = adminDb.collection('domainClaims').doc(domain);

    await adminDb.runTransaction(async (tx) => {
      tx.update(pendingRef, {
        status: 'verified',
        verifiedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      tx.set(companyRef, {
        domain,
        ownerEmail: email,
        ownerUid: uid,
        createdAt: FieldValue.serverTimestamp(),
      }, { merge: true });

      tx.set(claimRef, {
        domain,
        status: 'verified',
        ownerEmail: email,
        ownerUid: uid,
        verifiedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
    });

    const redirectUrl = `${VERIFY_REDIRECT_BASE}/auth/login/?email=${encodeURIComponent(email)}&verified=1`;
    return withCors(NextResponse.redirect(redirectUrl, { status: 302 }));
  } catch (error) {
    console.error('verifySignup error:', error);
    return withCors(new NextResponse('Verification failed', { status: 500 }));
  }
}
