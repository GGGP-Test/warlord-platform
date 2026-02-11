# Warlord Platform

> Supplier Intelligence & Market Data Analytics Platform

## 🚀 Live Platform

**Production:** https://warlord-1cbe3.web.app
**Status:** 🟢 Authentication Complete | 🟡 Dashboard In Progress

---

## 📋 Features

### ✅ Authentication System
- Google OAuth sign-in
- Email/password authentication  
- Email verification flow
- Business email validation
- Company domain verification
- Automated onboarding with site validation

### 📍 Pages
- `/auth/signup/` - Account creation with business validation
- `/auth/login/` - Multi-method sign-in (Google/Email)
- `/auth/bridge/` - Smart onboarding & company verification
- `/auth/verified/` - Success confirmation
- `/` - Dashboard (coming next)

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3 (Premium White Theme), Vanilla JavaScript
- **Backend:** Firebase (Auth, Firestore, Hosting)
- **API:** Google Cloud Run (supplier classification, enrichment)
- **Data Sources:** Placer.ai, Apify
- **CI/CD:** GitHub Actions (automated deployment)

---

## 🔧 Setup & Deployment

### Prerequisites

1. **Firebase Project:** `warlord-1cbe3`
2. **Google Cloud:** Cloud Run enabled for API
3. **GitHub:** Repository with Actions enabled

### GitHub Secrets Configuration

**Required Secret:** `FIREBASE_SERVICE_ACCOUNT`

**How to get it:**

1. Go to [Firebase Console](https://console.firebase.google.com/) → warlord-1cbe3
2. Project Settings ⚙️ → Service Accounts
3. Click "Generate new private key"
4. Save the JSON file
5. Copy the **entire JSON content**
6. Add to GitHub:
   - Go to: https://github.com/GGGP-Test/warlord-platform/settings/secrets/actions
   - Click "New repository secret"
   - **Name:** `FIREBASE_SERVICE_ACCOUNT`
   - **Value:** (paste entire JSON)
   - Click "Add secret"

### Automatic Deployment

**Every push to `main` automatically deploys!** 🎉

```bash
# Make changes, commit, push
git add .
git commit -m "Update feature"
git push origin main

# GitHub Actions handles the rest:
# ✅ Installs Firebase tools
# ✅ Authenticates with service account
# ✅ Deploys to warlord-1cbe3.web.app
```

**View deployment status:**
https://github.com/GGGP-Test/warlord-platform/actions

### Manual Deployment (if needed)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Deploy
firebase deploy --only hosting --project warlord-1cbe3
```

---

## 🎨 Design System

### Premium White Theme
- Clean, minimalist aesthetic
- Glass morphism effects with backdrop blur
- Smooth 280ms cubic-bezier transitions
- Mobile-first responsive design
- WCAG 2.1 AA accessibility compliance

### Typography
- **Headings:** Plus Jakarta Sans (800 weight, -2% letter spacing)
- **Body:** Inter (400-700 weights)
- **Monospace:** System mono stack

### Color Palette
```css
/* Light Theme */
--color-bg: #FAFAFA          /* Page background */
--color-surface: #FFFFFF      /* Cards, panels */
--color-text: #0A0A0A         /* Primary text */
--color-text-muted: #6B7280   /* Secondary text */
--color-primary: #3B82F6      /* Brand blue */
--color-success: #10B981      /* Success states */

/* Glass Morphism */
--glass-bg: rgba(255, 255, 255, 0.9)
--glass-border: rgba(0, 0, 0, 0.08)
--glass-shadow: 0 4px 12px rgba(0, 0, 0, 0.06)
```

---

## 🏗️ Project Structure

```
warlord-platform/
├── public/
│   ├── auth/
│   │   ├── signup/index.html      # Account creation + validation
│   │   ├── login/index.html       # Multi-method sign-in
│   │   ├── bridge/index.html      # Onboarding flow + site validation
│   │   └── verified/index.html    # Success confirmation
│   └── index.html                 # Main dashboard (TODO)
├── functions/                      # Cloud Functions (TODO)
├── firestore.rules                # Database security
├── firestore.indexes.json         # Query optimization
├── firebase.json                  # Firebase config
└── .github/workflows/
    └── firebase-deploy.yml        # CI/CD pipeline
```

---

## 🔐 Security

### Authentication Flow

```
┌─────────┐
│ Signup  │ → Email verification sent
└────┬────┘
     ↓
┌─────────┐
│  Login  │ → Check email verified
└────┬────┘
     ↓
┌─────────┐
│ Bridge  │ → Validate:
└────┬────┘   ✓ Business email (no personal)
     │        ✓ Domain matching
     │        ✓ Site reachable
     │        ✓ No robots.txt blocking
     ↓
┌──────────┐
│ Verified │ → Success! → Dashboard
└──────────┘
```

### Firestore Rules (Coming Soon)

```javascript
// Users: read/write own document only
// Companies: members read, owner writes
// Suppliers: read-only from frontend
```

---

## 🚦 API Integration

### Configure Cloud Run Endpoint

Edit `public/auth/bridge/index.html` line 14:

```html
<meta name="api-base" content="https://YOUR-SERVICE.a.run.app/api">
```

**Required endpoint:**
- `GET /api/classify?host=example.com&maxPages=8`
- Returns: `{ ok: true, host, favicon, summary, robotsDenied, crawlError }`

---

## 📊 Roadmap

### ✅ Phase 1: Authentication (COMPLETE)
- [x] Signup with validation
- [x] Multi-method login
- [x] Email verification
- [x] Business domain validation
- [x] Onboarding flow
- [x] Premium white theme

### 🟡 Phase 2: Dashboard (IN PROGRESS)
- [ ] Protected route with auth check
- [ ] User profile management
- [ ] Navigation system
- [ ] Responsive layout

### ⚪ Phase 3: Supplier Search
- [ ] Search interface
- [ ] Filter system (location, category, MOQ)
- [ ] Results display (grid/list)
- [ ] Firestore integration

### ⚪ Phase 4: Data Enrichment
- [ ] Placer.ai integration
- [ ] Apify web scraping
- [ ] Automated enrichment
- [ ] Real-time updates

### ⚪ Phase 5: Advanced Features
- [ ] Contact management
- [ ] Analytics dashboard
- [ ] Team collaboration
- [ ] Export functionality

---

## 🐛 Troubleshooting

### GitHub Actions Failing?

**Check:**
1. `FIREBASE_SERVICE_ACCOUNT` secret exists
2. Secret contains valid JSON (entire file)
3. Service account has "Firebase Hosting Admin" role
4. Project ID is correct: `warlord-1cbe3`

**View logs:**
https://github.com/GGGP-Test/warlord-platform/actions

### Authentication Not Working?

**Verify:**
1. Firebase Auth enabled in console
2. Google provider configured
3. Authorized domains include:
   - `warlord-1cbe3.web.app`
   - `warlord-1cbe3.firebaseapp.com`
   - `localhost` (for testing)

### Bridge Page Can't Validate Sites?

**Fix:**
1. Set API base URL in `<meta>` tag
2. Deploy Cloud Run API
3. Make API publicly accessible
4. Test endpoint: `curl https://YOUR-API.a.run.app/api/classify?host=example.com`

---

## 📞 Support

For issues or questions:
- Check GitHub Issues
- Review deployment logs
- Verify Firebase console settings

---

## 📝 License

Proprietary - All rights reserved © GGGP Platform

---

**Built with ❤️ for supplier intelligence**
