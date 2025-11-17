# ZenType Admin Audit Logging Specification

**Version:** 1.0  
**Created:** November 17, 2025  
**Author:** J (ZenType Architect)  
**Status:** ✅ PRODUCTION SPECIFICATION  
**Based On:** Google Cloud Audit Logs, AWS CloudTrail, Stripe Audit Log patterns

---

## 📋 **OVERVIEW**

### **Purpose**
Enterprise-grade audit logging system for ZenType admin panel that provides:
- Complete accountability for all admin actions
- GDPR compliance (Article 5: Accountability, Article 30: Records of Processing)
- Security monitoring and anomaly detection
- Forensic investigation capabilities
- Compliance reporting for audits

### **Design Philosophy**
> "Every admin action is logged, every log is queryable, every query is fast."

Inspired by:
- **Google Cloud Audit Logs:** 400-day retention, automatic logging, structured JSON
- **AWS CloudTrail:** Immutable logs, API-level tracking, cross-region aggregation
- **Stripe Audit Log:** User-friendly events, before/after diffs, CSV export

---

## 🏗️ **AUDIT LOG ARCHITECTURE**

### **1. Event Structure (Enhanced)**

```typescript
/**
 * ZenType Admin Audit Log Entry (Enhanced)
 * Collection: adminAuditLog
 * Retention: 7 years (GDPR Article 30 requirement)
 */
export interface AdminAuditLogEntry {
  // ============================================
  // CORE IDENTIFIERS
  // ============================================
  id: string;                     // Auto-generated Firestore document ID
  timestamp: string;              // ISO 8601 format (UTC)
  eventId: string;                // Unique event ID: "evt_" + timestamp + random
  
  // ============================================
  // ACTOR (WHO DID IT)
  // ============================================
  actor: {
    userId: string;               // Firebase Auth UID of admin
    email: string;                // Admin's email address
    role: 'admin' | 'superAdmin'; // Admin's role at time of action
    sessionId?: string;           // Optional: Session identifier
  };
  
  // ============================================
  // ACTION (WHAT HAPPENED)
  // ============================================
  action: {
    type: AuditActionType;        // See enum below
    category: AuditCategory;      // Group actions by type
    severity: AuditSeverity;      // Risk level of action
    description: string;          // Human-readable description
  };
  
  // ============================================
  // TARGET (WHAT WAS AFFECTED)
  // ============================================
  target?: {
    type: 'user' | 'subscription' | 'system' | 'test' | 'settings';
    userId?: string;              // Target user's Firebase UID
    email?: string;               // Target user's email
    resourceId?: string;          // Generic resource identifier
    resourceType?: string;        // Type of resource affected
  };
  
  // ============================================
  // CHANGES (BEFORE/AFTER)
  // ============================================
  changes?: {
    field: string;                // Dot-notation path: "subscription.tier"
    oldValue: any;                // Previous value (JSON serializable)
    newValue: any;                // New value (JSON serializable)
  }[];
  
  // ============================================
  // CONTEXT (METADATA)
  // ============================================
  context: {
    ipAddress?: string;           // Admin's IP address (anonymized in EU)
    userAgent?: string;           // Browser/device info
    reason?: string;              // Admin-provided reason for action
    apiEndpoint?: string;         // API route that handled request
    correlationId?: string;       // Request correlation ID
  };
  
  // ============================================
  // RESULT (SUCCESS/FAILURE)
  // ============================================
  result: {
    success: boolean;             // Whether action succeeded
    error?: string;               // Error message if failed
    errorCode?: string;           // Error code for categorization
  };
  
  // ============================================
  // COMPLIANCE (GDPR/AUDIT REQUIREMENTS)
  // ============================================
  compliance: {
    dataClassification: 'public' | 'internal' | 'confidential' | 'restricted';
    gdprLegalBasis: 'legitimate_interest' | 'legal_obligation' | 'consent';
    retentionExpiresAt: string;   // ISO 8601 - when log can be deleted
  };
}
```

---

## 📊 **ACTION TAXONOMY**

### **Action Types (Comprehensive)**

