# Admin Panel - Product Requirements Document (PRD)

**Last Updated:** November 17, 2025  
**Status:** 📋 PLANNING  
**Priority:** HIGH  
**GDPR Compliance:** ✅ Required  
**Target Completion:** December 2025

---

## 📋 **OVERVIEW**

### **Purpose**
Build a comprehensive admin panel for internal ZenType management that follows enterprise-grade best practices, GDPR compliance, and subscription-based SaaS architecture. This system will enable administrators to:
- Manage user accounts (view, edit, delete)
- Control subscription tiers and AI test generation limits
- Monitor system usage and analytics
- Make users admins (RBAC system)
- Handle GDPR compliance requests

### **Success Criteria**
- ✅ Admin authentication separate from regular users
- ✅ RBAC system with multiple admin levels
- ✅ User subscription management fully functional
- ✅ AI test generation limits enforced
- ✅ GDPR-compliant data handling
- ✅ Audit logging for all admin actions
- ✅ Secure, production-ready architecture

---

## 🎯 **BUSINESS REQUIREMENTS**

### **1. Admin Authentication & Authorization**

#### **Separate Admin Login System**
- **Route:** `/admin/login` (separate from `/login`)
- **Authentication Method:** Email/Password only (no OAuth for admins)
- **Security:**
  - Must re-authenticate before sensitive operations (account deletion, role changes)
  - Session timeout: 30 minutes of inactivity
  - IP address logging for security audit trail
  - Two-factor authentication (FUTURE: Phase 2)

#### **Role-Based Access Control (RBAC)**
Firebase custom claims implementation:

```typescript
interface AdminClaims {
  admin: boolean;           // Can view dashboards, manage users
  superAdmin: boolean;      // Can make other users admin
  canDeleteUsers: boolean;  // Can delete user accounts
  canManageSubscriptions: boolean; // Can change user tiers
}
```

**Role Hierarchy:**
1. **Regular User** (no custom claims)
   - Normal typing test access
   - Can upgrade via payment

2. **Admin** (`admin: true`)
   - View admin dashboard
   - View user list and profiles
   - View analytics and reports
   - Cannot make other admins
   - Cannot delete users

3. **Super Admin** (`admin: true, superAdmin: true, canDeleteUsers: true, canManageSubscriptions: true`)
   - All admin permissions
   - Can promote users to admin
   - Can delete user accounts
   - Can modify subscription tiers manually
   - Full system access

---

### **2. User Management Dashboard**

#### **User List View**
**Route:** `/admin/users`

**Features:**
- **Search & Filter:**
  - By email, username, UID
  - By subscription tier (free, premium)
  - By registration date range
  - By last activity date
  
- **Display Columns:**
  - User ID (Firebase UID)
  - Email address
  - Display name
  - Subscription tier (Free/Premium)
  - AI tests remaining (today)
  - Registration date
  - Last login date
  - Account status (active/suspended)
  - Actions dropdown

- **Pagination:**
  - 50 users per page
  - Server-side pagination for performance

#### **User Detail View**
**Route:** `/admin/users/[uid]`

**Information Displayed:**
- **Profile Data:**
  - Email, username, photo
  - Bio, theme preference, font preference
  - Account creation date
  - Email verification status
  
- **Statistics:**
  - Tests completed (total)
  - Average WPM
  - Average accuracy
  - Best score
  - Current rank

- **Subscription Details:**
  - Current tier (Free/Premium)
  - AI tests used today
  - Daily limit
  - Subscription start date (if premium)
  - Subscription end date (if premium)

- **Admin Actions:**
  - Edit user profile (email, username, display name)
  - Change subscription tier
  - Reset AI test limit
  - Suspend/Unsuspend account
  - Delete account (with confirmation)
  - Make admin (Super Admin only)

---

### **3. Subscription Management System**

#### **Subscription Tiers**

##### **Free Tier** (Default)
```typescript
interface FreeTierLimits {
  aiTestsPerDay: 5;           // Limited AI generations
  practiceTests: "unlimited";  // Unlimited pre-made tests
  features: [
    "Practice tests",
    "5 AI tests per day",
    "Leaderboard access",
    "Profile customization"
  ];
}
```

