# 🚀 ZenType Live Deployment Guide

Complete step-by-step guide to deploy ZenType from any device with all necessary requirements, accounts, and configurations.

**Last Updated:** November 17, 2025  
**Status:** ✅ PRODUCTION READY - DEPLOYED TO FIREBASE APP HOSTING  
**Current Version:** v2.2.0 with Admin Panel, Subscription System & Rate Limiting  
**Production URL:** Available via Firebase Console App Hosting section

## 🆕 **What's New in v2.2.0**
- ✅ **Admin Panel:** Full user management, subscription control, analytics dashboard, and audit logging
- ✅ **Subscription System:** Free/Premium tiers with AI test generation limits
- ✅ **Session Management:** Fixed admin session persistence with `useAdminAuth` hook
- ✅ **Simple Mode:** User-provided text for typing tests
- ✅ **Enhanced Security:** Role-based access control (RBAC) with Firebase custom claims

## 📋 Prerequisites & System Requirements

### **System Requirements**
- **Node.js**: Version 18.0 or higher
- **npm**: Version 9.0 or higher (or pnpm 8.0+)
- **Git**: Latest version for version control
- **Terminal/Command Line**: Access to bash, PowerShell, or equivalent

### **Check Your System**
```bash
# Verify Node.js version
node --version    # Should be 18.0+

# Verify npm version  
npm --version     # Should be 9.0+

# Verify Git
git --version     # Any recent version
```

---

## 🔑 Required Accounts & API Keys

### **1. Google/Firebase Account**
- **Google Account**: Personal or business account with admin privileges
- **Firebase Project ID**: `solotype-23c1f`
- **Firebase Authentication**: Enable Email/Password and Google Sign-in
- **Firestore Database**: Set up in production mode

### **2. Firebase Service Account (for AI Features)**
```bash
# Firebase project configuration
PROJECT_ID="solotype-23c1f"
REGION="us-central1"
```

### **3. Required API Keys & Environment Variables**
Create a `.env.local` file in the project root:
```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyAipHBANeyyXgq1n9h2G33PAwtuXkMRu-w"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="solotype-23c1f.firebaseapp.com" 
NEXT_PUBLIC_FIREBASE_PROJECT_ID="solotype-23c1f"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="solotype-23c1f.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="39439361072"
NEXT_PUBLIC_FIREBASE_APP_ID="1:39439361072:web:27661c0d7e4e341a02b9f5"

# Google AI API (for AI test generation)
GOOGLE_AI_API_KEY="your-google-ai-api-key"
GENKIT_ENV="prod"
```

---

## 🛠️ Installation & Setup Steps

### **Step 1: Clone & Install**
```bash
# Clone the repository
git clone [repository-url] zentype
cd zentype

# Install dependencies
npm install
# OR if using pnpm
pnpm install

# Install Firebase CLI globally
npm install -g firebase-tools
```

### **Step 2: Firebase Authentication**
```bash
# Login to Firebase (opens browser)
firebase login

# Verify you're logged into correct account
firebase projects:list

# Set active project
firebase use solotype-23c1f

# Verify configuration
firebase use --debug
```

### **Step 3: Environment Setup**
```bash
# Create environment file
touch .env.local
# Add all environment variables listed above

# Verify Firebase config
firebase functions:config:get
```

### **Step 4: Local Development Test**
```bash
# Test local development server
npm run dev
# Should start on http://localhost:3000

# Test build process
npm run build
# Should complete without errors
```

---

## 🔥 Firebase Setup & Configuration

### **1. Firebase Project Setup**
- **Project ID**: `solotype-23c1f`
- **Region**: `us-central1` (critical for Cloud Functions)
- **Billing**: Blaze Plan required for Cloud Functions

### **2. Firebase Services Configuration**

#### **Authentication**
```bash
# Enable Authentication providers
firebase auth:providers:enable password
firebase auth:providers:enable google.com
```

#### **Firestore Database**
```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Required collections:
# - profiles (user profiles)
# - test_results (typing test results)  
# - test_contents (pre-made tests)
# - subscriptions (user subscription data) ✅ NEW
# - adminAuditLog (admin action logging) ✅ NEW
# - adminUsers (admin user settings - optional) ✅ NEW
```

