# WARLORD PLATFORM - COMPLETE MERGER DOCUMENTATION

**Date:** February 1, 2026  
**Purpose:** Merge warlord-frontend + warlord-backend into unified warlord-platform  
**Design Source:** Galactly premium light theme inspiration

---

## MERGER OVERVIEW

### What We're Building
A **unified, production-ready Warlord Platform** that combines:
- ✅ Premium white theme onboarding (Galactly-inspired)
- ✅ Firebase Authentication + Firestore backend
- ✅ Cloud Functions for AI validation and enrichment
- ✅ Deployed to Firebase Hosting + Cloud Run
- ✅ Connected to GCP (warlord-1cbe3 project)

### Current State
```
warlord-platform/
├── app/                    # Next.js pages (needs update)
├── components/             # React components (needs white theme)
├── functions/              # Cloud Functions (from warlord-backend)
├── lib/                    # Utilities
├── firebase.json           # Firebase config
└── docs/                   # Documentation
```

---

## DESIGN SYSTEM - WHITE PREMIUM THEME

### Inspiration Source
**From:** `galactly-monorepo-v1/docs/auth/signup/index.html`

### Core Design Principles
1. **White/Cream Base** - Clean, professional, enterprise-appropriate
2. **Glass Morphism** - Subtle backdrop-filter effects on light backgrounds
3. **Soft Gradients** - Professional blues and neutrals
4. **Smooth Animations** - 280ms transitions (not rushed like Linear)
5. **Premium Feel** - Appropriate for $2,000/month platform

### Color Palette

```css
:root {
  /* === LIGHT THEME - WARLORD PLATFORM === */
  
  /* Base Colors */
  --color-bg-primary: #FAFAFA;        /* Off-white background */
  --color-bg-secondary: #FFFFFF;      /* Pure white surfaces */
  --color-surface: #FFFFFF;           /* Cards, modals */
  --color-surface-elevated: #FEFEFE;  /* Elevated cards */
  
  /* Text Colors */
  --color-text-primary: #0A0A0A;      /* Almost black - high contrast */
  --color-text-secondary: #6B7280;    /* Muted text */
  --color-text-tertiary: #9CA3AF;     /* Labels, captions */
  
  /* Professional Blue Accents */
  --color-primary: #3B82F6;           /* Professional blue (NOT navy) */
  --color-primary-hover: #2563EB;     /* Darker on hover */
  --color-primary-light: #DBEAFE;     /* Light blue backgrounds */
  
  /* Status Colors */
  --color-success: #10B981;           /* Green */
  --color-warning: #F59E0B;           /* Amber */
  --color-error: #EF4444;             /* Red */
  --color-info: #3B82F6;              /* Blue */
  
  /* Borders & Shadows */
  --color-border: #E5E7EB;            /* Subtle borders */
  --color-border-focus: #3B82F6;      /* Focus state */
  
  /* Glass Morphism */
  --glass-bg: rgba(255, 255, 255, 0.7);
  --glass-border: rgba(0, 0, 0, 0.1);
  --glass-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  
  /* Animation Timing */
  --transition-base: 280ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Typography

```css
/* Font Stack - Premium Sans-Serif */
--font-sans: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 
             'Segoe UI', Roboto, sans-serif;

/* Sizes */
--text-xs: 13px;
--text-sm: 15px;    /* Body text - slightly larger than standard */
--text-base: 16px;  /* Default */
--text-lg: 18px;
--text-xl: 21px;
--text-2xl: 28px;   /* Section headers */
--text-3xl: 36px;   /* Page titles */

/* Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;  /* For headings */
```

---

## COMPONENT DESIGN PATTERNS

### 1. Glass Morphism Cards

```css
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  box-shadow: var(--glass-shadow);
  padding: 24px;
  transition: all var(--transition-base);
}

.glass-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  border-color: rgba(59, 130, 246, 0.2);
}
```

### 2. Premium Buttons

```css
/* Primary Action */
.btn-primary {
  background: linear-gradient(180deg, #3B82F6 0%, #2563EB 100%);
  color: #FFFFFF;
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  font-size: 15px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
  transition: all var(--transition-base);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.35);
}

/* Secondary Action */
.btn-secondary {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 500;
  transition: all var(--transition-base);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 1);
  border-color: var(--color-primary);
  transform: translateY(-1px);
}
```

### 3. Form Inputs

```css
.input-field {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 15px;
  color: var(--color-text-primary);
  transition: all var(--transition-fast);
}

.input-field:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background: #FFFFFF;
}

