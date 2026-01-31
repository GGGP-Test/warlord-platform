# 🚀 WARLORD Platform - Unified Monorepo

**Supplier Intelligence Platform - Next.js 14 + Firebase**

[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)
- [Features](#features)
- [API Documentation](#api-documentation)

---

## 🎯 Overview

**WARLORD Platform** is a unified monorepo combining:

1. **Next.js 14 Frontend** - Modern React app with App Router
2. **Firebase Cloud Functions** - Serverless backend (Express API + Auth + AI)
3. **Firestore Database** - Real-time NoSQL database
4. **Firebase Hosting** - Static site hosting with CDN

**Key Features:**

✅ AI-powered supplier verification (CASCADE cost optimization)
✅ Email verification with magic links
✅ Company data extraction and validation
✅ Multi-phase onboarding flow
✅ Real-time dashboard analytics
✅ Comprehensive supplier enrichment API

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    WARLORD PLATFORM                      │
└──────────────────────────────────────────────────────────┘

┌─────────────────┐      ┌─────────────────────────────────┐
│   Next.js 14    │ ───► │   Firebase Cloud Functions      │
│   Frontend      │      │   (Express + Auth + AI)         │
│  (Static Export)│      │                                 │
│                 │      │  • Express API (Phase 1 & 2)   │
│  • Auth Pages   │      │  • Auth Functions (Bundle 4)    │
│  • Onboarding   │      │  • Supplier Services            │
│  • Dashboard    │      │  • Email & AI Integration       │
└─────────────────┘      └─────────────────────────────────┘
        │                            │
        │                            │
        └────────────┬───────────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │  Firebase Firestore  │
          │  (Shared Database)   │
          └──────────────────────┘
```

**Technology Stack:**

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS |
| **Backend** | Firebase Cloud Functions, Express.js, Node.js 20 |
| **Database** | Firebase Firestore |
| **Auth** | Firebase Auth, SendGrid |
| **AI/ML** | OpenAI GPT-4, Apify Web Scrapers |
| **Hosting** | Firebase Hosting (CDN) |
| **Deployment** | Firebase CLI, GitHub Actions (CI/CD) |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **Firebase CLI** (`npm install -g firebase-tools`)
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/GGGP-Test/warlord-platform.git
cd warlord-platform

# Install root dependencies
npm install

# Install Functions dependencies
cd functions
npm install
cd ..

# Set up environment variables
cp .env.example .env.local
cp functions/.env.example functions/.env

# Fill in your API keys in .env.local and functions/.env
```

### Environment Variables

**Root `.env.local` (Frontend - Public vars):**

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=warlord-1cbe3
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**`functions/.env` (Backend - Private vars):**

```env
OPENAI_API_KEY=sk-your-openai-key
SENDGRID_API_KEY=SG.your-sendgrid-key
SENDGRID_FROM_EMAIL=noreply@warlord.ai
APIPY_API_TOKEN=your-apify-token
GOOGLE_CUSTOM_SEARCH_API_KEY=your-google-api-key
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=your-search-engine-id
```

---

## 📁 Project Structure

```
warlord-platform/
├── app/                          # Next.js 14 App Router
│   ├── page.tsx                 # Landing page
│   ├── auth/
│   │   ├── signup/page.tsx      # Sign up
│   │   ├── login/page.tsx       # Sign in
│   │   ├── verified/page.tsx    # Email verified
│   │   └── bridge/page.tsx      # Company confirmation
│   ├── onboarding/page.tsx      # AI onboarding
│   ├── dashboard/page.tsx       # Analytics dashboard
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
│
├── components/                   # Reusable React components
│   ├── auth/
│   ├── ui/
│   └── layout/
│
├── lib/                          # Client-side utilities
│   ├── firebase.ts              # Firebase config
│   ├── api.ts                   # API client
│   └── validation.ts            # Form validation
│
├── functions/                    # Firebase Cloud Functions
│   ├── src/
│   │   ├── index.ts             # Main exports
│   │   ├── api/                 # Express API
│   │   │   ├── suppliers.ts
│   │   │   ├── enrichment.ts
│   │   │   └── validation.ts
│   │   ├── auth/                # Auth functions
│   │   │   ├── submitEmail.ts
│   │   │   ├── verifyEmail.ts
│   │   │   └── verifyDomain.ts
│   │   ├── onboarding/
│   │   ├── services/            # Business logic
│   │   ├── utils/
│   │   └── config/
│   ├── package.json
│   └── tsconfig.json
│
├── shared/                       # Shared types & utilities
│   └── types/
│       └── index.ts             # All TypeScript types
│
├── public/                       # Static assets
│   ├── images/
│   └── fonts/
│
├── docs/                         # Documentation
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── specs/
│
├── .github/
│   └── workflows/
│       └── deploy.yml           # CI/CD pipeline
│
├── firebase.json                 # Firebase config
├── .firebaserc                  # Firebase project
├── next.config.js               # Next.js config
├── tailwind.config.ts           # Tailwind config
├── tsconfig.json                # TypeScript config
└── package.json                 # Root package.json
```

---

## 💻 Development

### Run Locally

**Start both frontend and backend:**

```bash
# Terminal 1: Frontend (Next.js)
npm run dev
# Opens http://localhost:3000

# Terminal 2: Backend (Functions)
npm run dev:functions
# Opens http://localhost:5001

# OR use Firebase Emulator Suite (all services)
npm run emulators
# Opens http://localhost:4000 (Emulator UI)
```

**Frontend URLs:**
- Landing: http://localhost:3000
- Signup: http://localhost:3000/auth/signup
- Dashboard: http://localhost:3000/dashboard

**Backend URLs:**
- API: http://localhost:5001/warlord-1cbe3/us-central1/api
- Auth Functions: http://localhost:5001/warlord-1cbe3/us-central1/submitEmail

### Build for Production

```bash
# Build frontend
npm run build

# Build functions
npm run build:functions

# Test production build locally
npm run start
```

---

## 🚢 Deployment

### Deploy Everything

```bash
# Deploy both frontend and backend
npm run deploy
```

### Deploy Separately

```bash
# Deploy only frontend
npm run deploy:hosting

# Deploy only backend functions
npm run deploy:functions

# Deploy specific function
firebase deploy --only functions:submitEmail
```

### Production URLs

- **Frontend:** https://warlord-1cbe3.web.app
- **API Endpoint:** https://warlord-1cbe3.web.app/api
- **Functions:** https://us-central1-warlord-1cbe3.cloudfunctions.net

---

## ✨ Features

### Phase 1 & 2: Supplier API (Complete)
- ✅ CRUD operations for suppliers
- ✅ Multi-source enrichment (Web, LinkedIn, Crunchbase)
- ✅ Intelligent scoring system
- ✅ Batch operations (up to 1000 suppliers)
- ✅ Data validation engine

### Bundle 4: Pre-Onboarding AI (Complete)
- ✅ Email verification with SendGrid
- ✅ Domain validation (CASCADE: Free → Cheap → Expensive)
- ✅ Company data extraction with GPT-4
- ✅ Cost optimization (85% savings)
- ✅ Real-time cost tracking

### Auth System (New)
- ✅ Sign up with email + company info
- ✅ AI-powered business validation
- ✅ Magic link email verification
- ✅ Company bridge page (data confirmation)
- ✅ OAuth ready (Google, LinkedIn)

### Onboarding Flow
- ✅ Role selection (Supplier/Buyer)
- ✅ Company details collection
- ✅ Product selection
- ✅ Dashboard redirect

---

## 📚 API Documentation

### Base URL

```
Production: https://warlord-1cbe3.web.app/api
Local: http://localhost:5001/warlord-1cbe3/us-central1/api
```

### Endpoints

**Suppliers API:**

```bash
# Create supplier
POST /api/suppliers

# List all suppliers
GET /api/suppliers

# Get supplier
GET /api/suppliers/:id

# Delete supplier
DELETE /api/suppliers/:id

# Get enrichment history
GET /api/suppliers/:id/enrichments
```

**Enrichment API:**

```bash
# Enrich single supplier
POST /api/enrichment/:supplierId

# Enrich batch
POST /api/enrichment/batch/enrich

# Get enrichment stats
GET /api/enrichment/:supplierId/stats
```

**Validation API:**

```bash
# Validate single supplier
POST /api/enrichment/validate/single

# Validate batch
POST /api/enrichment/validate/batch

# Sanitize data
POST /api/enrichment/sanitize
```

**Auth Functions:**

```bash
# Submit email for verification
POST /submitEmail

# Verify email token
POST /verifyEmail

# Verify company domain
POST /verifyDomain

# Get company profile
GET /getCompanyProfile
```

---

## 🎓 Development Guides

### Adding a New Page

1. Create `app/your-page/page.tsx`
2. Add types to `shared/types/index.ts`
3. Create components in `components/your-page/`
4. Add API calls to `lib/api.ts`

### Adding a New Cloud Function

1. Create `functions/src/yourFunction.ts`
2. Export in `functions/src/index.ts`
3. Add types to `shared/types/index.ts`
4. Deploy: `firebase deploy --only functions:yourFunction`

### Testing Locally

```bash
# Run emulators
firebase emulators:start

# Test functions
firebase functions:shell

# View logs
firebase functions:log
```

---

## 📝 License

Private - © 2026 WARLORD Platform

---

## 🤝 Contributing

This is a private project. For questions, contact the development team.

---

**Built with ❤️ for supplier intelligence**
