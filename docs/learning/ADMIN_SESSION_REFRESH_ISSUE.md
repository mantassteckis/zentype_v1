# Admin Session Lost on Page Refresh - ERROR-ADMIN-007

**Status:** 🔴 CRITICAL BUG IDENTIFIED  
**Date Discovered:** November 17, 2025  
**Severity:** HIGH - Breaks admin workflow  
**Affected File:** `/app/admin/dashboard/page.tsx`

---

## 📊 Problem Statement

Admin users lose their session and are redirected to `/admin/login` every time they refresh any admin page. This makes the admin panel unusable for any workflow that requires page refreshes or multiple tabs.

**User Report:**
> "once you are logged in you are in till you refresh the webpage upon every refresh it's clearing authentication information and likely jwt missing for admin signed in session"

---

## 🧪 Testing Evidence

### Test 1: Regular Login (WORKING ✅)
```
1. Navigate to http://localhost:3000/login
2. Login as solo@solo.com
3. Redirected to /dashboard
4. Refresh page (F5)
5. Result: ✅ Session PERSISTS - stays on /dashboard
```

**Console Logs:**
```
Auth state changed: wJae26XQ1NZD4xqbLsS650v7qZa2
🔐 AuthProvider - User authenticated: wJae26XQ1NZD4xqbLsS650v7qZa2
🔍 AuthProvider - Fetching profile...
✅ AuthProvider - Profile found and loaded
✅ Dashboard - Both user and profile available, calculating stats...
```

### Test 2: Admin Login (BROKEN ❌)
```
1. Navigate to http://localhost:3000/admin/login
2. Login as solo@solo.com
3. Redirected to /admin/dashboard
4. Refresh page (F5)
5. Result: ❌ Session LOST - redirected back to /admin/login
```

**Console Logs:**
```
[Admin Dashboard] No user authenticated          ← ❌ PROBLEM: Checked too early
Auth state changed: wJae26XQ1NZD4xqbLsS650v7qZa2  ← ✅ Firebase auth restores AFTER check
🔐 AuthProvider - User authenticated: wJae26XQ1NZD4xqbLsS650v7qZa2
✅ AuthProvider - Profile found and loaded
```

