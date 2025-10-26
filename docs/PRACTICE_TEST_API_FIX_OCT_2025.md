# Practice Test API Fix - October 26, 2025

**Status:** ✅ FIXED  
**Issue Date:** October 26, 2025  
**Fixed By:** AI Agent with Playwright MCP  
**Severity:** HIGH - Practice tests were completely non-functional

---

## 🐛 Problem Summary

### Issue 1: Practice Tests API Returning HTTP 500 Error
**Symptom:**
- `/api/v1/tests?difficulty=Medium&timeLimit=60&limit=20` returning HTTP 500
- Error message: `"Missing or insufficient permissions"`
- Frontend showing: `"❌ HTTP 500: Internal Server Error"`
- No practice tests loading in the UI

### Issue 2: AI Test Generation Failing  
**Symptom:**
- AI test generation showing promotional modal instead of generating tests
- Gemini API returning 429 rate limit error
- Error details: `quota_limit_value: "0"` - Quota set to 0 requests per minute in GCP

---

## 🔍 Root Cause Analysis

### Practice Tests API Issue

**Problem:** The `/app/api/v1/tests/route.ts` was using **Firebase Client SDK** instead of **Firebase Admin SDK**.

```typescript
// ❌ OLD CODE - Using Client SDK
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const firebaseConfig = { /* client config */ };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
```

**Why it failed:**
1. Firebase Client SDK requires authentication context when running on the server side
2. Next.js API routes run on the server without browser authentication
3. Even though Firestore rules allowed all reads (`allow read: if true`), the Client SDK couldn't authenticate properly
4. The error `"Missing or insufficient permissions"` appeared because the Client SDK couldn't establish a valid server-side connection

**Key Insight:**  
The API route **always used Client SDK** (verified via git history), but something in the environment or Firebase SDK version changed that broke the connection. The proper solution is to use **Admin SDK** for all server-side operations.

### AI Test Generation Issue

**Problem:** Google Gemini API quota is set to **0 requests per minute** in the GCP project.

```json
{
  "quota_limit": "GenerateContentRequestsPerMinutePerProjectPerRegion",
  "quota_limit_value": "0",
  "reason": "RATE_LIMIT_EXCEEDED"
}
```

**Why it failed:**
- GCP quotas for Gemini API (gemini-2.0-flash model) are set to 0
- This is a GCP Console configuration issue, not a code issue
- The application correctly shows the promotional modal when this happens

---

## ✅ Solution Implemented

### Practice Tests API Fix

**Changed:** Switched from Firebase Client SDK to Firebase Admin SDK

```typescript
// ✅ NEW CODE - Using Admin SDK
import { db } from '@/lib/firebase-admin';

// Query using Admin SDK methods
let baseQuery: FirebaseFirestore.Query | FirebaseFirestore.CollectionReference = 
  db.collection(COLLECTIONS.TEST_CONTENTS);

baseQuery = baseQuery.where('difficulty', '==', difficulty);
baseQuery = baseQuery.where('timeLimit', '==', timeLimitNum);
baseQuery = baseQuery.orderBy('__name__');
baseQuery = baseQuery.limit(pageLimit + 1);

const querySnapshot = await baseQuery.get();
```

**Key Changes:**
1. Removed Firebase Client SDK imports
2. Imported `db` from `@/lib/firebase-admin`
3. Changed query building from Client SDK style to Admin SDK style
4. Admin SDK uses service account authentication (automatically handled)
5. Added proper TypeScript typing: `FirebaseFirestore.Query | FirebaseFirestore.CollectionReference`

**Files Modified:**
- `/app/api/v1/tests/route.ts` - Primary fix

**Files NOT Modified (already using Admin SDK):**
- `/app/api/leaderboard/route.ts` - Already correct ✅
- `/app/api/profile/route.ts` - Already correct ✅
- Other API routes using Admin SDK ✅

### AI Test Generation Issue

**Status:** NO CODE CHANGES NEEDED  
**Reason:** The application already handles this correctly with a promotional modal

**GCP Fix Required:**
1. Go to GCP Console → APIs & Services → Quotas
2. Search for "Vertex AI API" or "Generative Language API"  
3. Find "Generate Content API requests per minute per region"
4. Request quota increase from 0 to a reasonable limit (e.g., 60 requests/minute)
5. Wait for approval (usually 1-2 business days)

---

## 🧪 Testing & Verification

### Testing Method
Used **Playwright MCP** to test the live application at `http://localhost:3000`

