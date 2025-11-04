# Firebase App Hosting Environment Variables Setup Guide

**Last Updated:** November 5, 2025  
**Project:** ZenType V1  
**Platform:** Firebase App Hosting (Google Cloud Run)

---

## 🎯 Overview

Firebase App Hosting has its own environment variable system. **You do NOT need GitHub Secrets** for this setup. Everything is managed through Firebase and Google Cloud Secret Manager.

---

## 🔐 Two Types of Environment Variables

### 1. **Public Variables** (Non-Sensitive)
These are safe to include in `apphosting.yaml` and can be committed to Git:
- Firebase client config (`NEXT_PUBLIC_*` variables)
- API endpoints
- Feature flags
- Any data that's already visible in your frontend code

✅ **Already Configured in `apphosting.yaml`:**
```yaml
env:
  - variable: NEXT_PUBLIC_FIREBASE_API_KEY
    value: AIzaSyAipHBANeyyXgq1n9h2G33PAwtuXkMRu-w
  - variable: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
    value: solotype-23c1f.firebaseapp.com
  # ... (other public variables)
```

### 2. **Secret Variables** (Sensitive)
These should NEVER be committed to Git:
- API keys (Gemini, OpenAI, etc.)
- Database passwords
- Third-party service tokens
- OAuth client secrets

✅ **Configured via Google Cloud Secret Manager**

---

## 🚀 Setting Up Secret Environment Variables

### Step 1: Install Firebase CLI Secret Management (if not already installed)

Your Firebase CLI should already support secrets. Verify:
```bash
firebase --version  # Should be 13.0.0 or higher
```

### Step 2: Set Your Gemini API Key as a Secret

Run this command in your project directory:

```bash
firebase apphosting:secrets:set GEMINI_API_KEY
```

**What happens:**
1. Firebase CLI will prompt you to enter the secret value
2. Enter your Gemini API key when prompted
3. The secret is stored securely in Google Cloud Secret Manager
4. Firebase App Hosting automatically injects it as an environment variable at runtime

**Example:**
```
? Enter a value for GEMINI_API_KEY [input is hidden] ****************************
✔ Created a new secret version projects/39439361072/secrets/GEMINI_API_KEY/versions/1
```

### Step 3: Grant Access to the Secret (Automatic)

Firebase App Hosting automatically grants the necessary permissions. The secret is now available to your backend at runtime.

### Step 4: Verify Secret is Configured

Check your `apphosting.yaml` - it should now reference the secret:

```yaml
env:
  # ... public variables ...
  
  - variable: GEMINI_API_KEY
    secret: GEMINI_API_KEY  # References Cloud Secret Manager
```

---

## 🔄 How It Works at Runtime

When Firebase App Hosting deploys your backend:

1. **Public variables** from `apphosting.yaml` are injected as environment variables
2. **Secret references** trigger a fetch from Google Cloud Secret Manager
3. Your application code reads them via `process.env.GEMINI_API_KEY`
4. Secrets are **never written to disk** or exposed in logs

**In your code:**
```typescript
// lib/ai/genkit_functions.ts
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not defined');
}
```

✅ This works automatically - no code changes needed!

---

## 📋 Current Environment Variable Status

### ✅ Already Configured (Public)
- `NEXT_PUBLIC_FIREBASE_API_KEY` ✓
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` ✓
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` ✓
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` ✓
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` ✓
- `NEXT_PUBLIC_FIREBASE_APP_ID` ✓

### ⚠️ Needs Setup (Secret)
- `GEMINI_API_KEY` - **Run:** `firebase apphosting:secrets:set GEMINI_API_KEY`

---

## 🔧 Managing Secrets (Common Operations)

### List All Secrets
```bash
firebase apphosting:secrets:access GEMINI_API_KEY
```

### Update a Secret (Rotate API Key)
```bash
firebase apphosting:secrets:set GEMINI_API_KEY
```
This creates a new version. The old version is retained for rollback.

### Delete a Secret
```bash
gcloud secrets delete GEMINI_API_KEY --project=solotype-23c1f
```

### View Secret Metadata (Not the Value)
```bash
gcloud secrets describe GEMINI_API_KEY --project=solotype-23c1f
```

---

## 🎯 Complete Deployment Workflow

### 1. **Set Up Secrets (One-Time)**
```bash
firebase apphosting:secrets:set GEMINI_API_KEY
```

### 2. **Commit Code Changes**
```bash
git add apphosting.yaml
git commit -m "feat: Configure Firebase App Hosting environment variables"
git push origin master
```

### 3. **Automatic Deployment**
Firebase App Hosting automatically:
- Detects the GitHub push
- Builds your Next.js app
- Injects environment variables (public + secrets)
- Deploys to Cloud Run
- Routes traffic to the new version

### 4. **Verify Deployment**
```bash
# Check build status (if available in your Firebase CLI version)
firebase projects:list

# Or visit Firebase Console
open https://console.firebase.google.com/project/solotype-23c1f/apphosting
```

---

## 🚨 Security Best Practices

### ✅ DO:
- Store API keys in Google Cloud Secret Manager
- Use `NEXT_PUBLIC_` prefix only for truly public values
- Rotate secrets regularly
- Review secret access logs periodically

### ❌ DON'T:
- Commit secrets to `apphosting.yaml` directly
- Use GitHub Secrets (unnecessary for Firebase App Hosting)
- Hardcode API keys in source code
- Share secret values in documentation

---

## 🐛 Troubleshooting

### Problem: "GEMINI_API_KEY is not defined in environment variables"

**Solution 1:** Secret not created
```bash
firebase apphosting:secrets:set GEMINI_API_KEY
```

**Solution 2:** Secret exists but not granted access
```bash
firebase apphosting:secrets:grantaccess GEMINI_API_KEY --backend=zentype-v0
```

**Solution 3:** Verify secret exists in Cloud Console
```
https://console.cloud.google.com/security/secret-manager?project=solotype-23c1f
```

### Problem: "Permission denied accessing secret"

**Solution:** Grant the App Hosting service account access:
```bash
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --project=solotype-23c1f \
  --role=roles/secretmanager.secretAccessor \
  --member=serviceAccount:service-39439361072@gcp-sa-firebaseapphosting.iam.gserviceaccount.com
```

---

## 📊 Comparison: GitHub Secrets vs Firebase Secrets

| Feature | GitHub Secrets | Firebase App Hosting Secrets |
|---------|---------------|------------------------------|
| **Where stored** | GitHub repository | Google Cloud Secret Manager |
| **Used for** | GitHub Actions | Runtime environment variables |
| **Access method** | `${{ secrets.NAME }}` | `process.env.NAME` |
| **Required?** | ❌ Not for App Hosting | ✅ Yes (for sensitive vars) |
| **Versioning** | No | Yes (automatic versioning) |
| **Rotation** | Manual | Easy (`secrets:set` again) |

**Verdict:** For Firebase App Hosting, use **Firebase secrets** (Google Cloud Secret Manager), NOT GitHub Secrets.

---

## 🎉 Summary

1. **Public variables** → Add to `apphosting.yaml` ✅ (already done)
2. **Secret variables** → Use Firebase CLI: `firebase apphosting:secrets:set GEMINI_API_KEY`
3. **Deploy** → Just `git push origin master` (secrets auto-injected)
4. **No GitHub Secrets needed** → Everything managed by Firebase

**Next Step:** Run the secret setup command:
```bash
firebase apphosting:secrets:set GEMINI_API_KEY
```

Then push your updated `apphosting.yaml` to trigger deployment.
