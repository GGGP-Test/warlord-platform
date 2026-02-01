#!/bin/bash

# Warlord Platform - One-Command Deployment Setup
# This script configures GitHub Actions to automatically deploy to Firebase Hosting

set -e

echo ""
echo "🚀 Warlord Platform - Deployment Setup"
echo "========================================"
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
    echo "✅ Firebase CLI installed"
else
    echo "✅ Firebase CLI found"
fi

echo ""
echo "🔐 Logging into Firebase..."
firebase login

echo ""
echo "🔗 Setting up GitHub Actions integration..."
echo "   Repository: GGGP-Test/warlord-platform"
echo "   Firebase Project: warlord-1cbe3"
echo ""

# Initialize GitHub Actions hosting
firebase init hosting:github

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Check GitHub Actions: https://github.com/GGGP-Test/warlord-platform/actions"
echo "2. Check secrets: https://github.com/GGGP-Test/warlord-platform/settings/secrets/actions"
echo "3. Your site will auto-deploy on every push to 'main' branch"
echo "4. Live URL: https://warlord-1cbe3.web.app"
echo ""
echo "🎉 Ready to deploy! Make a commit and push to trigger deployment."
echo ""