```typescript
/**
 * All possible admin actions to be logged
 * Organized by category for better querying
 */
export enum AuditActionType {
  // ============================================
  // AUTHENTICATION & SESSION MANAGEMENT
  // ============================================
  ADMIN_LOGIN = 'admin_login',
  ADMIN_LOGOUT = 'admin_logout',
  ADMIN_SESSION_EXPIRED = 'admin_session_expired',
  ADMIN_PASSWORD_RESET = 'admin_password_reset',
  ADMIN_2FA_ENABLED = 'admin_2fa_enabled',
  ADMIN_2FA_DISABLED = 'admin_2fa_disabled',
  
  // ============================================
  // USER MANAGEMENT
  // ============================================
  USER_VIEWED = 'user_viewed',                 // Admin viewed user detail page
  USER_LIST_ACCESSED = 'user_list_accessed',   // Admin accessed user list
  USER_SEARCHED = 'user_searched',             // Admin searched for user
  USER_PROFILE_UPDATED = 'user_profile_updated',
  USER_EMAIL_CHANGED = 'user_email_changed',
  USER_USERNAME_CHANGED = 'user_username_changed',
  USER_PASSWORD_RESET = 'user_password_reset', // Admin reset user's password
  USER_ACCOUNT_DELETED = 'user_account_deleted',
  
  // ============================================
  // ROLE & PERMISSION MANAGEMENT
  // ============================================
  ROLE_GRANTED = 'role_granted',               // Promoted to admin/superAdmin
  ROLE_REVOKED = 'role_revoked',               // Demoted from admin
  PERMISSION_GRANTED = 'permission_granted',   // Granted specific permission
  PERMISSION_REVOKED = 'permission_revoked',   // Revoked specific permission
  
  // ============================================
  // SUBSCRIPTION MANAGEMENT
  // ============================================
  SUBSCRIPTION_TIER_CHANGED = 'subscription_tier_changed',
  SUBSCRIPTION_CREATED = 'subscription_created',
  SUBSCRIPTION_CANCELLED = 'subscription_cancelled',
  SUBSCRIPTION_LIMIT_MODIFIED = 'subscription_limit_modified',
  SUBSCRIPTION_RESET = 'subscription_reset',   // Reset daily AI test counter
  
  // ============================================
  // ACCOUNT STATUS MANAGEMENT
  // ============================================
  ACCOUNT_SUSPENDED = 'account_suspended',
  ACCOUNT_UNSUSPENDED = 'account_unsuspended',
  ACCOUNT_VERIFIED = 'account_verified',       // Admin manually verified account
  ACCOUNT_FLAGGED = 'account_flagged',         // Marked for review
  ACCOUNT_UNFLAGGED = 'account_unflagged',
  
  // ============================================
  // DATA EXPORT & PRIVACY (GDPR)
  // ============================================
  USER_DATA_EXPORTED = 'user_data_exported',   // GDPR Article 15 (Right to Access)
  USER_DATA_DELETED = 'user_data_deleted',     // GDPR Article 17 (Right to Erasure)
  CONSENT_UPDATED = 'consent_updated',         // GDPR Article 7 (Consent)
  
  // ============================================
  // TEST MANAGEMENT
  // ============================================
  TEST_DELETED = 'test_deleted',               // Admin deleted test result
  TEST_FLAGGED = 'test_flagged',               // Marked test as suspicious
  AI_TEST_GENERATED_ADMIN = 'ai_test_generated_admin', // Admin generated test for user
  
  // ============================================
  // SYSTEM CONFIGURATION
  // ============================================
  SYSTEM_SETTINGS_UPDATED = 'system_settings_updated',
  FEATURE_FLAG_TOGGLED = 'feature_flag_toggled',
  RATE_LIMIT_ADJUSTED = 'rate_limit_adjusted',
  
  // ============================================
  // SECURITY EVENTS
  // ============================================
  UNAUTHORIZED_ACCESS_ATTEMPT = 'unauthorized_access_attempt',
  SUSPICIOUS_ACTIVITY_DETECTED = 'suspicious_activity_detected',
  SECURITY_ALERT_ACKNOWLEDGED = 'security_alert_acknowledged',
}

/**
 * Action Categories for Filtering
 */
export enum AuditCategory {
  AUTHENTICATION = 'authentication',
  USER_MANAGEMENT = 'user_management',
  PERMISSIONS = 'permissions',
  SUBSCRIPTION = 'subscription',
  DATA_PRIVACY = 'data_privacy',
  SECURITY = 'security',
  SYSTEM_CONFIG = 'system_config',
}

/**
 * Severity Levels (Google Cloud-style)
 */
export enum AuditSeverity {
  INFO = 'INFO',           // Normal operations (login, view)
  NOTICE = 'NOTICE',       // Significant but expected (profile update)
  WARNING = 'WARNING',     // Unexpected but not dangerous (failed login)
  ERROR = 'ERROR',         // Operation failed (API error)
  CRITICAL = 'CRITICAL',   // High-risk action (account deletion, role change)
  ALERT = 'ALERT',         // Security incident (unauthorized access)
  EMERGENCY = 'EMERGENCY', // System-wide emergency (data breach)
}
```

