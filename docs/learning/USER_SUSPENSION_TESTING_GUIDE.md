# User Suspension Feature - Testing Guide
**Feature:** Account suspension and login blocking  
**Last Updated:** November 17, 2025  
**Verified:** ✅ Working correctly

---

## Overview
This guide documents the **correct workflow** for testing user account suspension, learned from real-world demonstration on November 17, 2025.

---

## Prerequisites

### Test User (Already Created)
```yaml
Username: testSuspension
Email: testsuspension@test.com
Password: TestPass123!
UID: Swz8ZsyjusXFUBOSObJyAZdzBuj1
Status: SUSPENDED ❌
```

### Admin User
```yaml
Email: solo@solo.com
Password: solosolo
UID: wJae26XQ1NZD4xqbLsS650v7qZa2
Role: Super Admin
```

---

## Standard Testing Workflow

### Phase 1: Admin Login & Navigation

#### Step 1: Login as Admin
**Options:**
- **Option A:** `/admin/login` (dedicated admin portal)
- **Option B:** `/login` (regular login - works if user has admin custom claims)

**Verification:**
- Console log: `[Admin Login] Admin access verified {role: superAdmin}`
- Auth state: `wJae26XQ1NZD4xqbLsS650v7qZa2`

#### Step 2: Navigate to User Management
**URL:** `http://localhost:3000/admin/users/[uid]`  
**Example:** `http://localhost:3000/admin/users/Swz8ZsyjusXFUBOSObJyAZdzBuj1`

**Verification:**
- Console log: `[AdminUserDetail] User details loaded`
- Page shows user profile with Suspend/Unsuspend button

---

### Phase 2: Suspend User Account

#### Step 3: Click "Suspend Account" Button
**Location:** User detail page, below user information cards

**Console Log:**
```
[AdminUserDetail] Suspend account clicked {uid: Swz8ZsyjusXFUBOSObJyAZdzBuj1}
```

#### Step 4: Handle Dialog Sequence (CRITICAL!)

**Dialog 1: Prompt for Suspension Reason**
- **Type:** `prompt`
- **Message:** "Enter suspension reason:"
- **Action:** Enter reason (e.g., "Testing suspension feature", "Spam account", "Policy violation")
- **Purpose:** Captured for audit trail in `adminAuditLog` collection
- **Tool:** `mcp_playwright_browser_handle_dialog({ accept: true, promptText: "..." })`

**Dialog 2: Confirmation**
- **Type:** `confirm`
- **Message:** "Are you sure you want to suspend this account?"
- **Action:** Click OK/Accept
- **Purpose:** Safety confirmation to prevent accidental suspensions
- **Tool:** `mcp_playwright_browser_handle_dialog({ accept: true })`

**Dialog 3: Success Notification**
- **Type:** `alert`
- **Message:** "Account suspended successfully!"
- **Action:** Dismiss by clicking OK
- **Purpose:** User feedback - confirms action completed
- **Tool:** `mcp_playwright_browser_handle_dialog({ accept: true })`

**Console Log:**
```
[AdminUserDetail] Suspending user {uid: Swz8ZsyjusXFUBOSObJyAZdzBuj1, disabled: true, reason: "..."}
```

#### Step 5: Verify Suspension in UI
**Expected Changes:**
- Button text changes: "Suspend Account" → "Unsuspend Account"
- Status badge appears: "Account Status: Suspended" (red)
- Page may auto-refresh to show updated status

---

### Phase 3: Test Suspended Account Login

#### Step 6: Logout Admin
**Action:** Click user menu → Sign Out  
**Verification:** Console log: `🚫 AuthProvider - No user authenticated`

#### Step 7: Navigate to Login Page
**URL:** `http://localhost:3000/login`

#### Step 8: Attempt Login with Suspended Credentials
**Fill Form:**
- Email: `testsuspension@test.com`
- Password: `TestPass123!`

**Click:** "Login" button

#### Step 9: Verify Suspension Blocking

**Expected Behavior:**

1. **Firebase Auth Error:**
   ```
   FirebaseError: Firebase: Error (auth/user-disabled)
   ```

2. **Console Error Logs:**
   ```
   [Admin Login] Login failed: FirebaseError: Firebase: Error (auth/user-disabled)
   Error logging in with email and password: FirebaseError: Firebase: Error (auth/user-disabled)
   ```

3. **UI Error Message (User-Facing):**
   ```
   "This account has been disabled. Please contact support."
   ```
   - Color: Red/Error styling
   - Location: Above login form
   - Clear and user-friendly

4. **Network Request:**
   - Status: `400 Bad Request`
   - API: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword`
   - Firebase rejects disabled accounts at authentication level

---

## Technical Details

### API Endpoint
**POST** `/api/v1/admin/users/[uid]/suspend`

**Request Body:**
```json
{
  "suspend": true,
  "reason": "Testing suspension feature"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "User suspended successfully"
}
```

### Firebase Auth Update
```typescript
import { getAuth } from 'firebase-admin/auth'

