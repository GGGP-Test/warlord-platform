import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/server/firebaseAdmin';

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

async function checkDomainAvailability(email: string) {
  if (!isBusinessEmail(email)) {
    return { ok: false as const, code: 'INVALID_EMAIL', status: 400 };
  }

  const domain = extractDomain(email)!;
  const claimRef = adminDb.collection('domainClaims').doc(domain);
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

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}

export async function GET() {
  return withCors(NextResponse.json({ ok: false, code: 'METHOD_NOT_ALLOWED' }, { status: 405 }));
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = String(body?.email || '').trim().toLowerCase();
  const result = await checkDomainAvailability(email);

  if (!result.ok) {
    return withCors(NextResponse.json({ ok: false, code: result.code }, { status: result.status }));
  }

  return withCors(NextResponse.json({ ok: true }, { status: 200 }));
}