---

## 🔍 **QUERY PATTERNS & INDEXES**

### **Required Firestore Indexes**

```typescript
// firestore.indexes.json (add to existing file)
{
  "indexes": [
    // ============================================
    // PRIMARY QUERY PATTERNS
    // ============================================
    
    // 1. List all logs by timestamp (default view)
    {
      "collectionGroup": "adminAuditLog",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    },
    
    // 2. Filter by action type + timestamp
    {
      "collectionGroup": "adminAuditLog",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "action.type", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    },
    
    // 3. Filter by actor (admin) + timestamp
    {
      "collectionGroup": "adminAuditLog",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "actor.userId", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    },
    
    // 4. Filter by target user + timestamp
    {
      "collectionGroup": "adminAuditLog",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "target.userId", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    },
    
    // 5. Filter by severity + timestamp
    {
      "collectionGroup": "adminAuditLog",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "action.severity", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    },
    
    // 6. Filter by category + timestamp
    {
      "collectionGroup": "adminAuditLog",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "action.category", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    },
    
    // 7. Failed actions only + timestamp
    {
      "collectionGroup": "adminAuditLog",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "result.success", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    },
    
    // ============================================
    // COMPOSITE QUERY PATTERNS (ADVANCED)
    // ============================================
    
    // 8. Admin + Action Type + Timestamp
    {
      "collectionGroup": "adminAuditLog",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "actor.userId", "order": "ASCENDING" },
        { "fieldPath": "action.type", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    },
    
    // 9. Target User + Action Type + Timestamp
    {
      "collectionGroup": "adminAuditLog",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "target.userId", "order": "ASCENDING" },
        { "fieldPath": "action.type", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    },
    
    // 10. Severity + Category + Timestamp
    {
      "collectionGroup": "adminAuditLog",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "action.severity", "order": "ASCENDING" },
        { "fieldPath": "action.category", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    }
  ]
}
```

### **Common Query Patterns**

```typescript
// 1. Get last 50 logs (default view)
db.collection('adminAuditLog')
  .orderBy('timestamp', 'desc')
  .limit(50)

// 2. Get logs for specific admin
db.collection('adminAuditLog')
  .where('actor.userId', '==', adminUid)
  .orderBy('timestamp', 'desc')
  .limit(100)

// 3. Get logs for specific user (target)
db.collection('adminAuditLog')
  .where('target.userId', '==', targetUid)
  .orderBy('timestamp', 'desc')

// 4. Get critical actions only
db.collection('adminAuditLog')
  .where('action.severity', '==', 'CRITICAL')
  .orderBy('timestamp', 'desc')

// 5. Get failed actions
db.collection('adminAuditLog')
  .where('result.success', '==', false)
  .orderBy('timestamp', 'desc')

// 6. Get subscription changes in date range
db.collection('adminAuditLog')
  .where('action.category', '==', 'subscription')
  .where('timestamp', '>=', startDate)
  .where('timestamp', '<=', endDate)
  .orderBy('timestamp', 'desc')

// 7. Search by admin email (requires client-side filter)
// Firestore doesn't support full-text search - filter after fetch
db.collection('adminAuditLog')
  .orderBy('timestamp', 'desc')
  .limit(500)
  // Then filter: .filter(log => log.actor.email.includes(searchQuery))
```

---

## 📈 **RETENTION & ARCHIVAL POLICY**

### **Retention Periods**

| Log Type | Retention | Reason |
|----------|-----------|--------|
| **All audit logs** | 7 years | GDPR Article 30 requirement (EU) |
| **CRITICAL severity** | Permanent | Security incidents, legal requirements |
| **ALERT severity** | Permanent | Security breaches, investigation needs |
| **USER_ACCOUNT_DELETED** | Permanent | Legal proof of GDPR compliance |
| **ROLE_GRANTED/REVOKED** | Permanent | Access control audit trail |
| **Regular operations** | 7 years | Standard compliance requirement |