#### **Cloud Functions**
```bash
# Navigate to functions directory
cd functions

# Install function dependencies
npm install

# Build functions
npm run build

# Deploy functions
firebase deploy --only functions
```

### **3. Required Cloud Functions**
- `submitTestResult` - Saves typing test results (✅ DEPLOYED with rate limiting: 100 req/hour)
- `generateAiTest` - Creates AI-generated typing tests (✅ DEPLOYED with rate limiting: 20 req/hour)
- `generateSimpleTest` - Creates typing tests from user-provided text (✅ DEPLOYED with subscription limits)
- `vercelLogDrain` - Processes Vercel log drains for centralized logging (✅ DEPLOYED)

### **4. Rate Limiting Implementation** ✅
- **Backend**: `firebase-functions-rate-limiter` with Firestore backend
- **AI Generation**: 20 requests per hour per authenticated user
- **Test Submission**: 100 requests per hour per authenticated user
- **Monitoring**: Integrated with enhanced debug system (RATE_LIMITING category)

---

## 🌐 Firebase App Hosting Deployment (RECOMMENDED)

### **What is Firebase App Hosting?**
Firebase App Hosting is the modern, integrated deployment solution for Next.js applications that provides:
- **Unified Deployment**: Single command deploys your entire Next.js app with all Firebase services
- **Source Control Integration**: Direct integration with your Git repository
- **Server-Side Rendering**: Full support for Next.js App Router and SSR
- **Environment Management**: Seamless environment variable handling
- **Firebase Extensions**: Built-in integration with all Firebase services
- **Automatic Scaling**: Handles traffic spikes automatically

### **Firebase App Hosting vs Traditional Hosting**
- **Traditional Firebase Hosting**: Static files only, requires separate function deployment
- **Firebase App Hosting**: Full-stack Next.js deployment with integrated backend

### **Configuration Files**

#### **firebase.json**
```json
{
  "functions": {
    "source": "functions",
    "predeploy": ["npm run build"]
  },
  "firestore": {
    "rules": "firestore.rules"
  },
  "apphosting": {
    "source": {
      "backendId": "zentype-v0",
      "rootDirectory": "/",
      "ignore": [
        "firebase.json",
        "**/.*",
        "**/node_modules/**"
      ]
    }
  }
}
```

#### **apphosting.yaml**
```yaml
# Firebase App Hosting configuration
runConfig:
  cpu: 1
  memoryMiB: 512
  maxInstances: 10
  minInstances: 0
  concurrency: 100

env:
  - variable: NODE_ENV
    value: production
  - variable: NEXT_PUBLIC_FIREBASE_PROJECT_ID
    value: solotype-23c1f
```

### **Deployment Process**

#### **Step 1: Prepare for Deployment**
```bash
# Ensure you're in the project root
cd /path/to/zentype

# Verify Firebase authentication
firebase login
firebase use solotype-23c1f

# Test local build (important!)
npm run build
```

#### **Step 2: Handle ESLint Issues (if needed)**
If you encounter ESLint errors during build:
```javascript
// next.config.mjs - Temporarily disable ESLint during builds
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Allows deployment while keeping dev warnings
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  // ... other config
};
```

#### **Step 3: Deploy to Firebase App Hosting**
```bash
# Single command deployment
firebase deploy

# What happens during deployment:
# 1. Authentication check
# 2. Project selection confirmation
# 3. Source code upload to Firebase App Hosting
# 4. Firestore rules deployment
# 5. Cloud Functions deployment
# 6. App Hosting rollout
# 7. Production URL generation
```

#### **Step 4: Monitor Deployment**
```bash
# Check deployment status
firebase apphosting:backends:list

# View deployment logs
firebase apphosting:backends:describe zentype-v0

# Access Firebase Console
open https://console.firebase.google.com/project/solotype-23c1f/apphosting
```

### **Deployment Output Example**
```
✔ apphosting: Source code uploaded at gs://firebaseapphosting-sources-39439361072-europe-west4/zentype-v0--94387-Itvxok3nIteO-.zip
✔ firestore: released rules firestore.rules to cloud.firestore
✔ functions[generateAiTest(us-central1)] Successful update operation.
✔ functions[submitTestResult(us-central1)] Successful update operation.
✔ functions[vercelLogDrain(us-central1)] Successful update operation.
✔ apphosting: Rollout for backend zentype-v0 complete!
✔ Deploy complete!
```

