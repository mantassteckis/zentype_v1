# Account Deletion Feature - Product Requirements Document

**Feature Name:** GDPR-Compliant Account Deletion  
**Created:** November 5, 2025  
**Last Updated:** November 5, 2025  
**Status:** 🔄 IN PROGRESS - Implementation Phase  
**Priority:** HIGH (University GDPR Requirement)

---

## 📋 **Overview**

Implement a secure, GDPR-compliant account deletion feature that allows users to permanently delete their account and all associated data from ZenType. This feature is required to comply with EU data protection regulations (GDPR), specifically the "Right to be Forgotten" (Article 17).

---

## 🎯 **Objectives**

### **Primary Goals**
1. ✅ Provide users with ability to delete their account
2. ✅ Automatically remove all user data from Firestore, Storage, and Authentication
3. ✅ Comply with GDPR "Right to be Forgotten" requirements
4. ✅ Prevent accidental deletions with multi-step verification
5. ✅ Meet Lithuanian university compliance requirements

### **Success Criteria**
- [ ] User can delete account from Settings page
- [ ] Password re-authentication required before deletion
- [ ] User must type "DELETE" to confirm
- [ ] All Firestore data deleted within 24 hours
- [ ] Account removed from Firebase Authentication immediately
- [ ] Clear audit trail of deletions in backend logs
- [ ] No orphaned data remains in database

---

## 🏗️ **Implementation Checklist**

### **Phase 1: Firebase Extension Setup**
- [ ] Enable Firebase Storage in production (required by extension)
- [ ] Install Delete User Data extension via Firebase CLI
- [ ] Configure Firestore paths: `users/{UID}`, `testResults/{UID}`, `aiTests/{UID}`
- [ ] Set delete mode to "recursive" for subcollections
- [ ] Enable auto-discovery with depth 3
- [ ] Configure auto-discovery fields: `userId`, `uid`, `createdBy`
- [ ] Verify extension deployment in Firebase Console

### **Phase 2: Backend API**
- [ ] Create `/app/api/v1/user/delete-account/route.ts`
- [ ] Implement ID token verification with Admin SDK
- [ ] Add recent authentication check (<5 minutes)
- [ ] Validate confirmation text ("DELETE")
- [ ] Call Firebase Admin `deleteUser()` method
- [ ] Add structured logging for deletion audit trail
- [ ] Implement error handling for all edge cases
- [ ] Test API with Postman/Thunder Client

### **Phase 3: Frontend UI**
- [ ] Add "Danger Zone" section to Settings page
- [ ] Create delete confirmation modal
- [ ] Implement password re-authentication field
- [ ] Add confirmation text input (must type "DELETE")
- [ ] Show clear warning about permanent deletion
- [ ] List all data that will be deleted (profile, tests, stats, etc.)
- [ ] Add GDPR compliance badge
- [ ] Implement loading states and error messages
- [ ] Sign out user after successful deletion
- [ ] Redirect to homepage after deletion

### **Phase 4: Testing & Verification**
- [ ] Test successful account deletion flow
- [ ] Test wrong password rejection
- [ ] Test confirmation text validation
- [ ] Test recent authentication requirement
- [ ] Verify Firestore data is actually deleted
- [ ] Verify user removed from Firebase Auth
- [ ] Test with Playwright MCP (automated E2E)
- [ ] Check Cloud Function logs for deletion events

### **Phase 5: Documentation**
- [ ] Update IKB current status file
- [ ] Document testing results
- [ ] Update main.md with feature entry
- [ ] Add lessons learned
- [ ] Create user-facing help documentation (optional)

---

## 🔐 **Security Requirements**

| Requirement | Implementation | Status |
|------------|----------------|--------|
| **Recent Authentication** | User must re-enter password | ⏳ Pending |
| **Confirmation Text** | Must type "DELETE" exactly | ⏳ Pending |
| **Token Verification** | Backend verifies ID token age | ⏳ Pending |
| **Audit Logging** | All deletions logged with timestamp | ⏳ Pending |
| **No Bypass** | Cannot delete without re-auth | ⏳ Pending |

