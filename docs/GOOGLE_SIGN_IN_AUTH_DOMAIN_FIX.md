# Google Sign-In Authorized Domain Fix - November 14, 2025

## Problem

**Error:** `auth/unauthorized-domain`  
**Location:** Production site (https://zentype-v1--solotype-23c1f.europe-west4.hosted.app)  
**Issue:** Google Sign-In popup opens but fails with unauthorized domain error

```json
{
  "code": "auth/unauthorized-domain",
  "message": "This domain is not authorized for OAuth operations",
  "name": "FirebaseError"
}
```

## Root Cause

Firebase Authentication has a whitelist of **authorized domains** that can use OAuth providers (Google, GitHub, etc.). When you deploy to a new Firebase App Hosting backend, the new domain is **not automatically added** to this whitelist.

Your production domain `zentype-v1--solotype-23c1f.europe-west4.hosted.app` was not in the authorized domains list.

---

## Solution: Add Domain to Firebase Auth

### Method 1: Firebase Console (Recommended - Fastest)

1. **Go to Firebase Console:**
   - Visit: https://console.firebase.google.com/
   - Select project: `solotype-23c1f`

2. **Navigate to Authentication:**
   - Click **"Authentication"** in left sidebar
   - Click **"Settings"** tab
   - Scroll to **"Authorized domains"** section

3. **Add Your Production Domain:**
   - Click **"Add domain"** button
   - Enter: `zentype-v1--solotype-23c1f.europe-west4.hosted.app`
   - Click **"Add"**

4. **Verify It Was Added:**
   Should see it in the list with status: ✅ Active

5. **Test Immediately:**
   - No deployment needed
   - Change takes effect immediately
   - Try Google Sign-In again in production

---

### Method 2: Firebase CLI (Alternative)

If you prefer CLI, you can view and add domains:

#### View Current Authorized Domains:
```bash
firebase auth:export auth-config.json
```

Then check the `authorizedDomains` array in the exported file.

#### Add via CLI:
Unfortunately, Firebase CLI doesn't have a direct command to add authorized domains. You must use the console or the REST API.

---

### Method 3: Firebase Admin SDK (Programmatic)

If you need to automate this, you can use the Firebase Admin SDK:

```typescript
import { auth } from 'firebase-admin';

await auth().updateProjectConfig({
  authorizedDomains: [
    'localhost',
    'solotype-23c1f.firebaseapp.com',
    'solotype-23c1f.web.app',
    'zentype-v1--solotype-23c1f.europe-west4.hosted.app'
  ]
});
```

**Note:** This requires Admin SDK with proper permissions.

---

## Expected Authorized Domains List

After fix, your Firebase Authentication authorized domains should include:

```
✅ localhost                                                      (for local dev)
✅ solotype-23c1f.firebaseapp.com                                (default Firebase domain)
✅ solotype-23c1f.web.app                                        (Firebase Hosting domain)
✅ zentype-v0--solotype-23c1f.europe-west4.hosted.app           (old backend - optional)
✅ zentype-v1--solotype-23c1f.europe-west4.hosted.app           (NEW - add this!)
```

---

## Why This Happens

### Firebase App Hosting vs Firebase Hosting

**Firebase Hosting:**
- Domains like `project-id.web.app` and `project-id.firebaseapp.com`
- Automatically added to authorized domains when you enable Firebase Hosting

**Firebase App Hosting:**
- Domains like `backend-id--project-id.region.hosted.app`
- **NOT automatically added** to authorized domains
- You must manually whitelist each backend's domain

### Security Reason

This is a security feature to prevent:
- Unauthorized domains from using your OAuth credentials
- Phishing attacks using your Firebase project
- Man-in-the-middle attacks on authentication flow

---

## Testing After Fix

### Test Google Sign-In:

1. **Go to Production Signup:**
   ```
   https://zentype-v1--solotype-23c1f.europe-west4.hosted.app/signup
   ```

2. **Click "Sign in with Google"**

3. **Expected Behavior:**
   - ✅ Google popup opens
   - ✅ Shows Google account selection
   - ✅ Allows you to select account
   - ✅ Redirects back to site with authentication
   - ✅ No `auth/unauthorized-domain` error

4. **Check Console:**
   - Should see: `"Google signup successful: [uid]"`
   - Should see: `"Profile created: ..."`

### Test Login Page Too:

```
https://zentype-v1--solotype-23c1f.europe-west4.hosted.app/login
```

Click "Sign in with Google" - should work identically.

---

## Additional OAuth Providers

If you add other OAuth providers in the future (GitHub, Facebook, Twitter, etc.), you'll need to:

1. **Configure the provider in Firebase Console:**
   - Authentication → Sign-in method → Add provider

2. **Ensure domain is authorized:**
   - Already done if you added it for Google Sign-In
   - Same authorized domains list applies to all OAuth providers

---

## Common Mistakes to Avoid

### ❌ Don't Include Protocol:
```
❌ https://zentype-v1--solotype-23c1f.europe-west4.hosted.app
✅ zentype-v1--solotype-23c1f.europe-west4.hosted.app
```

### ❌ Don't Include Trailing Slash:
```
❌ zentype-v1--solotype-23c1f.europe-west4.hosted.app/
✅ zentype-v1--solotype-23c1f.europe-west4.hosted.app
```

### ❌ Don't Include Port:
```
❌ zentype-v1--solotype-23c1f.europe-west4.hosted.app:443
✅ zentype-v1--solotype-23c1f.europe-west4.hosted.app
```

### ❌ Don't Include Paths:
```
❌ zentype-v1--solotype-23c1f.europe-west4.hosted.app/login
✅ zentype-v1--solotype-23c1f.europe-west4.hosted.app
```

---

## Related Issues

### CORS Configuration (Already Fixed)

You previously added the domain to Cloud Functions CORS:

**File:** `functions/src/index.ts`

```typescript
cors: [
  "http://localhost:3000",
  "https://zentype-v1--solotype-23c1f.europe-west4.hosted.app"  // ✅ Already added
]
```

This allows the domain to call your Cloud Functions, but is **separate from** Firebase Auth authorized domains.

### Firebase Hosting Domain (Not Affected)

Your old Firebase Hosting domain works because it was automatically authorized:
- `solotype-23c1f.web.app` - Auto-authorized
- `solotype-23c1f.firebaseapp.com` - Auto-authorized

But App Hosting uses different domain pattern:
- `zentype-v1--solotype-23c1f.europe-west4.hosted.app` - Must manually authorize

---

## Rollout to Other Branches

If you create preview deployments or other branches:

**Preview URLs Pattern:**
```
backend-id--branch-name--project-id.region.hosted.app
```

**Example:**
```
zentype-v1--feature-auth--solotype-23c1f.europe-west4.hosted.app
```

You'll need to add **each unique domain** to authorized domains, OR use a wildcard (if Firebase supports it).

**Wildcard (if supported):**
```
*.europe-west4.hosted.app
```

**Note:** Check Firebase documentation to see if wildcard domains are supported for your plan.

---

## Verification Checklist

After adding the domain, verify:

- [ ] Domain visible in Firebase Console → Authentication → Settings → Authorized domains
- [ ] Google Sign-In button works on `/signup` page
- [ ] Google Sign-In button works on `/login` page
- [ ] No `auth/unauthorized-domain` error in console
- [ ] User successfully redirected after Google auth
- [ ] User profile created in Firestore
- [ ] User can access `/dashboard` after sign-in

---

## Quick Command Reference

### Check Firebase Auth Config:
```bash
firebase auth:export auth-config.json
cat auth-config.json | grep -A 10 "authorizedDomains"
```

### View Project Info:
```bash
firebase projects:list
firebase use solotype-23c1f
```

### View App Hosting Backends:
```bash
firebase apphosting:backends:list
```

---

## Support Links

- **Firebase Auth Docs:** https://firebase.google.com/docs/auth/web/google-signin
- **Authorized Domains:** https://firebase.google.com/docs/auth/web/redirect-best-practices
- **App Hosting Domains:** https://firebase.google.com/docs/app-hosting/about-app-hosting

---

**Issue Reported:** November 14, 2025  
**Status:** 🔧 Fix in progress - User adding domain via Firebase Console  
**ETA:** Immediate (takes effect as soon as domain is added)  
**No Code Changes Needed:** ✅ Configuration only
