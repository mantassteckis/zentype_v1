# Admin Panel - Scope Definition

**Last Updated:** November 17, 2025  
**Status:** 📋 PLANNING  
**Priority:** HIGH  
**Critical Risk Zones:** 7 HIGH RISK areas identified

---

## ✅ **WHAT IS IN SCOPE**

### **1. New Files to Create**

#### **Admin Panel Routes**
```
app/
├── admin/
│   ├── layout.tsx              # Admin layout with sidebar navigation
│   ├── page.tsx                # Dashboard overview (redirects to /admin/dashboard)
│   ├── login/
│   │   └── page.tsx            # Admin-only login page
│   ├── dashboard/
│   │   └── page.tsx            # Analytics dashboard
│   ├── users/
│   │   ├── page.tsx            # User list view
│   │   └── [uid]/
│   │       └── page.tsx        # User detail view
│   ├── subscriptions/
│   │   └── page.tsx            # Subscription management
│   ├── health/
│   │   └── page.tsx            # System health monitoring
│   └── audit-log/
│       └── page.tsx            # Admin action audit log
```

#### **Admin API Routes**
```
app/api/v1/admin/
├── auth/
│   └── login/
│       └── route.ts            # Admin login API
├── users/
│   ├── route.ts                # GET (list users), POST (search/filter)
│   ├── [uid]/
│   │   └── route.ts            # GET (user details), PUT (update), DELETE (delete)
│   └── [uid]/
│       └── make-admin/
│           └── route.ts        # POST (promote to admin - Super Admin only)
├── subscriptions/
│   ├── route.ts                # GET (list subscriptions)
│   └── [userId]/
│       └── route.ts            # GET (user subscription), PUT (change tier)
├── audit-log/
│   └── route.ts                # GET (fetch audit logs with pagination)
└── analytics/
    └── route.ts                # GET (dashboard metrics)
```

#### **Backend/Functions**
```
functions/src/
├── subscription-rate-limiter.ts    # NEW: Subscription-based rate limiting
├── admin-audit-logger.ts           # NEW: Admin action logging utility
└── simple-test-generator.ts        # NEW: Simple mode test generation
```

#### **Middleware**
```
lib/
├── admin-middleware.ts         # NEW: Admin authorization middleware
├── subscription-checker.ts     # NEW: Check user subscription tier
└── audit-logger-client.ts      # NEW: Client-side audit logging helper
```

#### **Components**
```
components/admin/
├── AdminSidebar.tsx            # Admin navigation sidebar
├── UserListTable.tsx           # User list with search/filter
├── UserDetailCard.tsx          # User profile display
├── SubscriptionBadge.tsx       # Tier badge component
├── AuditLogTable.tsx           # Audit log display
├── AnalyticsChart.tsx          # Charts for dashboard
├── RoleBadge.tsx               # Display user roles (admin/superAdmin)
└── ConfirmationModal.tsx       # Confirm destructive actions
```

#### **Database Collections**
```
Firestore:
├── subscriptions/              # NEW: User subscription data
│   └── {userId}                # Document per user
├── adminAuditLog/              # NEW: Admin action logs
│   └── {logId}                 # Auto-generated log entry
└── adminUsers/                 # NEW: Admin-specific metadata
    └── {adminUid}              # Admin preferences, settings
```

---

### **2. Existing Files to Modify**