##### **Premium Tier**
```typescript
interface PremiumTierLimits {
  aiTestsPerDay: "unlimited"; // No AI limits
  practiceTests: "unlimited"; // Unlimited pre-made tests
  features: [
    "Practice tests",
    "Unlimited AI tests",
    "Priority support",
    "Advanced analytics",
    "Custom themes (future)",
    "Ad-free experience"
  ];
  price: {
    monthly: 3.00,  // USD
    annual: 30.00   // USD (save 17%)
  };
}
```

#### **Subscription Database Schema**

**New Firestore Collection:** `subscriptions`

```typescript
interface SubscriptionDocument {
  userId: string;              // Firebase UID
  tier: "free" | "premium";    // Subscription level
  status: "active" | "cancelled" | "expired";
  
  // Payment information
  stripeCustomerId?: string;   // For Stripe integration
  stripeSubscriptionId?: string;
  
  // Dates
  startDate: string;           // ISO timestamp
  endDate?: string;            // ISO timestamp (for premium)
  renewalDate?: string;        // ISO timestamp (auto-renewal)
  cancelledAt?: string;        // ISO timestamp
  
  // AI Test Limits
  aiTestsUsedToday: number;    // Resets daily
  lastResetDate: string;       // ISO date (YYYY-MM-DD)
  
  // Metadata
  createdAt: string;           // ISO timestamp
  updatedAt: string;           // ISO timestamp
  modifiedBy?: string;         // Admin UID (if manually changed)
}
```

**Index Requirements:**
- `userId` (single field index)
- `tier + status` (composite index)
- `endDate` (for expiration checks)

---

### **4. AI Test Generation Limit System**

#### **Rate Limiting Architecture**

**Existing Rate Limiter Integration:**
ZenType already has `firebase-functions-rate-limiter` implemented in `/functions/src/rate-limiter.ts`. We'll extend this for subscription-based limits.

##### **Enhanced Rate Limiter Configuration**

```typescript
// functions/src/subscription-rate-limiter.ts

import { FirebaseFunctionsRateLimiter } from 'firebase-functions-rate-limiter';
import { HttpsError } from 'firebase-functions/v2/https';
import { getFirestore } from 'firebase-admin/firestore';

const firestore = getFirestore();

export async function checkAiTestLimit(userId: string): Promise<void> {
  // 1. Fetch user's subscription
  const subscriptionRef = firestore.collection('subscriptions').doc(userId);
  const subscriptionDoc = await subscriptionRef.get();
  
  const subscription = subscriptionDoc.data() || {
    tier: 'free',
    aiTestsUsedToday: 0,
    lastResetDate: new Date().toISOString().split('T')[0]
  };
  
  // 2. Reset counter if new day
  const today = new Date().toISOString().split('T')[0];
  if (subscription.lastResetDate !== today) {
    subscription.aiTestsUsedToday = 0;
    subscription.lastResetDate = today;
  }
  
  // 3. Check limit based on tier
  if (subscription.tier === 'premium') {
    // Premium users have unlimited access
    return;
  }
  
  // Free tier: 5 tests per day
  if (subscription.aiTestsUsedToday >= 5) {
    throw new HttpsError(
      'resource-exhausted',
      'Daily AI test limit reached. Upgrade to Premium for unlimited tests.',
      {
        limit: 5,
        used: subscription.aiTestsUsedToday,
        tier: 'free',
        upgradeUrl: '/pricing'
      }
    );
  }
  
  // 4. Increment counter
  await subscriptionRef.set({
    ...subscription,
    aiTestsUsedToday: subscription.aiTestsUsedToday + 1,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}
```

##### **Integration with Existing Cloud Function**

```typescript
// functions/src/index.ts (modify generateAiTest function)

export const generateAiTest = onCall(async (request) => {
  // ... existing auth checks ...
  
  // NEW: Check subscription-based rate limit
  await checkAiTestLimit(userId);
  
  // ... existing AI generation logic ...
});
```

##### **Client-Side Limit Display**

Update `/app/test/page.tsx` to show remaining tests:

```typescript
// Fetch from API endpoint
const response = await fetch('/api/v1/user/subscription', {
  headers: { Authorization: `Bearer ${idToken}` }
});

const { aiTestsRemaining, tier } = await response.json();

// Display in UI
{tier === 'free' && (
  <div className="text-sm text-muted-foreground">
    {aiTestsRemaining} AI tests remaining today
    <Link href="/pricing" className="text-primary underline">
      Upgrade to Premium
    </Link>
  </div>
)}
```

---

### **5. Simple Mode for AI Test Generation**

**Feature Description:**
Allow users to paste their own text and generate a typing test without specifying difficulty or time parameters.

