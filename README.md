# Warlord Platform

> Supplier Intelligence & Market Data Analytics Platform

## 🚀 Live Platform

**Production:** https://warlord-1cbe3.web.app

## 📋 Features

### Authentication System
- ✅ Google OAuth sign-in
- ✅ Email/password authentication  
- ✅ Email verification flow
- ✅ Business email validation
- ✅ Company domain verification
- ✅ Automated onboarding with site validation

### Pages
- `/auth/signup/` - Account creation
- `/auth/login/` - Sign in
- `/auth/bridge/` - Onboarding & validation
- `/auth/verified/` - Success confirmation
- `/` - Dashboard (coming soon)

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3 (Premium White Theme), Vanilla JavaScript
- **Backend:** Firebase (Auth, Firestore, Hosting)
- **API:** Google Cloud Run (supplier data, classification)
- **Data Sources:** Placer.ai, Apify

## 🔧 Setup

### Prerequisites
- Firebase project: `warlord-1cbe3`
- Google Cloud project with Cloud Run enabled
- GitHub repository with Actions enabled

### Environment Setup

1. **GitHub Secrets** (Required for auto-deployment)
   ```
   FIREBASE_TOKEN - Firebase CI token for deployment
   ```

2. **Generate Firebase Token**
   ```bash
   firebase login:ci
   # Copy the token
   # Add to GitHub repo: Settings → Secrets → Actions → New secret
   # Name: FIREBASE_TOKEN
   # Value: <paste token>
   ```

3. **Configure API Base**
   
   Edit `public/auth/bridge/index.html` and set your Cloud Run URL:
   ```html
   <meta name="api-base" content="https://your-cloud-run-url.a.run.app/api">
   ```

## 📦 Deployment

### Automatic (via GitHub Actions)

Push to `main` branch:
```bash
git push origin main
```

GitHub Actions will automatically:
1. ✅ Checkout code
2. ✅ Install dependencies
3. ✅ Deploy to Firebase Hosting

View deployment status: https://github.com/GGGP-Test/warlord-platform/actions

### Manual Deployment

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Deploy
firebase deploy --only hosting
```

## 🔐 Security

### Firestore Rules

Security rules protect user data:
- Users can only access their own documents
- Company members can view company data
- Only company owners can modify company data
- Suppliers collection is read-only from frontend

### Authentication Flow

```
Signup → Email Verification → Login → Bridge (validation) → Verified → Dashboard
```

**Bridge validates:**
- ✅ Business email (no Gmail/Yahoo/Outlook)
- ✅ Domain matching (email domain = website domain)
- ✅ Site reachability
- ✅ Public access (no robots.txt blocking)

## 🏗️ Project Structure

```
warlord-platform/
├── public/
│   ├── auth/
│   │   ├── signup/index.html      # Account creation
│   │   ├── login/index.html       # Sign in
│   │   ├── bridge/index.html      # Onboarding validation
│   │   └── verified/index.html    # Success page
│   └── index.html                 # Dashboard (TODO)
├── functions/                      # Cloud Functions (TODO)
├── firestore.rules                # Database security rules
├── firestore.indexes.json         # Database indexes
├── firebase.json                  # Firebase config
└── .github/workflows/
    └── firebase-deploy.yml        # Auto-deployment
```

## 🎨 Design System

### Premium White Theme
- Clean, professional aesthetic
- Glass morphism effects
- Smooth animations & transitions
- Mobile-responsive
- Accessibility-first

### Typography
- **Headings:** Plus Jakarta Sans (800 weight)
- **Body:** Inter (400-700 weights)

### Colors
```css
--color-bg: #FAFAFA
--color-surface: #FFFFFF
--color-text: #0A0A0A
--color-primary: #3B82F6
--color-success: #10B981
```

## 📊 Next Steps

### Immediate
- [ ] Set FIREBASE_TOKEN secret in GitHub
- [ ] Configure API base URL in bridge page
- [ ] Test complete auth flow

### This Week
- [ ] Build dashboard interface
- [ ] Create supplier search UI
- [ ] Connect Firestore database
- [ ] Add user profile management

### Next Sprint
- [ ] Implement supplier filtering
- [ ] Add location-based search
- [ ] Build contact management
- [ ] Create analytics dashboard

## 🐛 Troubleshooting

### GitHub Actions fails
- Check `FIREBASE_TOKEN` secret is set
- Verify Firebase project ID: `warlord-1cbe3`

### Authentication not working
- Verify Firebase Auth is enabled in console
- Check authorized domains include your hosting URL

### Bridge page can't validate sites
- Set API base URL in `<meta>` tag
- Verify Cloud Run API is deployed and public

## 📝 License

Proprietary - All rights reserved

## 👤 Author

**GGGP Platform**

---

**Status:** 🟢 Authentication Complete | 🟡 Dashboard In Progress
