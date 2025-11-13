# Privacy & GDPR Compliance - Scope Definition

**Last Updated**: 2025-11-13
**Status**: Active

---

## ✅ WHAT IS IN SCOPE

### Files & Components to Create/Modify

#### Frontend Components
```
/components/privacy/
├── cookie-consent-banner.tsx      ← NEW: Cookie consent UI
├── privacy-settings.tsx           ← NEW: User privacy controls
├── data-export-button.tsx         ← NEW: Download user data
└── delete-account-button.tsx      ← NEW: Account deletion UI

/app/settings/privacy/
└── page.tsx                       ← NEW: Privacy settings page

/app/privacy-policy/
└── page.tsx                       ← NEW: Privacy policy display
```

#### Backend API Routes
```
/app/api/v1/user/
├── delete-account/route.ts        ← NEW: Account deletion endpoint
├── export-data/route.ts           ← NEW: Data export endpoint
├── update-consent/route.ts        ← NEW: Update cookie consents
└── get-consents/route.ts          ← NEW: Fetch user consents
```

#### Database Schema (Firestore)
```
/users/{UID}/
├── profile                        ← EXISTING: User data
├── preferences                    ← EXISTING: Settings
└── consents/                      ← NEW: Cookie/privacy consents
    ├── analytics                  ← Consent status + timestamp
    ├── functional                 ← Consent status + timestamp
    └── advertising                ← Consent status + timestamp
```

#### Documentation
```
/docs/privacy/
├── privacy.prd.md                 ← THIS: Requirements
├── privacy.scope.md               ← THIS: Scope definition
├── privacy.current.md             ← Current status
└── privacy-policy-template.md     ← NEW: Policy content

/docs/account-deletion/
├── account-deletion.prd.md        ← UPDATE: Add extension details
├── account-deletion.scope.md      ← UPDATE: Add API endpoints
├── account-deletion.current.md    ← UPDATE: Extension status
└── account-deletion.errors.md     ← UPDATE: Known issues
```

---

## ❌ WHAT IS NOT IN SCOPE

### Protected Areas (DO NOT TOUCH)
- `/lib/firebase/firebaseConfig.ts` - Firebase initialization (already configured)
- `/lib/firebase/auth.ts` - Authentication logic (stable)
- `/lib/firebase/firestore.ts` - Database helpers (working)
- `/components/debug/` - Debugger system (HIGH RISK)
- `/app/test/` - Test functionality (core feature)
- `/app/api/v1/test/` - Test APIs (stable)
- Authentication flows (login/signup) - Working, don't break

### Out of Scope Features
- Email marketing system (not implemented yet)
- Payment processing (not applicable)
- Third-party integrations beyond Firebase (none exist)
- Mobile app privacy (web only)
- Social media integration (not implemented)

---

## 🔗 INTERCONNECTED FEATURES

### Dependencies (Features that depend on Privacy)

#### Account Deletion ← Privacy
**File**: `/docs/account-deletion/account-deletion.scope.md`
**Connection**: Account deletion is part of "Right to Erasure" (GDPR)
**Impact**: Privacy policy must link to account deletion feature

#### User Settings ← Privacy
**File**: `/app/settings/page.tsx`
**Connection**: Settings page will contain privacy controls
**Impact**: Privacy settings must integrate with existing settings UI

#### Authentication ← Privacy
**File**: `/lib/firebase/auth.ts`
**Connection**: User data rights tied to authenticated users
**Impact**: Must verify user is authenticated before data operations

---

## ⚠️ CRITICAL AREAS TO PAY ATTENTION TO

### HIGH RISK ZONES

#### 1. Firebase Delete User Data Extension
**Location**: Firebase Console → Extensions → delete-user-data-gdpr
**Risk**: Misconfiguration could delete wrong data or fail to delete all data
**Current Configuration**:
```yaml
Cloud Firestore paths: users/{UID},testResults/{UID},aiTests/{UID}
Cloud Functions location: europe-west1 (Belgium)
Enable auto discovery: yes
Auto discovery depth: 5
Auto discovery search fields: userId,uid,createdBy
```
**Rules**:
- ⚠️ DO NOT modify extension configuration without testing
- ⚠️ DO NOT delete the extension
- ⚠️ Test account deletion in dev environment first

