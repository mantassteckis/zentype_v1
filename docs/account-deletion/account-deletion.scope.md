# Account Deletion Feature - Scope Definition

**Feature Name:** GDPR-Compliant Account Deletion  
**Created:** November 5, 2025  
**Last Updated:** November 5, 2025  
**Status:** 🔄 IN PROGRESS

---

## ⚠️ CRITICAL: 99% CERTAINTY RULE ENFORCEMENT

This scope file defines **EXACTLY** what you can and cannot modify. Violating scope boundaries may break existing features. Read carefully before making any changes.

---

## ✅ **WHAT IS IN SCOPE** (Safe to Modify)

### **1. Firebase Extension Installation**
- **Action:** Install `firebase/delete-user-data` extension
- **Command:** `firebase ext:install firebase/delete-user-data --project=solotype-23c1f`
- **Configuration Parameters:**
  - Cloud Firestore paths: `users/{UID},testResults/{UID},aiTests/{UID}`
  - Delete mode: `recursive`
  - Enable auto-discovery: `Yes`
  - Search depth: `3`
  - Search fields: `userId,uid,createdBy`
- **Risk Level:** 🟢 LOW - Extension is isolated, won't affect running app

---

### **2. New Backend API Route**
- **File to CREATE:** `/app/api/v1/user/delete-account/route.ts`
- **Purpose:** Handle account deletion requests with security checks
- **Dependencies:**
  - `firebase-admin/auth` (already installed)
  - `@/lib/firebase-admin` (existing Admin SDK setup)
- **What to Implement:**
  - POST handler with ID token verification
  - Recent authentication check (<5 minutes)
  - Confirmation text validation ("DELETE")
  - Call `getAuth().deleteUser(uid)`
  - Structured logging with trace IDs
  - Error handling for all edge cases
- **Risk Level:** 🟢 LOW - New file, no existing code modified

---

### **3. Settings Page UI Update**
- **File to MODIFY:** `/app/settings/page.tsx`
- **Lines to Add:** NEW "Danger Zone" section (append at end)
- **What to Implement:**
  - Danger zone card with red border/background
  - "Delete My Account" button
  - Confirmation modal component
  - Password input field (for re-authentication)
  - Confirmation text input (must type "DELETE")
  - Warning messages and data deletion list
  - Loading states and error handling
  - Success flow (sign out + redirect)
- **Critical Areas to Protect:**
  - ⚠️ **DO NOT MODIFY** existing settings sections (General Settings, Theme Settings, etc.)
  - ⚠️ **DO NOT CHANGE** layout structure or routing
  - ⚠️ **DO NOT ALTER** existing state management
- **Risk Level:** 🟡 MEDIUM - Modifying existing file, but only adding new section at end

---

