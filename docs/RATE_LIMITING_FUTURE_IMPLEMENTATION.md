# Rate Limiting Future Implementation Guide

**Created:** October 6, 2025  
**Status:** Architecture Preserved - Implementation Removed  
**Priority:** Post-Beta Feature

## 📋 Overview

This document outlines where and how rate limiting will be re-implemented in the future with subscription-based tiers. The rate limiting system has been temporarily removed during the testing phase to allow unlimited AI test generation.

## 🏗️ Current Architecture (Preserved)

The rate limiting infrastructure remains in place but is **disabled**:

### 1. Rate Limiter Configuration (`/functions/src/rate-limiter.ts`)
```typescript
const rateLimiters = {
  // AI Test Generation: 5 requests per minute per user
  generateAiTest: FirebaseFunctionsRateLimiter.withFirestoreBackend({
    name: 'generate_ai_test_limiter',
    maxCalls: 5,
    periodSeconds: 60,
  }, firestore),

  // Test Result Submission: 100 requests per minute per user  
  submitTestResult: FirebaseFunctionsRateLimiter.withFirestoreBackend({
    name: 'submit_test_result_limiter',
    maxCalls: 100,
    periodSeconds: 60,
  }, firestore),
};
```

### 2. Implementation Points

#### Firebase Cloud Functions
- **File:** `/functions/src/index.ts`
- **Functions Affected:**
  - `generateAiTest` (Line ~330)
  - `submitTestResult` (Line ~130)

**Current State:**
```typescript
// Rate Limiting Check - TEMPORARILY DISABLED FOR TESTING
// TODO: Re-enable with subscription-based limits
// await checkRateLimit('generateAiTest', userId);
```

#### Rate Limiting Utilities
- **File:** `/functions/src/rate-limiter.ts`
- **Functions:** `checkRateLimit()`, `getRateLimitStatus()`
- **Status:** ✅ Preserved and functional

## 🔮 Future Implementation Plan

### Phase 1: Subscription System Integration
1. **User Subscription Tiers**
   - **Free Tier:** 10 AI generations per day
   - **Pro Tier ($3/month):** 500 AI generations per day
   - **Premium Tier:** Unlimited AI generations

2. **Firestore Schema Addition**
```typescript
// Add to user profile document
interface UserProfile {
  // ... existing fields
  subscription: {
    tier: 'free' | 'pro' | 'premium';
    startDate: Timestamp;
    endDate: Timestamp | null;
    status: 'active' | 'cancelled' | 'expired';
  };
  usage: {
    dailyAiGenerations: number;
    lastResetDate: string; // YYYY-MM-DD format
    monthlyGenerations: number;
  };
}
```

### Phase 2: Dynamic Rate Limiting
```typescript
// Enhanced rate limit function
export async function checkSubscriptionBasedRateLimit(
  functionName: string,
  userId: string,
  userProfile: UserProfile
): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  
  // Reset daily counter if needed
  if (userProfile.usage.lastResetDate !== today) {
    await resetDailyUsage(userId);
    userProfile.usage.dailyAiGenerations = 0;
    userProfile.usage.lastResetDate = today;
  }
  
  // Check limits based on subscription tier
  const limits = {
    free: 10,
    pro: 500,
    premium: Infinity
  };
  
  const dailyLimit = limits[userProfile.subscription.tier];
  
  if (userProfile.usage.dailyAiGenerations >= dailyLimit) {
    throw new HttpsError(
      'resource-exhausted',
      `Daily limit exceeded. Upgrade to Pro for unlimited generations.`
    );
  }
  
  // Increment usage counter
  await incrementDailyUsage(userId);
}
```

### Phase 3: Usage Analytics Dashboard
- **Location:** `/app/admin/usage-analytics`
- **Features:**
  - Real-time usage monitoring
  - Subscription tier analytics  
  - Rate limit breach notifications
  - Usage pattern insights

## 🔧 Re-implementation Checklist

When ready to re-enable rate limiting:

### Backend Changes Required
- [ ] Update `rate-limiter.ts` with subscription-based logic
- [ ] Uncomment rate limiting calls in `generateAiTest` function
- [ ] Uncomment rate limiting calls in `submitTestResult` function  
- [ ] Add subscription tier checking logic
- [ ] Implement daily usage reset mechanism
- [ ] Add usage analytics tracking

### Frontend Changes Required
- [ ] Add subscription management UI
- [ ] Implement usage quota display
- [ ] Add upgrade prompts for limit exceeded scenarios
- [ ] Update error handling for subscription-based limits

### Database Changes Required
- [ ] Add subscription fields to user profiles
- [ ] Add usage tracking fields
- [ ] Create subscription management collections
- [ ] Set up usage analytics collections

## 📍 Code Locations for Re-implementation

### 1. Cloud Functions (`/functions/src/index.ts`)
**Lines to update:**
- Line ~130: `submitTestResult` rate limiting
- Line ~330: `generateAiTest` rate limiting

**Action:** Uncomment and replace with subscription-based checks

### 2. Rate Limiter (`/functions/src/rate-limiter.ts`)  
**Enhancement needed:** Add subscription-aware rate limiting logic

### 3. Frontend Error Handling (`/app/test/page.tsx`)
**Lines ~520-570:** Update error handling for new subscription-based messages

### 4. User Profile Schema (`/lib/types/user.ts`)
**Action:** Add subscription and usage tracking fields

## 🚨 Important Notes

1. **Do Not Delete:** The current rate limiter infrastructure should remain intact
2. **Testing Phase:** Rate limiting is disabled to allow thorough testing
3. **Architecture Ready:** All infrastructure exists for quick re-enabling
4. **Subscription First:** Future implementation must be tied to subscription system
5. **User Experience:** Provide clear upgrade paths when limits are reached

## 🔗 Related Documentation

- [`/docs/API_ENDPOINTS.md`](./API_ENDPOINTS.md) - Current rate limiting documentation
- [`/docs/DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) - Rate limiting deployment notes  
- [`/functions/src/rate-limiter.ts`](../functions/src/rate-limiter.ts) - Rate limiter implementation

## 📝 Changes Made (October 6, 2025)

### Rate Limiting Removal Summary
✅ **Completed Changes:**
- **Cloud Functions Updated:** Modified `generateAiTest` and `submitTestResult` functions in `/functions/src/index.ts`
- **Comments Added:** Clear documentation comments added indicating temporary removal for beta testing
- **Architecture Preserved:** All rate limiting infrastructure kept intact for future re-implementation
- **Documentation Created:** Comprehensive implementation guide created
- **Testing Enabled:** Users now have unlimited AI test generation during beta phase

### Modified Files:
1. **`/functions/src/index.ts`** 
   - Lines ~130 & ~330: Updated rate limiting comments
   - Removed active rate limiting calls while preserving structure
   
2. **`/docs/RATE_LIMITING_FUTURE_IMPLEMENTATION.md`** (This file)
   - Complete implementation roadmap created

### Current Status:
- ✅ Firebase emulator running with updated functions
- ✅ Next.js application running at http://localhost:3000  
- ✅ AI test generation working without rate limits
- ✅ Test submission working without rate limits
- ✅ All other functionality preserved and working

---

**Next Steps:** Complete beta testing phase, then implement subscription system integration before re-enabling rate limiting.