#### 2. Consent Storage (Firestore)
**Location**: `/users/{UID}/consents/`
**Risk**: Incorrect consent storage could violate GDPR
**Rules**:
- ✅ MUST timestamp all consent actions
- ✅ MUST store consent status (boolean)
- ✅ MUST allow withdrawal of consent
- ❌ NEVER assume consent (default: false)
- ❌ NEVER pre-tick consent boxes

#### 3. Data Export Functionality
**Location**: `/app/api/v1/user/export-data/route.ts` (to be created)
**Risk**: Exposing sensitive data or other users' data
**Rules**:
- ✅ MUST verify user authentication
- ✅ MUST only export requesting user's data
- ✅ MUST include all user data (complete export)
- ✅ MUST redact sensitive info (hashed passwords, etc.)
- ❌ NEVER expose other users' data
- ❌ NEVER skip authentication check

#### 4. Account Deletion API
**Location**: `/app/api/v1/user/delete-account/route.ts` (to be created)
**Risk**: Accidental data deletion or incomplete deletion
**Rules**:
- ✅ MUST require re-authentication (security)
- ✅ MUST call Firebase Admin SDK `deleteUser(uid)`
- ✅ MUST log deletion action with correlation ID
- ✅ MUST return success confirmation
- ❌ NEVER allow deletion without re-authentication
- ❌ NEVER delete data manually (extension handles it)

---

## 📁 FILES TO REFERENCE

### Constants & Configuration
- `/lib/constants.ts` - App-wide constants
- `/lib/firebase/firebaseConfig.ts` - Firebase config
- `/lib/logger.ts` - Logging utilities

### Existing User Management
- `/app/api/v1/user/profile/route.ts` - User profile API
- `/app/settings/page.tsx` - Settings page

### Logging Standards
- `/docs/CENTRALIZED_LOGGING_CHECKLIST.md` - Logging requirements
- All API routes must use structured logging with span tracking

---

## 🧪 TESTING REQUIREMENTS

### Must Test Before Commit
1. **Cookie Consent Banner**
   - Appears on first visit
   - Respects user choices
   - Persists across sessions

2. **Account Deletion Flow**
   - User clicks "Delete Account"
   - Confirmation modal appears
   - Re-authentication required
   - Extension triggers (deletes data)
   - User redirected to login

3. **Data Export**
   - User clicks "Export My Data"
   - JSON file downloads
   - Contains all user data
   - No sensitive info leaked

4. **Privacy Settings**
   - User can view current consents
   - User can update consents
   - Changes persist in Firestore

---

## 🚀 DEPLOYMENT NOTES

### Environment Variables
No new environment variables needed (Firebase Admin SDK already configured)

### Firebase Extension
- ✅ Already installed: `delete-user-data-gdpr`
- ✅ Configured for EU data center (europe-west1)
- ✅ Auto-discovery enabled

### Database Rules
No Firestore rules changes needed (existing rules cover consent documents)

---

## 📊 SUCCESS METRICS

### Technical Metrics
- ✅ Account deletion completes in < 5 minutes
- ✅ Data export generates within 10 seconds
- ✅ Cookie consent banner loads in < 500ms
- ✅ No data leaks in export functionality

### Compliance Metrics
- ✅ All 8 GDPR rights implemented
- ✅ Privacy policy published and accessible
- ✅ Consent mechanism follows CookieYes best practices
- ✅ Data stored in EU data centers only

---

## 🔄 RELATED SCOPE FILES

- **Account Deletion**: `/docs/account-deletion/account-deletion.scope.md`
- **Authentication**: (no scope file yet - core feature)
- **User Settings**: (no scope file yet - stable feature)

---

**Last Updated**: 2025-11-13