### **Post-Deployment Verification**

#### **Get Your Production URL**
1. Open Firebase Console: https://console.firebase.google.com/project/solotype-23c1f/apphosting
2. Navigate to App Hosting section
3. Find your `zentype-v0` backend
4. Copy the production URL (typically ends in `.web.app` or `.firebaseapp.com`)

#### **Test Production Features**
```bash
# Test key functionality:
# ✅ Application loads correctly
# ✅ User authentication works
# ✅ Typing tests function properly
# ✅ AI test generation works
# ✅ Data persistence to Firestore
# ✅ Debug panel functionality
# ✅ API endpoints respond correctly
```

### **Firebase App Hosting Benefits**
- **Integrated Deployment**: No separate hosting and function deployments
- **Automatic SSL**: HTTPS enabled by default
- **Global CDN**: Fast loading worldwide
- **Version Management**: Easy rollbacks and version control
- **Environment Variables**: Secure handling of secrets
- **Monitoring**: Built-in performance and error tracking

---

## 🌐 Alternative Deployment Methods

### **Traditional Firebase Hosting (Legacy)**
```bash
# 1. Build the application
npm run build

# 2. Deploy everything (functions + hosting)
firebase deploy

# OR deploy individually:
firebase deploy --only functions
firebase deploy --only hosting
firebase deploy --only firestore:rules
```

### **Docker + Google Cloud Run Alternative**
For advanced users who prefer containerized deployments:
```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### **Google App Engine Alternative**
```yaml
# app.yaml
runtime: nodejs18
env: standard
automatic_scaling:
  min_instances: 0
  max_instances: 10
```

### **Deployment Verification**
```bash
# Check deployment status
firebase hosting:sites:list

# View live site
open https://solotype-23c1f.web.app

# Check function logs
firebase functions:log

# Test specific function
firebase functions:shell
```

---

## 🧪 Testing & Validation

### **Local Testing Checklist**
- [ ] `npm run dev` starts without errors
- [ ] User registration/login works
- [ ] Pre-made tests load correctly
- [ ] AI test generation works
- [ ] Test results save and appear in dashboard
- [ ] History page shows saved results

### **Production Testing Checklist**
- [ ] Website loads at https://solotype-23c1f.web.app
- [ ] Authentication works in production
- [ ] Test result saving functions properly
- [ ] AI features work with production API keys
- [ ] All pages navigate correctly
- [ ] No CORS errors in browser console

---

## 🔧 Common Deployment Issues & Solutions

### **Issue 1: CORS Policy Errors**
```bash
# Solution: Ensure using onCall functions, not onRequest
# Check functions/src/index.ts - should use onCall()
export const submitTestResult = onCall(async (request) => {
  // Function logic
});
```

### **Issue 2: Authentication Failures**
```bash
# Verify Firebase project configuration
firebase use --debug

# Check environment variables
cat .env.local

# Test authentication locally first
npm run dev
```

### **Issue 3: Function Deployment Failures**
```bash
# Navigate to functions directory
cd functions

# Install dependencies
npm install

# Build functions
npm run build

# Deploy with verbose logging
firebase deploy --only functions --debug
```

### **Issue 4: Next.js Static Export Issues**
```bash
# Verify next.config.mjs has correct export settings
output: 'export'
trailingSlash: true
distDir: 'out'
```

---

## 📱 Multi-Device Deployment

### **From Windows**
```powershell
# PowerShell commands
npm install
firebase login
firebase deploy
```

### **From Mac/Linux**
```bash
# Terminal commands  
npm install
firebase login
firebase deploy
```

### **From Cloud Shell/Remote Server**
```bash
# Install Node.js if needed
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Continue with standard deployment
npm install
firebase login --no-localhost
firebase deploy
```

---

## � Admin Panel Deployment Requirements

### **⚠️ CRITICAL: Admin Panel Security Setup**

The admin panel requires additional configuration for production deployment. Follow these steps carefully to ensure secure operation.

### **1. Firebase Custom Claims (IAM Permissions)**

#### **What are Custom Claims?**
Custom claims are Firebase Authentication tokens that store user roles (admin, superAdmin) for authorization without additional database lookups.

#### **Create First Admin User**
```bash
# Using the provided script (RECOMMENDED)
node scripts/create-admin-user.js your-email@example.com superAdmin

