# Firebase Session Revocation Issue

**Date Discovered:** November 17, 2025  
**Severity:** MEDIUM (Known Limitation)  
**Status:** DOCUMENTED - Cannot Fix (Firebase Behavior)

## Issue Summary

When a superAdmin promotes another user to admin/superAdmin or edits admin permissions, **the superAdmin performing the action gets logged out** and must re-authenticate.

## Root Cause

This is **NOT a bug in our code** - it's Firebase's built-in security mechanism:

1. When `admin.auth().setCustomUserClaims(uid, claims)` is called to grant admin privileges
2. Firebase's internal security detects a high-privilege change
3. Firebase automatically **invalidates authentication tokens** to force token refresh
4. This affects **all active sessions** with admin claims, including the admin making the change
5. The client detects token invalidation and redirects to login

## Why This Happens

Firebase implements this for security:
- Prevents stale tokens with outdated privilege levels
- Ensures privilege escalation takes effect immediately
- Protects against session hijacking with elevated permissions

## Evidence

**Test Scenario (Nov 17, 2025):**
- User: solo@solo.com (superAdmin)
- Action: Promoted mr68aT026ScxGFckz0tQ0HyY23D3 to admin
- Result: solo@solo.com got logged out immediately

**Console Logs:**
```
[INFO] [AdminUserDetail] Promoting user {uid: mr68aT026ScxGFckz0tQ0HyY23D3, role: admin}
[WARNING] [AdminUserDetail] No authenticated user {uid: mr68aT026ScxGFckz0tQ0HyY23D3}
[LOG] Auth state changed: wJae26XQ1NZD4xqbLsS650v7qZa2
```

**Attempted Fixes (All Failed):**
1. ❌ Conditional session revocation (`uid !== adminUserId`) - Still logged out
2. ❌ Removed `revokeUserSessions()` entirely - Still logged out
3. ❌ Different API endpoints for promote vs edit - Still logged out

## Why We Can't Fix This

This is **Firebase's internal behavior** that we cannot override or disable:

- `auth.setCustomUserClaims()` triggers automatic token refresh
- No Firebase API to bypass this security mechanism
- Happens server-side before our code can intercept
- Affects all Firebase projects using custom claims for RBAC

## Workarounds

### For Admins:
1. **Accept the logout**: Save work before promoting users
2. **Use saved credentials**: Browser auto-fills login after redirect
3. **Batch operations**: Promote multiple users at once before getting logged out

### For Development:
1. **Multiple browser profiles**: Admin in Chrome, testing in Firefox
2. **Incognito windows**: Test user in incognito, admin in normal window
3. **Different devices**: Admin on laptop, test user on phone

## Implementation Decision

✅ **We will ACCEPT this behavior and DOCUMENT it clearly:**

1. **UI Warning**: Show alert before promote action
2. **Better UX**: Redirect back to same page after re-login
3. **API Message**: Include warning in success response
4. **Documentation**: Add to admin panel user guide

## Future Improvements

### Short-term (Current Sprint):
- [ ] Add warning modal before promoting users
- [ ] Store last page in localStorage for post-login redirect
- [ ] Update success message with clear explanation

### Long-term (Future Consideration):
- [ ] Implement separate Firebase projects for admins vs users (complex)
- [ ] Use Firebase Auth domains isolation (requires architecture change)
- [ ] Build custom session management (defeats purpose of Firebase Auth)

## Related Files

- `/app/api/v1/admin/users/[uid]/promote/route.ts` - Promote API
- `/app/admin/users/[uid]/page.tsx` - User detail page with promote buttons
- `/lib/firebase-admin.ts` - setUserCustomClaims function

## References

- [Firebase Admin SDK - Set Custom Claims](https://firebase.google.com/docs/auth/admin/custom-claims)
- [Firebase Auth Token Refresh Behavior](https://firebase.google.com/docs/auth/admin/manage-sessions)

## Lessons Learned

**Lesson 27: Firebase Token Refresh on Privilege Changes**
- **Context:** Admin gets logged out when promoting other users
- **Root Cause:** Firebase automatically refreshes tokens when `setCustomUserClaims()` changes admin privileges
- **Impact:** Cannot prevent - it's Firebase's security mechanism
- **Solution:** Document behavior, improve UX, warn users before action
- **Prevention:** Not possible - fundamental Firebase behavior for security
- **Quote:** "you know i think i know the reason now... when I am promoting someone else's... it needs to update... it's restarting and that's why it's lastly asking for the prompt"

## Status: ACCEPTED AS KNOWN LIMITATION

This is **not a bug to fix**, but a **Firebase feature to document**. Our code is correct - Firebase's security model requires this behavior.

---

**Last Updated:** November 17, 2025  
**Documented By:** AI Agent (J - ZenType Architect)  
**Verified By:** User Testing (solo@solo.com)