await getAuth().updateUser(uid, {
  disabled: true  // or false to unsuspend
})
```

### Audit Log Entry
**Collection:** `adminAuditLog`
```json
{
  "timestamp": "2025-11-17T07:30:00.000Z",
  "adminUserId": "wJae26XQ1NZD4xqbLsS650v7qZa2",
  "adminEmail": "solo@solo.com",
  "adminRole": "superAdmin",
  "action": "user_suspended",
  "targetUserId": "Swz8ZsyjusXFUBOSObJyAZdzBuj1",
  "targetUserEmail": "testsuspension@test.com",
  "reason": "Testing suspension feature",
  "metadata": {
    "ipAddress": "...",
    "userAgent": "..."
  },
  "success": true
}
```

---

## Common Issues & Solutions

### Issue 1: Dialogs Not Appearing
**Symptom:** Page freezes after clicking "Suspend Account"  
**Cause:** Dialog is open but not visible in snapshot  
**Solution:** Use `mcp_playwright_browser_handle_dialog` even if not shown in snapshot

### Issue 2: "Failed to fetch" Errors
**Symptom:** API endpoints return network errors  
**Cause:** Admin middleware blocking unauthenticated requests  
**Solution:** Ensure admin is properly logged in and custom claims are set

### Issue 3: Suspension Not Persisting
**Symptom:** User can still login after suspension  
**Cause:** Firebase Auth cache or token not invalidated  
**Solution:** 
- Revoke user sessions: `revokeRefreshTokens(uid)`
- Clear browser cache/localStorage
- Force token refresh

### Issue 4: Page Redirects After Login
**Symptom:** Admin redirected to dashboard instead of staying on user detail  
**Cause:** Expected behavior - middleware validates permissions  
**Solution:** Navigate directly to user detail URL after login

---

## Playwright MCP Testing Pattern

```typescript
// Step 1: Login as admin
await page.goto('http://localhost:3000/admin/login')
await page.getByPlaceholder('admin@zentype.app').fill('solo@solo.com')
await page.getByPlaceholder('Enter your password').fill('solosolo')
await page.getByRole('button', { name: 'Sign In as Admin' }).click()
await page.waitForLoadState('networkidle')

// Step 2: Navigate to user
await page.goto('http://localhost:3000/admin/users/Swz8ZsyjusXFUBOSObJyAZdzBuj1')
await page.waitForLoadState('networkidle')

// Step 3: Click suspend button
await page.getByRole('button', { name: 'Suspend Account' }).click()

// Step 4: Handle dialogs (MUST BE IN SEQUENCE)
// Dialog 1: Prompt
page.once('dialog', async dialog => {
  console.log(`Dialog type: ${dialog.type()}`)
  console.log(`Dialog message: ${dialog.message()}`)
  await dialog.accept('Testing suspension feature')
})

// Dialog 2: Confirm
page.once('dialog', async dialog => {
  await dialog.accept()
})

// Dialog 3: Alert
page.once('dialog', async dialog => {
  await dialog.accept()
})

// Wait for suspension to complete
await page.waitForLoadState('networkidle')

// Step 5: Test suspended login
await page.getByRole('button', { name: 'Sign Out' }).click()
await page.goto('http://localhost:3000/login')
await page.getByPlaceholder('Enter your email').fill('testsuspension@test.com')
await page.getByPlaceholder('Enter your password').fill('TestPass123!')
await page.getByRole('button', { name: 'Login' }).click()

// Step 6: Verify error message
const errorMessage = await page.getByText('This account has been disabled').textContent()
expect(errorMessage).toContain('disabled')
```

---

## Success Criteria

✅ **Feature is Working if:**
1. Admin can login and access user detail page
2. Clicking "Suspend Account" triggers 3 dialogs in sequence
3. Suspension reason is captured in audit log
4. User's `disabled` field set to `true` in Firebase Auth
5. Suspended user **cannot login** with valid credentials
6. Error message clearly states "This account has been disabled"
7. Firebase error code is `auth/user-disabled`
8. Admin can unsuspend user (reverse process)

---

## Cleanup

### To Unsuspend Test User:
1. Login as admin
2. Navigate to user detail page
3. Click "Unsuspend Account" button
4. Confirm action
5. Verify user can login again

### To Delete Test User:
```bash
# Using Firebase Admin SDK
firebase auth:delete Swz8ZsyjusXFUBOSObJyAZdzBuj1

# Or via admin panel
http://localhost:3000/admin/users/Swz8ZsyjusXFUBOSObJyAZdzBuj1
→ Click "Delete User" button
```

---

## Related Documentation

- **API Route:** `/app/api/v1/admin/users/[uid]/suspend/route.ts`
- **Frontend Component:** `/app/admin/users/[uid]/page.tsx`
- **Admin Middleware:** `/lib/admin-middleware.ts`
- **Firebase Admin Utils:** `/lib/firebase-admin.ts`
- **Audit Logging:** `adminAuditLog` Firestore collection

---

**Last Verified:** November 17, 2025 ✅  
**Status:** Feature working as expected  
**Next Test:** Unsuspension flow verification