### Test Results

#### ✅ Practice Tests API - WORKING
```
Console Log: ✅ Fetched 4 pre-made tests
API Response: GET /api/v1/tests?difficulty=Medium&timeLimit=60&limit=20 200 in 1864ms
Firebase Log: ✅ Firebase Admin SDK initialized with service account
Query Result: {"resultsCount":4, "testsReturned":4}
```

**UI Verification:**
- Practice Test tab displays 4 tests:
  1. Technology - Medium - 52 words - 1m
  2. Business & Finance - Medium - 88 words - 1m
  3. Customer Support - VPN - Medium - 69 words - 1m
  4. Health & Medical - Medium - 81 words - 1m

#### ✅ AI Test Generation - PROPER ERROR HANDLING
```
API Response: POST generateAiTest - 503 (AI service unavailable)
Modal Displayed: "🎉 Unlimited AI Tests with Pro"
Modal Message: "Our AI service is experiencing high demand. Upgrade to ZenType Pro for priority access..."
Fallback Button: "Use Practice Test" - Successfully switches to Practice Test tab
```

**Error Handling Verified:**
- Modal appears when AI generation fails
- Clear error message explaining the issue
- Actionable CTA buttons (Upgrade / Use Practice Test)
- Practice Test fallback works correctly

---

## 📊 Impact

### Before Fix
- ❌ 0 practice tests loading
- ❌ HTTP 500 errors in console
- ❌ Users couldn't use any tests
- ⚠️ AI generation showing promotional message (correct behavior given quota issue)

### After Fix
- ✅ 4 practice tests loading successfully
- ✅ HTTP 200 responses
- ✅ Users can select and use practice tests
- ✅ AI generation properly handled with modal

---

## 🔄 Related Issues & Context

### Why Client SDK Was Used Initially
Looking at git history, the API routes were built with Client SDK from the start. This worked initially but broke due to:
1. Possible Firebase SDK version updates
2. Changes in how Next.js handles server-side Firebase connections
3. Firestore connection stability issues with Client SDK on server

### Best Practice Going Forward
**All Next.js API routes should use Firebase Admin SDK**

- ✅ Admin SDK: Server-side operations, service account auth
- ❌ Client SDK: Client-side only (React components, browser code)

### Other API Routes Status
Checked all other API routes:
- `/app/api/leaderboard/route.ts` - Uses Admin SDK ✅
- `/app/api/profile/route.ts` - Uses Admin SDK ✅  
- `/app/api/tests/route.ts` - **Still uses Client SDK** ⚠️ (legacy endpoint, may need fixing)
- `/app/api/v1/submit-test-result/route.ts` - Check needed
- All admin routes - Use Admin SDK ✅

**Recommendation:** Audit all API routes and migrate any remaining Client SDK usage to Admin SDK.

---

## 📝 Lessons Learned

1. **Always use Admin SDK for server-side operations** - Client SDK is for browser only
2. **Playwright MCP is excellent for debugging** - Allowed real-time testing and verification
3. **Check git history before major changes** - Understanding how it worked before prevents breaking other things
4. **Test both happy and error paths** - AI quota issue was discovered during testing
5. **Document quota issues separately** - GCP quota problems are not code issues

---

## 🚀 Deployment Notes

### Development (localhost)
- ✅ Fixed and tested
- Admin SDK uses service account file: `solotype-23c1f-firebase-adminsdk-fbsvc-c02945eb94.json`

### Production (Firebase App Hosting)
- ✅ Should work automatically
- Admin SDK will use default credentials in Firebase environment
- No additional configuration needed

### Environment Variables Required
```env
# Already configured - no changes needed
FIREBASE_SERVICE_ACCOUNT_KEY=./solotype-23c1f-firebase-adminsdk-fbsvc-c02945eb94.json
```

---

## 📚 References

- Firebase Admin SDK Documentation: https://firebase.google.com/docs/admin/setup
- Firebase Client SDK vs Admin SDK: https://firebase.google.com/docs/admin/setup#initialize-sdk
- Firestore Admin SDK Node.js: https://firebase.google.com/docs/firestore/server/query-data
- Git commit with fix: (will be created after this documentation)

---

**Next Steps:**
1. ✅ Practice Tests API fixed
2. ✅ Verified with Playwright
3. ⏳ Deploy to production
4. ⏳ Request Gemini API quota increase in GCP Console
5. ⏳ Audit remaining API routes for Client SDK usage

---

**End of Documentation - October 26, 2025**
