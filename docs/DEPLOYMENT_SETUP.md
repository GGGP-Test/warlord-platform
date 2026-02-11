# 🚀 Deployment Setup Guide

## Status: GitHub Actions Workflow Created ✅

The automatic deployment workflow has been created at:
`.github/workflows/firebase-hosting-merge.yml`

**What it does:**
- Triggers on every push to `main` branch
- Automatically deploys to Firebase Hosting
- Publishes to live channel (warlord-1cbe3.web.app)

---

## ⚠️ ONE-TIME SETUP REQUIRED

You need to configure the Firebase service account secret for GitHub Actions to work.

### Option 1: Using Firebase CLI (Recommended)

```bash
# Install Firebase CLI if you haven't
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize GitHub Actions integration
firebase init hosting:github
```

The CLI will:
1. Ask for your GitHub repository: `GGGP-Test/warlord-platform`
2. Automatically create the service account
3. Add the secret `FIREBASE_SERVICE_ACCOUNT_WARLORD_1CBE3` to your GitHub repo
4. Configure the workflow (already done!)

### Option 2: Manual Setup

1. **Generate Service Account Key:**
   - Go to: https://console.firebase.google.com/project/warlord-1cbe3/settings/serviceaccounts/adminsdk
   - Click "Generate new private key"
   - Download the JSON file

2. **Add to GitHub Secrets:**
   - Go to: https://github.com/GGGP-Test/warlord-platform/settings/secrets/actions
   - Click "New repository secret"
   - Name: `FIREBASE_SERVICE_ACCOUNT_WARLORD_1CBE3`
   - Value: Paste the entire JSON content from the downloaded file
   - Click "Add secret"

---

## ✅ Verification Steps

After setup:

1. **Check if secret exists:**
   - Go to: https://github.com/GGGP-Test/warlord-platform/settings/secrets/actions
   - You should see `FIREBASE_SERVICE_ACCOUNT_WARLORD_1CBE3` listed

2. **Trigger deployment:**
   ```bash
   # Make any small change to trigger the workflow
   git commit --allow-empty -m "Trigger deployment"
   git push origin main
   ```

3. **Monitor the deployment:**
   - Go to: https://github.com/GGGP-Test/warlord-platform/actions
   - Watch the workflow run
   - Should complete in ~2-3 minutes

4. **Visit your live site:**
   - https://warlord-1cbe3.web.app/auth/signup
   - Or your custom domain if configured

---

## 🔧 Current Firebase Config

```json
{
  "projectId": "warlord-1cbe3",
  "authDomain": "warlord-1cbe3.firebaseapp.com",
  "storageBucket": "warlord-1cbe3.appspot.com"
}
```

---

## 📋 What's Deployed

### Live Pages
- `/auth/signup` - Premium white theme signup flow
- Role selection (Supplier vs Buyer)
- Google OAuth (work accounts only)
- Email + Password signup
- Business email validation

### Coming Soon
- `/auth/login` - Login page
- `/auth/bridge` - Onboarding bridge
- `/auth/verified` - Email verified confirmation
- `/dashboard` - Main application

---

## 🐛 Troubleshooting

### Workflow fails with "Error: Could not find credentials"
→ Service account secret not configured. Follow Option 1 or 2 above.

### Workflow runs but deployment fails
→ Check Firebase project permissions:
   - Go to: https://console.firebase.google.com/project/warlord-1cbe3/settings/iam
   - Ensure the service account has "Firebase Hosting Admin" role

### Can't find the secret in GitHub
→ Make sure you're in the right repository:
   - https://github.com/GGGP-Test/warlord-platform/settings/secrets/actions

### Deployment succeeds but site not updating
→ Clear browser cache or check in incognito mode

---

## 🎯 Next Steps

1. **Configure the service account** (use Option 1 - it's faster)
2. **Test the deployment** with an empty commit
3. **Verify the live site** loads properly
4. **Let me know** and I'll create the remaining auth pages

---

## 📞 Need Help?

If you get stuck:
1. Check the GitHub Actions logs: https://github.com/GGGP-Test/warlord-platform/actions
2. Check Firebase console: https://console.firebase.google.com/project/warlord-1cbe3/hosting
3. Share the error message and I'll help debug

---

**The platform is ready to deploy! Just need that one-time secret configuration.** 🚀