# Manual method via Firebase Console
# 1. Go to Firebase Console → Authentication
# 2. Find your user account
# 3. Copy the UID
# 4. Use Firebase Admin SDK to set custom claims
```

#### **Required IAM Permissions in GCP**
To use Firebase Admin SDK for custom claims, ensure your service account has these roles:

1. **Go to Google Cloud Console IAM:**
   - URL: `https://console.cloud.google.com/iam-admin/iam?project=solotype-23c1f`

2. **Required Service Account Roles:**
   ```
   ✅ Firebase Admin SDK Administrator
   ✅ Service Account Token Creator
   ✅ Cloud Datastore User (for Firestore access)
   ✅ Cloud Functions Developer (for function deployment)
   ```

3. **Grant Permissions (if missing):**
   ```bash
   # Using gcloud CLI
   gcloud projects add-iam-policy-binding solotype-23c1f \
     --member="serviceAccount:firebase-adminsdk-fbsvc@solotype-23c1f.iam.gserviceaccount.com" \
     --role="roles/firebase.admin"
   ```

#### **Verify Custom Claims Work**
```bash
# Test custom claims API
curl -X GET https://your-app.web.app/api/v1/admin/auth/verify \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN"

# Expected response:
# { "success": true, "userId": "...", "email": "...", "claims": { "admin": true } }
```

---

### **2. Firestore Security Rules for Admin Collections**

#### **Critical Security Rules**
Add these rules to `firestore.rules` before deploying:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ✅ User profiles - users can read/write their own
    match /profiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // ✅ Test results - users can read/write their own
    match /testResults/{documentId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // 🔒 ADMIN ONLY: Subscriptions collection
    match /subscriptions/{userId} {
      // Users can read their own subscription
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Only server-side (Admin SDK) can write
      allow write: if false;
    }
    
    // 🔒 ADMIN ONLY: Admin audit log
    match /adminAuditLog/{logId} {
      // No client access - only Firebase Admin SDK
      allow read, write: if false;
    }
    
    // 🔒 ADMIN ONLY: Admin user settings
    match /adminUsers/{userId} {
      // No client access - only Firebase Admin SDK
      allow read, write: if false;
    }
  }
}
```

#### **Deploy Security Rules**
```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Verify rules deployed
firebase firestore:rules:get
```

---

### **3. Admin API Routes & Session Management**

#### **Server-Side vs Client-Side Rendering**

**🔴 CRITICAL PATTERN: Admin Pages Must Use Client-Side Auth**

Admin pages use the `useAdminAuth` hook pattern to avoid session loss on page refresh:

```typescript
// ✅ CORRECT: Client-side authentication with async listener
'use client';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function AdminDashboard() {
  const { user, adminData, isLoading, error } = useAdminAuth();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay />;
  if (!user) return <Navigate to="/admin/login" />;
  
  return <DashboardContent />;
}
```

```typescript
// ❌ WRONG: Synchronous auth checks cause race conditions
const currentUser = auth.currentUser; // NULL on page refresh!
if (!currentUser) redirect('/admin/login'); // Always redirects
```

**Why This Matters:**
- Firebase Auth restoration takes 100-500ms on page load
- Synchronous checks happen BEFORE restoration completes
- Result: Admin loses session on every page refresh
- Solution: Use `onAuthStateChanged` listener in `useAdminAuth` hook

#### **Admin API Routes**

All admin API routes follow this authentication pattern:

```typescript
// Server-side API route pattern
import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin, requireSuperAdmin } from '@/lib/admin-middleware';
import { logAdminAction } from '@/lib/admin-audit-logger';

