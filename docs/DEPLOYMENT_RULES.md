# ZenType Deployment Rules

**Last Updated**: November 3, 2025

## 🚨 CRITICAL RULE: Production Deployment

### When User Says "Put to Production" or "Deploy to Production"

**ALWAYS means:** Deploy to Firebase Hosting ONLY

**NEVER means:** 
- ❌ Merge branches to master
- ❌ Push to GitHub
- ❌ Cherry-pick commits to master
- ❌ Any Git operations that affect branches

---

## Proper Firebase Deployment Process

### Step 1: Verify Locally with Playwright MCP
Before ANY deployment, you MUST verify everything works:

```bash
# 1. Server running on localhost:3000
npm run dev

# 2. Test with Playwright MCP
- Navigate to all affected pages
- Test critical functionality
- Verify no console errors
- Confirm Firebase Admin SDK working
```

### Step 2: Build Production Version
```bash
# Build Next.js for production
npm run build

# Verify build succeeded with no errors
# Check .next folder exists
```

### Step 3: Deploy to Firebase Hosting
```bash
# Deploy ONLY to Firebase Hosting
firebase deploy --only hosting

# If backend functions changed:
firebase deploy --only functions

# Full deployment (only if needed):
firebase deploy
```

### Step 4: Verify Production Deployment
```bash
# Open production site
open https://solotype-23c1f.web.app

# Test with Playwright MCP on production URL
- Verify all features working
- Test authentication
- Test result saving
- Verify charts rendering
```

---

## Git Workflow (Separate from Deployment)

### When to Commit to Git
**Only when explicitly asked:**
- "Commit this"
- "Save to Git"
- "Push to GitHub"
- "Merge to master"

### Git Commands
```bash
# 1. Commit locally
git add .
git commit -m "feat: descriptive commit message"

# 2. Push to origin (only when asked)
git push origin master

# 3. Never cherry-pick without explicit instruction
# Never force push without explicit instruction
```

---

## Environment Variables for Production

### Required in Firebase Secret Manager
```bash
# Add Firebase Admin SDK credentials to production
firebase functions:secrets:set FIREBASE_SERVICE_ACCOUNT_KEY

# Add Gemini API key
firebase functions:secrets:set GEMINI_API_KEY
```

### Local Development (.env.local)
```env
# Firebase Client SDK (public)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...

# Firebase Admin SDK (server-side only)
FIREBASE_SERVICE_ACCOUNT_KEY=path/to/service-account.json

# Google Gemini API
GEMINI_API_KEY=...
```

---

## Common Mistakes to Avoid

### ❌ DON'T
1. Don't merge branches when user says "production"
2. Don't cherry-pick commits without testing
3. Don't deploy without Playwright verification
4. Don't force push to master without explicit permission
5. Don't deploy without building first (`npm run build`)

### ✅ DO
1. Always verify with Playwright MCP first
2. Build production version before deploying
3. Deploy to Firebase Hosting with `firebase deploy --only hosting`
4. Verify production site after deployment
5. Keep Git operations separate from deployment

---

## Emergency Rollback Procedure

### If Production Breaks After Deployment

**Option 1: Rollback Firebase Hosting**
```bash
# List previous deployments
firebase hosting:releases:list

# Rollback to previous version
firebase hosting:rollback
```

**Option 2: Redeploy Working Version**
```bash
# 1. Checkout last working commit
git checkout <working-commit-hash>

# 2. Build production
npm run build

# 3. Deploy to Firebase
firebase deploy --only hosting

# 4. Return to master
git checkout master
```

---

## Checklist: Before Every Production Deployment

```markdown
- [ ] All features verified working locally with Playwright MCP
- [ ] No console errors on critical pages
- [ ] Firebase Admin SDK initialized successfully
- [ ] Test result saving works
- [ ] Leaderboard loading works
- [ ] Charts rendering correctly
- [ ] npm run build completes successfully
- [ ] No TypeScript compilation errors
- [ ] .env.local has all required variables
- [ ] Service account key file exists
```

---

## Production URLs

- **Hosting**: https://solotype-23c1f.web.app
- **Backend (App Hosting)**: https://zentype-v0-backend-<region>.web.app
- **Firebase Console**: https://console.firebase.google.com/project/solotype-23c1f

---

## Summary

**"Put to production" = Firebase deployment, NOT Git merge**

Always follow this order:
1. ✅ Verify locally with Playwright MCP
2. ✅ Build production version
3. ✅ Deploy to Firebase
4. ✅ Verify production site
5. ✅ (Optional) Commit to Git if explicitly asked

**Never mix deployment with Git operations unless explicitly instructed.**
