# Admin Panel Production Deployment Guide

**Document Version:** 1.0  
**Last Updated:** November 17, 2025  
**Status:** Production Ready  
**Deployment Target:** Firebase App Hosting + Cloud Functions

---

## 📋 **PRE-DEPLOYMENT CHECKLIST**

Before deploying the admin panel to production, complete ALL of the following:

### **1. Code Review & Testing**
- [x] All Phase 1-7 features implemented and tested
- [x] Playwright MCP testing completed successfully
- [x] All TypeScript compilation errors resolved
- [x] No console errors in dev environment
- [x] All admin routes require authentication
- [x] GDPR compliance verified (audit logging, CSV export)
- [x] Security rules prevent client-side access to admin collections

### **2. Environment Variables**
- [ ] `FIREBASE_PROJECT_ID` set correctly
- [ ] `FIREBASE_CLIENT_EMAIL` set correctly  
- [ ] `FIREBASE_PRIVATE_KEY` set correctly (production service account)
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY` set correctly
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` set correctly
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID` set correctly
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` set correctly
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` set correctly
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID` set correctly

### **3. Firebase Configuration**
- [ ] Production Firebase project created
- [ ] Firebase Admin SDK service account downloaded
- [ ] Firestore database created (production mode)
- [ ] Cloud Functions enabled
- [ ] Firebase App Hosting enabled
- [ ] Billing account linked (required for Cloud Functions)

### **4. Security Preparation**
- [ ] First super admin user identified (email address)
- [ ] Firestore security rules reviewed and ready to deploy
- [ ] Custom claims script tested in staging environment
- [ ] Audit log retention policy documented (7 years GDPR)

---

## 🔥 **STEP 1: UPDATE FIRESTORE SECURITY RULES**

### **Critical Security Rules for Admin Panel**

These rules MUST be added to `firestore.rules` before deployment:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // ==========================================
    // ADMIN-ONLY COLLECTIONS (NO CLIENT ACCESS)
    // ==========================================
    
    // Admin Audit Log - Server-side only
    match /adminAuditLog/{logId} {
      allow read, write: if false; // Only Firebase Admin SDK can access
    }
    
    // Admin Users Collection (if implemented)
    match /adminUsers/{userId} {
      allow read, write: if false; // Only Firebase Admin SDK can access
    }
    
    // ==========================================
    // USER COLLECTIONS WITH ADMIN OVERRIDES
    // ==========================================
    
    // Subscriptions - Users read their own, admins write via backend
    match /subscriptions/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false; // Only backend can write (subscription changes)
    }
    
    // Profiles - Users read/write their own, admins read all via backend
    match /profiles/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
      // Admins use Firebase Admin SDK for reading other users' profiles
    }
    
    // Test Results - Users read/write their own, admins read all via backend
    match /testResults/{resultId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow write: if request.auth != null && request.data.userId == request.auth.uid;
      // Admins use Firebase Admin SDK for analytics queries
    }
    
    // AI Generated Tests - Users read their own, admins read all via backend
    match /aiGeneratedTests/{testId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow write: if request.auth != null && request.data.userId == request.auth.uid;
      // Admins use Firebase Admin SDK for analytics queries
    }
    
    // ==========================================
    // EXISTING RULES (DO NOT MODIFY)
    // ==========================================
    
    // ... your existing Firestore rules for public data, etc.
  }
}
```

### **Deploy Firestore Rules**

```bash
# 1. Navigate to project root
cd /path/to/zentype_v1

# 2. Review the rules before deploying
cat firestore.rules

# 3. Deploy to production
firebase deploy --only firestore:rules --project YOUR_PRODUCTION_PROJECT_ID