.input-field::placeholder {
  color: var(--color-text-tertiary);
}
```

---

## FILE STRUCTURE - POST-MERGER

```
warlord-platform/
├── public/
│   ├── auth/
│   │   ├── index.html              # Landing/router
│   │   ├── signup/
│   │   │   └── index.html          # Signup page (white theme)
│   │   ├── login/
│   │   │   └── index.html          # Login page
│   │   ├── bridge/
│   │   │   └── index.html          # Company confirmation
│   │   └── verified/
│   │       └── index.html          # Success page
│   └── dashboard/
│       └── index.html              # Main dashboard
│
├── functions/                      # Cloud Functions (from warlord-backend)
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.ts            # Authentication endpoints
│   │   │   ├── enrichment.ts      # Company enrichment
│   │   │   └── validation.ts      # Email/domain validation
│   │   ├── services/
│   │   │   ├── ai.service.ts      # OpenAI integration
│   │   │   ├── scraping.service.ts # Apify web scraping
│   │   │   └── domain.service.ts  # Domain intelligence
│   │   └── index.ts               # Main export
│   ├── package.json
│   └── tsconfig.json
│
├── app/                            # Next.js (if needed for dashboard)
├── components/                     # Shared React components
├── lib/                            # Utilities
│   ├── firebase.ts                # Firebase client config
│   └── constants.ts               # Shared constants
│
├── firebase.json                   # Firebase config
├── firestore.rules                # Security rules
├── firestore.indexes.json         # Database indexes
├── .firebaserc                    # Project config (warlord-1cbe3)
└── package.json                    # Root dependencies
```

---

## AUTHENTICATION FLOW

### Step 1: Landing/Router (`public/auth/index.html`)
```javascript
// Check authentication status
if (hasAuthToken && bridgeComplete) {
  → redirect to /dashboard/
} else if (hasAuthToken && !bridgeComplete) {
  → redirect to /auth/bridge/
} else {
  → show landing page with "Get Started" CTA
}
```

### Step 2: Signup (`public/auth/signup/index.html`)

**Design:** White theme with glass morphism

**Features:**
- Role selection (Supplier vs Buyer)
- Google OAuth (work accounts only)
- Email + Password signup
- Business email validation (block personal domains)
- AI validation (2-5 second check)
- Email verification required

**Flow:**
1. User selects role (Supplier/Buyer)
2. User enters business email
3. System checks if domain is claimed
4. If free → continue to password
5. If claimed → redirect to login
6. Create account → Send verification email
7. User verifies → Redirect to bridge

### Step 3: Bridge (`public/auth/bridge/index.html`)

**Purpose:** Company confirmation with AI-detected data

**Shows:**
- Company logo (from favicon)
- Website detected
- Primary products (up to 3, AI-extracted)
- "Is this your company?" confirmation

**Actions:**
- ✅ YES → Continue to dashboard
- ✖️ NO → Human call scheduling (Calendly)
- Edit products (add/remove)

### Step 4: Verified (`public/auth/verified/index.html`)

**Design:** Success animation with checkmark

**Message:** "Email verified! Taking you to your platform..."

**Auto-redirect:** 2 seconds → /auth/bridge/ or /dashboard/

---

## BACKEND SERVICES (Cloud Functions)

### Service 1: AI Validation (`functions/src/services/validation.service.ts`)

```typescript
export async function validateBusinessEmail(email: string) {
  const domain = extractDomain(email);
  
  // 1. Check personal domain blocklist
  if (PERSONAL_DOMAINS.has(domain)) {
    return { valid: false, reason: 'personal_domain' };
  }
  
  // 2. DNS MX record check
  const mxRecords = await dns.resolveMx(domain);
  if (!mxRecords || mxRecords.length === 0) {
    return { valid: false, reason: 'no_mx_records' };
  }
  
  // 3. Check domain claim status
  const claim = await firestore
    .collection('domainClaims')
    .doc(domain)
    .get();
    
  if (claim.exists) {
    const data = claim.data();
    return {
      valid: false,
      reason: 'domain_claimed',
      claimedBy: data.owner,
      status: data.status
    };
  }
  
  return { valid: true };
}
```

### Service 2: Company Enrichment (`functions/src/services/enrichment.service.ts`)

```typescript
export async function enrichCompany(domain: string) {
  // 1. Scrape website with Apify
  const scrapedData = await apifyClient.scrapeWebsite({
    url: `https://${domain}`,
    pages: ['/', '/about', '/products']
  });
  
  // 2. Extract data with OpenAI
  const aiAnalysis = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{
      role: 'system',
      content: 'Extract company profile from website content. Return JSON with: companyName, industry, productCategories (max 3), isPackagingBusiness (boolean), confidence (0-100)'
    }, {
      role: 'user',
      content: JSON.stringify(scrapedData)
    }]
  });
  
  // 3. Get favicon for logo
  const favicon = await fetchFavicon(domain);
  
  // 4. Return enriched profile
  return {
    domain,
    companyName: aiAnalysis.companyName,
    website: `https://${domain}`,
    logo: favicon,
    products: aiAnalysis.productCategories,
    isPackaging: aiAnalysis.isPackagingBusiness,
    confidence: aiAnalysis.confidence,
    enrichedAt: new Date().toISOString()
  };
}
```

### Service 3: Domain Claims (`functions/src/services/domain.service.ts`)

```typescript
export async function claimDomain(domain: string, email: string, uid: string) {
  return await firestore.runTransaction(async (tx) => {
    const claimRef = firestore.collection('domainClaims').doc(domain);
    const claimDoc = await tx.get(claimRef);
    
    if (claimDoc.exists) {
      const data = claimDoc.data();
      if (data.owner !== email) {
        throw new Error('domain_already_claimed');
      }
      // Update existing claim
      tx.update(claimRef, {
        status: 'verified',
        verifiedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    } else {
      // Create new claim
      tx.set(claimRef, {
        domain,
        owner: email,
        uid,
        status: 'pending',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    return { success: true };
  });
}
```

---

## FIRESTORE DATA STRUCTURE

```javascript
// Collection: users
{
  uid: "firebase_uid",
  email: "john@acmecorp.com",
  role: "supplier" | "buyer",
  domain: "acmecorp.com",
  companyProfile: {
    name: "Acme Corp",
    website: "https://acmecorp.com",
    logo: "https://...",
    products: ["Boxes", "Labels", "Packaging"]
  },
  onboardingStatus: "email_verification" | "bridge_pending" | "completed",
  createdAt: Timestamp,
  emailVerified: true,
  bridgeCompleted: false
}

// Collection: domainClaims
{
  domain: "acmecorp.com",
  owner: "john@acmecorp.com",
  uid: "firebase_uid",
  status: "pending" | "verified",
  createdAt: Timestamp,
  verifiedAt: Timestamp | null
}

// Collection: enrichmentCache
{
  domain: "acmecorp.com",
  companyName: "Acme Corp",
  products: [...],
  isPackaging: true,
  confidence: 92,
  enrichedAt: Timestamp,
  expiresAt: Timestamp  // 30 days cache
}
```

---

## DEPLOYMENT CONFIGURATION

### Firebase Hosting (`firebase.json`)

```json
{
  "hosting": {
    "public": "public",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      },
      {
        "source": "/auth/**",
        "destination": "/auth/index.html"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|ico|css|js)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ],
    "cleanUrls": true,
    "trailingSlash": false
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs18"
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}
```

### Cloud Functions Endpoints

```
POST /api/auth/validate-email
  → Validate business email
  → Check domain claim status
  → Return: { valid: boolean, reason?: string }

POST /api/auth/signup
  → Create Firebase user
  → Claim domain
  → Send verification email
  → Return: { success: boolean, uid: string }

POST /api/enrichment/company
  → Scrape website
  → AI analysis
  → Cache results
  → Return: { companyName, products, logo, confidence }

GET /api/domain/:domain/status
  → Check if domain is claimed
  → Return: { claimed: boolean, owner?: string }
```

---

## IMPLEMENTATION CHECKLIST

### Phase 1: Static Pages (White Theme) ✅ NEXT
- [ ] Create `public/auth/signup/index.html` with white theme
- [ ] Create `public/auth/login/index.html` matching design
- [ ] Create `public/auth/bridge/index.html` company confirmation
- [ ] Create `public/auth/verified/index.html` success page
- [ ] Create `public/auth/index.html` landing/router

### Phase 2: Firebase Client Integration
- [ ] Add Firebase SDK to HTML pages
- [ ] Implement Google OAuth flow
- [ ] Implement email/password signup
- [ ] Add email verification handling
- [ ] Implement auth state persistence

### Phase 3: Cloud Functions Backend
- [ ] Deploy validation service
- [ ] Deploy enrichment service
- [ ] Deploy domain claim service
- [ ] Set up Firestore security rules
- [ ] Configure API endpoints

### Phase 4: Testing & Deployment
- [ ] Test complete signup flow
- [ ] Test Google OAuth
- [ ] Test email verification
- [ ] Test bridge confirmation
- [ ] Deploy to Firebase Hosting
- [ ] Verify live at warlord-1cbe3.web.app

---

## NEXT IMMEDIATE STEPS

**Priority 1:** Create white theme signup page
**Priority 2:** Test authentication flow
**Priority 3:** Deploy and verify live

**File to create first:** `public/auth/signup/index.html`

---

## NOTES

- Design inspired by Galactly but tailored for Warlord branding
- White/light theme appropriate for $2,000/month enterprise platform
- Glass morphism effects are subtle, not overdone
- 280ms animations feel premium, not rushed
- All personal domain blocking logic retained from Galactly
- Domain claim system ensures one company per domain
- AI validation happens BEFORE account creation (saves resources)

---

**Status:** Ready to implement
**Next:** Create signup page with white premium theme