**Timeline:**
1. Page loads → Admin dashboard `useEffect` runs immediately
2. Admin dashboard checks `auth.currentUser` → `null` (Firebase hasn't restored session yet)
3. Admin dashboard redirects to `/admin/login`
4. 100-500ms later: Firebase restores auth state (`Auth state changed`)
5. Too late - already redirected

---

## 🔍 Root Cause Analysis

### Code Comparison

**Regular Dashboard (WORKING):**
```typescript
// /app/dashboard/page.tsx
import { useAuth } from "@/context/AuthProvider"

export default function DashboardPage() {
  const { user, profile, isLoading } = useAuth(); // ✅ Waits for auth state
  
  useEffect(() => {
    if (user && profile) {
      // ✅ Only runs after Firebase auth is restored
      calculateUserStats(user.uid).then(setUserStats);
    }
  }, [user, profile, isLoading]);
  
  // ✅ Shows loading state while Firebase restores session
  if (isLoading) {
    return <div>Loading...</div>
  }
}
```

**Admin Dashboard (BROKEN):**
```typescript
// /app/admin/dashboard/page.tsx
import { auth } from "@/lib/firebase/client"

export default function AdminDashboardPage() {
  useEffect(() => {
    const verifyAdminAccess = async () => {
      const user = auth.currentUser  // ❌ PROBLEM: Synchronous check
      if (!user) {
        console.log('[Admin Dashboard] No user authenticated')
        router.push('/admin/login')  // ❌ Redirects before Firebase restores session
        return
      }
      // ...
    }
    
    verifyAdminAccess()
  }, [router])
}
```

### Why Regular Dashboard Works

**AuthProvider Pattern (line 28 of `/context/AuthProvider.tsx`):**
```typescript
const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
  console.log("Auth state changed:", currentUser?.uid);
  setUser(currentUser);
  
  if (currentUser) {
    // Fetch profile, set up listeners
    setIsLoading(false);  // ✅ Only set false AFTER auth restored
  } else {
    setProfile(null);
    setIsLoading(false);
  }
});
```

**Key Points:**
1. `onAuthStateChanged` is an async listener that waits for Firebase to restore the session
2. `isLoading` starts as `true` (line 19)
3. `isLoading` only becomes `false` AFTER Firebase confirms auth state
4. Regular pages wait for `isLoading: false` before checking user

---

## 🐛 The Bug

**File:** `/app/admin/dashboard/page.tsx`  
**Lines:** 30-34

```typescript
const user = auth.currentUser  // ❌ Returns null on page load
if (!user) {
  console.log('[Admin Dashboard] No user authenticated')
  router.push('/admin/login')  // ❌ Immediate redirect
  return
}
```

**Problem:**
- `auth.currentUser` is a **synchronous property**
- On page refresh, Firebase needs time to restore the session from localStorage/cookies
- This restoration takes 100-500ms
- Admin dashboard checks `auth.currentUser` **immediately** on mount
- Result: Always `null` on first check → Always redirects to login

**Why This Worked on Initial Login:**
- On initial login (not refresh), `signInWithEmailAndPassword` sets `auth.currentUser` immediately
- The redirect to `/admin/dashboard` happens while `auth.currentUser` is still set
- So the first useEffect run has a valid user
- But on refresh, the user must be restored from persistent storage

---

## ✅ Solution Approach

### Option 1: Add Auth State Listener (Recommended)

Add `onAuthStateChanged` listener to admin dashboard, similar to `AuthProvider`:

```typescript
const [authReady, setAuthReady] = useState(false);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      // Verify admin access with API
      const idToken = await currentUser.getIdToken();
      const response = await fetch('/api/v1/admin/auth/verify', {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAdminData(data);
      } else {
        router.push('/admin/login');
      }
    } else {
      router.push('/admin/login');
    }
    
    setAuthReady(true);
    setIsLoading(false);
  });
  
  return () => unsubscribe();
}, [router]);

if (!authReady || isLoading) {
  return <div>Verifying admin access...</div>;
}
```

**Benefits:**
- ✅ Waits for Firebase to restore session before checking
- ✅ Works on both initial login and page refresh
- ✅ Properly handles auth state changes (logout, etc.)
- ✅ Minimal code changes

### Option 2: Use AuthProvider + Admin Verification

Use `useAuth()` hook and verify admin claims:

```typescript
const { user, isLoading } = useAuth();

useEffect(() => {
  if (isLoading) return;  // Wait for auth to be ready
  
  if (!user) {
    router.push('/admin/login');
    return;
  }
  
  // Now safe to verify admin access
  verifyAdminAccess(user);
}, [user, isLoading]);
```

**Benefits:**
- ✅ Reuses existing AuthProvider infrastructure
- ✅ Consistent with regular pages
- ✅ Real-time profile updates

**Drawbacks:**
- ❌ AuthProvider doesn't fetch custom claims (admin permissions)
- ❌ Would need to extend AuthProvider or fetch claims separately

---

## 🎯 Recommended Solution

**Option 1** is recommended because:
1. Admin pages have different auth requirements (custom claims)
2. Adding `onAuthStateChanged` is a small, focused change
3. Keeps admin auth logic separate from user auth logic
4. No risk of breaking regular page auth
5. Can verify admin permissions in the same listener

---

## 📝 Files to Modify

### Pages WITH the Bug (5 files):
1. ✅ **`/app/admin/dashboard/page.tsx`** - Line 30: Synchronous `auth.currentUser` check
2. ✅ **`/app/admin/users/page.tsx`** - Line 62: Synchronous `auth.currentUser` check
3. ✅ **`/app/admin/analytics/page.tsx`** - Line 72: Synchronous `auth.currentUser` check
4. ✅ **`/app/admin/audit-log/page.tsx`** - Line 107: Synchronous `auth.currentUser` check
5. ✅ **`/app/admin/users/[uid]/page.tsx`** - Multiple uses of `auth.currentUser` in API calls

### Pages WITHOUT the Bug (2 files):
1. ✅ **`/app/admin/subscriptions/page.tsx`** - Already uses `useAuth()` hook (line 46)
2. ✅ **`/app/admin/performance/page.tsx`** - Server component with child component handling auth

### Total Impact:
- **5 files need fixing** (dashboard, users, analytics, audit-log, users/[uid])
- **All use the same broken pattern** (synchronous `auth.currentUser` check in useEffect)
- **One file already correct** (subscriptions uses `useAuth()` hook)

---

## 🧪 Testing Plan

1. ✅ Login to admin panel
2. ✅ Navigate to admin dashboard
3. ✅ Refresh page (F5)
4. ✅ Verify: Still logged in, no redirect to login
5. ✅ Refresh multiple times
6. ✅ Verify: Session persists across all refreshes
7. ✅ Open admin panel in new tab
8. ✅ Verify: Already logged in
9. ✅ Logout, refresh page
10. ✅ Verify: Redirects to login (correct behavior)

---

## 📚 Related Issues

- ✅ **ERROR-ADMIN-001**: Authorization middleware bug (fixed)
- ✅ **ERROR-ADMIN-002**: Admin demotion bug (fixed)
- ✅ **ERROR-ADMIN-006**: Session management UX issue (fixed)
- 🔴 **ERROR-ADMIN-007**: Admin session lost on page refresh (THIS ISSUE)

---

## 🎓 Lessons Learned

### Lesson: Firebase Auth State Restoration is Async

**Problem:**
- `auth.currentUser` is a synchronous property
- Appears `null` on page load even if user is logged in
- Firebase takes time to restore session from persistent storage

**Solution:**
- Always use `onAuthStateChanged()` listener
- Never check `auth.currentUser` synchronously on mount
- Wait for auth state to be "ready" before making decisions

**Pattern:**
```typescript
// ❌ BAD: Synchronous check on mount
useEffect(() => {
  if (!auth.currentUser) {
    redirect();
  }
}, []);

// ✅ GOOD: Wait for auth state
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user) {
      redirect();
    }
  });
  return () => unsubscribe();
}, []);
```

### Lesson: Auth Patterns Should Be Consistent

**Problem:**
- Regular pages use `AuthProvider` with `onAuthStateChanged`
- Admin pages use direct `auth.currentUser` checks
- Inconsistency leads to bugs

**Solution:**
- Use the same auth restoration pattern everywhere
- If admin pages need different logic, still wait for auth state first
- Document the auth pattern in a central location

---

**Status:** Ready for implementation  
**Next Steps:** Apply Option 1 solution to all admin pages
