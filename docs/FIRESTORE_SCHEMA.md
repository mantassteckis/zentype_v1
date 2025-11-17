# ZenType Firestore Schema Documentation

## Overview
This document defines the complete Firestore database schema for the ZenType application. This schema is the **authoritative source** for all collection structures, field types, and data relationships.

**Last Updated**: November 17, 2025  
**Status**: ✅ Active and Verified  
**Collections Count**: 11 collections (8 existing + 3 admin panel collections)

---

## Collection Structure

### 1. `profiles` Collection
**Purpose**: User profile data and statistics  
**Document ID**: Firebase Auth UID

```typescript
interface UserProfile {
  id: string;                    // Document ID (Firebase Auth UID)
  email: string;                 // User's email address
  displayName: string;           // User's display name
  createdAt: string;            // ISO timestamp
  bio?: string;                 // Optional user biography
  preferredThemeId: string;     // UI theme preference
  preferredFontId: string;      // Font preference for typing
  settings: {
    keyboardSounds: boolean;    // Audio feedback setting
    visualFeedback: boolean;    // Visual feedback setting
    autoSaveAiTests: boolean;   // Auto-save AI generated tests
  };
  stats: {
    rank: string;               // User's typing rank (E, D, C, B, A, S)
    testsCompleted: number;     // Total tests completed
    avgWpm: number;            // Average words per minute
    avgAcc: number;            // Average accuracy percentage
  };
}
```

### 2. `test_contents` Collection ⭐ **PRIMARY TEST SOURCE**
**Purpose**: Pre-made typing tests library  
**Document ID**: Auto-generated

```typescript
interface PreMadeTest {
  id: string;                   // Document ID
  text: string;                 // The typing test content
  difficulty: 'Easy' | 'Medium' | 'Hard';  // Difficulty level
  category: string;             // Test category
  source: string;               // Content source/attribution
  wordCount: number;            // Number of words in test
  timeLimit: number;            // Recommended time limit in seconds
  createdAt: string;           // ISO timestamp
}
```

**Current Categories**:
- `technology` - Tech-related content
- `customer_support` - Customer service scenarios
- `business_finance` - Business and finance content
- `health_medical` - Healthcare and medical content

**Test Distribution**: 48 total tests (4 categories × 4 durations × 3 difficulties)

### 3. `aiGeneratedTests` Collection
**Purpose**: AI-generated typing tests  
**Document ID**: Auto-generated

```typescript
interface AiGeneratedTest {
  id: string;                   // Document ID
  userId: string;               // Creator's Firebase Auth UID
  text: string;                 // Generated test content
  prompt: string;               // Original user prompt
  difficulty: string;           // Requested difficulty
  category: string;             // Test category
  wordCount: number;            // Number of words
  createdAt: string;           // ISO timestamp
  isPublic: boolean;           // Whether test is publicly available
}
```

### 4. `testResults` Collection
**Purpose**: Individual typing test results  
**Document ID**: Auto-generated

```typescript
interface TestResult {
  id: string;                   // Document ID
  userId: string;               // User's Firebase Auth UID
  testId?: string;              // Reference to test_contents or aiGeneratedTests
  testType: 'practice' | 'ai' | 'custom';  // Type of test taken
  wpm: number;                  // Words per minute achieved
  accuracy: number;             // Accuracy percentage (0-100)
  timeSpent: number;           // Time spent in seconds
  completedAt: string;         // ISO timestamp
  mistakes: number;            // Number of typing mistakes
  testText: string;            // The actual text that was typed
  userInput: string;           // What the user actually typed
}
```

### 5. `leaderboard_all_time` Collection
**Purpose**: All-time leaderboard rankings  
**Document ID**: User's Firebase Auth UID

```typescript
interface LeaderboardEntry {
  id: string;                   // Document ID (Firebase Auth UID)
  displayName: string;          // User's display name
  bestWpm: number;             // Best WPM score
  bestAccuracy: number;        // Best accuracy score
  testsCompleted: number;      // Total tests completed
  lastUpdated: string;         // ISO timestamp
}
```

### 6. `leaderboard_daily` Collection
**Purpose**: Daily leaderboard rankings  
**Document ID**: User's Firebase Auth UID