#### **🔴 HIGH RISK: Firebase Admin SDK Setup**
- **File:** `/lib/firebase-admin.ts`
- **Changes:** Add admin authorization helper functions
- **Risk Level:** HIGH - Wrong changes break all Admin SDK operations
- **Lines to Add:** ~50-100 lines (append only, don't modify existing code)
- **Critical Functions:**
  ```typescript
  export async function verifyAdminToken(idToken: string): Promise<AdminClaims>
  export async function setUserCustomClaims(uid: string, claims: object): Promise<void>
  export async function revokeUserSessions(uid: string): Promise<void>
  ```

#### **🟡 MEDIUM RISK: Cloud Functions Index**
- **File:** `/functions/src/index.ts`
- **Changes:** Add new Cloud Functions for admin operations
- **Risk Level:** MEDIUM - Breaking existing exports affects all APIs
- **Lines to Add:** ~200-300 lines
- **New Exports:**
  ```typescript
  export const generateSimpleTest = onCall(...)
  export const adminListUsers = onCall(...)
  export const adminUpdateSubscription = onCall(...)
  ```

#### **🟡 MEDIUM RISK: Rate Limiter**
- **File:** `/functions/src/rate-limiter.ts`
- **Changes:** Extend existing rate limiter with subscription-based logic
- **Risk Level:** MEDIUM - Affects AI test generation for all users
- **Lines to Modify:** ~50 lines (add new function, don't modify existing limiters)
- **New Function:**
  ```typescript
  export async function checkAiTestLimit(userId: string): Promise<void>
  ```

#### **🟢 LOW RISK: Main Index Update**
- **File:** `/docs/MAIN.md`
- **Changes:** Add admin panel section to documentation index
- **Risk Level:** LOW - Documentation only
- **Lines to Add:** ~30 lines in appropriate section

#### **🟢 LOW RISK: Firestore Schema Docs**
- **File:** `/docs/FIRESTORE_SCHEMA.md`
- **Changes:** Document new `subscriptions` and `adminAuditLog` collections
- **Risk Level:** LOW - Documentation only
- **Lines to Add:** ~100 lines with TypeScript interfaces

#### **🟢 LOW RISK: Test Page (Simple Mode Link)**
- **File:** `/app/test/page.tsx`
- **Changes:** Add link to simple mode (`/test/simple`)
- **Risk Level:** LOW - Single link addition
- **Lines to Add:** ~10 lines in UI section

---

### **3. Interconnected Features**

#### **🔗 INTERCONNECTION: Account Deletion Feature**
- **Related Docs:** `/docs/account-deletion/`
- **Integration Point:** Admin panel reuses existing account deletion API
- **Admin Enhancement:** Admins can delete accounts without re-authentication
- **Dependencies:**
  - `/app/api/v1/user/delete-account/route.ts` - Existing API
  - Firebase Extension: `delete-user-data-gdpr` - Already installed
- **Testing Required:** Verify admin deletion triggers same extension

#### **🔗 INTERCONNECTION: Privacy & GDPR Compliance**
- **Related Docs:** `/docs/privacy/`
- **Integration Point:** Admin panel must log GDPR-related actions
- **Dependencies:**
  - `/app/api/v1/user/export-data/route.ts` - Data export API
  - `/app/api/v1/user/consents/route.ts` - Consent management
- **Admin Access:** Admins can export user data on behalf of user
- **Audit Requirement:** All data exports logged with admin ID

#### **🔗 INTERCONNECTION: Existing Rate Limiter**
- **Related Docs:** `/docs/DEBUG_GUIDE.md` (rate limiting section)
- **Integration Point:** Subscription limits extend existing rate limiter
- **Dependencies:**
  - `/functions/src/rate-limiter.ts` - Existing rate limiter
  - `firebase-functions-rate-limiter` package - Already installed
- **Enhancement:** Subscription tier determines AI test limits
- **Testing Required:** Verify free tier limits work without breaking premium users

#### **🔗 INTERCONNECTION: Firebase Authentication**
- **Related Docs:** Implicit in `/lib/firebase-admin.ts`
- **Integration Point:** Custom claims for admin roles
- **Dependencies:**
  - Firebase Admin SDK - Already configured
  - `/context/AuthProvider.tsx` - Existing auth context
- **Enhancement:** Add custom claims check in AuthProvider
- **Security Note:** Admin routes must verify custom claims, not just authentication

---

### **4. Testing Requirements**

#### **Playwright MCP Test Scenarios**
All tests must run on `localhost:3000` with dev server running:

**Test Suite 1: Admin Authentication**
- [ ] Admin login with valid credentials
- [ ] Admin login rejection for non-admin users
- [ ] Session timeout after 30 minutes
- [ ] Re-authentication modal before account deletion

**Test Suite 2: User Management**
- [ ] Admin can view user list
- [ ] Admin can search users by email
- [ ] Admin can view user detail page
- [ ] Admin can edit user profile (email, username)
- [ ] Super Admin can promote user to admin
- [ ] Regular admin CANNOT promote users (403 error)

**Test Suite 3: Subscription Management**
- [ ] Admin can view user subscription
- [ ] Admin can change subscription tier
- [ ] Free tier user hits 5 AI test limit
- [ ] Premium user has unlimited AI tests
- [ ] Simple mode counts against daily limit
- [ ] Subscription tier change logged in audit log

**Test Suite 4: Account Deletion**
- [ ] Admin can delete user account
- [ ] Deletion triggers Firebase extension
- [ ] Audit log records admin deletion
- [ ] Deleted user cannot login

**Test Suite 5: Audit Logging**
- [ ] All admin actions appear in audit log
- [ ] Logs include admin email, timestamp, IP
- [ ] Pagination works for large log sets
- [ ] Filter audit logs by action type

---

## ❌ **WHAT IS NOT IN SCOPE**

### **🚫 PROTECTED AREAS - DO NOT MODIFY**

#### **1. Existing Authentication Flow**
- **Files:**
  - `/app/login/page.tsx` - Regular user login
  - `/app/signup/page.tsx` - User registration
  - `/context/AuthProvider.tsx` - Auth state management
- **Why Protected:** Core user authentication must remain unchanged
- **Exception:** Only extend AuthProvider to check custom claims (read-only)

#### **2. Existing API Endpoints**
- **Files:**
  - `/app/api/v1/tests/route.ts` - Practice tests API
  - `/app/api/v1/submit-test-result/route.ts` - Test result submission
- **Why Protected:** Production APIs serving all users
- **Exception:** Only read from these endpoints, don't modify behavior

#### **3. User-Facing Test Pages**
- **Files:**
  - `/app/test/page.tsx` - Main typing test
  - `/app/dashboard/page.tsx` - User dashboard
  - `/app/settings/page.tsx` - User settings
- **Why Protected:** User experience must not be affected
- **Exception:** Only add admin links if user has admin custom claim

#### **4. Leaderboard System**
- **Files:**
  - `/app/leaderboard/page.tsx` - Leaderboard display
  - Collections: `leaderboard_all_time`, `leaderboard_daily`, `leaderboard_weekly`
- **Why Protected:** Complex aggregation logic, no admin changes needed
- **Exception:** Admins can view leaderboard like regular users

#### **5. AI Test Generation (Gemini API)**
- **Files:**
  - `/functions/src/index.ts` (generateAiTest function)
  - `/lib/ai/genkit_functions.ts` - AI integration
- **Why Protected:** Critical revenue-generating feature
- **Exception:** Only add subscription check at function entry, don't modify AI logic

---

## ⚠️ **CRITICAL AREAS TO PAY ATTENTION TO**

### **HIGH RISK ZONES** 🔴

#### **1. Firebase Custom Claims Management**
- **Files:**
  - `/lib/firebase-admin.ts` (new functions)
  - `/app/api/v1/admin/users/[uid]/make-admin/route.ts` (new file)
- **Risk:** Incorrect claims break authorization across entire app
- **Critical Rules:**
  - ✅ ALWAYS validate existing claims before overwriting
  - ✅ NEVER remove `admin: true` without explicit confirmation
  - ✅ ALWAYS log claim changes to audit log
  - ❌ NEVER set claims on client-side (security risk)
- **Testing Required:**
  - Verify claims persist across logout/login
  - Verify claims propagate to ID token after refresh
  - Verify non-admin users cannot access admin routes even with direct URL

#### **2. Subscription Rate Limiting**
- **Files:**
  - `/functions/src/subscription-rate-limiter.ts` (new file)
  - `/functions/src/index.ts` (integration point)
- **Risk:** Breaking limits affects all users, potential revenue loss
- **Critical Rules:**
  - ✅ ALWAYS check premium tier before applying limits
  - ✅ ALWAYS reset counters at midnight UTC
  - ✅ NEVER block premium users
  - ❌ NEVER allow unlimited free tier (prevent abuse)
- **Testing Required:**
  - Free user hits 5 AI test limit → upgrade prompt shown
  - Premium user generates 100 AI tests → no errors
  - Counter resets correctly at midnight
  - Simple mode counts against daily limit

#### **3. Admin Audit Logging**
- **Files:**
  - `/functions/src/admin-audit-logger.ts` (new file)
  - All admin API routes (log every action)
- **Risk:** Missing logs = GDPR non-compliance, security blind spots
- **Critical Rules:**
  - ✅ ALWAYS log before performing destructive action
  - ✅ ALWAYS include: timestamp, admin ID, target user, action type, IP address
  - ✅ ALWAYS capture before/after values for changes
  - ❌ NEVER skip logging to "save time"
- **Common Mistakes to Avoid:**
  - ❌ Logging after action (if action fails, log is incomplete)
  - ❌ Not logging read operations (GDPR requires access logs)
  - ❌ Hardcoding admin email (use Firebase Auth email)

#### **4. User Account Deletion (Admin Override)**
- **Files:**
  - `/app/api/v1/admin/users/[uid]/route.ts` (DELETE method)
  - Integration with existing `/app/api/v1/user/delete-account/route.ts`
- **Risk:** Accidental deletion = irreversible data loss
- **Critical Rules:**
  - ✅ ALWAYS require confirmation modal (double-check)
  - ✅ ALWAYS log deletion with admin ID
  - ✅ ALWAYS reuse existing Firebase Extension (don't reimplement)
  - ❌ NEVER allow batch deletions without extra safeguards
- **Testing Required:**
  - Admin deletion triggers same extension as user self-deletion
  - Audit log records admin UID and reason
  - Deleted user receives email notification (future feature)

#### **5. Admin Route Authorization**
- **Files:**
  - `/lib/admin-middleware.ts` (new file)
  - All `/app/admin/*` routes (use middleware)
- **Risk:** Unauthorized access = security breach
- **Critical Rules:**
  - ✅ ALWAYS verify custom claims on every admin route
  - ✅ ALWAYS redirect to `/admin/login` if unauthorized
  - ✅ ALWAYS check specific permission for sensitive actions
  - ❌ NEVER rely on client-side role checks alone
- **Permission Matrix:**
  ```typescript
  // Example permission checks
  if (action === 'delete_user' && !claims.canDeleteUsers) {
    throw new Error('Insufficient permissions');
  }
  
  if (action === 'make_admin' && !claims.superAdmin) {
    throw new Error('Only Super Admins can promote users');
  }
  ```

---

### **MEDIUM RISK ZONES** 🟡

#### **1. Subscription Collection Schema**
- **Files:**
  - Firestore collection: `subscriptions`
  - TypeScript interface in `/lib/types/database.ts` (extend existing)
- **Risk:** Schema changes affect billing and limits
- **Mitigation:**
  - Document all fields with TypeScript interface
  - Add data validation on write
  - Test subscription changes with real data

#### **2. Simple Mode Text Processing**
- **Files:**
  - `/functions/src/simple-test-generator.ts` (new file)
  - `/app/test/simple/page.tsx` (new route)
- **Risk:** Malicious input could crash function
- **Mitigation:**
  - Validate text length (50-5000 characters)
  - Sanitize input (remove dangerous characters)
  - Rate limit simple mode (use existing limiter)

---

## 📁 **FILES TO REFERENCE**

### **Implementation Patterns**
- **API Route Pattern:** `/app/api/v1/user/export-data/route.ts` (authentication, logging, error handling)
- **Admin SDK Usage:** `/app/api/v1/tests/route.ts` (correct Admin SDK imports and initialization)
- **Rate Limiting:** `/functions/src/rate-limiter.ts` (existing rate limiter configuration)
- **Audit Logging:** `/app/api/v1/user/delete-account/route.ts` (sensitive operation logging)

### **UI Components to Reuse**
- **Table Components:** `/components/dashboard/` (existing table patterns)
- **Modal Components:** `/components/ui/dialog.tsx` (confirmation modals)
- **Badge Components:** `/components/ui/badge.tsx` (role badges, tier badges)
- **Layout Pattern:** `/app/dashboard/layout.tsx` (sidebar navigation)

### **Authentication Patterns**
- **Firebase Admin Auth:** `/lib/firebase-admin.ts` (Admin SDK initialization)
- **Client Auth Context:** `/context/AuthProvider.tsx` (auth state management)
- **Token Verification:** `/app/api/v1/user/consents/route.ts` (ID token verification pattern)

---

## 🔗 **CROSS-FEATURE DEPENDENCIES**

### **Dependency Graph**

```
Admin Panel
├── Requires: Firebase Admin SDK (/lib/firebase-admin.ts)
├── Extends: Rate Limiter (/functions/src/rate-limiter.ts)
├── Integrates: Account Deletion (existing Firebase Extension)
├── Logs to: Admin Audit Log (new collection)
└── Uses: Privacy/GDPR APIs (data export, consent management)
```

### **Impact Analysis**

**If Admin Panel Changes Break:**
- ✅ Regular users unaffected (separate routes)
- ✅ Typing tests continue working
- ✅ User authentication still functional
- ❌ Admins cannot manage subscriptions
- ❌ AI test limits not enforced (fallback to unlimited)

**If Subscription System Breaks:**
- ✅ Existing users keep current tier
- ✅ Admin panel continues working
- ❌ New premium signups fail
- ❌ AI test limits not enforced
- ❌ Revenue loss

---

## 📊 **SUCCESS METRICS**

### **Technical Metrics**
- Admin login response time: < 500ms
- User list load time (1000 users): < 2s
- Subscription tier change: < 1s
- Audit log query (10,000 entries): < 3s
- Zero false positives on rate limiting

### **Security Metrics**
- 100% of admin actions logged
- Zero unauthorized admin route access
- Zero accidental account deletions
- All custom claims propagate within 5 minutes

### **GDPR Compliance Metrics**
- Audit logs retained for 7 years
- Data export available within 10 seconds
- Account deletion completes within 5 minutes
- All admin actions reversible (except deletion)

---

## 🚀 **DEPLOYMENT NOTES**

### **Environment Variables Required**
No new environment variables - reuse existing Firebase config.

### **Firebase Extension Configuration**
- ✅ `delete-user-data-gdpr` already installed (europe-west1)
- ✅ Auto-discovery enabled
- No changes needed

### **Firestore Indexes Required**
```bash
# subscriptions collection
firestore:indexes:
  - collectionGroup: subscriptions
    queryScope: COLLECTION
    fields:
      - fieldPath: userId
        order: ASCENDING
      - fieldPath: tier
        order: ASCENDING

# adminAuditLog collection
firestore:indexes:
  - collectionGroup: adminAuditLog
    queryScope: COLLECTION
    fields:
      - fieldPath: timestamp
        order: DESCENDING
      - fieldPath: action
        order: ASCENDING
```

### **Security Rules to Add**
```javascript
// firestore.rules

// Admin audit log (read-only for admins)
match /adminAuditLog/{logId} {
  allow read: if request.auth.token.admin == true;
  allow write: if false; // Only server-side writes
}

// Subscriptions (users can read their own, admins can read all)
match /subscriptions/{userId} {
  allow read: if request.auth.uid == userId || request.auth.token.admin == true;
  allow write: if false; // Only server-side writes via Admin SDK
}
```

---

**Document Version:** 1.0  
**Author:** J (ZenType Architect)  
**Review Status:** ✅ READY FOR IMPLEMENTATION  
**Critical Warnings:** 7 HIGH RISK zones identified - handle with extreme caution