**Route:** `/test/simple` (new page)

**UI Components:**
- Large textarea for pasting text
- Character/word counter
- "Generate Test" button
- Preview of generated test

**Backend Logic:**

```typescript
// functions/src/index.ts (new function)

export const generateSimpleTest = onCall(async (request) => {
  const userId = request.auth?.uid;
  const { text } = request.data;
  
  // 1. Validate input
  if (!text || text.trim().length < 50) {
    throw new HttpsError('invalid-argument', 'Text must be at least 50 characters');
  }
  
  if (text.length > 5000) {
    throw new HttpsError('invalid-argument', 'Text must be less than 5000 characters');
  }
  
  // 2. Check subscription limit (same as generateAiTest)
  await checkAiTestLimit(userId);
  
  // 3. Clean and format text (no AI processing needed)
  const cleanedText = text
    .trim()
    .replace(/\s+/g, ' ')           // Normalize whitespace
    .replace(/[^\w\s.,!?-]/g, '');  // Remove special characters
  
  const wordCount = cleanedText.split(/\s+/).length;
  
  // 4. Save to Firestore
  const testRef = await firestore.collection('aiGeneratedTests').add({
    userId,
    text: cleanedText,
    prompt: 'User-provided text (simple mode)',
    difficulty: 'custom',
    category: 'custom',
    wordCount,
    createdAt: new Date().toISOString(),
    isPublic: false,
    mode: 'simple'
  });
  
  return {
    testId: testRef.id,
    text: cleanedText,
    wordCount
  };
});
```

**Key Differences from Regular AI Mode:**
- ❌ No Gemini AI API call (no cost)
- ❌ No difficulty selection
- ❌ No time limit specification
- ✅ Still counts against daily AI test limit (to prevent abuse)
- ✅ Minimal text processing (cleaning only)
- ✅ Faster generation (no API latency)

---

## 🔒 **SECURITY & GDPR COMPLIANCE**

### **1. Admin Action Audit Logging**

**New Firestore Collection:** `adminAuditLog`

```typescript
interface AdminAuditLogEntry {
  logId: string;            // Auto-generated
  timestamp: string;        // ISO timestamp
  adminUserId: string;      // Who performed the action
  adminEmail: string;       // Admin's email
  action: string;           // Action type
  targetUserId?: string;    // User affected (if applicable)
  targetEmail?: string;     // User's email (if applicable)
  changes?: object;         // Before/after values
  ipAddress: string;        // Admin's IP address
  userAgent: string;        // Admin's browser
  success: boolean;         // Whether action succeeded
  errorMessage?: string;    // If action failed
}
```

**Actions to Log:**
- `admin_login` - Admin logged in
- `user_view` - Viewed user profile
- `user_edit` - Modified user data
- `user_delete` - Deleted user account
- `user_suspend` - Suspended user
- `subscription_change` - Changed subscription tier
- `role_grant` - Made user admin
- `role_revoke` - Removed admin role
- `limit_reset` - Reset AI test limit

**Example Log Entry:**

```json
{
  "logId": "audit_1732123456789",
  "timestamp": "2025-11-17T14:30:00.000Z",
  "adminUserId": "admin_abc123",
  "adminEmail": "admin@zentype.com",
  "action": "subscription_change",
  "targetUserId": "user_xyz789",
  "targetEmail": "user@example.com",
  "changes": {
    "before": { "tier": "free" },
    "after": { "tier": "premium" }
  },
  "ipAddress": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "success": true
}
```

### **2. GDPR Compliance Checklist**

- ✅ **Right to Access:** Admins can view all user data
- ✅ **Right to Erasure:** Admins can delete accounts (uses existing Firebase Extension)
- ✅ **Right to Rectification:** Admins can edit user profiles
- ✅ **Audit Trail:** All admin actions logged with timestamps
- ✅ **Data Minimization:** Only necessary data stored in subscriptions collection
- ✅ **Consent Management:** Uses existing cookie consent system
- ✅ **Data Portability:** Uses existing data export API
- ✅ **EU Data Storage:** Firebase region europe-west1 (Belgium)

### **3. Security Best Practices**

**Admin Authentication:**
- ✅ Separate login route (`/admin/login`)
- ✅ Email verification required
- ✅ Strong password requirements (min 12 characters)
- ✅ Session timeout after 30 minutes
- ✅ Re-authentication before destructive actions