### **Archival Strategy (Future: Phase 2)**

```typescript
// Archive logs older than 2 years to Cloud Storage
// Keep recent 2 years in Firestore for fast queries
// Archive format: JSON Lines (.jsonl) compressed with gzip

// Example archival structure:
// gs://zentype-audit-logs/
//   2023/
//     01-january/
//       audit-logs-2023-01.jsonl.gz
//     02-february/
//       audit-logs-2023-02.jsonl.gz
```

---

## 🔒 **SECURITY & PRIVACY**

### **IP Address Anonymization (GDPR Article 6)**

```typescript
/**
 * Anonymize IP addresses for EU users
 * Example: 192.168.1.100 → 192.168.1.0
 */
function anonymizeIpAddress(ip: string, userRegion: string): string {
  if (userRegion === 'EU') {
    const parts = ip.split('.');
    if (parts.length === 4) {
      parts[3] = '0'; // Mask last octet
      return parts.join('.');
    }
  }
  return ip; // Full IP for non-EU
}
```

### **Sensitive Data Redaction**

```typescript
/**
 * Redact sensitive fields before logging
 */
function sanitizeChanges(changes: any[]): any[] {
  const SENSITIVE_FIELDS = [
    'password',
    'passwordHash',
    'apiKey',
    'secretKey',
    'stripeSecretKey',
    'firebasePrivateKey',
  ];
  
  return changes.map(change => {
    if (SENSITIVE_FIELDS.some(field => change.field.includes(field))) {
      return {
        ...change,
        oldValue: '[REDACTED]',
        newValue: '[REDACTED]',
      };
    }
    return change;
  });
}
```

### **Access Control**

```typescript
// Only admins can read audit logs
// NO ONE can write to audit logs (server-side only)

// firestore.rules
match /adminAuditLog/{logId} {
  // Admins can read
  allow read: if request.auth.token.admin == true;
  
  // NO direct writes allowed (only via Admin SDK)
  allow write: if false;
}
```

---

## 📝 **LOGGING IMPLEMENTATION PATTERN**

### **Centralized Logging Function**

```typescript
// /lib/admin-audit-logger.ts

import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { AuditActionType, AuditCategory, AuditSeverity } from '@/lib/types/audit';

const db = getFirestore();

/**
 * Log admin action to audit trail
 * ALWAYS call this BEFORE performing the action (not after)
 */
export async function logAdminAction(params: {
  // Actor
  adminUserId: string;
  adminEmail: string;
  adminRole: 'admin' | 'superAdmin';
  
  // Action
  actionType: AuditActionType;
  actionCategory: AuditCategory;
  actionSeverity: AuditSeverity;
  actionDescription: string;
  
  // Target (optional)
  targetUserId?: string;
  targetUserEmail?: string;
  targetResourceId?: string;
  targetResourceType?: string;
  
  // Changes (optional)
  changes?: { field: string; oldValue: any; newValue: any }[];
  
  // Context
  ipAddress?: string;
  userAgent?: string;
  reason?: string;
  apiEndpoint?: string;
  correlationId?: string;
  
  // Result
  success: boolean;
  error?: string;
  errorCode?: string;
}): Promise<string> {
  
  const eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = new Date().toISOString();
  const retentionExpiresAt = new Date(Date.now() + (7 * 365 * 24 * 60 * 60 * 1000)).toISOString(); // 7 years
  
  const logEntry = {
    eventId,
    timestamp,
    
    actor: {
      userId: params.adminUserId,
      email: params.adminEmail,
      role: params.adminRole,
    },
    
    action: {
      type: params.actionType,
      category: params.actionCategory,
      severity: params.actionSeverity,
      description: params.actionDescription,
    },
    
    target: params.targetUserId ? {
      type: 'user' as const,
      userId: params.targetUserId,
      email: params.targetUserEmail,
      resourceId: params.targetResourceId,
      resourceType: params.targetResourceType,
    } : undefined,
    
    changes: params.changes,
    
    context: {
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      reason: params.reason,
      apiEndpoint: params.apiEndpoint,
      correlationId: params.correlationId,
    },
    
    result: {
      success: params.success,
      error: params.error,
      errorCode: params.errorCode,
    },
    
    compliance: {
      dataClassification: 'internal' as const,
      gdprLegalBasis: 'legitimate_interest' as const,
      retentionExpiresAt,
    },
  };
  
  try {
    const docRef = await db.collection('adminAuditLog').add(logEntry);
    console.log('[AuditLogger] Action logged', { eventId, actionType: params.actionType });
    return docRef.id;
  } catch (error) {
    // CRITICAL: Logging must never fail silently
    console.error('[AuditLogger] FAILED TO LOG ACTION', { eventId, error });
    // Fall back to console logging
    console.error('[AuditLogger] Failed log entry:', JSON.stringify(logEntry));
    throw new Error('Audit logging failed - action aborted');
  }
}
```