export async function GET(request: NextRequest) {
  // 1. Verify admin authorization
  const adminCheck = await verifyAdmin(request);
  if (!adminCheck.authorized) {
    return NextResponse.json(
      { success: false, message: adminCheck.error },
      { status: 403 }
    );
  }
  
  // 2. Log admin action (GDPR compliance)
  await logAdminAction({
    adminUserId: adminCheck.userId!,
    adminEmail: adminCheck.email!,
    action: 'VIEW_ANALYTICS',
    category: 'analytics',
    ipAddress: request.headers.get('x-forwarded-for'),
    userAgent: request.headers.get('user-agent')
  });
  
  // 3. Perform action
  const data = await fetchAnalytics();
  
  return NextResponse.json({ success: true, data });
}
```

#### **Admin API Endpoints**

| Endpoint | Method | Purpose | Auth Required | Server/Client |
|----------|--------|---------|---------------|---------------|
| `/api/v1/admin/auth/verify` | GET/POST | Verify admin access | Bearer token | Server |
| `/api/v1/admin/users` | GET | List all users | admin | Server |
| `/api/v1/admin/users/[uid]` | GET | User details | admin | Server |
| `/api/v1/admin/users/[uid]` | PUT | Edit profile | admin | Server |
| `/api/v1/admin/users/[uid]/promote` | POST/DELETE | Role changes | superAdmin | Server |
| `/api/v1/admin/users/[uid]/suspend` | POST | Suspend/unsuspend | admin | Server |
| `/api/v1/admin/users/[uid]/delete` | DELETE | Delete account | superAdmin | Server |
| `/api/v1/admin/users/[uid]/subscription` | GET/PUT | Subscription mgmt | admin | Server |
| `/api/v1/admin/subscriptions` | GET | List subscriptions | admin | Server |
| `/api/v1/admin/analytics` | GET | Platform metrics | admin | Server |
| `/api/v1/admin/audit-log` | GET | Audit log viewer | admin | Server |

#### **Authorization Middleware**

```typescript
// /lib/admin-middleware.ts pattern
export async function requireAdmin(request: NextRequest): Promise<AdminAuthResult> {
  // 1. Extract Bearer token
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { authorized: false, error: 'No authorization token' };
  }
  
  // 2. Verify Firebase ID token
  const token = authHeader.substring(7);
  const decodedToken = await adminAuth.verifyIdToken(token);
  
  // 3. Check custom claims
  if (!decodedToken.admin && !decodedToken.superAdmin) {
    return { authorized: false, error: 'Insufficient permissions' };
  }
  
  return {
    authorized: true,
    userId: decodedToken.uid,
    email: decodedToken.email,
    claims: decodedToken
  };
}
```

---

### **4. Subscription System Configuration**

#### **Firestore Subscription Schema**
```typescript
interface Subscription {
  userId: string;              // User UID
  tier: 'free' | 'premium';    // Subscription tier
  status: 'active' | 'canceled';
  aiTestsUsed: number;         // Daily AI test count
  aiTestLimit: number;         // Daily limit (free: 3, premium: 50)
  lastResetDate: string;       // YYYY-MM-DD for midnight UTC reset
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### **Subscription Rate Limiter**
```typescript
// /functions/src/subscription-rate-limiter.ts
export async function checkAiTestLimit(userId: string): Promise<{
  allowed: boolean;
  remaining: number;
  limit: number;
  tier: string;
}> {
  const subscription = await getSubscription(userId);
  
  // Check if daily reset needed (midnight UTC)
  const today = new Date().toISOString().split('T')[0];
  if (subscription.lastResetDate !== today) {
    await resetDailyUsage(userId, today);
    subscription.aiTestsUsed = 0;
  }
  
  // Check limit
  const allowed = subscription.aiTestsUsed < subscription.aiTestLimit;
  
  return {
    allowed,
    remaining: Math.max(0, subscription.aiTestLimit - subscription.aiTestsUsed),
    limit: subscription.aiTestLimit,
    tier: subscription.tier
  };
}
```

---

### **5. Admin Audit Logging (GDPR Compliance)**

#### **Audit Log Schema**
```typescript
interface AdminAuditLogEntry {
  id: string;                  // Auto-generated Firestore ID
  adminUserId: string;         // Admin who performed action
  adminEmail: string;          // Admin email
  action: string;              // VIEW_USER, EDIT_PROFILE, SUSPEND_ACCOUNT, etc.
  category: 'authentication' | 'subscription' | 'user-management' | 'analytics' | 'data-privacy';
  timestamp: Timestamp;
  metadata?: {                 // Action-specific data
    targetUserId?: string;
    changes?: Record<string, any>;
    reason?: string;
  };
  ipAddress?: string;
  userAgent?: string;
}
```

#### **Audit Logger Usage**
```typescript
// Log all admin actions
import { logAdminAction } from '@/lib/admin-audit-logger';

await logAdminAction({
  adminUserId: 'admin-uid',
  adminEmail: 'admin@example.com',
  action: 'SUSPEND_ACCOUNT',
  category: 'user-management',
  metadata: {
    targetUserId: 'user-uid',
    reason: 'Violation of terms of service'
  },
  ipAddress: request.headers.get('x-forwarded-for'),
  userAgent: request.headers.get('user-agent')
});
```

---

### **6. Firebase Security & IAM Checklist**

#### **Pre-Deployment Security Checklist**

- [ ] **Firestore Security Rules Deployed**
  - [ ] `subscriptions/{userId}` - read: self, write: server-only
  - [ ] `adminAuditLog/{logId}` - no client access
  - [ ] `adminUsers/{userId}` - no client access

- [ ] **Firebase Admin SDK Service Account**
  - [ ] Service account key downloaded (if needed for local dev)
  - [ ] IAM roles granted: Firebase Admin, Token Creator, Datastore User
  - [ ] Service account key stored securely (NOT in Git)

- [ ] **Firebase Custom Claims**
  - [ ] At least one superAdmin user created
  - [ ] Admin verification API tested (`/api/v1/admin/auth/verify`)
  - [ ] Custom claims persist across sessions

- [ ] **Admin API Authorization**
  - [ ] All admin routes use `requireAdmin()` or `requireSuperAdmin()`
  - [ ] Bearer token verification working
  - [ ] Unauthorized access returns 403 Forbidden

- [ ] **Audit Logging**
  - [ ] All admin actions logged to `adminAuditLog` collection
  - [ ] Audit log API tested (`/api/v1/admin/audit-log`)
  - [ ] CSV export functionality working

- [ ] **Subscription System**
  - [ ] Rate limiter tested (free: 3/day, premium: 50/day)
  - [ ] Midnight UTC reset logic working
  - [ ] Admin can manually change user tiers

- [ ] **Session Management**
  - [ ] `useAdminAuth` hook used on all admin pages
  - [ ] Admin sessions persist across page refreshes
  - [ ] No synchronous `auth.currentUser` checks in admin pages

---

## 🛡️ Security & Best Practices

### **Environment Variables Security**
- Never commit `.env.local` to Git
- Use Firebase secrets for production API keys
- Rotate API keys regularly
- Store Firebase service account keys securely

### **Firebase Security Rules**
See **Admin Panel Deployment Requirements → Section 2** above for complete Firestore security rules.

### **Admin Panel Security Best Practices**
1. **Principle of Least Privilege:**
   - Regular admins: user management, subscription control
   - Super admins: role promotion, account deletion, system settings

2. **Audit Everything:**
   - All admin actions logged with timestamp, admin ID, and metadata
   - Audit logs stored in Firestore (no client access)
   - CSV export available for compliance audits

3. **Session Management:**
   - Use `useAdminAuth` hook (async Firebase Auth listener)
   - Never use synchronous `auth.currentUser` checks
   - Handle loading states properly

4. **Self-Protection:**
   - Admins cannot suspend themselves
   - Admins cannot delete themselves
   - Super admins cannot demote themselves
   - Must remove admin role before account deletion

5. **Rate Limiting:**
   - Admin API routes have rate limits to prevent abuse
   - Subscription limits enforced server-side (not client-side)

---

## 📞 Support & Troubleshooting

### **Useful Commands**
```bash
# Check Firebase project status
firebase projects:list

# View function logs
firebase functions:log --only submitTestResult

# Test functions locally
firebase emulators:start

# Reset local Firebase config  
firebase use --clear
firebase use solotype-23c1f
```

### **Debug Information**
- **Project Console**: https://console.firebase.google.com/project/solotype-23c1f
- **App Hosting Console**: https://console.firebase.google.com/project/solotype-23c1f/apphosting
- **Live Site**: Available via Firebase Console App Hosting section
- **Function Region**: us-central1
- **Backend ID**: zentype-v0

### **Firebase App Hosting Specific Commands**
```bash
# List all App Hosting backends
firebase apphosting:backends:list

# Get detailed backend information
firebase apphosting:backends:describe zentype-v0

# View rollout history
firebase apphosting:rollouts:list --backend zentype-v0

# Create a new rollout (redeploy)
firebase deploy
```

### **Emergency Rollback**
```bash
# Revert to previous working commit
git log --oneline -10
git reset --hard [commit-hash]
firebase deploy
```

---

## 📊 Deployment Checklist

### **Pre-Deployment**
- [ ] All environment variables configured
- [ ] Firebase CLI authenticated (`firebase login`)
- [ ] Correct project selected (`firebase use solotype-23c1f`)
- [ ] Local testing completed successfully (`npm run dev`)
- [ ] Build process works (`npm run build`)
- [ ] Code committed to Git
- [ ] ESLint issues resolved or temporarily disabled

### **Firebase App Hosting Deployment**
- [ ] `firebase deploy` command executed successfully
- [ ] Source code uploaded to Firebase App Hosting
- [ ] Firestore rules deployed
- [ ] Cloud Functions updated (generateAiTest, submitTestResult, vercelLogDrain)
- [ ] App Hosting rollout completed
- [ ] Production URL obtained from Firebase Console

### **Post-Deployment Verification**

#### **Core Functionality**
- [ ] Production site loads correctly
- [ ] Test user registration/login functionality
- [ ] Verify typing test functionality works
- [ ] Test AI generation functionality (rate limiting: 20 req/hour)
- [ ] Verify test result saving works (rate limiting: 100 req/hour)
- [ ] Check all pages navigate correctly
- [ ] Monitor function logs for errors
- [ ] Confirm no CORS errors in browser console
- [ ] Verify rate limiting is working correctly
- [ ] Test debug system and RATE_LIMITING category logging
- [ ] Verify Firebase Authentication integration
- [ ] Test Firestore data persistence

#### **Admin Panel Verification** ✅ NEW
- [ ] **Admin Authentication:**
  - [ ] Admin login page loads (`/admin/login`)
  - [ ] First superAdmin user created (via script)
  - [ ] Admin can log in successfully
  - [ ] Non-admin users blocked with 403 error
  - [ ] Admin sessions persist across page refreshes

- [ ] **Admin Dashboard:**
  - [ ] Dashboard loads with permission badges
  - [ ] Shows admin role and email correctly
  - [ ] Navigation links work (Users, Analytics, Audit Log, Subscriptions)

- [ ] **User Management:**
  - [ ] User list loads with pagination
  - [ ] Search and filters work
  - [ ] User detail pages load
  - [ ] Profile editing works
  - [ ] Role promotion (user → admin) works
  - [ ] Account suspension works
  - [ ] Suspended users cannot log in
  - [ ] Account deletion works (after role removal)

- [ ] **Subscription Management:**
  - [ ] Subscription list loads
  - [ ] Tier changes work (free ↔ premium)
  - [ ] AI test limits enforced correctly
  - [ ] Midnight UTC reset logic working

- [ ] **Analytics Dashboard:**
  - [ ] All 8 metric cards display data
  - [ ] Auto-refresh toggle works
  - [ ] Manual refresh updates data
  - [ ] System health indicators correct

- [ ] **Audit Log:**
  - [ ] Audit log loads with entries
  - [ ] Filters work (category, action, date range)
  - [ ] Pagination works
  - [ ] CSV export downloads correctly
  - [ ] All admin actions being logged

- [ ] **Security Verification:**
  - [ ] Firestore security rules deployed
  - [ ] Admin API routes require authorization
  - [ ] Unauthorized access returns 403
  - [ ] Custom claims working correctly
  - [ ] Audit logging captures all actions

---

**🎉 Deployment Complete!** Your ZenType application is now live on Firebase App Hosting with full Next.js App Router support, integrated Firebase services, and production-ready performance.

**Key Achievement:** Successfully deployed using Firebase App Hosting with unified deployment, automatic scaling, and integrated Firebase services including Firestore, Authentication, and Cloud Functions.

For any issues, refer to the troubleshooting section or check the `docs/errors.md` file for known solutions.
