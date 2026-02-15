import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';
import { sendVerificationEmail } from './utils/email';

const PENDING_TTL_MS = 24 * 60 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_RESENDS = 5;
const VERIFY_REDIRECT_BASE = process.env.SIGNUP_REDIRECT_BASE_URL || 'https://site--warlord-platform--vz4ftkwrzdfs.code.run';

const PERSONAL_DOMAINS = new Set([
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
  'aol.com', 'icloud.com', 'mail.com', 'protonmail.com',
  'yandex.com', 'zoho.com', 'gmx.com', 'inbox.com',
  'googlemail.com', 'ymail.com', 'live.com', 'msn.com',
  'me.com', 'mac.com', 'pm.me', 'fastmail.com', 'hey.com',
]);

function setCors(res: functions.Response<any>) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
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

async function checkDomainAvailability(db: admin.firestore.Firestore, email: string) {
  if (!isBusinessEmail(email)) {
    return { ok: false as const, code: 'INVALID_EMAIL', status: 400 };
  }

  const domain = extractDomain(email)!;
  const claimRef = db.collection('domainClaims').doc(domain);
  const claimSnap = await claimRef.get();

  if (!claimSnap.exists) return { ok: true as const, domain };

  const claim = claimSnap.data() || {};
  const status = String(claim.status || '').toLowerCase();
  const pendingExpiresAt = claim.pendingExpiresAt?.toDate?.();

  if (status === 'verified') {
    return { ok: false as const, code: 'DOMAIN_TAKEN', status: 409 };
  }

  if (status === 'pending' && pendingExpiresAt && pendingExpiresAt.getTime() > Date.now()) {
    return { ok: false as const, code: 'PENDING', status: 409 };
  }

  return { ok: true as const, domain };
}

export const checkDomain = functions.https.onRequest(async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return void res.status(204).send('');
  if (req.method !== 'POST') return void res.status(405).json({ ok: false, code: 'METHOD_NOT_ALLOWED' });

  const email = String(req.body?.email || '').trim().toLowerCase();
  const db = admin.firestore();

  const result = await checkDomainAvailability(db, email);
  if (!result.ok) {
    return void res.status(result.status).json({ ok: false, code: result.code });
  }

  return void res.status(200).json({ ok: true });
});

export const startSignup = functions.https.onRequest(async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return void res.status(204).send('');
  if (req.method !== 'POST') return void res.status(405).json({ ok: false, code: 'METHOD_NOT_ALLOWED' });

  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const provider = req.body?.provider === 'google' ? 'google' : 'password';
    const password = provider === 'password' ? String(req.body?.password || '') : null;

    if (!email) return void res.status(400).json({ ok: false, code: 'EMAIL_REQUIRED' });
    if (!isBusinessEmail(email)) return void res.status(400).json({ ok: false, code: 'INVALID_EMAIL' });
    if (provider === 'password' && (!password || password.length < 6)) {
      return void res.status(400).json({ ok: false, code: 'INVALID_PASSWORD' });
    }

    const db = admin.firestore();
    const domain = extractDomain(email)!;
    const pendingId = crypto.randomUUID();
    const token = crypto.randomBytes(32).toString('hex');
    const tokenDigest = hashToken(token);
    const now = Date.now();
    const expiresAt = admin.firestore.Timestamp.fromMillis(now + PENDING_TTL_MS);
    const pendingRef = db.collection('pendingSignups').doc(pendingId);
    const claimRef = db.collection('domainClaims').doc(domain);

    const passwordData = provider === 'password' && password ? hashPassword(password) : null;

    await db.runTransaction(async (tx) => {
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
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        requestIp: req.ip || null,
      });

      tx.set(claimRef, {
        domain,
        status: 'pending',
        pendingId,
        pendingBy: email,
        pendingExpiresAt: expiresAt,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
    });

    await sendVerificationEmail(email, buildVerifyLink(pendingId, token));

    return void res.status(200).json({ ok: true, pendingId });
  } catch (error) {
    const code = error instanceof Error ? error.message : 'INTERNAL_ERROR';
    if (code === 'DOMAIN_TAKEN' || code === 'PENDING') {
      return void res.status(409).json({ ok: false, code });
    }
    console.error('startSignup error:', error);
    return void res.status(500).json({ ok: false, code: 'INTERNAL_ERROR' });
  }
});