```typescript
interface DailyLeaderboardEntry {
  id: string;                   // Document ID (Firebase Auth UID)
  displayName: string;          // User's display name
  bestWpm: number;             // Best WPM for the day
  bestAccuracy: number;        // Best accuracy for the day
  testsCompleted: number;      // Tests completed today
  date: string;                // Date in YYYY-MM-DD format
  lastUpdated: string;         // ISO timestamp
}
```

### 7. `leaderboard_weekly` Collection
**Purpose**: Weekly leaderboard rankings  
**Document ID**: User's Firebase Auth UID

```typescript
interface WeeklyLeaderboardEntry {
  id: string;                   // Document ID (Firebase Auth UID)
  displayName: string;          // User's display name
  bestWpm: number;             // Best WPM for the week
  bestAccuracy: number;        // Best accuracy for the week
  testsCompleted: number;      // Tests completed this week
  weekStart: string;           // Week start date (YYYY-MM-DD)
  lastUpdated: string;         // ISO timestamp
}
```

### 8. `generate_ai_test_limiter` Collection
**Purpose**: Rate limiting for AI test generation  
**Document ID**: User's Firebase Auth UID

```typescript
interface AiTestLimiter {
  id: string;                   // Document ID (Firebase Auth UID)
  requestCount: number;         // Number of requests made
  lastRequest: string;          // ISO timestamp of last request
  resetTime: string;           // When the counter resets
}
```

---

## 🔐 Admin Panel Collections (Added November 17, 2025)

### 9. `subscriptions` Collection
**Purpose**: User subscription tiers and AI test rate limiting  
**Document ID**: User's Firebase Auth UID

```typescript
interface Subscription {
  userId: string;               // Firebase Auth UID
  tier: 'free' | 'premium';    // Subscription tier
  status: 'active' | 'cancelled' | 'expired' | 'trial';  // Subscription status
  
  // AI Test Rate Limiting (Daily)
  aiTestsUsedToday: number;    // Number of AI tests used today (resets daily)
  aiTestDailyLimit: number;    // Daily limit (5 for free, -1 for premium = unlimited)
  aiTestResetDate: string;     // ISO string - date when counter resets (midnight UTC)
  
  // Billing & Payments (Stripe Integration - Phase 3)
  stripeCustomerId?: string;   // Stripe customer ID
  stripeSubscriptionId?: string; // Stripe subscription ID
  stripePriceId?: string;      // Stripe price ID (monthly or yearly plan)
  
  // Subscription Dates
  startDate: string;           // ISO string - when subscription started
  endDate?: string;            // ISO string - when subscription ends (null for active recurring)
  cancelledAt?: string;        // ISO string - when user cancelled (still active until endDate)
  
  // Timestamps
  createdAt: string;           // ISO string
  updatedAt: string;           // ISO string
}
```

**Subscription Tiers**:
- **Free**: 5 AI tests per day, unlimited practice tests
- **Premium**: Unlimited AI tests, $3/month or $30/year

**Rate Limiting Logic**:
- On AI test generation: Check `aiTestsUsedToday` against `aiTestDailyLimit`
- If `aiTestResetDate` < today: Reset `aiTestsUsedToday` to 0, update `aiTestResetDate`
- Increment `aiTestsUsedToday` after successful generation

### 10. `adminAuditLog` Collection
**Purpose**: GDPR-compliant audit trail for all admin actions  
**Document ID**: Auto-generated

```typescript
interface AdminAuditLogEntry {
  id: string;                   // Auto-generated document ID
  timestamp: string;            // ISO string - when action occurred
  
  // Who performed the action
  adminUserId: string;          // Firebase UID of admin user
  adminEmail: string;           // Email of admin user (for human readability)
  adminRole: 'admin' | 'superAdmin';  // Admin's role at time of action
  
  // What action was performed
  action: 
    | 'user_created' 
    | 'user_updated' 
    | 'user_deleted' 
    | 'subscription_created' 
    | 'subscription_updated' 
    | 'subscription_cancelled'
    | 'role_granted' 
    | 'role_revoked' 
    | 'ai_test_limit_modified'
    | 'account_email_changed'
    | 'account_username_changed'
    | 'admin_login'
    | 'admin_logout';
  
  // Target of the action (if applicable)
  targetUserId?: string;        // Firebase UID of affected user
  targetUserEmail?: string;     // Email of affected user
  
  // What changed (structured data)
  changes?: {
    field: string;              // e.g., 'subscription.tier', 'user.email'
    oldValue: string | number | boolean | null; // Previous value
    newValue: string | number | boolean | null; // New value
  }[];
  
  // Additional context
  metadata?: {
    ipAddress?: string;         // IP address of admin (GDPR: legitimate interest for security)
    userAgent?: string;         // Browser/device info
    reason?: string;            // Admin-provided reason for action
  };
  
  // Success/Failure
  success: boolean;             // Whether action succeeded
  error?: string;               // Error message if action failed
}
```

