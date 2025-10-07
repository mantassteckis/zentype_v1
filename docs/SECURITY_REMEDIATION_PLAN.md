# ZenType Security Remediation Implementation Plan

**Created:** October 7, 2025
**Status:** 🔴 ACTIVE - Critical Security Fixes Required
**Owner:** Development Team
**Reference:** SECURITY_AUDIT_REPORT.md

---

## 📋 Table of Contents

- [Executive Summary](#executive-summary)
- [Prerequisites & Preparation](#prerequisites--preparation)
- [Phase 1: Critical Fixes (IMMEDIATE)](#phase-1-critical-fixes-immediate)
- [Phase 2: High-Priority Fixes (Pre-Beta)](#phase-2-high-priority-fixes-pre-beta)
- [Phase 3: Medium-Priority Fixes (Pre-Production)](#phase-3-medium-priority-fixes-pre-production)
- [Testing & Validation](#testing--validation)
- [Deployment Procedures](#deployment-procedures)
- [Rollback Procedures](#rollback-procedures)
- [Related Documentation](#related-documentation)

---

## 📊 Executive Summary

### Current Status
**Production Readiness**: 🔴 **NOT READY FOR DEPLOYMENT**
**Blocking Issues**: 3 Critical, 8 High-Priority vulnerabilities
**Estimated Total Time**: ~29 hours across 3 phases

### Remediation Phases
| Phase | Priority | Issues | Time | Deployment Gate |
|-------|----------|--------|------|-----------------|
| Phase 1 | CRITICAL | 6 issues | 5 hours | Blocks ALL deployments |
| Phase 2 | HIGH | 5 issues | 12 hours | Blocks public beta |
| Phase 3 | MEDIUM | 8 issues | 12 hours | Blocks production launch |

### Success Criteria
- ✅ All Phase 1 fixes deployed and tested
- ✅ Authentication flows validated (no bypasses)
- ✅ Firestore rules restrict unauthorized access
- ✅ Admin endpoints secured with role validation
- ✅ No hardcoded secrets in source code
- ✅ QUICK_VERIFICATION_GUIDE.md checklist passes

---

## 🔧 Prerequisites & Preparation

### Before Starting Any Fixes

#### 1. **Create Feature Branch**
```bash
# Create security fix branch from current main
git checkout -b security/critical-fixes-phase-1

# Verify clean working directory
git status
```

#### 2. **Backup Current State**
```bash
# Tag current state for rollback reference
git tag security-audit-baseline-2025-10-07

# Push tag to remote
git push origin security-audit-baseline-2025-10-07
```

#### 3. **Review IKB Documentation**
Read these documents before proceeding (30 minutes):
- `SECURITY_AUDIT_REPORT.md` - All vulnerability details
- `FIRESTORE_SCHEMA.md` - Database structure reference
- `DEPLOYMENT_GUIDE.md` - Deployment procedures
- `RATE_LIMITING_FUTURE_IMPLEMENTATION.md` - Rate limiting context
- `.github/chatmodes/J.chatmode.md` - Development philosophy

#### 4. **Environment Setup**
```bash
# Ensure you have latest dependencies
npm install

# Verify Firebase CLI is authenticated
firebase login

# Check Firebase project
firebase use solotype-23c1f

# Verify environment variables are set
cat .env.local | grep -E "FIREBASE_SERVICE_ACCOUNT_KEY|GEMINI_API_KEY"
```

#### 5. **Set Up Local Testing Environment**
```bash
# Start Firebase emulators (in separate terminal)
cd functions
npm run serve

# In another terminal, start Next.js dev server
npm run dev
```

### Team Communication
- [ ] Notify team of security fixes in progress
- [ ] Block production deployments until Phase 1 complete
- [ ] Schedule testing window for Phase 1 validation
- [ ] Prepare staging environment for testing

---

## 🔴 PHASE 1: Critical Fixes (IMMEDIATE)

**Objective**: Eliminate active data breach risks and authentication bypasses
**Estimated Time**: 5 hours
**Deployment Gate**: MANDATORY before ANY deployment (dev, staging, production)

### Fix 1.1: Firestore Security Rules (30 minutes)

**Issue**: CRIT-001 from SECURITY_AUDIT_REPORT.md
**Location**: `firestore.rules:16`
**Current Risk**: Complete database exposure to anonymous users

#### Implementation Steps

**Step 1: Read Current Rules** (5 min)
```bash
# Review current Firestore rules
cat firestore.rules

# Check deployed rules in Firebase Console
firebase firestore:rules --project solotype-23c1f
```

**Step 2: Create New Secure Rules** (15 min)

Open `firestore.rules` and **REPLACE** lines 15-17 with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function: Check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }

    // Helper function: Check if user owns the document
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Helper function: Check if user is admin (via custom claims)
    function isAdmin() {
      return isAuthenticated() && request.auth.token.admin == true;
    }

    // ========================================
    // PROFILES COLLECTION
    // ========================================
    match /profiles/{userId} {
      // Users can read their own profile
      allow read: if isOwner(userId);

      // Users can create/update their own profile
      allow create, update: if isOwner(userId);

      // Only user can delete their own profile
      allow delete: if isOwner(userId);
    }

    // ========================================
    // TEST RESULTS COLLECTION
    // ========================================
    match /testResults/{resultId} {
      // Users can only write their own test results
      allow create: if isAuthenticated()
                    && request.resource.data.userId == request.auth.uid;

      // Users can read their own results
      allow read: if isAuthenticated()
                  && resource.data.userId == request.auth.uid;

      // Users can update their own results (for corrections)
      allow update: if isOwner(resource.data.userId);

      // Only owner can delete
      allow delete: if isOwner(resource.data.userId);
    }

    // ========================================
    // TEST CONTENTS COLLECTION (Pre-made tests)
    // ========================================
    match /test_contents/{testId} {
      // Anyone authenticated can read tests
      allow read: if isAuthenticated();

      // Only admins can create/update/delete tests
      allow write: if isAdmin();
    }

    // ========================================
    // AI GENERATED TESTS COLLECTION
    // ========================================
    match /aiGeneratedTests/{testId} {
      // Users can read their own AI tests or public tests
      allow read: if isAuthenticated()
                  && (resource.data.userId == request.auth.uid
                      || resource.data.isPublic == true);

      // Users can create their own AI tests
      allow create: if isAuthenticated()
                    && request.resource.data.userId == request.auth.uid;

      // Users can update/delete their own AI tests
      allow update, delete: if isOwner(resource.data.userId);
    }

    // ========================================
    // LEADERBOARD COLLECTIONS
    // ========================================
    match /leaderboard_all_time/{userId} {
      // Anyone can read all-time leaderboard
      allow read: if isAuthenticated();

      // No direct writes - only via Admin SDK in API routes
      allow write: if false;
    }

    match /leaderboard_weekly/{docId} {
      // Anyone can read weekly leaderboard
      allow read: if isAuthenticated();

      // No direct writes - only via Admin SDK
      allow write: if false;
    }

    match /leaderboard_monthly/{docId} {
      // Anyone can read monthly leaderboard
      allow read: if isAuthenticated();

      // No direct writes - only via Admin SDK
      allow write: if false;
    }

    // ========================================
    // ADMIN COLLECTIONS (Performance logs, etc.)
    // ========================================
    match /performance_logs/{logId} {
      // Only admins can read logs
      allow read: if isAdmin();

      // No direct writes - only via Admin SDK
      allow write: if false;
    }

    // ========================================
    // DENY ALL OTHER COLLECTIONS BY DEFAULT
    // ========================================
    // This replaces the dangerous "allow read, write: if true"
    // Any collection not explicitly defined above is DENIED
  }
}
```

**Step 3: Test Rules Locally** (5 min)
```bash
# Start Firestore emulator with new rules
firebase emulators:start --only firestore

# In another terminal, run test script (create this file)
node scripts/test-firestore-rules.js
```

Create `scripts/test-firestore-rules.js`:
```javascript
// Test Firestore rules locally
const { initializeTestEnvironment, assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');

async function testRules() {
  const testEnv = await initializeTestEnvironment({
    projectId: 'solotype-23c1f',
    firestore: {
      rules: require('fs').readFileSync('firestore.rules', 'utf8')
    }
  });

  // Test 1: Unauthenticated user cannot read profiles
  const unauthedDb = testEnv.unauthenticatedContext().firestore();
  await assertFails(unauthedDb.collection('profiles').doc('user123').get());
  console.log('✅ Test 1 passed: Unauth user cannot read profiles');

  // Test 2: Authenticated user can read own profile
  const aliceDb = testEnv.authenticatedContext('alice').firestore();
  await assertSucceeds(aliceDb.collection('profiles').doc('alice').get());
  console.log('✅ Test 2 passed: User can read own profile');

  // Test 3: User cannot read another user's profile
  await assertFails(aliceDb.collection('profiles').doc('bob').get());
  console.log('✅ Test 3 passed: User cannot read other profiles');

  // Test 4: User can create own test result
  await assertSucceeds(aliceDb.collection('testResults').add({
    userId: 'alice',
    wpm: 50,
    accuracy: 95
  }));
  console.log('✅ Test 4 passed: User can create own test result');

  console.log('\n✅ All Firestore rules tests passed!');
  await testEnv.cleanup();
}

testRules().catch(console.error);
```

**Step 4: Deploy Rules** (5 min)
```bash
# Deploy to Firebase (after Phase 1 is complete)
firebase deploy --only firestore:rules --project solotype-23c1f

# Verify deployment
firebase firestore:rules --project solotype-23c1f
```

#### Validation Checklist
- [ ] Unauthenticated users cannot read any data
- [ ] Users can only access their own profiles
- [ ] Users can only create test results with their own userId
- [ ] Leaderboards are read-only (no direct client writes)
- [ ] Admin collections require admin token
- [ ] All tests in `test-firestore-rules.js` pass

---

### Fix 1.2: Remove Authentication Bypass (15 minutes)

**Issue**: CRIT-002 from SECURITY_AUDIT_REPORT.md
**Location**: `app/api/submit-test-result/route.ts:244-265`
**Current Risk**: Unauthenticated test submissions via fallback

#### Implementation Steps

**Step 1: Review Current Code** (5 min)
```bash
# Open file and locate the problematic code
code app/api/submit-test-result/route.ts

# Search for "fallback" in the file
grep -n "fallback" app/api/submit-test-result/route.ts
```

**Step 2: Remove Fallback Mechanism** (5 min)

In `app/api/submit-test-result/route.ts`, **FIND** lines 244-265:
```typescript
try {
  // Basic JWT token validation - check if it's properly formatted
  const tokenParts = idToken.split('.');
  if (tokenParts.length !== 3) {
    throw new Error('Invalid token format');
  }

  // Decode the payload (for local development only)
  const payload = JSON.parse(atob(tokenParts[1]));
  userId = payload.user_id || payload.sub;

  if (!userId) {
    throw new Error('No user ID in token');
  }

  logger.info(context, 'Token validated successfully', { userId });
} catch (error) {
  logger.warn(context, 'Token validation failed, using fallback', ...);
  // For testing purposes, use a fallback user ID
  userId = 'test-user-fallback';  // <-- REMOVE THIS
  logger.info(context, 'Using fallback user ID for testing', { userId });
}
```

**REPLACE** with this secure implementation (use Firebase Admin SDK):
```typescript
// This route should use Admin SDK like v1 does
// For now, add proper error handling until migration is complete

try {
  // Import at top of file: import { getAuth } from 'firebase-admin/auth';
  // Import at top of file: import { auth } from '@/lib/firebase-admin';

  // Verify token using Firebase Admin SDK
  const decodedToken = await auth.verifyIdToken(idToken);
  userId = decodedToken.uid;

  logger.info(context, 'Token validated successfully', {
    userId,
    email: decodedToken.email
  });
} catch (authError) {
  // Token verification failed - return 401 immediately
  logger.error(context, authError instanceof Error ? authError : new Error(String(authError)), {
    step: 'TOKEN_VERIFICATION_FAILED'
  });

  const correlationId = request.headers.get(CORRELATION_ID_HEADER) || 'unknown';
  const errorResponse = NextResponse.json(
    {
      error: 'Authentication failed',
      message: 'Invalid or expired authentication token',
      correlationId
    },
    { status: 401 }
  );
  errorResponse.headers.set(CORRELATION_ID_HEADER, correlationId);
  logger.logRequest(context, startTime, 401, { reason: 'Token verification failed' });
  return errorResponse;
}
```

**Step 3: Add Required Imports** (2 min)

At the **TOP** of `app/api/submit-test-result/route.ts`, add:
```typescript
import { auth } from '@/lib/firebase-admin';
```

**Step 4: Test Authentication** (3 min)
```bash
# Start dev server
npm run dev

# Test with invalid token (should return 401)
curl -X POST http://localhost:3000/api/submit-test-result \
  -H "Authorization: Bearer INVALID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"wpm": 50, "accuracy": 95, "testType": "practice", "difficulty": "Medium", "testId": "test123", "errors": 5, "timeTaken": 60, "textLength": 100, "userInput": "test"}'

# Expected: 401 Unauthorized response
```

#### Validation Checklist
- [ ] Removed all `test-user-fallback` references
- [ ] Added Firebase Admin SDK token verification
- [ ] Returns 401 on any token validation failure
- [ ] No silent fallbacks in catch blocks
- [ ] Logs authentication failures for monitoring
- [ ] Manual test with invalid token returns 401

---

### Fix 1.3: Remove Hardcoded API Keys (20 minutes)

**Issue**: CRIT-003 from SECURITY_AUDIT_REPORT.md
**Locations**:
- `lib/firebase/client.ts:9-14`
- `app/api/submit-test-result/route.ts:12`
- `app/api/tests/route.ts:11`
- `app/api/v1/tests/route.ts:11`

**Current Risk**: Firebase keys exposed in source code and client bundles

#### Implementation Steps

**Step 1: Identify All Hardcoded Keys** (5 min)
```bash
# Search for hardcoded API keys
grep -r "AIzaSyAipHBANeyyXgq1n9h2G33PAwtuXkMRu-w" .

# Search for hardcoded fallback patterns
grep -r "process.env.* || \"" lib/ app/

# Expected: Find 4+ files with hardcoded keys
```

**Step 2: Remove Fallbacks from lib/firebase/client.ts** (5 min)

In `lib/firebase/client.ts`, **REPLACE** lines 8-16:
```typescript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAipHBANeyyXgq1n9h2G33PAwtuXkMRu-w",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "solotype-23c1f.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "solotype-23c1f",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "solotype-23c1f.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "39439361072",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:39439361072:web:27661c0d7e4e341a02b9f5",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};
```

**WITH** (no fallbacks):
```typescript
// Validate required environment variables
const requiredEnvVars = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check for missing variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => `NEXT_PUBLIC_FIREBASE_${key.toUpperCase()}`);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required Firebase environment variables: ${missingVars.join(', ')}. ` +
    'See DEPLOYMENT_GUIDE.md for setup instructions.'
  );
}

const firebaseConfig = {
  apiKey: requiredEnvVars.apiKey!,
  authDomain: requiredEnvVars.authDomain!,
  projectId: requiredEnvVars.projectId!,
  storageBucket: requiredEnvVars.storageBucket!,
  messagingSenderId: requiredEnvVars.messagingSenderId!,
  appId: requiredEnvVars.appId!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};
```

**Step 3: Remove Fallbacks from API Routes** (5 min)

**For each file**: `app/api/submit-test-result/route.ts`, `app/api/tests/route.ts`, `app/api/v1/tests/route.ts`

**FIND** firebaseConfig object with `|| "hardcoded-value"` patterns

**REPLACE** with the same validation pattern as above, OR better yet, these routes should use Admin SDK (see Fix 1.6)

**Step 4: Verify Environment Variables Exist** (2 min)
```bash
# Check .env.local has all required variables
cat .env.local | grep NEXT_PUBLIC_FIREBASE

# Expected output:
# NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=solotype-23c1f.firebaseapp.com
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=solotype-23c1f
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=solotype-23c1f.firebasestorage.app
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=39439361072
# NEXT_PUBLIC_FIREBASE_APP_ID=1:39439361072:web:...
# NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-...
```

**Step 5: Test Build Validation** (3 min)
```bash
# Test that build fails with missing env vars
# Temporarily rename .env.local
mv .env.local .env.local.backup

# Try to build (should fail)
npm run build

# Expected: Error message about missing environment variables

# Restore .env.local
mv .env.local.backup .env.local

# Build should succeed now
npm run build
```

#### Validation Checklist
- [ ] Removed all `|| "hardcoded-value"` fallbacks
- [ ] Added environment variable validation
- [ ] Build fails gracefully with helpful error if env vars missing
- [ ] No API keys visible in source code
- [ ] `.env.local` is in `.gitignore`
- [ ] Build succeeds with proper env vars

---

### Fix 1.4: Add Admin Authentication (2 hours)

**Issue**: HIGH-001 from SECURITY_AUDIT_REPORT.md
**Locations**:
- `app/api/admin/performance/stats/route.ts`
- `app/api/admin/logs/search/route.ts`
- `app/api/v1/admin/performance/stats/route.ts`
- `app/api/v1/admin/logs/search/route.ts`

**Current Risk**: Admin endpoints accessible without authentication

#### Implementation Steps

**Step 1: Create Admin Middleware** (30 min)

Create `lib/admin-auth.ts`:
```typescript
/**
 * Admin Authentication Middleware
 *
 * Verifies Firebase ID tokens and checks admin privileges.
 * Use this in all admin API routes.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';
import { logger, createApiContext } from '@/lib/structured-logger';
import { CORRELATION_ID_HEADER } from '@/lib/correlation-id';

export interface AdminAuthResult {
  isAuthenticated: boolean;
  isAdmin: boolean;
  userId?: string;
  email?: string;
  error?: NextResponse;
}

/**
 * Verify admin access for a request
 *
 * @param request - Incoming NextRequest
 * @returns AdminAuthResult with authentication status
 */
export async function verifyAdminAccess(request: NextRequest): Promise<AdminAuthResult> {
  const context = createApiContext(request, 'Admin Auth Check');
  const correlationId = request.headers.get(CORRELATION_ID_HEADER) || 'admin-auth';

  // Step 1: Check for Authorization header
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn(context, 'Admin endpoint accessed without auth header');

    const errorResponse = NextResponse.json(
      {
        error: 'Authentication required',
        message: 'Admin endpoints require authentication',
        correlationId
      },
      { status: 401 }
    );
    errorResponse.headers.set(CORRELATION_ID_HEADER, correlationId);

    return {
      isAuthenticated: false,
      isAdmin: false,
      error: errorResponse
    };
  }

  // Step 2: Extract and verify Firebase ID token
  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await auth.verifyIdToken(idToken);

    logger.info(context, 'Token verified for admin endpoint', {
      userId: decodedToken.uid,
      email: decodedToken.email
    });

    // Step 3: Check admin privileges
    // Option 1: Custom claims (recommended for production)
    const isAdmin = decodedToken.admin === true;

    // Option 2: Environment variable for beta (simple, single admin)
    // const isAdmin = decodedToken.uid === process.env.ADMIN_USER_ID;

    // Option 3: Firestore lookup (flexible, supports multiple admins)
    // const adminDoc = await db.collection('admins').doc(decodedToken.uid).get();
    // const isAdmin = adminDoc.exists;

    if (!isAdmin) {
      logger.warn(context, 'Non-admin user attempted admin endpoint access', {
        userId: decodedToken.uid,
        email: decodedToken.email
      });

      const errorResponse = NextResponse.json(
        {
          error: 'Insufficient permissions',
          message: 'Admin access required',
          correlationId
        },
        { status: 403 }
      );
      errorResponse.headers.set(CORRELATION_ID_HEADER, correlationId);

      return {
        isAuthenticated: true,
        isAdmin: false,
        userId: decodedToken.uid,
        email: decodedToken.email,
        error: errorResponse
      };
    }

    // Success - user is authenticated AND admin
    logger.info(context, 'Admin access granted', {
      userId: decodedToken.uid,
      email: decodedToken.email
    });

    return {
      isAuthenticated: true,
      isAdmin: true,
      userId: decodedToken.uid,
      email: decodedToken.email
    };

  } catch (authError) {
    logger.error(context, authError instanceof Error ? authError : new Error(String(authError)), {
      step: 'ADMIN_TOKEN_VERIFICATION_FAILED'
    });

    const errorResponse = NextResponse.json(
      {
        error: 'Authentication failed',
        message: 'Invalid or expired token',
        correlationId
      },
      { status: 401 }
    );
    errorResponse.headers.set(CORRELATION_ID_HEADER, correlationId);

    return {
      isAuthenticated: false,
      isAdmin: false,
      error: errorResponse
    };
  }
}

/**
 * Set admin custom claim for a user
 * Run this once to make a user an admin
 *
 * Usage: node scripts/set-admin.js <userId>
 */
export async function setAdminClaim(userId: string): Promise<void> {
  try {
    await auth.setCustomUserClaims(userId, { admin: true });
    console.log(`✅ Admin claim set for user: ${userId}`);
  } catch (error) {
    console.error('Failed to set admin claim:', error);
    throw error;
  }
}
```

**Step 2: Create Admin Setup Script** (15 min)

Create `scripts/set-admin.js`:
```javascript
/**
 * Set admin custom claim for a user
 *
 * Usage: node scripts/set-admin.js <userEmail>
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
if (!admin.apps.length) {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const serviceAccount = require(path.join(process.cwd(), serviceAccountPath));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'solotype-23c1f'
  });
}

async function setAdmin(email) {
  try {
    // Get user by email
    const user = await admin.auth().getUserByEmail(email);
    console.log(`Found user: ${user.uid} (${user.email})`);

    // Set custom claims
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`✅ Admin claim set for ${email}`);

    // Verify
    const updatedUser = await admin.auth().getUser(user.uid);
    console.log('Custom claims:', updatedUser.customClaims);

    process.exit(0);
  } catch (error) {
    console.error('Error setting admin claim:', error);
    process.exit(1);
  }
}

const email = process.argv[2];
if (!email) {
  console.error('Usage: node scripts/set-admin.js <userEmail>');
  process.exit(1);
}

setAdmin(email);
```

**Step 3: Update Admin Endpoints** (60 min)

For **each admin endpoint**, apply this pattern:

**Example**: `app/api/admin/performance/stats/route.ts`

**BEFORE**:
```typescript
async function handleGET(request: NextRequest) {
  console.log("Admin performance stats API called");

  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '1h';

    // ... rest of handler
  } catch (error) {
    // ...
  }
}
```

**AFTER**:
```typescript
import { verifyAdminAccess } from '@/lib/admin-auth';

async function handleGET(request: NextRequest) {
  console.log("Admin performance stats API called");

  // STEP 1: Verify admin access FIRST
  const authResult = await verifyAdminAccess(request);

  // If authentication failed, return error response immediately
  if (authResult.error) {
    return authResult.error;
  }

  // STEP 2: Log admin access for audit trail
  console.log('Admin access granted:', {
    userId: authResult.userId,
    email: authResult.email,
    endpoint: '/api/admin/performance/stats'
  });

  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '1h';

    // ... rest of handler (unchanged)
  } catch (error) {
    // ...
  }
}
```

**Apply to all 4 admin endpoints**:
1. `app/api/admin/performance/stats/route.ts` - Both GET handler
2. `app/api/admin/logs/search/route.ts` - Both GET and POST handlers
3. `app/api/v1/admin/performance/stats/route.ts` - GET handler
4. `app/api/v1/admin/logs/search/route.ts` - GET and POST handlers

**Step 4: Set Your Admin User** (5 min)
```bash
# Make yourself an admin (use your Firebase Auth email)
node scripts/set-admin.js your-email@example.com

# Expected output:
# Found user: abc123xyz (your-email@example.com)
# ✅ Admin claim set for your-email@example.com
# Custom claims: { admin: true }
```

**Step 5: Test Admin Authentication** (10 min)

Test with authenticated requests:
```bash
# Get your Firebase ID token (from browser DevTools or Firebase Auth)
# Login to your app, open DevTools Console, run:
# firebase.auth().currentUser.getIdToken().then(token => console.log(token))

export ADMIN_TOKEN="<your-id-token>"

# Test admin endpoint with valid admin token
curl -X GET "http://localhost:3000/api/admin/performance/stats?timeRange=1h" \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Expected: 200 OK with stats data

# Test without token (should fail)
curl -X GET "http://localhost:3000/api/admin/performance/stats"

# Expected: 401 Unauthorized

# Test with non-admin user token (create a second test account)
curl -X GET "http://localhost:3000/api/admin/performance/stats" \
  -H "Authorization: Bearer <non-admin-token>"

# Expected: 403 Forbidden
```

#### Validation Checklist
- [ ] Created `lib/admin-auth.ts` middleware
- [ ] Created `scripts/set-admin.js` helper
- [ ] Updated all 4 admin endpoints with authentication
- [ ] Set admin claim for at least one user
- [ ] Tested: No token returns 401
- [ ] Tested: Non-admin token returns 403
- [ ] Tested: Admin token returns 200 with data
- [ ] Admin access logged for audit trail

---

### Fix 1.5: Fix JWT Verification (1 hour)

**Issue**: HIGH-002 from SECURITY_AUDIT_REPORT.md
**Location**: `app/api/submit-test-result/route.ts:244-257`
**Current Risk**: Manual JWT parsing without signature verification

**NOTE**: This fix is **partially covered by Fix 1.2**, but we need to verify complete removal.

#### Implementation Steps

**Step 1: Verify Fix 1.2 Completion** (10 min)

Check that `app/api/submit-test-result/route.ts` now uses Firebase Admin SDK:

```bash
# Search for manual JWT parsing (should find NONE in API routes)
grep -n "atob(" app/api/submit-test-result/route.ts

# Search for proper Admin SDK usage (should find this)
grep -n "auth.verifyIdToken" app/api/submit-test-result/route.ts
```

**If `atob()` still exists**: Return to Fix 1.2 and complete it first.

**Step 2: Document Proper Auth Pattern** (20 min)

Create `docs/API_AUTHENTICATION_PATTERN.md`:
```markdown
# API Authentication Pattern - Standard Implementation

**Status**: ✅ REQUIRED for all authenticated API routes
**Last Updated**: October 7, 2025

## Required Pattern for All Authenticated Routes

### Step 1: Import Dependencies
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';
import { logger, createApiContext, createTimingContext } from '@/lib/structured-logger';
import { CORRELATION_ID_HEADER } from '@/lib/correlation-id';
```

### Step 2: Verify Token at Route Entry
```typescript
async function handlePOST(request: NextRequest) {
  const { startTime } = createTimingContext();
  const context = createApiContext(request, 'POST /api/your-route');
  const correlationId = request.headers.get(CORRELATION_ID_HEADER) || 'route-id';

  try {
    // STEP 1: Validate Authorization header exists
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn(context, 'Missing or invalid authorization header');

      const errorResponse = NextResponse.json(
        { error: 'Authentication required', correlationId },
        { status: 401 }
      );
      errorResponse.headers.set(CORRELATION_ID_HEADER, correlationId);
      return errorResponse;
    }

    // STEP 2: Extract token
    const idToken = authHeader.split('Bearer ')[1];

    // STEP 3: Verify token using Firebase Admin SDK (REQUIRED)
    let userId: string;
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      userId = decodedToken.uid;

      logger.info(context, 'Authentication successful', { userId });
    } catch (authError) {
      logger.error(context, authError instanceof Error ? authError : new Error(String(authError)));

      const errorResponse = NextResponse.json(
        { error: 'Invalid authentication token', correlationId },
        { status: 401 }
      );
      errorResponse.headers.set(CORRELATION_ID_HEADER, correlationId);
      return errorResponse;
    }

    // STEP 4: Proceed with authenticated request
    // ... your route logic here using verified userId

  } catch (error) {
    logger.error(context, error instanceof Error ? error : new Error(String(error)));
    // ... error handling
  }
}
```

### Anti-Patterns (NEVER DO THIS)

❌ **Manual JWT Decoding**
```typescript
// WRONG - No signature verification
const payload = JSON.parse(atob(token.split('.')[1]));
const userId = payload.sub; // Untrusted data!
```

❌ **Fallback Mechanisms**
```typescript
// WRONG - Bypasses authentication
try {
  const decodedToken = await auth.verifyIdToken(idToken);
  userId = decodedToken.uid;
} catch (error) {
  userId = 'test-user'; // NEVER DO THIS
}
```

❌ **Trusting Client-Provided User IDs**
```typescript
// WRONG - Client can fake userId
const { userId } = await request.json();
// Always use userId from verified token instead
```

### Routes Requiring This Pattern

- [x] `/api/submit-test-result` - Fixed in Phase 1
- [ ] `/api/profile` - Fix in Phase 1.6
- [x] `/api/admin/*` - Fixed with admin middleware
- [x] `/api/v1/admin/*` - Fixed with admin middleware
- [ ] Any future authenticated routes

### Testing Authentication

```bash
# Test 1: No token (should return 401)
curl -X POST http://localhost:3000/api/your-route

# Test 2: Invalid token (should return 401)
curl -X POST http://localhost:3000/api/your-route \
  -H "Authorization: Bearer invalid-token"

# Test 3: Valid token (should return 200 or expected response)
curl -X POST http://localhost:3000/api/your-route \
  -H "Authorization: Bearer $VALID_TOKEN"
```
```

**Step 3: Audit All API Routes** (20 min)

Create a checklist of routes requiring authentication:

```bash
# Find all API route files
find app/api -name "route.ts" -type f

# Check each for authentication
for file in $(find app/api -name "route.ts" -type f); do
  echo "=== $file ==="
  grep -n "auth.verifyIdToken\|atob(" "$file" || echo "  ⚠️ No authentication found"
  echo ""
done
```

Create `scripts/audit-api-auth.sh`:
```bash
#!/bin/bash
# Audit all API routes for proper authentication

echo "🔍 API Route Authentication Audit"
echo "=================================="
echo ""

ROUTES=$(find app/api -name "route.ts" -type f)
NO_AUTH_ROUTES=()
UNSAFE_AUTH_ROUTES=()
SAFE_AUTH_ROUTES=()

for route in $ROUTES; do
  # Check for unsafe manual JWT parsing
  if grep -q "atob(" "$route"; then
    UNSAFE_AUTH_ROUTES+=("$route - Uses manual JWT parsing")
  fi

  # Check for proper Admin SDK verification
  if grep -q "auth.verifyIdToken" "$route"; then
    SAFE_AUTH_ROUTES+=("$route")
  elif grep -q "POST\|PUT\|PATCH\|DELETE" "$route" && ! grep -q "auth.verifyIdToken" "$route"; then
    # Routes with mutations should have auth
    NO_AUTH_ROUTES+=("$route")
  fi
done

echo "✅ Routes with proper authentication (${#SAFE_AUTH_ROUTES[@]}):"
for route in "${SAFE_AUTH_ROUTES[@]}"; do
  echo "  ✓ $route"
done
echo ""

echo "⚠️  Routes with unsafe authentication (${#UNSAFE_AUTH_ROUTES[@]}):"
for route in "${UNSAFE_AUTH_ROUTES[@]}"; do
  echo "  ⚠ $route"
done
echo ""

echo "❌ Routes missing authentication (${#NO_AUTH_ROUTES[@]}):"
for route in "${NO_AUTH_ROUTES[@]}"; do
  echo "  ✗ $route"
done
echo ""

if [ ${#UNSAFE_AUTH_ROUTES[@]} -gt 0 ] || [ ${#NO_AUTH_ROUTES[@]} -gt 0 ]; then
  echo "🔴 Authentication audit FAILED"
  exit 1
else
  echo "✅ Authentication audit PASSED"
  exit 0
fi
```

```bash
# Run audit
chmod +x scripts/audit-api-auth.sh
./scripts/audit-api-auth.sh
```

**Step 4: Document Findings** (10 min)

Update `SECURITY_AUDIT_REPORT.md` with audit results:
```bash
# Add section at end of report documenting which routes have been fixed
echo "## Authentication Audit Results (Post-Fix)" >> docs/SECURITY_AUDIT_REPORT.md
./scripts/audit-api-auth.sh >> docs/SECURITY_AUDIT_REPORT.md
```

#### Validation Checklist
- [ ] No `atob()` usage in any API routes
- [ ] All authenticated routes use `auth.verifyIdToken()`
- [ ] Created `API_AUTHENTICATION_PATTERN.md` documentation
- [ ] Created `audit-api-auth.sh` script
- [ ] Audit script shows 0 unsafe routes
- [ ] All mutation endpoints (POST/PUT/DELETE) have authentication

---

### Fix 1.6: Add Profile Authentication (1 hour)

**Issue**: HIGH-003 from SECURITY_AUDIT_REPORT.md
**Location**: `app/api/profile/route.ts:14-76`
**Current Risk**: Unauthenticated profile creation

#### Implementation Steps

**Step 1: Review Current Profile Route** (10 min)
```bash
# Open and analyze current implementation
code app/api/profile/route.ts

# Check for authentication
grep -n "auth" app/api/profile/route.ts

# Expected: No authentication currently
```

**Step 2: Add Authentication to Profile Route** (30 min)

**REPLACE** the entire `POST` function in `app/api/profile/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebase-admin';
import { logger, createApiContext, createTimingContext } from '@/lib/structured-logger';
import { CORRELATION_ID_HEADER } from '@/lib/correlation-id';

/**
 * Create or update user profile
 *
 * SECURITY: Requires authentication. Users can only create/update their own profile.
 * The userId is extracted from the verified Firebase token, not from request body.
 *
 * @param request - NextRequest with Authorization header and JSON body
 * @returns NextResponse with profile data or error
 */
export async function POST(request: NextRequest) {
  const { startTime } = createTimingContext();
  const context = createApiContext(request, 'POST /api/profile');
  const correlationId = request.headers.get(CORRELATION_ID_HEADER) || 'profile-create';

  try {
    // ================================================
    // STEP 1: AUTHENTICATE USER
    // ================================================
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn(context, 'Profile creation attempted without authentication');

      const errorResponse = NextResponse.json(
        {
          error: 'Authentication required',
          message: 'You must be logged in to create a profile',
          correlationId
        },
        { status: 401 }
      );
      errorResponse.headers.set(CORRELATION_ID_HEADER, correlationId);
      return errorResponse;
    }

    const idToken = authHeader.split('Bearer ')[1];
    let decodedToken;

    try {
      decodedToken = await auth.verifyIdToken(idToken);
      logger.info(context, 'User authenticated for profile creation', {
        userId: decodedToken.uid,
        email: decodedToken.email
      });
    } catch (authError) {
      logger.error(context, authError instanceof Error ? authError : new Error(String(authError)));

      const errorResponse = NextResponse.json(
        {
          error: 'Invalid authentication',
          message: 'Authentication token is invalid or expired',
          correlationId
        },
        { status: 401 }
      );
      errorResponse.headers.set(CORRELATION_ID_HEADER, correlationId);
      return errorResponse;
    }

    // ================================================
    // STEP 2: PARSE AND VALIDATE REQUEST BODY
    // ================================================
    const body = await request.json();

    // SECURITY: Use userId from verified token, NOT from request body
    const userId = decodedToken.uid;
    const email = decodedToken.email || body.email;

    // Validate required fields (uid comes from token, not body)
    if (!email) {
      return NextResponse.json(
        {
          error: 'Email is required',
          correlationId
        },
        { status: 400 }
      );
    }

    // ================================================
    // STEP 3: USE FIRESTORE TRANSACTION FOR ATOMIC OPERATION
    // ================================================
    const profileRef = db.collection('profiles').doc(userId);

    let profileData;

    await db.runTransaction(async (transaction) => {
      const existingProfile = await transaction.get(profileRef);

      if (existingProfile.exists) {
        // Profile exists - update it
        const updates = {
          email: email,
          username: body.username || existingProfile.data()?.username || email.split('@')[0],
          bio: body.bio !== undefined ? body.bio : existingProfile.data()?.bio || '',
          preferredThemeId: body.preferredThemeId || existingProfile.data()?.preferredThemeId || 'standard',
          preferredFontId: body.preferredFontId || existingProfile.data()?.preferredFontId || 'fira-code',
          settings: {
            keyboardSounds: body.settings?.keyboardSounds ?? existingProfile.data()?.settings?.keyboardSounds ?? true,
            visualFeedback: body.settings?.visualFeedback ?? existingProfile.data()?.settings?.visualFeedback ?? true,
            autoSaveAiTests: body.settings?.autoSaveAiTests ?? existingProfile.data()?.settings?.autoSaveAiTests ?? false
          },
          updatedAt: new Date().toISOString()
        };

        transaction.update(profileRef, updates);
        profileData = { ...existingProfile.data(), ...updates };

        logger.info(context, 'Profile updated', { userId });
      } else {
        // Profile doesn't exist - create it
        profileData = {
          uid: userId,
          email: email,
          username: body.username || email.split('@')[0],
          bio: body.bio || '',
          preferredThemeId: body.preferredThemeId || 'standard',
          preferredFontId: body.preferredFontId || 'fira-code',
          settings: {
            keyboardSounds: body.settings?.keyboardSounds ?? true,
            visualFeedback: body.settings?.visualFeedback ?? true,
            autoSaveAiTests: body.settings?.autoSaveAiTests ?? false
          },
          stats: {
            rank: body.stats?.rank || 'E',
            avgAcc: body.stats?.avgAcc || 0,
            avgWpm: body.stats?.avgWpm || 0,
            testsCompleted: body.stats?.testsCompleted || 0,
            bestWpm: body.stats?.bestWpm || 0
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        transaction.set(profileRef, profileData);

        logger.info(context, 'Profile created', { userId });
      }
    });

    // ================================================
    // STEP 4: RETURN SUCCESS RESPONSE
    // ================================================
    const successResponse = NextResponse.json({
      success: true,
      message: 'Profile saved successfully',
      profile: profileData,
      correlationId
    });
    successResponse.headers.set(CORRELATION_ID_HEADER, correlationId);

    logger.logRequest(context, startTime, 200, { userId });
    return successResponse;

  } catch (error) {
    logger.error(context, error instanceof Error ? error : new Error(String(error)));

    const correlationId = request.headers.get(CORRELATION_ID_HEADER) || 'profile-error';
    const errorResponse = NextResponse.json(
      {
        error: 'Failed to save profile',
        message: 'An error occurred while saving your profile',
        correlationId
      },
      { status: 500 }
    );
    errorResponse.headers.set(CORRELATION_ID_HEADER, correlationId);

    logger.logRequest(context, startTime, 500, {});
    return errorResponse;
  }
}
```

**Step 3: Add Required Imports** (5 min)

Ensure top of file has:
```typescript
import { auth } from '@/lib/firebase-admin';
import { logger, createApiContext, createTimingContext } from '@/lib/structured-logger';
import { CORRELATION_ID_HEADER } from '@/lib/correlation-id';
```

**Step 4: Test Profile Authentication** (15 min)

```bash
# Test 1: Create profile without authentication (should fail)
curl -X POST http://localhost:3000/api/profile \
  -H "Content-Type: application/json" \
  -d '{"username": "hacker", "email": "hacker@example.com"}'

# Expected: 401 Unauthorized

# Test 2: Create profile with valid token
# (Get token from browser after login)
curl -X POST http://localhost:3000/api/profile \
  -H "Authorization: Bearer $VALID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username": "myusername", "bio": "Test bio"}'

# Expected: 200 OK with profile data

# Test 3: Try to create profile for another user (should use token userId)
curl -X POST http://localhost:3000/api/profile \
  -H "Authorization: Bearer $VALID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"uid": "other-user-id", "email": "other@example.com"}'

# Expected: 200 OK but profile created for authenticated user (from token), not "other-user-id"
```

#### Validation Checklist
- [ ] Added authentication to profile route
- [ ] userId extracted from verified token (not request body)
- [ ] Email extracted from token or body
- [ ] Used Firestore transaction for atomic operations
- [ ] Test: Cannot create profile without authentication
- [ ] Test: Cannot create profile for another user
- [ ] Test: Authenticated user can create own profile
- [ ] Proper error handling and logging

---

## 🔄 PHASE 1 COMPLETION CHECKLIST

Before proceeding to Phase 2 or deploying:

### Code Changes Complete
- [ ] Fix 1.1: Firestore rules deployed and tested
- [ ] Fix 1.2: Authentication bypass removed from submit-test-result
- [ ] Fix 1.3: All hardcoded API keys removed
- [ ] Fix 1.4: Admin authentication added to all admin endpoints
- [ ] Fix 1.5: JWT verification audit passed
- [ ] Fix 1.6: Profile route authentication implemented

### Testing Complete
- [ ] Firestore rules test script passes
- [ ] Unauthenticated requests to admin endpoints return 401
- [ ] Non-admin users get 403 on admin endpoints
- [ ] Test submission requires valid authentication
- [ ] Profile creation requires authentication
- [ ] No `atob()` usage in codebase
- [ ] Build succeeds with environment variables
- [ ] Build fails without environment variables

### Documentation Complete
- [ ] Created `API_AUTHENTICATION_PATTERN.md`
- [ ] Created `scripts/test-firestore-rules.js`
- [ ] Created `scripts/set-admin.js`
- [ ] Created `scripts/audit-api-auth.sh`
- [ ] Created `lib/admin-auth.ts`
- [ ] Updated SECURITY_AUDIT_REPORT.md with completion status

### Git Commit
```bash
# Stage all changes
git add .

# Commit with detailed message
git commit -m "security: Phase 1 critical fixes - CRIT-001 to HIGH-003

- Fix CRIT-001: Implement granular Firestore security rules
- Fix CRIT-002: Remove authentication bypass fallback
- Fix CRIT-003: Remove hardcoded API keys, add env validation
- Fix HIGH-001: Add admin authentication middleware
- Fix HIGH-002: Remove manual JWT parsing, use Admin SDK
- Fix HIGH-003: Add authentication to profile route

Testing:
- Firestore rules tested with unit tests
- Admin endpoints verified with auth checks
- All routes audited for proper authentication

Refs: SECURITY_AUDIT_REPORT.md Phase 1"

# Push to remote
git push origin security/critical-fixes-phase-1
```

### Deployment Preparation
- [ ] All tests passing locally
- [ ] Environment variables documented in DEPLOYMENT_GUIDE.md
- [ ] Admin user(s) set up with custom claims
- [ ] Rollback plan documented (see below)
- [ ] Team notified of deployment window

---

## 📅 PHASE 2: High-Priority Fixes (Pre-Beta)

**STATUS**: 🟡 Start after Phase 1 deployed and tested
**Estimated Time**: 12 hours
**Deployment Gate**: Must complete before public beta

### Overview
Phase 2 addresses high-priority security issues that don't block internal testing but are required before public beta deployment.

### Issues to Fix
1. **HIGH-004**: Implement rate limiting on API routes
2. **HIGH-005**: Fix unbounded pagination limits
3. **HIGH-006**: Sanitize verbose error messages
4. **HIGH-007**: Replace console logging with structured logger
5. **HIGH-008**: Migrate API routes from Client SDK to Admin SDK

**Detailed implementation steps for Phase 2 will be added after Phase 1 completion.**

---

## 📅 PHASE 3: Medium-Priority Fixes (Pre-Production)

**STATUS**: ⚪ Start during subscription system implementation
**Estimated Time**: 12 hours
**Deployment Gate**: Must complete before production launch

### Overview
Phase 3 addresses medium-priority hardening and compliance requirements.

### Issues to Fix
1. **MED-001**: Environment-based service account configuration
2. **MED-002**: Unified rate limiting architecture
3. **MED-003**: Input sanitization and XSS protection
4. **MED-004**: Update vulnerable dependencies
5. **MED-005**: Remove emails from leaderboard API
6. **MED-006**: Pseudonymize user IDs in logs
7. **MED-007**: Implement Firebase App Check
8. **MED-008**: Remove hardcoded service account filename

**Detailed implementation steps for Phase 3 will be added after Phase 2 completion.**

---

## ✅ Testing & Validation

### Phase 1 Testing Procedures

#### 1. Firestore Rules Testing
```bash
# Run automated tests
npm run test:firestore-rules

# Manual testing
firebase emulators:start --only firestore

# In another terminal
node scripts/test-firestore-rules.js
```

#### 2. Authentication Testing
```bash
# Test all authenticated endpoints
./scripts/test-authentication.sh
```

Create `scripts/test-authentication.sh`:
```bash
#!/bin/bash
# Test authentication on all protected endpoints

echo "🔐 Authentication Testing Suite"
echo "================================"
echo ""

# Test endpoints (you'll need a valid token)
VALID_TOKEN="${FIREBASE_TOKEN}"
if [ -z "$VALID_TOKEN" ]; then
  echo "Error: Set FIREBASE_TOKEN environment variable"
  echo "Get token from: firebase.auth().currentUser.getIdToken()"
  exit 1
fi

# Test 1: Admin endpoint without token
echo "Test 1: Admin endpoint without token..."
RESPONSE=$(curl -s -w "\n%{http_code}" http://localhost:3000/api/admin/performance/stats)
STATUS=$(echo "$RESPONSE" | tail -n 1)
if [ "$STATUS" = "401" ]; then
  echo "✅ PASS: Returns 401"
else
  echo "❌ FAIL: Expected 401, got $STATUS"
fi
echo ""

# Test 2: Admin endpoint with token
echo "Test 2: Admin endpoint with valid admin token..."
RESPONSE=$(curl -s -w "\n%{http_code}" -H "Authorization: Bearer $VALID_TOKEN" http://localhost:3000/api/admin/performance/stats)
STATUS=$(echo "$RESPONSE" | tail -n 1)
if [ "$STATUS" = "200" ]; then
  echo "✅ PASS: Returns 200"
else
  echo "❌ FAIL: Expected 200, got $STATUS"
fi
echo ""

# Test 3: Submit test result without token
echo "Test 3: Test submission without token..."
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:3000/api/submit-test-result \
  -H "Content-Type: application/json" \
  -d '{"wpm": 50, "accuracy": 95}')
STATUS=$(echo "$RESPONSE" | tail -n 1)
if [ "$STATUS" = "401" ]; then
  echo "✅ PASS: Returns 401"
else
  echo "❌ FAIL: Expected 401, got $STATUS"
fi
echo ""

# Test 4: Profile creation without token
echo "Test 4: Profile creation without token..."
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:3000/api/profile \
  -H "Content-Type: application/json" \
  -d '{"username": "test"}')
STATUS=$(echo "$RESPONSE" | tail -n 1)
if [ "$STATUS" = "401" ]; then
  echo "✅ PASS: Returns 401"
else
  echo "❌ FAIL: Expected 401, got $STATUS"
fi
echo ""

echo "================================"
echo "Authentication testing complete"
```

#### 3. Integration Testing

Use existing `QUICK_VERIFICATION_GUIDE.md` checklist:
- [ ] Login with test account works
- [ ] AI test generation works (authenticated)
- [ ] Test submission works (authenticated)
- [ ] Leaderboard displays (authenticated)
- [ ] Profile creation/update works (authenticated)
- [ ] Admin panel accessible (admin users only)

---

## 🚀 Deployment Procedures

### Phase 1 Deployment Steps

#### Pre-Deployment Checklist
- [ ] All Phase 1 fixes complete and tested locally
- [ ] Git branch up to date: `git pull origin security/critical-fixes-phase-1`
- [ ] All tests passing: `npm test && ./scripts/test-authentication.sh`
- [ ] Environment variables verified in production
- [ ] Admin user(s) set up with custom claims
- [ ] Rollback plan reviewed

#### Deployment Sequence

**Step 1: Deploy Firestore Rules** (5 min)
```bash
# Deploy security rules FIRST (doesn't affect running code)
firebase deploy --only firestore:rules --project solotype-23c1f

# Verify deployment
firebase firestore:rules --project solotype-23c1f
```

**Step 2: Set Production Admin Users** (5 min)
```bash
# Set admin claims for production users
node scripts/set-admin.js production-admin@example.com

# Verify
# (Check in Firebase Console: Authentication > Users > Custom Claims)
```

**Step 3: Deploy Application Code** (10 min)

**For Vercel deployment**:
```bash
# Ensure environment variables are set in Vercel dashboard
# Vercel > Project > Settings > Environment Variables

# Deploy to preview first
git push origin security/critical-fixes-phase-1

# Test preview deployment URL
# If successful, merge to main
git checkout main
git merge security/critical-fixes-phase-1
git push origin main

# Production deployment triggers automatically
```

**For Firebase Hosting**:
```bash
# Build application
npm run build

# Deploy to Firebase
firebase deploy --only hosting --project solotype-23c1f

# Get deployment URL
firebase hosting:channel:list --project solotype-23c1f
```

**Step 4: Post-Deployment Validation** (15 min)
```bash
# Test production endpoints
export PROD_URL="https://your-production-url.com"

# Test 1: Firestore rules active
# (Try to read data without auth - should fail)

# Test 2: Admin endpoint requires auth
curl -X GET "$PROD_URL/api/admin/performance/stats"
# Expected: 401

# Test 3: Test submission requires auth
curl -X POST "$PROD_URL/api/submit-test-result" \
  -H "Content-Type: application/json" \
  -d '{"wpm": 50}'
# Expected: 401

# Test 4: Login and test workflow
# (Manual browser testing)
```

#### Post-Deployment Monitoring

Monitor for 24 hours after deployment:
- [ ] Check error rates in Vercel/Firebase logs
- [ ] Monitor authentication failures (should increase initially as unauthenticated requests are rejected)
- [ ] Verify admin access works
- [ ] Check user-reported issues

---

## ⏮️ Rollback Procedures

### If Phase 1 Deployment Fails

#### Rollback Firestore Rules
```bash
# Revert to previous rules
git checkout HEAD~1 firestore.rules

# Deploy old rules
firebase deploy --only firestore:rules --project solotype-23c1f
```

#### Rollback Application Code

**Vercel**:
```bash
# In Vercel dashboard
# Deployments > Previous deployment > Promote to Production
```

**Firebase Hosting**:
```bash
# List previous releases
firebase hosting:releases:list --project solotype-23c1f

# Rollback to specific release
firebase hosting:rollback --project solotype-23c1f
```

#### Emergency Access

If admin access is broken:
```bash
# Temporarily set yourself as admin
node scripts/set-admin.js your-email@example.com

# Or temporarily disable admin checks (EMERGENCY ONLY)
# Comment out admin verification in lib/admin-auth.ts
# Redeploy
# FIX IMMEDIATELY
```

---

## 📚 Related Documentation

### Internal Documentation (IKB)
- **SECURITY_AUDIT_REPORT.md** - Complete vulnerability assessment
- **FIRESTORE_SCHEMA.md** - Database structure and security rules
- **DEPLOYMENT_GUIDE.md** - General deployment procedures
- **QUICK_VERIFICATION_GUIDE.md** - Testing checklist
- **RATE_LIMITING_FUTURE_IMPLEMENTATION.md** - Rate limiting context
- **API_ENDPOINTS.md** - API route reference
- **.github/chatmodes/J.chatmode.md** - Development philosophy

### New Documentation Created
- **API_AUTHENTICATION_PATTERN.md** - Standard auth implementation
- **SECURITY_REMEDIATION_PLAN.md** (this file)

### External Resources
- **Firebase Security Rules**: https://firebase.google.com/docs/firestore/security/get-started
- **Firebase Admin SDK**: https://firebase.google.com/docs/admin/setup
- **OWASP API Security**: https://owasp.org/www-project-api-security/

---

## 📊 Progress Tracking

### Phase 1 Status

| Fix | Issue | Status | Time | Tester | Date |
|-----|-------|--------|------|--------|------|
| 1.1 | Firestore Rules | ⚪ Not Started | 30 min | - | - |
| 1.2 | Auth Bypass | ⚪ Not Started | 15 min | - | - |
| 1.3 | Hardcoded Keys | ⚪ Not Started | 20 min | - | - |
| 1.4 | Admin Auth | ⚪ Not Started | 2 hours | - | - |
| 1.5 | JWT Verification | ⚪ Not Started | 1 hour | - | - |
| 1.6 | Profile Auth | ⚪ Not Started | 1 hour | - | - |

**Legend**:
- ⚪ Not Started
- 🔵 In Progress
- 🟢 Complete
- 🔴 Blocked

### Update Progress
```bash
# After completing each fix, update this file
# Mark status as complete and add tester name + date
```

---

## 🆘 Support & Questions

### If You Get Stuck

1. **Review Documentation**:
   - Read SECURITY_AUDIT_REPORT.md for context
   - Check API_AUTHENTICATION_PATTERN.md for patterns
   - Review J.chatmode.md for development philosophy

2. **Test Incrementally**:
   - Complete one fix at a time
   - Test after each fix before proceeding
   - Commit working state frequently

3. **Common Issues**:
   - **"Firebase not initialized"**: Check lib/firebase-admin.ts imports
   - **"401 Unauthorized"**: Verify token is being sent and is valid
   - **"Rules denied access"**: Check Firestore rules are deployed
   - **"Admin access denied"**: Verify custom claims are set

4. **Emergency Contacts**:
   - Check project team communication channel
   - Reference AGENT_LOG.md for historical context

---

**End of Security Remediation Plan - Phase 1**
**Document Version**: 1.0
**Last Updated**: October 7, 2025
**Next Review**: After Phase 1 deployment

**Remember the J.chatmode.md philosophy**:
- Do not break existing working code
- Test thoroughly before deploying
- Document all changes
- Security is non-negotiable
