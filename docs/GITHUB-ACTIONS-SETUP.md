# GitHub Actions Setup Guide

**For deployments WITHOUT local installations (VPN-friendly)**

---

## 🎯 What This Does

GitHub Actions will automatically:
1. ✅ Install Node.js 20
2. ✅ Install all npm dependencies
3. ✅ Build TypeScript functions
4. ✅ Build Next.js frontend
5. ✅ Deploy to Firebase Hosting & Functions
6. ✅ Run on every push to `main` branch

**You don't need to install anything locally!**

---

## 🔧 One-Time Setup (5 minutes)

### Step 1: Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/project/warlord-1cbe3/settings/serviceaccounts/adminsdk)

2. Click **"Service accounts"** tab

3. Click **"Generate new private key"**

4. Click **"Generate key"** (downloads a JSON file)

5. Open the downloaded JSON file in a text editor

6. Copy the ENTIRE contents (all the JSON)

### Step 2: Add Secret to GitHub

1. Go to your GitHub repo: https://github.com/GGGP-Test/warlord-platform

2. Click **Settings** → **Secrets and variables** → **Actions**

3. Click **"New repository secret"**

4. Name: `FIREBASE_SERVICE_ACCOUNT`

5. Value: Paste the entire JSON from Step 1

6. Click **"Add secret"**

### Step 2b: Add Resend API key (for email from Cloud Functions)

If you use signup verification or magic-link emails (Resend), add your Resend API key:

1. In the same **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Name: `RESEND_API_KEY`
4. Value: your Resend API key (starts with `re_`)
5. Click **"Add secret"**

The workflow **Deploy Firebase Cloud Functions** uses this to set Firebase config before deploying, so functions can send email without you running Firebase from your location.

### Step 3: Enable GitHub Actions (if not already enabled)

1. Go to **Settings** → **Actions** → **General**

2. Under "Actions permissions", select:
   - ✅ **"Allow all actions and reusable workflows"**

3. Click **"Save"**

---

## 🚀 How to Use

### Automatic Deployment

**Every time you push to `main` branch:**

```bash
# Make changes to your code
git add .
git commit -m "Update functions"
git push origin main

# GitHub Actions automatically:
# 1. Builds everything
# 2. Deploys to Firebase
# 3. Updates your live site
```

### Manual Deployment

1. Go to **Actions** tab in GitHub
2. Click **"Build and Deploy to Firebase"**
3. Click **"Run workflow"**
4. Select branch → Click **"Run workflow"**

---

## 📊 Monitor Deployments

### View Build Status

1. Go to **Actions** tab: https://github.com/GGGP-Test/warlord-platform/actions

2. See all workflow runs (green ✅ = success, red ❌ = failed)

3. Click on any run to see detailed logs

### Check What's Deployed

**Live URLs after successful deployment:**

- **Frontend:** https://warlord-1cbe3.web.app/
- **Functions:** https://us-central1-warlord-1cbe3.cloudfunctions.net/

### View Firebase Console

- **Hosting:** https://console.firebase.google.com/project/warlord-1cbe3/hosting
- **Functions:** https://console.firebase.google.com/project/warlord-1cbe3/functions
- **Firestore:** https://console.firebase.google.com/project/warlord-1cbe3/firestore

---

## 🛠️ Workflow Files Explained

### Main Deployment Workflow

**File:** `.github/workflows/deploy.yml`

**Triggers:**
- ✅ Push to `main` branch
- ✅ Pull request to `main`
- ✅ Manual trigger (workflow_dispatch)

**Steps:**
1. Checkout code from GitHub
2. Setup Node.js 20
3. Install root dependencies
4. Install Functions dependencies
5. Build Functions (TypeScript → JavaScript)
6. Build Next.js (if app exists)
7. Deploy to Firebase

### Cloud Functions–only deploy (no local Firebase)

**File:** `.github/workflows/firebase-functions-deploy.yml`

Use this when you **can’t run Firebase from your machine** (e.g. location restriction). Everything runs on GitHub’s servers.

**Triggers:**
- ✅ Push to `main` that changes `functions/**` or this workflow file
- ✅ Manual trigger: Actions → **Deploy Firebase Cloud Functions** → Run workflow

**Steps:**
1. Checkout, Node 20, authenticate with `FIREBASE_SERVICE_ACCOUNT`
2. Install and build functions (`npm ci`, `npm run build`)
3. Set Resend key in Firebase config from `RESEND_API_KEY` secret
4. Deploy only functions: `firebase deploy --only functions`

**Required secrets:** `FIREBASE_SERVICE_ACCOUNT`, `RESEND_API_KEY` (for email)

### Test Workflow

**File:** `.github/workflows/test-functions.yml`

**Triggers:**
- Pull requests that change `functions/**`
- Manual trigger

**Steps:**
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Build Functions
5. Run tests (when configured)

---

## 🔍 Troubleshooting

### Deployment Failed ❌

**Check the error logs:**

1. Go to Actions tab
2. Click the failed workflow
3. Click the red step to see error