**Authorization Checks:**
```typescript
// Middleware for admin routes

export async function verifyAdmin(request: NextRequest): Promise<AdminClaims> {
  const idToken = request.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!idToken) {
    throw new Error('Unauthorized');
  }
  
  const decodedToken = await getAuth().verifyIdToken(idToken);
  
  if (!decodedToken.admin) {
    throw new Error('Insufficient permissions');
  }
  
  return {
    admin: decodedToken.admin || false,
    superAdmin: decodedToken.superAdmin || false,
    canDeleteUsers: decodedToken.canDeleteUsers || false,
    canManageSubscriptions: decodedToken.canManageSubscriptions || false
  };
}
```

**Rate Limiting for Admin APIs:**
```typescript
// Prevent brute force attacks
const adminRateLimiter = FirebaseFunctionsRateLimiter.withFirestoreBackend({
  name: 'admin_api_limiter',
  maxCalls: 100,
  periodSeconds: 60,
}, firestore);
```

---

## 📊 **ADMIN DASHBOARD FEATURES**

### **1. Analytics Overview**
**Route:** `/admin/dashboard`

**Metrics Displayed:**
- Total users (all time)
- New users (last 7 days, last 30 days)
- Active users (last 24 hours)
- Premium subscribers count
- Total revenue (if payment integration added)
- Tests completed (last 24 hours)
- AI tests generated (last 24 hours)
- Average WPM across platform
- Server uptime and health

**Charts:**
- User growth over time (line chart)
- Subscription tier distribution (pie chart)
- Daily active users (bar chart)
- AI test usage by tier (comparison chart)

### **2. System Health**
**Route:** `/admin/health`

- Firebase connection status
- Firestore read/write latency
- Cloud Functions cold start metrics
- Error rate (last 24 hours)
- API endpoint availability
- Gemini API quota remaining

---

## 🚀 **IMPLEMENTATION CHECKLIST**

### **Phase 1: Foundation (Week 1-2)**
- [ ] Create `/docs/admin-panel/` IKB structure
- [ ] Design Firestore schema for `subscriptions` collection
- [ ] Implement Firebase custom claims for RBAC
- [ ] Create admin authentication flow
- [ ] Build admin middleware for authorization checks

### **Phase 2: User Management (Week 3-4)**
- [ ] Build user list view with search/filter
- [ ] Build user detail view
- [ ] Implement user profile editing API
- [ ] Implement account suspension API
- [ ] Implement role promotion API (Super Admin only)
- [ ] Test user management with Playwright MCP

### **Phase 3: Subscription System (Week 5-6)**
- [ ] Implement subscription rate limiter
- [ ] Create subscription management API
- [ ] Build subscription tier change UI
- [ ] Integrate with existing AI test generation
- [ ] Test free tier limits enforcement
- [ ] Create pricing page for users

### **Phase 4: Simple Mode (Week 7)**
- [ ] Create `/test/simple` route
- [ ] Build simple text paste UI
- [ ] Implement `generateSimpleTest` Cloud Function
- [ ] Integrate with subscription limits
- [ ] Test simple mode end-to-end

### **Phase 5: Audit & Analytics (Week 8)**
- [ ] Implement admin audit logging
- [ ] Build analytics dashboard
- [ ] Create system health monitoring
- [ ] Set up alerting for critical issues

### **Phase 6: Testing & Deployment (Week 9-10)**
- [ ] Complete Playwright MCP testing suite
- [ ] Security audit and penetration testing
- [ ] GDPR compliance verification
- [ ] Performance optimization
- [ ] Production deployment
- [ ] Update IKB documentation with lessons learned

---

## 📝 **TECHNICAL NOTES**

### **Payment Integration (Future: Phase 2)**
- Stripe integration for premium subscriptions
- Webhook handling for subscription events
- Automatic tier upgrades/downgrades
- Refund handling
- Billing history for users

### **Monitoring & Alerting (Future: Phase 3)**
- Google Cloud Monitoring integration
- Slack/email alerts for critical errors
- Daily usage reports
- Anomaly detection (unusual AI test spikes)

### **Advanced Features (Future: Phase 4)**
- Bulk user operations (import, export)
- Email campaigns to users
- Custom theme creator for premium users
- A/B testing framework
- Advanced analytics (cohort analysis, retention)

---

**Document Version:** 1.0  
**Author:** J (ZenType Architect)  
**Review Status:** ✅ READY FOR IMPLEMENTATION