### **4. Firebase Storage Setup**
- **Action:** Enable Firebase Storage in production
- **Method:** Firebase Console (https://console.firebase.google.com/project/solotype-23c1f/storage)
- **Why Needed:** Delete User Data extension requires Storage API enabled
- **Risk Level:** 🟢 LOW - Console configuration, no code changes

---

### **5. Documentation Updates**
- **Files to MODIFY:**
  - `/docs/MAIN.md` - Add account-deletion feature entry
  - `/docs/account-deletion/account-deletion.current.md` - Update status
  - `/docs/account-deletion/account-deletion.errors.md` - Log any issues
- **Risk Level:** 🟢 LOW - Documentation only

---

## ❌ **WHAT IS NOT IN SCOPE** (DO NOT TOUCH)

### **🚫 PROTECTED AREAS - DO NOT MODIFY**

#### **1. Authentication System**
- **Files:**
  - `/context/AuthProvider.tsx` - User authentication context
  - `/lib/firebase.ts` - Firebase client initialization
  - `/lib/firebase-admin.ts` - Firebase Admin SDK setup
- **Why Protected:** Core authentication logic used across entire app
- **Exception:** Only use existing exports, don't modify internals

---

#### **2. Firestore Database Structure**
- **Collections:**
  - `/users/{uid}` - User profiles
  - `/testResults/{uid}` - Test results
  - `/aiTests/{uid}` - AI-generated tests
- **Why Protected:** Extension handles deletion, we don't manually delete
- **Exception:** Read existing structure to understand data flow

---

#### **3. Existing Settings Sections**
- **Settings Page Sections:**
  - General Settings (keyboard sounds, visual feedback)
  - Theme Settings (typing themes, fonts)
  - User preferences management
- **Lines to Avoid:** Lines 1-200 (approximately)
- **Why Protected:** Existing features working correctly, don't break them
- **Exception:** Only append new "Danger Zone" section at end

---

#### **4. Firebase Cloud Functions**
- **Files:**
  - `/functions/src/index.ts` - Existing functions (submitTestResult, generateAiTest)
- **Why Protected:** Production functions handling critical operations
- **Exception:** Extension creates its own functions, we don't touch existing ones

---

#### **5. API Routes (Other than new one)**
- **Protected Routes:**
  - `/app/api/v1/tests/route.ts` - Practice tests
  - `/app/api/v1/ai-tests/route.ts` - AI test generation
  - `/app/api/v1/results/route.ts` - Test results submission
- **Why Protected:** Working APIs used by entire application
- **Exception:** Reference for patterns, don't modify

---

#### **6. User Dashboard & Leaderboard**
- **Files:**
  - `/app/dashboard/page.tsx`
  - `/app/leaderboard/page.tsx`
  - `/components/dashboard/*`
- **Why Protected:** Display logic doesn't need account deletion awareness
- **Exception:** After user deletion, these pages naturally show empty state

---

#### **7. Test Page & Typing Engine**
- **Files:**
  - `/app/test/page.tsx`
  - `/components/dashboard/WordBasedTypingTest.tsx`
  - All typing logic
- **Why Protected:** Core application functionality, unrelated to deletion
- **Exception:** None - completely isolated from account deletion

---

## 🔗 **INTERCONNECTED FEATURES**

### **Dependencies FROM This Feature:**
1. **Firebase Authentication**
   - Uses: `getAuth()`, `reauthenticateWithCredential()`, `deleteUser()`
   - Impact: Deletion removes user from Auth
   - Document in: `/docs/account-deletion/account-deletion.scope.md` (this file)

2. **Firestore Database**
   - Uses: Extension automatically deletes data
   - Impact: User profile, test results, AI tests removed
   - Document in: See "Data Deletion Scope" in PRD

3. **Settings Page**
   - Uses: Adds new section to existing page
   - Impact: New UI component for deletion
   - Document in: `/app/settings/page.tsx` (comments)

---

### **Dependencies TO This Feature:**
1. **Firebase Admin SDK**
   - Location: `/lib/firebase-admin.ts`
   - Usage: Import `getAuth()` for deleteUser()
   - Constraint: Must use Admin SDK (not client SDK)

2. **Authentication Context**
   - Location: `/context/AuthProvider.tsx`
   - Usage: Get current user for re-authentication
   - Constraint: User must be logged in

3. **Delete User Data Extension**
   - Location: Firebase Console (installed extension)
   - Usage: Triggers on user deletion event
   - Constraint: Must be installed and configured first

---

## 📁 **FILES TO REFERENCE** (Read-Only)

### **For Implementation Patterns:**
1. `/app/api/v1/tests/route.ts` - API route structure example
2. `/app/api/v1/results/route.ts` - Admin SDK usage example
3. `/app/settings/page.tsx` - Existing settings UI patterns
4. `/lib/firebase-admin.ts` - Admin SDK initialization

### **For Constants:**
1. `/lib/firebase.ts` - Firebase config
2. `/context/AuthProvider.tsx` - Auth context structure

### **For Documentation:**
1. `/docs/FIRESTORE_SCHEMA.md` - Database structure
2. `/docs/API_DESIGN_DOCUMENTATION.md` - API patterns
3. `/docs/DEBUG_GUIDE.md` - Logging standards

---

## ⚠️ **CRITICAL AREAS TO PAY ATTENTION TO**

### **HIGH RISK ZONES** 🔴

#### **1. Settings Page Modification**
- **File:** `/app/settings/page.tsx`
- **Risk:** Breaking existing settings sections
- **Mitigation:** Only append new section at end, don't modify existing JSX
- **Line Numbers:** Add after line ~150 (after existing settings sections)

#### **2. Firebase Admin SDK Usage**
- **File:** `/app/api/v1/user/delete-account/route.ts` (new file)
- **Risk:** Using client SDK instead of Admin SDK
- **Mitigation:** Always import from `firebase-admin/auth`, never from `firebase/auth`
- **Example:** ✅ `import { getAuth } from 'firebase-admin/auth'`
- **Example:** ❌ `import { getAuth } from 'firebase/auth'` (WRONG)

#### **3. Token Verification Security**
- **File:** `/app/api/v1/user/delete-account/route.ts` (new file)
- **Risk:** Accepting old/replayed tokens
- **Mitigation:** Check `auth_time` field (<5 minutes)
- **Code:**
  ```typescript
  const authTime = decodedToken.auth_time;
  const now = Math.floor(Date.now() / 1000);
  if (now - authTime > 300) { // 5 minutes
    throw new Error('Recent authentication required');
  }
  ```

---

### **MEDIUM RISK ZONES** 🟡

#### **1. Modal State Management**
- **File:** `/app/settings/page.tsx`
- **Risk:** State conflicts with existing settings
- **Mitigation:** Use unique state variable names (e.g., `showDeleteModal`, not just `showModal`)

#### **2. Firebase Extension Configuration**
- **Tool:** Firebase CLI
- **Risk:** Incorrect paths causing incomplete deletion
- **Mitigation:** Use exact paths: `users/{UID},testResults/{UID},aiTests/{UID}`
- **Verification:** Test with test account, check Firestore after deletion

---

## 🔄 **CROSS-FEATURE DEPENDENCIES**

### **Features That Depend on Account Deletion:**
- None (this is a terminal operation)

### **Features Account Deletion Depends On:**
1. **Firebase Authentication** - Must be working to verify user
2. **Firebase Admin SDK** - Must be initialized correctly
3. **Firestore Database** - Must have user data to delete
4. **Settings Page** - Must be accessible to trigger deletion

---

## 🧪 **TESTING BOUNDARIES**

### **What to Test:**
- ✅ New API route (`/api/v1/user/delete-account`)
- ✅ New Danger Zone section in Settings
- ✅ Delete confirmation modal
- ✅ Password re-authentication flow
- ✅ Firestore data deletion (via extension)

### **What NOT to Test:**
- ❌ Existing settings sections (already tested)
- ❌ Other API routes (unmodified)
- ❌ Authentication login/signup (unmodified)

---

## 📝 **SCOPE CHANGE REQUESTS**

If you need to modify something outside this scope:
1. **Stop immediately** - Don't proceed
2. **Document the reason** - Why is it necessary?
3. **Update this scope file** - Add new section
4. **Get approval** - Review with team/user
5. **Test thoroughly** - Verify no regressions

---

## ✅ **SCOPE VERIFICATION CHECKLIST**

Before starting implementation:
- [ ] Read this entire scope file
- [ ] Understand protected areas
- [ ] Identified all files to create/modify
- [ ] Confirmed no scope violations
- [ ] Ready to implement within boundaries

Before committing changes:
- [ ] No protected files modified (except Settings page append)
- [ ] New API route follows existing patterns
- [ ] Settings page only has new section added
- [ ] All dependencies properly imported
- [ ] No changes to authentication logic
- [ ] Extension properly configured

---

**Last Updated:** November 5, 2025  
**Scope Status:** ✅ DEFINED - Ready for Implementation  
**99% Certainty Rule:** ENFORCED