**GDPR Compliance**:
- Legitimate interest: Security monitoring and accountability
- Retention: 90 days (configurable)
- User access: Available via data export API
- Deletion: Removed during account deletion (Firebase Extension)

### 11. `adminUsers` Collection (Optional - Phase 5)
**Purpose**: Admin-specific preferences and settings  
**Document ID**: User's Firebase Auth UID

```typescript
interface AdminUserSettings {
  userId: string;               // Firebase Auth UID
  email: string;                // Admin email
  
  // Admin Preferences
  preferences?: {
    defaultUserListPageSize?: number; // Default rows per page (10, 25, 50, 100)
    dashboardLayout?: 'compact' | 'detailed'; // Dashboard view preference
    notificationsEnabled?: boolean; // Email notifications for critical events
  };
  
  // Timestamps
  createdAt: string;           // ISO string - when admin role was first granted
  lastLoginAt?: string;        // ISO string - last admin login
  updatedAt: string;           // ISO string
}
```

**Note**: Admin roles are managed via Firebase Custom Claims (not stored in this collection).  
This collection only stores admin-specific UI preferences.

---

## API Integration

### Primary Endpoints
- **GET** `/api/v1/tests` - Fetches from `test_contents` collection
- **POST** `/api/submit-test-result` - Writes to `testResults` collection
- **Cloud Functions** - Handle AI generation and complex operations

### Collection Usage by Feature
- **Practice Tests**: `test_contents` → `testResults`
- **AI Tests**: `aiGeneratedTests` → `testResults`
- **User Profiles**: `profiles` (read/write user data)
- **Leaderboards**: `leaderboard_*` collections (aggregated data)

---

## Security Rules Summary

```javascript
// Firestore Security Rules (firestore.rules)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own profile
    match /profiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Test contents are publicly readable
    match /test_contents/{testId} {
      allow read: if true;
      allow write: if false; // Only server-side writes
    }
    
    // Users can only access their own test results
    match /testResults/{resultId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Admin Panel Collections (Added November 17, 2025)
    // Users can read their own subscription data
    match /subscriptions/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false; // Only server-side writes (admin actions)
    }
    
    // Audit log is admin-only (read via admin API)
    match /adminAuditLog/{logId} {
      allow read, write: if false; // Only server-side access (Firebase Admin SDK)
    }
    
    // Admin user settings (admin-only)
    match /adminUsers/{userId} {
      allow read, write: if false; // Only server-side access (Firebase Admin SDK)
    }
    
    // Additional rules for other collections...
  }
}
```

---

## Data Relationships

```mermaid
graph TD
    A[profiles] --> B[testResults]
    C[test_contents] --> B
    D[aiGeneratedTests] --> B
    A --> E[leaderboard_all_time]
    A --> F[leaderboard_daily]
    A --> G[leaderboard_weekly]
    A --> H[generate_ai_test_limiter]
```

---

## Migration & Maintenance Notes

### ⚠️ Critical Information
1. **Collection Name**: Always use `test_contents` (NOT `preMadeTests`)
2. **API Compatibility**: All endpoints reference `test_contents`
3. **Data Integrity**: Pre-made tests are populated via generation script
4. **Schema Validation**: TypeScript interfaces enforce data structure

### Recent Changes
- ✅ **January 2025**: Populated `test_contents` with 48 comprehensive tests
- ✅ **Verified**: API endpoints successfully fetch from correct collection
- ✅ **Tested**: Frontend integration working with new schema

### Backup & Recovery
- Generation script: `generate-premade-tests.js`
- Recreation script: `recreate-firestore-collections.js`
- Schema validation: TypeScript interfaces in `/lib/types/database.ts`

---

## Validation Checklist

- [ ] All collections exist in Firestore
- [ ] Security rules are properly configured
- [ ] API endpoints reference correct collections
- [ ] TypeScript interfaces match Firestore data
- [ ] Frontend components use correct data structure
- [ ] Test data is properly seeded

**Status**: ✅ All items verified and working as of January 2025