### **Usage Example in API Route**

```typescript
// app/api/v1/admin/users/[uid]/suspend/route.ts

import { logAdminAction } from '@/lib/admin-audit-logger';
import { AuditActionType, AuditCategory, AuditSeverity } from '@/lib/types/audit';

export async function POST(request: NextRequest) {
  const adminVerification = await requireAdmin(request);
  const { uid } = await params;
  const { disabled, reason } = await request.json();
  
  // 1. LOG BEFORE ACTION (not after)
  await logAdminAction({
    adminUserId: adminVerification.userId,
    adminEmail: adminVerification.email,
    adminRole: adminVerification.claims?.superAdmin ? 'superAdmin' : 'admin',
    
    actionType: disabled ? AuditActionType.ACCOUNT_SUSPENDED : AuditActionType.ACCOUNT_UNSUSPENDED,
    actionCategory: AuditCategory.USER_MANAGEMENT,
    actionSeverity: AuditSeverity.CRITICAL, // Suspension is critical
    actionDescription: `${disabled ? 'Suspended' : 'Unsuspended'} user account`,
    
    targetUserId: uid,
    targetUserEmail: userEmail, // fetch from Firebase Auth
    
    changes: [{
      field: 'disabled',
      oldValue: !disabled,
      newValue: disabled,
    }],
    
    context: {
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      reason: reason || 'No reason provided',
      apiEndpoint: request.url,
    },
    
    success: true, // Will be true if no error thrown
  });
  
  // 2. THEN PERFORM ACTION
  await getAuth().updateUser(uid, { disabled });
  
  return NextResponse.json({ success: true });
}
```

---

## 📊 **METRICS & MONITORING**

### **Key Metrics to Track**

1. **Action Volume**
   - Total admin actions per day
   - Actions per admin per day
   - Peak action times

2. **Action Distribution**
   - By category (user management, subscriptions, etc.)
   - By severity (INFO, CRITICAL, ALERT)
   - By success/failure rate

3. **Admin Activity**
   - Most active admins
   - Inactive admins (no logins in 30 days)
   - Failed login attempts

4. **Security Alerts**
   - Unauthorized access attempts
   - Suspicious activity patterns
   - Multiple failed actions

5. **GDPR Compliance**
   - Data export requests (Article 15)
   - Data deletion requests (Article 17)
   - Average response time for GDPR requests

---

## ✅ **IMPLEMENTATION CHECKLIST**

- [ ] Create enhanced TypeScript interfaces in `/lib/types/audit.ts`
- [ ] Implement `logAdminAction()` in `/lib/admin-audit-logger.ts`
- [ ] Update all existing admin APIs to use centralized logger
- [ ] Create Firestore indexes (10 indexes required)
- [ ] Build audit log API endpoint (`/api/v1/admin/audit-log`)
- [ ] Build audit log viewer UI (`/app/admin/audit-log/page.tsx`)
- [ ] Implement CSV export functionality
- [ ] Add real-time alerts for CRITICAL severity actions
- [ ] Test logging performance (should handle 1000+ logs/day)
- [ ] Document archival strategy for Phase 2

---

## 📚 **REFERENCES**

- **Google Cloud Audit Logs:** https://cloud.google.com/logging/docs/audit
- **AWS CloudTrail:** https://aws.amazon.com/cloudtrail/
- **Stripe Audit Log:** https://stripe.com/docs/audit-log
- **GDPR Article 30:** Records of processing activities
- **OWASP Logging Cheat Sheet:** https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html

---

**Document Version:** 1.0  
**Review Status:** ✅ READY FOR IMPLEMENTATION  
**Est. Implementation Time:** 4-6 hours (all components)
