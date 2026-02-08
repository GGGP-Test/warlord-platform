# SendGrid Setup for Email Verification

This guide will help you set up SendGrid to send verification emails automatically.

## Step 1: Create SendGrid Account (FREE)

1. Go to [https://signup.sendgrid.com/](https://signup.sendgrid.com/)
2. Sign up for a **FREE account** (100 emails/day)
3. Verify your email address

## Step 2: Get SendGrid API Key

1. Log in to SendGrid Console: [https://app.sendgrid.com/](https://app.sendgrid.com/)
2. Go to **Settings** → **API Keys** (left sidebar)
3. Click **Create API Key** (blue button, top right)
4. Name it: `Warlord Platform Verification Emails`
5. Choose **Full Access** (for simplicity)
6. Click **Create & View**
7. **COPY the API key immediately** (you won't see it again!)

## Step 3: Verify Sender Email

SendGrid requires you to verify the email address you'll send from:

### Option A: Single Sender Verification (Quick - Recommended for testing)

1. Go to **Settings** → **Sender Authentication**
2. Click **Get Started** under "Single Sender Verification"
3. Fill in the form:
   - **From Name**: `Galactly`
   - **From Email**: Your email (e.g., `noreply@yourdomain.com` or your personal email)
   - **Reply To**: Same as above
   - **Company Address**: Your address
4. Click **Create**
5. **Check your email** and click the verification link
6. Wait for verification (usually instant)

### Option B: Domain Authentication (Professional - Better for production)

1. Go to **Settings** → **Sender Authentication**
2. Click **Get Started** under "Authenticate Your Domain"
3. Enter your domain (e.g., `galactly.com`)
4. Add the DNS records provided by SendGrid to your domain
5. Wait for DNS propagation (can take 24-48 hours)

## Step 4: Add Secrets to GitHub

1. Go to your repository: [https://github.com/GGGP-Test/warlord-platform/settings/secrets/actions](https://github.com/GGGP-Test/warlord-platform/settings/secrets/actions)

2. **Add SENDGRID_API_KEY:**
   - Click **New repository secret**
   - Name: `SENDGRID_API_KEY`
   - Value: (paste the API key from Step 2)
   - Click **Add secret**

3. **Add FROM_EMAIL:**
   - Click **New repository secret**
   - Name: `FROM_EMAIL`
   - Value: The email you verified in Step 3 (e.g., `noreply@galactly.com`)
   - Click **Add secret**

4. **Add APP_URL:**
   - Click **New repository secret**
   - Name: `APP_URL`
   - Value: `https://site--warlord-platform--vz4ftkwrzdfs.code.run`
   - Click **Add secret**

## Step 5: Set Environment Variables in Firebase

You also need to set these in Firebase so the Cloud Function can access them:

### Using Firebase Console (Easiest):

1. Go to [Firebase Console](https://console.firebase.google.com/project/warlord-1cbe3/functions/list)
2. Click on a function → **Environment Variables** tab
3. Add these variables:
   - `SENDGRID_API_KEY`: (your SendGrid API key)
   - `FROM_EMAIL`: (your verified sender email)
   - `APP_URL`: `https://site--warlord-platform--vz4ftkwrzdfs.code.run`

### Using GitHub Actions (Already set up!):

The deployment workflow will automatically set these from your GitHub secrets.

## Step 6: Deploy the Cloud Function

1. Go to [GitHub Actions](https://github.com/GGGP-Test/warlord-platform/actions)
2. Click **Deploy Cloud Functions** in the left sidebar
3. Click **Run workflow** → **Run workflow**
4. Wait for the green checkmark ✅

## Step 7: Test It!

1. Go to your signup page: `https://site--warlord-platform--vz4ftkwrzdfs.code.run/auth/signup/TEST.html`
2. Sign up with a business email
3. Check your inbox for the verification email! 📧

## Troubleshooting

### Emails not sending?

1. **Check SendGrid Dashboard:**
   - Go to [Activity Feed](https://app.sendgrid.com/email_activity)
   - Look for your email
   - Check if it was blocked or bounced

2. **Check Cloud Function Logs:**
   - Go to [Firebase Console Logs](https://console.firebase.google.com/project/warlord-1cbe3/functions/logs)
   - Look for errors in `onPendingVerificationCreated`

3. **Verify Environment Variables:**
   - Make sure all 3 variables are set correctly
   - Check for typos in email addresses

4. **Check Spam Folder:**
   - SendGrid emails might land in spam initially
   - Mark as "Not Spam" to improve deliverability

### Free Tier Limits

- **SendGrid**: 100 emails/day
- **Firebase Cloud Functions**: 2M invocations/month (free tier)
- **Firestore**: 50K reads, 20K writes per day (free tier)

You're well within limits for testing and early users!

## Next Steps

- [ ] Set up SendGrid account
- [ ] Get API key
- [ ] Verify sender email
- [ ] Add secrets to GitHub
- [ ] Set environment variables in Firebase
- [ ] Deploy Cloud Function
- [ ] Test email verification

---

**Need help?** Open an issue or check the [SendGrid Documentation](https://docs.sendgrid.com/)