---

## 🇪🇺 **GDPR Compliance**

### **Article 17: Right to Erasure ("Right to be Forgotten")**

**Legal Requirements:**
- ✅ User can request data deletion
- ✅ Data deleted without undue delay
- ✅ Complete removal (no orphaned records)
- ✅ User consent (explicit confirmation)
- ✅ Transparent process (clear UI)

**ZenType Implementation:**
- Firebase Delete User Data extension (automatic cleanup)
- Multi-step verification (password + confirmation)
- Backend audit logs (deletion timestamp)
- Recursive Firestore deletion (no orphaned data)
- Clear user communication (what gets deleted)

---

## 📊 **Data Deletion Scope**

### **Will Be Deleted:**
1. **Firebase Authentication** - User account and email
2. **Firestore Collections:**
   - `/users/{uid}` - User profile and preferences
   - `/testResults/{uid}` - All test results and statistics
   - `/aiTests/{uid}` - Custom AI-generated tests
   - Any subcollections within these paths (recursive)
3. **Cloud Storage** (if implemented):
   - `/avatars/{uid}` - User avatar images
   - `/uploads/{uid}` - Any user-uploaded files

### **Will NOT Be Deleted:**
- Aggregated anonymous statistics (no PII)
- System logs (retention period: 30 days)
- Leaderboard historical records (anonymized after deletion)

---

## 🚨 **User Experience Flow**

```
Settings Page
    ↓
Click "Delete My Account" button
    ↓
Modal appears with warnings
    ↓
User enters password (re-authentication)
    ↓
User types "DELETE" to confirm
    ↓
Backend API verifies token + confirmation
    ↓
Firebase Admin deletes user
    ↓
Extension triggers automatic data cleanup
    ↓
User signed out + redirected to homepage
    ↓
Success message shown
```

---

## 📝 **Technical Stack**

- **Backend:** Next.js API Routes (`/app/api/v1/user/delete-account/route.ts`)
- **Frontend:** React with TypeScript (Settings page modal)
- **Authentication:** Firebase Auth with re-authentication
- **Data Cleanup:** Firebase Delete User Data Extension
- **Database:** Firestore (recursive deletion)
- **Logging:** Structured logging with trace IDs

---

## 🎨 **UI/UX Requirements**

### **Visual Design**
- Red color scheme for danger zone (destructive action)
- Clear warning icons (⚠️)
- Modal overlay for confirmation
- Disabled submit button until conditions met
- Loading spinner during deletion process

### **Messaging**
- **Warning:** "This action cannot be undone"
- **GDPR Badge:** "🇪🇺 GDPR Compliant"
- **Data List:** Bullet points of what gets deleted
- **Success:** "Account deleted. Sorry to see you go!"
- **Error:** Clear error messages with retry option

---

## 🧪 **Testing Scenarios**

1. **Happy Path:** User deletes account successfully
2. **Wrong Password:** Shows error, prevents deletion
3. **Invalid Confirmation:** Button disabled until "DELETE" typed
4. **Recent Auth:** Requires fresh login if session old
5. **Network Error:** Shows retry option
6. **Extension Failure:** Backend logs error, user notified
7. **Partial Deletion:** Monitor for orphaned data

---

## 📅 **Timeline Estimate**

- **Phase 1 (Extension):** ~30 minutes
- **Phase 2 (Backend):** ~45 minutes
- **Phase 3 (Frontend):** ~1 hour
- **Phase 4 (Testing):** ~30 minutes
- **Phase 5 (Docs):** ~15 minutes

**Total:** ~3 hours

---

## ✅ **Definition of Done**

- [ ] User can delete account from Settings page
- [ ] All security checks implemented and working
- [ ] All Firestore data automatically deleted
- [ ] Playwright MCP tests pass
- [ ] No TypeScript errors
- [ ] IKB documentation updated
- [ ] Verified in production with test account
- [ ] Code reviewed and merged to master

---

**End of PRD - Ready for Implementation**