export const resendSignup = functions.https.onRequest(async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return void res.status(204).send('');
  if (req.method !== 'POST') return void res.status(405).json({ ok: false, code: 'METHOD_NOT_ALLOWED' });

  try {
    const pendingId = String(req.body?.pendingId || '').trim();
    if (!pendingId) return void res.status(400).json({ ok: false, code: 'PENDING_ID_REQUIRED' });

    const db = admin.firestore();
    const ref = db.collection('pendingSignups').doc(pendingId);
    const snap = await ref.get();

    if (!snap.exists) return void res.status(404).json({ ok: false, code: 'NOT_FOUND' });

    const data = snap.data()!;
    if (data.status !== 'pending') return void res.status(409).json({ ok: false, code: 'ALREADY_VERIFIED' });

    const lastResendAt = data.lastResendAt?.toDate?.();
    if (lastResendAt && Date.now() - lastResendAt.getTime() < RESEND_COOLDOWN_MS) {
      return void res.status(429).json({ ok: false, code: 'RATE_LIMITED' });
    }

    const resendCount = Number(data.resendCount || 0);
    if (resendCount >= MAX_RESENDS) {
      return void res.status(429).json({ ok: false, code: 'MAX_RESENDS_REACHED' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenDigest = hashToken(token);
    await ref.update({
      tokenHash: tokenDigest,
      tokenExpiresAt: admin.firestore.Timestamp.fromMillis(Date.now() + PENDING_TTL_MS),
      resendCount: resendCount + 1,
      lastResendAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await sendVerificationEmail(data.email, buildVerifyLink(pendingId, token));

    return void res.status(200).json({ ok: true });
  } catch (error) {
    console.error('resendSignup error:', error);
    return void res.status(500).json({ ok: false, code: 'INTERNAL_ERROR' });
  }
});

export const verifySignup = functions.https.onRequest(async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return void res.status(204).send('');
  if (req.method !== 'GET') return void res.status(405).json({ ok: false, code: 'METHOD_NOT_ALLOWED' });

  const pendingId = String(req.query.pendingId || '').trim();
  const token = String(req.query.token || '').trim();

  if (!pendingId || !token) {
    return void res.status(400).send('Missing verification params');
  }

  const db = admin.firestore();
  const pendingRef = db.collection('pendingSignups').doc(pendingId);

  try {
    const pendingSnap = await pendingRef.get();
    if (!pendingSnap.exists) return void res.status(400).send('Invalid verification link');

    const pending = pendingSnap.data()!;
    const tokenHashValue = hashToken(token);
    const tokenExpiresAt = pending.tokenExpiresAt?.toDate?.();

    if (pending.status !== 'pending' || pending.tokenHash !== tokenHashValue || !tokenExpiresAt || tokenExpiresAt.getTime() < Date.now()) {
      return void res.status(400).send('Invalid or expired verification link');
    }

    const email = pending.email as string;
    const domain = pending.domain as string;

    let uid: string;
    try {
      const existing = await admin.auth().getUserByEmail(email);
      uid = existing.uid;
      await admin.auth().updateUser(uid, { emailVerified: true });
    } catch {
      const createPayload: admin.auth.CreateRequest = {
        email,
        emailVerified: true,
      };
      if (pending.provider === 'password' && pending.passwordHash && pending.passwordSalt) {
        createPayload.password = crypto.randomBytes(24).toString('base64url');
      } else {
        createPayload.password = crypto.randomBytes(24).toString('base64url');
      }
      const created = await admin.auth().createUser(createPayload);
      uid = created.uid;
    }

    const companyRef = db.collection('companies').doc(domain);
    const claimRef = db.collection('domainClaims').doc(domain);

    await db.runTransaction(async (tx) => {
      tx.update(pendingRef, {
        status: 'verified',
        verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      tx.set(companyRef, {
        domain,
        ownerEmail: email,
        ownerUid: uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

      tx.set(claimRef, {
        domain,
        status: 'verified',
        ownerEmail: email,
        ownerUid: uid,
        verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
    });

    const redirectUrl = `${VERIFY_REDIRECT_BASE}/auth/login/?email=${encodeURIComponent(email)}&verified=1`;
    return void res.redirect(302, redirectUrl);
  } catch (error) {
    console.error('verifySignup error:', error);
    return void res.status(500).send('Verification failed');
  }
});