# 4. Verify deployment
# Go to Firebase Console → Firestore Database → Rules tab
# Confirm updated timestamp and review deployed rules
```

---

## 🔐 **STEP 2: SET UP FIRST SUPER ADMIN USER**

### **Option A: Manual Setup (Firebase Console)**

**Use this method if you have a user already registered in Firebase Auth.**

1. **Go to Firebase Console**
   - Navigate to: https://console.firebase.google.com
   - Select your production project
   - Go to **Authentication** tab

2. **Find Your User**
   - Click on the user you want to make super admin
   - Note their **UID** (e.g., `wJae26XQ1NZD4xqbLsS650v7qZa2`)

3. **Open Cloud Shell**
   - In Firebase Console, click the Cloud Shell icon (top right)
   - Wait for terminal to initialize

4. **Set Custom Claims**
   ```bash
   # Install Firebase Admin SDK if not already installed
   npm install -g firebase-tools
   
   # Initialize Firebase Admin SDK
   firebase functions:shell --project YOUR_PRODUCTION_PROJECT_ID
   
   # Run this command in the shell:
   const admin = require('firebase-admin');
   admin.auth().setCustomUserClaims('USER_UID_HERE', {
     admin: true,
     superAdmin: true,
     canDeleteUsers: true,
     canManageSubscriptions: true,
     canViewAuditLogs: true,
     canManageSettings: true
   }).then(() => {
     console.log('✅ Super Admin claims set successfully');
   });
   ```

5. **Verify Claims**
   ```bash
   admin.auth().getUser('USER_UID_HERE').then((user) => {
     console.log('Custom claims:', user.customClaims);
   });
   ```

6. **Force User to Re-Login**
   - User must log out and log back in for claims to take effect
   - Or revoke sessions: `admin.auth().revokeRefreshTokens('USER_UID_HERE')`

---

### **Option B: Automated Script (Recommended)**

**Use this method to set up the first super admin programmatically.**

1. **Create Setup Script**

Create `scripts/setup-first-admin.js`:

```javascript
/**
 * Setup First Super Admin User
 * Run this script ONCE after production deployment
 * 
 * Usage: node scripts/setup-first-admin.js <email>
 * Example: node scripts/setup-first-admin.js admin@zentype.com
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

async function setupFirstAdmin(email) {
  try {
    console.log('🔍 Looking up user:', email);
    
    // Get user by email
    const user = await admin.auth().getUserByEmail(email);
    console.log('✅ User found:', user.uid);
    
    // Set super admin claims
    await admin.auth().setCustomUserClaims(user.uid, {
      admin: true,
      superAdmin: true,
      canDeleteUsers: true,
      canManageSubscriptions: true,
      canViewAuditLogs: true,
      canManageSettings: true,
    });
    console.log('✅ Super Admin claims set successfully');
    
    // Verify claims
    const updatedUser = await admin.auth().getUser(user.uid);
    console.log('✅ Verified custom claims:', updatedUser.customClaims);
    
    // Revoke refresh tokens to force re-login
    await admin.auth().revokeRefreshTokens(user.uid);
    console.log('✅ User sessions revoked (user must re-login)');
    
    console.log('\n🎉 Setup complete! User must log out and log back in.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Get email from command line argument
const email = process.argv[2];
if (!email) {
  console.error('❌ Usage: node scripts/setup-first-admin.js <email>');
  process.exit(1);
}

setupFirstAdmin(email);
```

2. **Run the Script**

```bash
# Set environment variables
export FIREBASE_PROJECT_ID="your-prod-project-id"
export FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
export FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Run the script
node scripts/setup-first-admin.js admin@zentype.com

# Expected output:
# 🔍 Looking up user: admin@zentype.com
# ✅ User found: wJae26XQ1NZD4xqbLsS650v7qZa2
# ✅ Super Admin claims set successfully
# ✅ Verified custom claims: { admin: true, superAdmin: true, ... }
# ✅ User sessions revoked (user must re-login)
# 🎉 Setup complete! User must log out and log back in.
```

3. **Verify in Console**
   - Go to Firebase Console → Authentication
   - Click on the user
   - Scroll down to "Custom Claims"
   - Verify all admin permissions are set

---

## ☁️ **STEP 3: DEPLOY CLOUD FUNCTIONS**

### **Cloud Functions to Deploy**

The admin panel requires these Cloud Functions:

1. **`generateAITest`** - AI test generation with subscription limits
2. **`generateSimpleTest`** - Simple mode test generation
3. **Subscription rate limiter** - Enforces daily AI test limits

### **Deployment Steps**

```bash
# 1. Navigate to functions directory
cd /path/to/zentype_v1/functions

# 2. Install dependencies (if not already done)
npm install

# 3. Build TypeScript functions
npm run build

# 4. Deploy all functions to production
firebase deploy --only functions --project YOUR_PRODUCTION_PROJECT_ID

# 5. Wait for deployment to complete (may take 3-5 minutes)
# Expected output:
# ✔  functions[us-central1-generateAITest] Successful update operation.
# ✔  functions[us-central1-generateSimpleTest] Successful update operation.

# 6. Verify deployment
firebase functions:list --project YOUR_PRODUCTION_PROJECT_ID

# 7. Test a function
firebase functions:log --project YOUR_PRODUCTION_PROJECT_ID --only generateAITest
```

### **Environment Variables for Cloud Functions**

Set these in Firebase Console → Functions → Configuration:

```bash
# Gemini API Key (for AI test generation)
GEMINI_API_KEY=your_gemini_api_key_here

# Set via Firebase CLI:
firebase functions:config:set \
  gemini.api_key="YOUR_GEMINI_KEY" \
  --project YOUR_PRODUCTION_PROJECT_ID

# Deploy config
firebase deploy --only functions --project YOUR_PRODUCTION_PROJECT_ID
```

---

## 🚀 **STEP 4: DEPLOY NEXT.JS APP (FIREBASE APP HOSTING)**

### **Prerequisites**

- Firebase App Hosting enabled
- Production Firebase project selected
- Service account with necessary permissions

### **Deployment Steps**

```bash
# 1. Navigate to project root
cd /path/to/zentype_v1

# 2. Create production environment file
cat > .env.production <<EOF
# Firebase Production Config
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123

# Firebase Admin SDK (Backend)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
EOF

# 3. Build Next.js app for production
npm run build

# 4. Test production build locally
npm run start

# 5. Deploy to Firebase App Hosting
firebase deploy --only hosting --project YOUR_PRODUCTION_PROJECT_ID

# 6. Wait for deployment (may take 5-10 minutes)
# Expected output:
# ✔  hosting: release complete
# ✔  Deploy complete!
# https://your-project-id.web.app

# 7. Verify deployment
curl https://your-project-id.web.app/api/health

# 8. Test admin login
# Open: https://your-project-id.web.app/admin/login
# Login with super admin account
```

### **Set Environment Variables in Firebase Console**

1. Go to Firebase Console → App Hosting → Settings
2. Click "Environment Variables"
3. Add each variable from `.env.production`
4. Save and redeploy

---

## 🔒 **STEP 5: SECURITY HARDENING**

### **1. IP Whitelisting (Optional but Recommended)**

Restrict admin panel access to specific IP addresses:

**Option A: Cloud Armor (Google Cloud)**
```bash
# Create IP whitelist policy
gcloud compute security-policies create admin-ip-whitelist \
    --description "Allow only specific IPs to access admin panel"

# Add allowed IPs
gcloud compute security-policies rules create 1000 \
    --security-policy admin-ip-whitelist \
    --expression "origin.ip == '203.0.113.0/24'" \
    --action "allow"

# Apply to backend service
gcloud compute backend-services update YOUR_BACKEND_SERVICE \
    --security-policy admin-ip-whitelist
```

**Option B: Firebase Security Rules (App Check)**
```javascript
// Enable App Check in Firebase Console
// Then add to app initialization:
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('YOUR_RECAPTCHA_SITE_KEY'),
  isTokenAutoRefreshEnabled: true
});
```

### **2. Rate Limiting**

Add rate limiting to admin routes:

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const ip = request.ip || 'unknown';
    const now = Date.now();
    const limit = 100; // requests per minute
    const window = 60000; // 1 minute
    
    const rateLimit = rateLimitMap.get(ip);
    if (rateLimit) {
      if (now - rateLimit.timestamp < window) {
        if (rateLimit.count >= limit) {
          return NextResponse.json(
            { error: 'Too many requests' },
            { status: 429 }
          );
        }
        rateLimit.count++;
      } else {
        rateLimitMap.set(ip, { count: 1, timestamp: now });
      }
    } else {
      rateLimitMap.set(ip, { count: 1, timestamp: now });
    }
  }
  
  return NextResponse.next();
}
```

### **3. HTTPS Only**

Ensure all admin traffic uses HTTPS:

```javascript
// next.config.mjs
export default {
  async headers() {
    return [
      {
        source: '/admin/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
        ],
      },
    ];
  },
};
```

### **4. Content Security Policy**

Add CSP headers to prevent XSS:

```javascript
// next.config.mjs
export default {
  async headers() {
    return [
      {
        source: '/admin/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https:;
              font-src 'self' data:;
              connect-src 'self' https://*.googleapis.com https://*.firebaseio.com;
              frame-ancestors 'none';
            `.replace(/\\s+/g, ' ').trim()
          },
        ],
      },
    ];
  },
};
```

---

## 📊 **STEP 6: MONITORING & ALERTING**

### **1. Set Up Google Cloud Monitoring**

```bash
# Enable Cloud Monitoring API
gcloud services enable monitoring.googleapis.com --project YOUR_PRODUCTION_PROJECT_ID

# Create notification channel (email)
gcloud alpha monitoring channels create \
    --display-name="Admin Alerts" \
    --type=email \
    --channel-labels=email_address=admin@zentype.com
```

### **2. Create Alert Policies**

**High Error Rate Alert:**
```bash
gcloud alpha monitoring policies create \
    --notification-channels=CHANNEL_ID \
    --display-name="High Error Rate - Admin Panel" \
    --condition-display-name="Error rate > 5%" \
    --condition-threshold-value=0.05 \
    --condition-threshold-duration=300s \
    --condition-filter='resource.type="cloud_function" AND metric.type="cloudfunctions.googleapis.com/function/execution_count" AND metric.labels.status!="ok"'
```

**High Latency Alert:**
```bash
gcloud alpha monitoring policies create \
    --notification-channels=CHANNEL_ID \
    --display-name="High Latency - Admin APIs" \
    --condition-display-name="Latency > 5s" \
    --condition-threshold-value=5000 \
    --condition-threshold-duration=300s \
    --condition-filter='resource.type="cloud_function" AND metric.type="cloudfunctions.googleapis.com/function/execution_times"'
```

### **3. Set Up Uptime Checks**

```bash
# Health check endpoint
gcloud monitoring uptime create \
    --display-name="Admin Panel Health Check" \
    --resource-type=uptime-url \
    --monitored-resource=https://your-project-id.web.app/api/health \
    --check-interval=5m
```

---

## 🧪 **STEP 7: POST-DEPLOYMENT VERIFICATION**

### **Verification Checklist**

After deployment, verify all features are working:

```bash
# 1. Test admin login
curl -X POST https://your-project-id.web.app/api/v1/admin/auth/verify \
  -H "Authorization: Bearer YOUR_ID_TOKEN" \
  -H "Content-Type: application/json"

# 2. Test user list API
curl https://your-project-id.web.app/api/v1/admin/users?page=1&limit=10 \
  -H "Authorization: Bearer YOUR_ID_TOKEN"

# 3. Test analytics API
curl https://your-project-id.web.app/api/v1/admin/analytics \
  -H "Authorization: Bearer YOUR_ID_TOKEN"

# 4. Test audit log API
curl https://your-project-id.web.app/api/v1/admin/audit-log?page=1&limit=50 \
  -H "Authorization: Bearer YOUR_ID_TOKEN"

# 5. Test subscription management
curl -X PUT https://your-project-id.web.app/api/v1/admin/users/USER_UID/subscription \
  -H "Authorization: Bearer YOUR_ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tier":"premium"}'
```

### **Manual UI Testing**

1. **Admin Login**
   - Visit `/admin/login`
   - Login with super admin account
   - Verify redirect to `/admin/dashboard`

2. **User Management**
   - Visit `/admin/users`
   - Search for a user
   - Click user card
   - Test all actions (edit, suspend, promote, tier change)

3. **Analytics Dashboard**
   - Visit `/admin/analytics`
   - Verify all metric cards load
   - Test auto-refresh toggle
   - Test manual refresh button

4. **Audit Log Viewer**
   - Visit `/admin/audit-log`
   - Test filters (action type, category, severity)
   - Test CSV export
   - Verify pagination works

5. **Authentication Redirect**
   - Log out
   - Try to access `/admin/users`
   - Verify redirect to `/admin/login`

---

## 🚨 **ROLLBACK PLAN**

If deployment fails or critical bugs are discovered:

### **Option 1: Rollback Cloud Functions**

```bash
# List all deployments
firebase functions:log --project YOUR_PRODUCTION_PROJECT_ID

# Rollback to previous version
firebase functions:delete FUNCTION_NAME --project YOUR_PRODUCTION_PROJECT_ID
firebase deploy --only functions --project YOUR_PRODUCTION_PROJECT_ID
```

### **Option 2: Rollback Firestore Rules**

```bash
# Go to Firebase Console → Firestore → Rules
# Click "Rules History" tab
# Select previous version
# Click "Publish"
```

### **Option 3: Rollback Next.js App**

```bash
# Go to Firebase Console → App Hosting → Releases
# Find previous working release
# Click "Rollback"
# Confirm rollback
```

---

## 📝 **PRODUCTION MAINTENANCE**

### **Weekly Tasks**
- [ ] Review audit logs for suspicious activity
- [ ] Check analytics dashboard for anomalies
- [ ] Verify all admin accounts are still active
- [ ] Review error logs in Cloud Monitoring

### **Monthly Tasks**
- [ ] Rotate Firebase service account keys
- [ ] Review and update security rules if needed
- [ ] Check for Firebase SDK updates
- [ ] Review GDPR compliance (audit log retention)
- [ ] Test disaster recovery plan

### **Quarterly Tasks**
- [ ] Full security audit
- [ ] Performance benchmarking
- [ ] Review admin permissions (remove unused admins)
- [ ] Update documentation with any changes

---

## 📞 **SUPPORT CONTACTS**

**Firebase Support:**
- Console: https://console.firebase.google.com/support
- Community: https://firebase.google.com/community

**Critical Issues:**
- Contact: admin@zentype.com
- On-Call: (Set up PagerDuty or similar)

---

## 📄 **APPENDIX: ENVIRONMENT VARIABLES**

### **Production Environment Variables (.env.production)**

```bash
# ==========================================
# FIREBASE CLIENT CONFIG (PUBLIC)
# ==========================================
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456

# ==========================================
# FIREBASE ADMIN SDK (SERVER-SIDE ONLY)
# ==========================================
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nXXXXXXXX\n-----END PRIVATE KEY-----\n"

# ==========================================
# EXTERNAL APIS
# ==========================================
GEMINI_API_KEY=your_gemini_api_key_here

# ==========================================
# APP CONFIG
# ==========================================
NEXT_PUBLIC_APP_URL=https://zentype.com
NODE_ENV=production
```

---

## ✅ **DEPLOYMENT COMPLETE**

Once all steps are completed:

1. Update this document with actual production URLs
2. Share deployment summary with team
3. Schedule post-deployment review meeting
4. Monitor logs for first 24 hours
5. Celebrate! 🎉

**Deployed By:** _______________  
**Deployment Date:** _______________  
**Production URL:** https://_______________  
**Status:** ⬜ In Progress ⬜ Complete ⬜ Failed  

---

**Document Status:** Complete  
**Next Review:** After first production deployment  
**Maintainer:** ZenType DevOps Team