**Common issues:**

**Error: "Firebase service account not found"**
- ✅ Make sure `FIREBASE_SERVICE_ACCOUNT` secret is set
- ✅ Verify the JSON is valid (no extra spaces/newlines)

**Error: "Build failed" in Functions**
- ✅ Check `functions/src/` for TypeScript errors
- ✅ Make sure all imports are correct
- ✅ Check `functions/package.json` dependencies

**Error: "Permission denied"**
- ✅ Service account needs Firebase Admin permissions
- ✅ Go to Firebase Console → Project Settings → Service Accounts
- ✅ Make sure account has "Firebase Admin" role

### Build Succeeds But Site Doesn't Update

1. **Check Firebase Hosting:**
   - Go to https://console.firebase.google.com/project/warlord-1cbe3/hosting
   - Look for recent deployment

2. **Check Function Deployment:**
   - Go to https://console.firebase.google.com/project/warlord-1cbe3/functions
   - Verify functions are listed

3. **Clear Browser Cache:**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

---

## 📋 Development Workflow

### Making Changes

```bash
# 1. Create a feature branch
git checkout -b feature/new-auth-page

# 2. Make your changes
# Edit files in app/, components/, functions/src/, etc.

# 3. Commit changes
git add .
git commit -m "Add new auth page"

# 4. Push to GitHub
git push origin feature/new-auth-page

# 5. Create Pull Request on GitHub
# This triggers test workflow (no deployment yet)

# 6. After review, merge to main
# This triggers full deployment workflow
```

### Testing Before Merge

**Option 1: Use GitHub Codespaces (recommended for VPN issues)**

1. Go to your repo on GitHub
2. Click **Code** → **Codespaces** → **Create codespace**
3. Wait for environment to load
4. In terminal:
   ```bash
   cd functions
   npm install
   npm run build
   ```

**Option 2: Push to test branch**

1. Create branch: `git checkout -b test/my-changes`
2. Push: `git push origin test/my-changes`
3. Check Actions tab for build status
4. If successful, merge to main

---

## 🎯 Best Practices

### Branch Strategy

```
main (production)
  ↑
  └── merge from feature branches
        ↑
        └── develop & test here
```

**Rules:**
- ✅ `main` = production (always deployable)
- ✅ Feature branches = development
- ✅ Test in feature branches before merging
- ✅ Use Pull Requests for code review

### Commit Messages

```bash
# Good ✅
git commit -m "Add email verification function"
git commit -m "Fix CORS error in submitEmail"
git commit -m "Update landing page design"

# Bad ❌
git commit -m "updates"
git commit -m "fix"
git commit -m "wip"
```

### Environment Variables / GitHub Secrets

**Never commit secrets!**

| Secret | Used by | Purpose |
|--------|---------|---------|
| `FIREBASE_SERVICE_ACCOUNT` | All deploy workflows | JSON key for Firebase/GCP auth |
| `RESEND_API_KEY` | **Deploy Firebase Cloud Functions** | Resend API key; set in Firebase config before deploy so functions can send email |

```bash
# ✅ Good - use GitHub Secrets
# Set in: GitHub repo → Settings → Secrets and variables → Actions

# ❌ Bad - don't commit
# .env files are gitignored
# Never push API keys to GitHub
```

---

## 📞 Quick Reference

### URLs

| Service | URL |
|---------|-----|
| **Live Site** | https://warlord-1cbe3.web.app/ |
| **Functions** | https://us-central1-warlord-1cbe3.cloudfunctions.net/ |
| **GitHub Repo** | https://github.com/GGGP-Test/warlord-platform |
| **GitHub Actions** | https://github.com/GGGP-Test/warlord-platform/actions |
| **Firebase Console** | https://console.firebase.google.com/project/warlord-1cbe3 |

### Commands

```bash
# Push changes (triggers deployment)
git push origin main

# Create new branch
git checkout -b feature/my-feature

# View status
git status

# View logs
git log --oneline
```

---

## ✅ Verification Checklist

### After Setup

- [ ] Firebase service account secret added to GitHub (`FIREBASE_SERVICE_ACCOUNT`)
- [ ] Resend API key added if you use email (`RESEND_API_KEY`)
- [ ] GitHub Actions enabled in repo settings
- [ ] Test deployment by pushing to main (or run **Deploy Firebase Cloud Functions** manually)
- [ ] Check Actions tab for green checkmark ✅
- [ ] Visit live site to verify deployment
- [ ] Check Firebase Console for deployed functions

### Before Each Deploy

- [ ] Code builds locally (if possible) or in Codespaces
- [ ] No sensitive data in commits
- [ ] Commit message is descriptive
- [ ] Pull latest changes: `git pull origin main`

### After Each Deploy

- [ ] Check Actions tab for success ✅
- [ ] Visit live site to verify changes
- [ ] Check browser console for errors
- [ ] Test critical functionality

---

**🎉 You're all set! Push code to GitHub and let Actions do the rest!**
