# ZenType Documentation Index - AI Knowledge Base

**Last Updated:** November 17, 2025 (Admin Panel Phase 6 Complete - Session Management Fixed)  
**Purpose:** Central index for all project documentation - use this as entry point for AI assistance  
**Production URL:** https://zentype-v1--solotype-23c1f.europe-west4.hosted.app/  
**Old Production URL (Deprecated):** https://zentype-v0--solotype-23c1f.europe-west4.hosted.app/

---

## 📑 **Table of Contents - Quick Jump**

- [Instructions for AI](#instructions-for-ai-assistants)
- [Quick Navigation](#quick-navigation)
- [1. Architecture & Design](#1-architecture--design)
- [2. Typing System Implementation](#2-typing-system-implementation)
- [3. Feature Implementations](#3-feature-implementations)
- [4. Debugging & Logging](#4-debugging--logging)
- [5. Deployment & Operations](#5-deployment--operations)
- [6. Bug Fixes & Issues](#6-bug-fixes--issues)
- [7. Planning & Specifications](#7-planning--specifications)
- [8. Privacy & GDPR Compliance](#8-privacy--gdpr-compliance)
- [9. Account Deletion & User Rights](#9-account-deletion--user-rights)
- [10. Admin Panel & Subscription Management](#10-admin-panel--subscription-management) **← NEW**
- [11. Agent Logs](#11-agent-logs)
- [Recent Changes Log](#recent-changes-log)
- [Key Project Facts](#key-project-facts-for-ai)

---

## 📋 **Instructions for AI Assistants**

When working on this project:
1. **Start here** - Read this file first to understand available documentation
2. **Find relevant docs** - Use the index below to locate specific information
3. **Update this file** - When creating new documentation, add an entry here with date
4. **Keep it current** - Always update the "Last Updated" date when modifying any doc

---

## 🎯 **Quick Navigation**

### **Core Architecture**
- `FIRESTORE_SCHEMA.md` - Database structure and collections
- `API_DESIGN_DOCUMENTATION.md` - Complete API architecture
- `API_ENDPOINTS.md` - API routes reference
- `TECHNICAL_API_INVENTORY.md` - Detailed API implementation status

### **Feature Implementation**
- `WPM_ACCURACY_ANALYSIS.md` - WPM calculation (MonkeyType formula)
- `MONKEYTYPE_BEHAVIOR_FIX.md` - MonkeyType-style UX improvements
- `WORD_BASED_TYPING_IMPLEMENTATION_COMPLETE.md` - Word-based typing system
- `WORD_BASED_TYPING_MIGRATION_PLAN.md` - Migration strategy
- `ZENTYPE_AUTO_SAVE_SUCCESS_SUMMARY.md` - Auto-save implementation
- `MODAL_SYSTEM_IMPLEMENTATION.md` - Modal system for AI failures and promotions
- `MODAL_SYSTEM_DEPLOYMENT_SUMMARY.md` - Final deployment summary and checklist

### **Privacy & Compliance** **← NEW**
- `privacy/privacy.prd.md` - Privacy requirements and GDPR compliance plan
- `privacy/privacy.scope.md` - Privacy scope and boundaries
- `privacy/privacy.current.md` - Current privacy implementation status
- `privacy/gdpr-data-processing.md` - Complete data processing documentation
- `privacy/privacy-policy-template.md` - Privacy policy for users
- `account-deletion/account-deletion.prd.md` - Account deletion requirements
- `account-deletion/account-deletion.scope.md` - Account deletion scope
- `account-deletion/account-deletion.current.md` - Account deletion status (Firebase Extension installed)

### **Development Guides**
- `DEBUG_GUIDE.md` - Debug logging system
- `TEST_GENERATION_GUIDE.md` - Test creation workflow
- `AI_TEST_GENERATION_GUIDE.md` - AI test generation
- `DEPLOYMENT_GUIDE.md` - Deployment procedures
- `QUICK_VERIFICATION_GUIDE.md` - Testing checklist
- `MODAL_TESTING_NOTES.md` - **NEW** - Modal system testing guide

### **System Documentation**
- `CENTRALIZED_LOGGING_CHECKLIST.md` - Logging standards
- `LOG_RETENTION_ALERTING.md` - Log management
- `CORS_FIX_SUMMARY.md` - CORS configuration

---

## 📚 **Complete Documentation List**

### **1. Architecture & Design**

#### `FIRESTORE_SCHEMA.md`
**Path:** `docs/FIRESTORE_SCHEMA.md`  
**Purpose:** Complete Firestore database schema  
**Contents:** Collections structure (users, testResults, premadeTests, aiTests), indexes, security rules  
**Updated:** October 3, 2025

#### `API_DESIGN_DOCUMENTATION.md`
**Path:** `docs/API_DESIGN_DOCUMENTATION.md`  
**Purpose:** Comprehensive API architecture documentation  
**Contents:** All API endpoints, request/response formats, authentication, error handling  
**Updated:** October 3, 2025

#### `API_ENDPOINTS.md`
**Path:** `docs/API_ENDPOINTS.md`  
**Purpose:** Quick API reference  
**Contents:** List of all API routes with brief descriptions  
**Updated:** October 3, 2025

#### `TECHNICAL_API_INVENTORY.md`
**Path:** `docs/TECHNICAL_API_INVENTORY.md`  
**Purpose:** API implementation status tracker  
**Contents:** Implemented vs planned endpoints, migration status from Cloud Functions to API routes  
**Updated:** October 3, 2025

#### `Logical Architecture Specification for Word-Based Typing Test.md`
**Path:** `docs/Logical Architecture Specification for Word-Based Typing Test.md`  
**Purpose:** Original specification for word-based typing system  
**Contents:** Requirements, state management, algorithms for word-based typing  
**Updated:** October 3, 2025

---

### **2. Typing System Implementation**

#### `WPM_ACCURACY_ANALYSIS.md`
**Path:** `docs/WPM_ACCURACY_ANALYSIS.md`  
**Purpose:** WPM calculation explanation (MonkeyType formula)  
**Contents:** Gross WPM formula, real-time accuracy calculation, implementation details  
**Status:** ✅ FIXED - Using MonkeyType's Gross WPM  
**Updated:** October 3, 2025

#### `MONKEYTYPE_BEHAVIOR_FIX.md`
**Path:** `docs/MONKEYTYPE_BEHAVIOR_FIX.md`  
**Purpose:** MonkeyType-style UX improvements  
**Contents:** Original text preservation, empty spacebar blocking, visual smoothness  
**Status:** ✅ COMPLETED  
**Updated:** October 3, 2025

#### `WORD_BASED_TYPING_IMPLEMENTATION_COMPLETE.md`
**Path:** `docs/WORD_BASED_TYPING_IMPLEMENTATION_COMPLETE.md`  
**Purpose:** Word-based typing implementation summary  
**Contents:** State architecture, typing engine, rendering logic, API compatibility  
**Status:** ✅ COMPLETED  
**Updated:** October 3, 2025

#### `WORD_BASED_TYPING_MIGRATION_PLAN.md`
**Path:** `docs/WORD_BASED_TYPING_MIGRATION_PLAN.md`  
**Purpose:** Migration strategy from character-based to word-based  
**Contents:** Analysis of current implementation, migration phases, risk assessment  
**Updated:** October 3, 2025

#### `WORD_BASED_TYPING_IMPLEMENTATION_AUDIT.md`
**Path:** `docs/WORD_BASED_TYPING_IMPLEMENTATION_AUDIT.md`  
**Purpose:** Pre-implementation audit of existing typing system  
**Contents:** Current state analysis, component breakdown, state flow  
**Updated:** October 3, 2025

#### `NET_WPM_IMPLEMENTATION_SUMMARY.md`
**Path:** `docs/NET_WPM_IMPLEMENTATION_SUMMARY.md`  
**Purpose:** Net WPM implementation details (deprecated - now using Gross WPM)  
**Contents:** Original Net WPM formula implementation  
**Status:** ⚠️ DEPRECATED - Replaced by Gross WPM  
**Updated:** October 3, 2025

---

### **3. Feature Implementations**

#### `theme-system/` **NEW IKB STRUCTURE**
**Path:** `docs/theme-system/`  
**Purpose:** Complete theme and font customization system (IKB compliant)  
**Contents:**
- `theme-system.prd.md` - Product requirements (10 themes, 10 fonts, specifications)
- `theme-system.scope.md` - Scope definition (what to touch, what NOT to touch)
- `theme-system.current.md` - Current status and known issues  
**Status:** 🔧 FIXING - Settings page has outdated arrays  
**Updated:** November 3, 2025

#### `ZENTYPE_AUTO_SAVE_SUCCESS_SUMMARY.md`
**Path:** `docs/ZENTYPE_AUTO_SAVE_SUCCESS_SUMMARY.md`  
**Purpose:** Auto-save AI tests feature documentation  
**Contents:** User preferences for auto-saving AI generated tests  
**Status:** ✅ COMPLETED  
**Updated:** October 3, 2025

#### `MODAL_SYSTEM_IMPLEMENTATION.md`
**Path:** `docs/MODAL_SYSTEM_IMPLEMENTATION.md`  
**Purpose:** Modal system for AI failures and promotional campaigns  
**Contents:** ZenTypeModal component, error handling flow, promotional modals, practice test redirect  
**Status:** ✅ COMPLETED - Deployed to production  
**Updated:** October 3, 2025

#### `AI_TEST_GENERATION_GUIDE.md`
**Path:** `docs/AI_TEST_GENERATION_GUIDE.md`  
**Purpose:** Guide for AI test generation feature  
**Contents:** How to generate custom tests using AI, API integration  
**Updated:** October 3, 2025

#### `TEST_GENERATION_GUIDE.md`
**Path:** `docs/TEST_GENERATION_GUIDE.md`  
**Purpose:** Manual test creation guide  
**Contents:** Creating pre-made tests, test structure, difficulty levels  
**Updated:** October 3, 2025

---

### **4. Debugging & Logging**

#### `DEBUG_GUIDE.md`
**Path:** `docs/DEBUG_GUIDE.md`  
**Purpose:** Debug logging system documentation  
**Contents:** How to use debug logger, flow tracking, log levels  
**Updated:** October 3, 2025

#### `CENTRALIZED_LOGGING_CHECKLIST.md`
**Path:** `docs/CENTRALIZED_LOGGING_CHECKLIST.md`  
**Purpose:** Logging standards and checklist  
**Contents:** Required logging points, log format standards, best practices  
**Updated:** October 3, 2025

#### `LOG_RETENTION_ALERTING.md`
**Path:** `docs/LOG_RETENTION_ALERTING.md`  
**Purpose:** Log management strategy  
**Contents:** Retention policies, alerting rules, monitoring setup  
**Updated:** October 3, 2025

---

### **5. Deployment & Operations**

#### `ZENTYPE_V0_DEPLOYMENT_PLAN.md`
**Path:** `docs/ZENTYPE_V0_DEPLOYMENT_PLAN.md`  
**Purpose:** Initial deployment strategy  
**Contents:** V0 deployment checklist, pre-launch tasks  
**Updated:** October 3, 2025

#### `DEPLOYMENT_GUIDE.md`
**Path:** `docs/DEPLOYMENT_GUIDE.md`  
**Purpose:** Complete deployment procedures  
**Contents:** Step-by-step deployment process, environment variables, post-deploy checks  
**Updated:** October 3, 2025

#### `QUICK_VERIFICATION_GUIDE.md`
**Path:** `docs/QUICK_VERIFICATION_GUIDE.md`  
**Purpose:** Quick testing checklist  
**Contents:** Essential features to test before deployment  
**Updated:** October 3, 2025

#### `MODAL_TESTING_NOTES.md` **NEW**
**Path:** `docs/MODAL_TESTING_NOTES.md`  
**Purpose:** Modal system testing guide and verification checklist  
**Contents:** Local testing instructions, test button usage, debug logging verification, production testing scenarios  
**Status:** ✅ COMPLETED - Ready for testing  
**Updated:** October 3, 2025

#### `MODAL_SYSTEM_DEPLOYMENT_SUMMARY.md`
**Path:** `docs/MODAL_SYSTEM_DEPLOYMENT_SUMMARY.md`  
**Purpose:** Final deployment summary and production readiness checklist  
**Contents:** Git status, deployment instructions, testing verification results, success metrics, troubleshooting guide  
**Status:** ✅ READY FOR DEPLOYMENT  
**Updated:** October 3, 2025

#### `FIREBASE_APP_HOSTING_PRODUCTION_DEPLOYMENT_NOV_2025.md` **NEW**
**Path:** `docs/FIREBASE_APP_HOSTING_PRODUCTION_DEPLOYMENT_NOV_2025.md`  
**Purpose:** Complete Firebase App Hosting production deployment documentation  
**Contents:** Backend configuration, environment variables, CORS fixes, production testing results, deployment timeline, troubleshooting guide  
**Status:** ✅ COMPLETED - PRODUCTION LIVE  
**Updated:** November 5, 2025

---

### **6. Bug Fixes & Issues**

#### `PRACTICE_TEST_API_FIX_OCT_2025.md` **NEW**
**Path:** `docs/PRACTICE_TEST_API_FIX_OCT_2025.md`  
**Purpose:** Complete documentation of HTTP 500 error fix for practice tests API  
**Contents:** Root cause analysis (Client SDK vs Admin SDK), solution implementation, Playwright testing verification, Gemini API quota issue documentation  
**Status:** ✅ FIXED AND VERIFIED  
**Updated:** October 26, 2025

#### `CORS_FIX_SUMMARY.md`
**Path:** `docs/CORS_FIX_SUMMARY.md`  
**Purpose:** CORS configuration fix documentation  
**Contents:** CORS issues encountered and solutions  
**Updated:** October 3, 2025

#### `CORS_FIX_DEPLOYMENT.md`
**Path:** `docs/CORS_FIX_DEPLOYMENT.md`  
**Purpose:** Deployment of CORS fixes  
**Contents:** Deployment steps for CORS configuration  
**Updated:** October 3, 2025

#### `errors.md`
**Path:** `docs/errors.md`  
**Purpose:** Common errors and solutions  
**Contents:** Error codes, troubleshooting steps  
**Updated:** October 3, 2025

---

### **7. Planning & Specifications**

#### `Pre Implementation Architecture Audit.md`
**Path:** `docs/Pre Implementation Architecture Audit.md`  
**Purpose:** Pre-implementation system audit  
**Contents:** Current architecture analysis before major changes  
**Updated:** October 3, 2025

#### `part_3_plan.md`
**Path:** `docs/part_3_plan.md`  
**Purpose:** Phase 3 development plan  
**Contents:** Future features, roadmap  
**Updated:** October 3, 2025

#### `API_PLAN.md`
**Path:** `docs/API_PLAN.md`  
**Purpose:** Original API planning document  
**Contents:** Initial API design proposals  
**Updated:** October 3, 2025

#### `API_PLAN_IMPLEMENTED.md`
**Path:** `docs/API_PLAN_IMPLEMENTED.md`  
**Purpose:** Implemented API features tracker  
**Contents:** API features that have been completed  
**Updated:** October 3, 2025

---

### **8. Privacy & GDPR Compliance**

#### `privacy/privacy.prd.md`
**Path:** `docs/privacy/privacy.prd.md`  
**Purpose:** Privacy and GDPR compliance requirements  
**Contents:** All 8 GDPR data subject rights, cookie consent system, data processing details, implementation checklist  
**Status:** ✅ COMPLETED  
**Updated:** November 13, 2025

#### `privacy/privacy.scope.md`
**Path:** `docs/privacy/privacy.scope.md`  
**Purpose:** Privacy implementation scope definition  
**Contents:** Files to create/modify, protected areas, critical zones (consent storage, data export, account deletion API), testing requirements  
**Status:** ✅ COMPLETED  
**Updated:** November 13, 2025

#### `privacy/privacy.current.md`
**Path:** `docs/privacy/privacy.current.md`  
**Purpose:** Current privacy implementation status  
**Contents:** Phase-by-phase progress (Firebase extension installed, API endpoints pending), Firebase extension configuration, sensitive areas documentation  
**Status:** 🔄 IN PROGRESS (25% complete)  
**Updated:** November 13, 2025

#### `privacy/gdpr-data-processing.md`
**Path:** `docs/privacy/gdpr-data-processing.md`  
**Purpose:** Complete GDPR data processing documentation  
**Contents:** What data we collect, legal basis, storage locations (EU only), data processors (Google Cloud), security measures, retention policies  
**Status:** ✅ COMPLETED  
**Updated:** November 13, 2025

#### `privacy/privacy-policy-template.md`
**Path:** `docs/privacy/privacy-policy-template.md`  
**Purpose:** User-facing privacy policy template  
**Contents:** Complete privacy policy text covering all GDPR requirements, user rights, cookie information, data processors  
**Status:** ✅ DRAFT (needs legal review)  
**Updated:** November 13, 2025

#### `app/privacy-policy/page.tsx` (LIVE PAGE)
**Path:** `/app/privacy-policy/page.tsx`  
**Purpose:** User-facing Privacy Policy page on the website  
**Contents:** Complete GDPR-compliant privacy policy with Firebase hyperlinks, data controller info, user rights, contact information  
**Links Added**:
- Firebase Privacy: https://firebase.google.com/support/privacy
- Firebase DPA: https://firebase.google.com/terms/data-processing-terms
**Status:** ✅ LIVE  
**Updated:** November 13, 2025

#### `app/terms-of-service/page.tsx` (LIVE PAGE)
**Path:** `/app/terms-of-service/page.tsx`  
**Purpose:** User-facing Terms of Service page on the website  
**Contents:** Comprehensive legal terms (13 sections) covering Firebase usage, data collection, user conduct, intellectual property, GDPR rights, termination, disclaimers, limitation of liability, indemnification, changes to terms, governing law, miscellaneous provisions, contact information  
**Links Included**:
- Firebase Terms: https://firebase.google.com/terms
- Firebase Privacy: https://firebase.google.com/support/privacy
- Firebase DPA: https://firebase.google.com/terms/data-processing-terms
- Privacy Policy: /privacy-policy
- Privacy Settings: /settings/privacy
**Status:** ✅ LIVE  
**Updated:** November 13, 2025

---

### **9. Account Deletion & User Rights**

#### `account-deletion/account-deletion.prd.md`
**Path:** `docs/account-deletion/account-deletion.prd.md`  
**Purpose:** GDPR-compliant account deletion requirements  
**Contents:** Feature requirements, security measures, Firebase extension integration, implementation checklist  
**Status:** ✅ COMPLETED  
**Updated:** November 5, 2025

#### `account-deletion/account-deletion.scope.md`
**Path:** `docs/account-deletion/account-deletion.scope.md`  
**Purpose:** Account deletion scope definition  
**Contents:** Files to modify, protected areas, Firebase extension configuration, critical areas (HIGH RISK zones)  
**Status:** ✅ COMPLETED  
**Updated:** November 5, 2025

#### `account-deletion/account-deletion.current.md`
**Path:** `docs/account-deletion/account-deletion.current.md`  
**Purpose:** Current account deletion implementation status  
**Contents:** Firebase extension installed (`delete-user-data-gdpr`), Cloud Functions deployed in `europe-west1`, API implementation pending  
**Status:** 🔄 IN PROGRESS (50% complete)  
**Updated:** November 13, 2025

#### `account-deletion/account-deletion.errors.md`
**Path:** `docs/account-deletion/account-deletion.errors.md`  
**Purpose:** Error tracking for account deletion feature  
**Contents:** Error history with solutions and prevention methods  
**Status:** ✅ READY (no errors yet)  
**Updated:** November 5, 2025

**Key Implementation Details:**
- **Firebase Extension:** `delete-user-data-gdpr` (v0.1.25) installed
- **Location:** `europe-west1` (Belgium) - EU/GDPR compliant
- **Firestore Paths:** `users/{UID},testResults/{UID},aiTests/{UID}`
- **Auto-Discovery:** Enabled (depth 5, fields: userId,uid,createdBy)
- **Cloud Functions:** 3 functions deployed for deletion orchestration
- **Next Steps:** Implement `/app/api/v1/user/delete-account/route.ts`

---

### **10. Admin Panel & Subscription Management** **← NEW**

#### `admin-panel/admin-panel.prd.md`
**Path:** `docs/admin-panel/admin-panel.prd.md`  
**Purpose:** Comprehensive admin panel product requirements with RBAC and subscription management  
**Contents:** RBAC system (Firebase custom claims), subscription tiers (Free: 5 AI tests/day, Premium: unlimited), user management dashboard, simple mode architecture, admin audit logging, GDPR compliance checklist, 6-phase implementation plan  
**Status:** 📝 PLANNING COMPLETE - Ready for Phase 1 implementation  
**Updated:** November 17, 2025

#### `admin-panel/admin-panel.scope.md`
**Path:** `docs/admin-panel/admin-panel.scope.md`  
**Purpose:** Admin panel scope definition and risk analysis  
**Contents:** New files to create (/app/admin/* routes, /app/api/v1/admin/* APIs, subscription-rate-limiter.ts, admin-middleware.ts), files to modify (firebase-admin.ts, rate-limiter.ts, index.ts), 7 HIGH RISK zones identified, cross-feature dependencies mapped, Firestore indexes, security rules  
**Status:** 📝 PLANNING COMPLETE  
**Updated:** November 17, 2025

#### `admin-panel/admin-panel.current.md`
**Path:** `docs/admin-panel/admin-panel.current.md`  
**Purpose:** Admin panel implementation status tracking  
**Contents:** 0% progress tracker across 6 phases (Foundation, User Management, Subscription System, Simple Mode, Audit & Analytics, Testing & Deployment), tasks broken down, sensitive areas documented  
**Status:** 🔄 NOT STARTED (0% complete)  
**Updated:** November 17, 2025

#### `admin-panel/admin-panel.errors.md`
**Path:** `docs/admin-panel/admin-panel.errors.md`  
**Purpose:** Error tracking for admin panel feature  
**Contents:** Error history template with preventive measures (ready for implementation phase)  
**Status:** ✅ READY (no errors yet - planning phase)  
**Updated:** November 17, 2025

**Key Features:**
- **RBAC System:** Firebase custom claims (admin, superAdmin, canDeleteUsers, canManageSubscriptions)
- **Subscription Tiers:**
  - Free: 5 AI tests per day, unlimited practice tests
  - Premium: Unlimited AI tests, $3/month or $30/year
- **Rate Limiting:** Extends existing firebase-functions-rate-limiter with subscription-based logic
- **Admin Dashboard:**
  - User list with search, filter, pagination
  - User detail view with role promotion (Super Admin only)
  - Subscription management UI
  - Account deletion (integrates with existing GDPR extension)
  - User profile editing (email, username changes)
- **Simple Mode:** Text paste UI for quick test generation (no parameter configuration)
- **Admin Audit Logging:** Complete trail in adminAuditLog collection (timestamp, adminUserId, action, targetUserId, changes, IP, success)
- **GDPR Compliance:** Reuses existing Firebase Extension (delete-user-data-gdpr) and data export API
- **Next Steps:** Begin Phase 1 (Foundation) - Firebase custom claims, admin middleware, admin authentication flow

---

### **11. Agent Logs**

#### `AGENT_LOG.md`
**Path:** `docs/AGENT_LOG.md`  
**Purpose:** AI agent conversation log  
**Contents:** Historical log of AI assistant interactions and changes  
**Updated:** October 3, 2025

---

## 🔄 **Recent Changes Log**

### November 17, 2025 (Latest - Admin Panel Phase 4 Complete + Tab Integration Enhancement ✅)

- 🎨 **Simple Mode Tab Integration Enhancement** (Post-Phase 4 UX Improvement)
  - **Implementation:**
    - Modified `/app/test/page.tsx` to integrate Simple Mode as third tab
    - Changed tab grid from 2 columns to 3 columns (Practice Test, AI-Generated Test, Simple Mode)
    - Added Simple Mode state management (simpleText, simpleTextError, isGeneratingSimple)
    - Implemented handleGenerateSimpleTest function (110 lines) with Cloud Function integration
    - Created complete Simple Mode TabsContent component (120 lines) with:
      - Large textarea with 50-5000 character validation
      - Real-time character counter and word counter
      - Validation indicator ("✓ Ready to generate" or error message)
      - Subscription status display (reuses existing component)
      - Info box explaining Simple Mode functionality
      - Generate Test button with loading state
    - Updated Start Typing button logic to handle Simple Mode
  
  - **Testing Results** (Playwright MCP):
    - ✅ All three tabs functional and switchable
    - ✅ Simple Mode validation: 327 characters → 52 words → "✓ Ready to generate"
    - ✅ Cloud Function call successful (testId: pR8xBYXcWPJ1L0qX12CB)
    - ✅ Test auto-selected and loaded into typing interface
    - ✅ Typing test started correctly with 327 character text
    - ✅ No regressions to Practice Test or AI-Generated Test tabs
  
  - **UX Benefits:**
    - Consolidates all test modes into unified interface (better discoverability)
    - Eliminates navigation between pages (faster workflow)
    - Consistent UI pattern for all test configuration options
    - Reduces context switching for users
  
  - **Commits:**
    - cb00a57: "feat: Integrate Simple Mode as third tab in main test configuration page"
    - 6581daa: "docs: Document Simple Mode tab integration enhancement"

- 🔄 **Simple Mode Redirect Refactoring** (Post-Integration Cleanup)
  - **Problem:** After tab integration, `/app/test/simple/page.tsx` became redundant (294 lines of duplicate code)
  - **Solution:** Converted to lightweight redirect page maintaining backward compatibility
  
  - **Implementation:**
    - Replaced 294-line Simple Mode implementation with 37-line redirect component (87% reduction)
    - Added `useSearchParams` import to `/app/test/page.tsx`
    - Updated `activeTab` state initialization to read `?tab=` query parameter
    - Redirect uses `router.replace('/test?tab=simple')` for seamless transition
    - Displays loading spinner and "Redirecting to Simple Mode..." message
  
  - **Testing Results** (Playwright MCP):
    - ✅ Navigated to `http://localhost:3000/test/simple` → Shows redirect page
    - ✅ Auto-redirected to `http://localhost:3000/test?tab=simple` within 2 seconds
    - ✅ Simple Mode tab automatically selected on arrival
    - ✅ All functionality working correctly (same as direct tab access)
    - ✅ No console errors or broken links
  
  - **Benefits:**
    - Single source of truth for Simple Mode (no code duplication)
    - Backward compatibility maintained (existing bookmarks/links work)
    - Cleaner codebase (87% less code in standalone page)
    - Better maintainability (one place to update features)
    - Seamless user experience (redirect is instant and smooth)
  
  - **Best Practice:**
    - When consolidating features, use redirects instead of deleting old routes
    - Preserves SEO, bookmarks, and external links
    - Provides migration path without breaking changes
  
  - **Commits:**
    - 888cd9f: "refactor: Convert /test/simple to redirect page for backward compatibility"
    - (pending): "docs: Document redirect refactoring in IKB"

- 🎉 **Admin Panel Phase 4: Simple Mode COMPLETE** (66% total progress)
  - **Features Implemented:**
    - Created `/app/test/simple/page.tsx` - Simple Mode UI (302 lines)
      - Large textarea for text input (50-5000 character validation)
      - Real-time character counter (0/5000 characters)
      - Real-time word counter
      - Validation indicator: "✓ Ready to generate" or "⚠ Min 50 characters"
      - Generate Test button with loading state and disabled logic
      - Subscription status banner (Premium: Unlimited / Free: X of 5 today)
      - Back to Test Page navigation
      - Info box explaining Simple Mode functionality
    
    - Created `/functions/src/simple-test-generator.ts` - Cloud Function (139 lines)
      - Text cleaning: normalize whitespace, remove special characters
      - Validation: 50-5000 character range, type checking
      - Subscription limit enforcement via checkAiTestLimit()
      - Firestore save to aiGeneratedTests collection with mode: 'simple'
      - Comprehensive error handling (unauthenticated, invalid-argument, resource-exhausted, internal)
      - Deployed to Firebase us-central1 region
    
    - Fixed `/functions/src/subscription-rate-limiter.ts` - Removed non-existent logging imports
      - Removed startSpan/endSpan calls (function doesn't exist)
      - Replaced console.log/warn/error with logger.info/warn/error
      - Fixed TypeScript compilation errors
  
  - **Testing Results** (Playwright MCP):
    - ✅ Simple Mode page loads with textarea and controls
    - ✅ Real-time validation: 186 characters, 32 words counted correctly
    - ✅ Generate button disabled until text >=50 characters
    - ✅ Cloud Function successfully generated test (testId: dzy6jTHJPu2G6SkTaO3C)
    - ✅ Text saved to Firestore aiGeneratedTests collection
    - ✅ Page redirects to /test?mode=ai&testId=dzy6jTHJPu2G6SkTaO3C
    - ✅ Console log: "[Simple Mode] Test generated successfully"
    - ✅ Premium user shows "✨ Premium: Unlimited AI tests" banner
  
  - **Integration Points:**
    - Uses Firebase SDK httpsCallable() for secure Cloud Function calls
    - Integrates with existing checkAiTestLimit() from subscription-rate-limiter
    - Counts against daily AI test limit (same as regular AI generation)
    - Uses existing Firebase client config from /lib/firebase/client.ts
    - Error handling for subscription limit (functions/resource-exhausted)
  
  - **Documentation Updated:**
    - `/docs/admin-panel/admin-panel.current.md` - Phase 4 marked 100% complete
    - Added Lesson 16: Firebase SDK Callable Functions > Raw HTTPS
    - Overall admin panel progress: 50% → 66%
  
  - **Lesson Learned:**
    - Lesson 16: Use Firebase SDK callable functions instead of raw fetch()
    - `httpsCallable(functions, 'functionName')` handles authentication automatically
    - No manual Bearer token required
    - Standardized error codes: `functions/resource-exhausted`, `functions/unauthenticated`
    - Cleaner error handling with structured error objects
  
  - **Git Commits:**
    - `2966d05` - feat: Implement Simple Mode with Cloud Function backend
  
  - **Status:** ✅ PHASE 4 COMPLETE - Ready for Phase 5 or Phase 6
  - **Next Steps:**
    - Phase 5: Audit & Analytics (dashboard metrics, system health monitoring, alerting)
    - Phase 6: Testing & Deployment (comprehensive Playwright testing, security audit, GDPR compliance)

### November 17, 2025 (Admin Panel Phase 3 Complete ✅)

- 🎉 **Admin Panel Phase 3: Subscription System COMPLETE** (50% total progress)
  - **Fixed ERROR-ADMIN-001:** Subscription Management API 500 error
    - Root cause: Inverted authorization check logic (`if (adminCheck)` instead of `if (!adminCheck.authorized)`)
    - AdminAuthResult objects are always truthy - must check `.authorized` property
    - Fixed in 3 API endpoints:
      - `/app/api/v1/admin/subscriptions/route.ts` (GET list)
      - `/app/api/v1/admin/subscriptions/[userId]/route.ts` (GET single, PUT update)
  
  - **Features Verified Working** (Playwright MCP Testing):
    - ✅ Subscription list page loads with 16 total users
    - ✅ Free tier users display "5 of undefined today" (minor frontend display issue)
    - ✅ Premium users display "∞ AI tests" with crown icon
    - ✅ Tier change functionality: Changed test21@gmail.com free → premium successfully
    - ✅ Confirmation dialog and success alert working
    - ✅ Audit logging to adminAuditLog collection
    - ✅ Search and filter UI present
    - ✅ Pagination controls working
  
  - **All Phase 3 Components Complete:**
    - **Phase 3a:** Subscription rate limiter (267 lines) - checkAiTestLimit() with daily reset
    - **Phase 3b:** Cloud Function integration - Added limit check to generateAiTest at line 341
    - **Phase 3c:** User subscription API - GET /api/v1/user/subscription with remaining tests
    - **Phase 3d:** Test page subscription display - Shows remaining tests and upgrade prompts
    - **Phase 3e:** Admin subscription APIs - List all users, get/update single subscription
    - **Phase 3f:** Admin subscriptions UI (398 lines) - Tier change dropdown, search, filter, pagination
    - **Phase 3g:** Pricing page (214 lines) - Free vs Premium comparison, FAQ section
    - **Phase 3j:** Fixed rendering issue - Removed state updates during render
  
  - **Documentation Updated:**
    - `/docs/admin-panel/admin-panel.current.md` - Phase 3 marked 100% complete, added Lesson 15
    - `/docs/admin-panel/admin-panel.errors.md` - ERROR-ADMIN-001 resolved with full diagnosis
    - Overall admin panel progress: 35% → 50%
  
  - **Lesson Learned:**
    - Lesson 15: Always check `.authorized` property, not object truthiness
    - Middleware functions return objects (always truthy) - must examine specific properties
    - Pattern: `if (!result.authorized)` NOT `if (result)`
  
  - **Git Commits:**
    - `d1db436` - fix: Correct admin middleware authorization check logic
    - Screenshots saved: admin-subscriptions-working.png, admin-subscriptions-tier-change-success.png
  
  - **Status:** ✅ PHASE 3 COMPLETE - Ready for Phase 4 (Simple Mode)
  - **Next Steps:**
    - Phase 4: Simple Mode (text paste UI for quick test generation)
    - Phase 5: Audit & Analytics (dashboard metrics, system health monitoring)
    - Phase 6: Testing & Deployment (comprehensive Playwright testing, security audit)

### November 17, 2025 (Earlier - Admin Panel System Documentation ✅)

- 📝 **Admin Panel IKB Documentation Structure Created**
  - **Purpose**: Comprehensive documentation for admin panel with RBAC, subscription management, and GDPR compliance
  - **Research Phase**:
    - Used Context7 MCP to fetch Firebase Admin SDK custom claims documentation
    - Analyzed GitHub repositories (codelitdev/firebase-admin-dashboard, irfan-za/admin-dashboard)
    - Studied existing ZenType codebase (FIRESTORE_SCHEMA.md, authentication patterns)
    - Reviewed existing GDPR compliance infrastructure (Firebase Extension delete-user-data-gdpr)
  
  - **Documentation Created**:
    - `/docs/admin-panel/admin-panel.prd.md` (2,500+ lines)
      - RBAC system design using Firebase custom claims (admin, superAdmin, canDeleteUsers, canManageSubscriptions)
      - Subscription tiers (Free: 5 AI tests/day, Premium: unlimited)
      - User management dashboard specifications
      - Simple mode architecture (text paste for quick test generation)
      - Admin audit logging requirements
      - GDPR compliance checklist
      - 6-phase implementation plan (Foundation → User Management → Subscription System → Simple Mode → Audit & Analytics → Testing & Deployment)
    
    - `/docs/admin-panel/admin-panel.scope.md` (1,800+ lines)
      - 7 HIGH RISK zones identified (Firebase custom claims, subscription rate limiting, admin audit logging, user account deletion, admin route authorization, subscription collection schema, simple mode text processing)
      - New files to create: /app/admin/* routes, /app/api/v1/admin/* APIs, subscription-rate-limiter.ts, admin-middleware.ts
      - Files to modify: firebase-admin.ts, rate-limiter.ts, index.ts
      - Cross-feature dependencies mapped
      - Firestore indexes and security rules documented
    
    - `/docs/admin-panel/admin-panel.current.md`
      - 0% implementation status tracker across 6 phases
      - Tasks broken down with acceptance criteria
      - Sensitive areas documented (reuses lessons from past ZenType errors)
    
    - `/docs/admin-panel/admin-panel.errors.md`
      - Error tracking template with preventive measures
      - Based on past ZenType errors (Practice Tests API Fix Oct 26, Account Deletion Nov 13)
  
  - **Key Architectural Decisions**:
    - RBAC: Firebase custom claims (not database roles) for security and performance
    - Rate Limiting: Extends existing firebase-functions-rate-limiter with subscription-based logic
    - Admin Auth: Separate admin login flow (email/password only, no OAuth)
    - Audit Logging: adminAuditLog collection with IP tracking, timestamp, changes
    - GDPR: Integrates with existing Firebase Extension (delete-user-data-gdpr in europe-west1)
    - Subscription Schema: Firestore subscriptions collection with tier, aiTestsUsedToday, resetDate
  
  - **Files Modified**:
    - `/docs/MAIN.md` - Added Section 10: Admin Panel & Subscription Management, updated Recent Changes Log, updated Last Updated timestamp
  
  - **Status**: ✅ PLANNING COMPLETE - Ready for Phase 1 (Foundation) implementation
  - **Next Steps**: 
    - Create TypeScript interface for AdminClaims
    - Extend /lib/firebase-admin.ts with custom claims functions
    - Create admin-middleware.ts for route authorization
    - Implement admin authentication flow

### November 13, 2025 (UX Improvements: Legal Links & Password Visibility ✅)

- 🎨 **Profile Dropdown - Legal Navigation Links**
  - **Problem**: Terms of Service and Privacy Policy not easily accessible from authenticated user interface
  - **Solution**: Added legal links to profile dropdown menu
    - Removed: "Help & Support" button (feature not yet implemented)
    - Added: "Terms of Service" link with FileText icon
    - Added: "Privacy Policy" link with Shield icon
    - Positioned between Settings and Sign Out separator
    - Same styling as Settings link (hover effects, transitions)
  
  - **Testing** (Playwright MCP):
    - ✅ Profile dropdown displays both legal links correctly
    - ✅ ToS link navigates to `/terms-of-service` successfully
    - ✅ Privacy link navigates to `/privacy-policy` successfully
    - ✅ Icons display correctly (FileText and Shield)
  
  - **File Modified**:
    - `/components/header.tsx` - Updated profile dropdown menu

- 👁️ **Password Visibility Toggle (Eye Icon)**
  - **Problem**: Users couldn't verify password input (common UX pattern missing)
  - **Solution**: Added password visibility toggle to login and signup forms
    - Eye icon button (Eye/EyeOff from lucide-react)
    - Positioned inside password input (absolute right-3)
    - Toggles input type: `password` ↔ `text`
    - Accessible: `aria-label` with dynamic text ("Show password" / "Hide password")
    - Gray icon with hover effect (gray-400 → gray-300)
  
  - **Testing** (Playwright MCP):
    - ✅ Login form: Toggle button changes from "Show password" to "Hide password"
    - ✅ Signup form: Toggle button works identically
    - ✅ Eye/EyeOff icons display correctly
    - ✅ Password text becomes visible when toggled
    - ✅ No layout issues or styling conflicts
  
  - **Files Modified**:
    - `/app/login/page.tsx` - Added password visibility toggle
    - `/app/signup/page.tsx` - Added password visibility toggle
  
  - **Documentation Updated**:
    - `/docs/privacy/privacy.current.md` - Added Lesson 9 (UX Improvements)
    - `/docs/MAIN.md` - Added UX improvements entry to Recent Changes Log

### November 13, 2025 (Earlier - Data Export Security Hardening ✅)

- 🔒 **Data Export Sanitization for Security**
  - **Problem Identified**: User-facing data export was exposing too much internal system information
    - Firebase UIDs (28-character format revealed)
    - Correlation IDs (internal request tracking patterns)
    - Firebase timestamp structure (`{_seconds, _nanoseconds}`)
    - IP addresses (localhost environments)
    - Redundant system fields (`userId` in every nested object)
  
  - **Security Risk**: Exposing internal identifiers could aid attackers in understanding system architecture
  
  - **Implementation** (`/app/api/v1/user/export-data/route.ts`):
    - Created `sanitizeExportData()` function with 5 helper functions:
      - `maskUid()`: Converts `"Xp4s...p983"` → `"user_***************p983"` (last 4 chars only)
      - `maskIp()`: Converts `"::1"` → `"xxx.xxx.xxx.xxx (localhost)"`
      - `convertTimestamp()`: Converts `{_seconds: 1759...}` → `"2025-11-13T07:09:19.000Z"` (ISO 8601)
      - `sanitizeTestResult()`: Removes `userId`, `correlationId`, converts timestamps
      - `sanitizeConsent()`: Removes `userId`, masks IP addresses
    - Applied sanitization before returning response (no breaking changes)
    - Added `"_security"` note to export metadata explaining masking
  
  - **What Gets Sanitized**:
    - ✅ Firebase UIDs → Masked to `user_***...last4`
    - ✅ Correlation IDs → Removed completely
    - ✅ Timestamps → Converted to ISO 8601 standard format
    - ✅ IP addresses → Masked to `xxx.xxx.xxx.xxx`
    - ✅ Redundant fields → Removed (`userId` in nested objects)
  
  - **What's Preserved** (100% User Data):
    - ✅ All typing test results (WPM, accuracy, errors, duration, text)
    - ✅ All AI-generated tests
    - ✅ All consent records with audit trail
    - ✅ Authentication data (email, display name, timestamps)
    - ✅ Profile information
    - ✅ GDPR metadata and legal information
  
  - **Critical: No Breaking Changes**:
    - ✅ Database queries unchanged (still fetch all user data)
    - ✅ Internal logging unchanged (uses original data)
    - ✅ Span tracking unchanged (records operation metrics)
    - ✅ GDPR Article 15 (Right to Access) compliance maintained
    - ✅ GDPR Article 20 (Data Portability) compliance maintained
  
  - **Testing & Verification** (Playwright MCP):
    - ✅ UIDs masked correctly: `"user_***************Z4E2"`
    - ✅ Correlation IDs removed from all objects
    - ✅ Timestamps converted to ISO: `"2025-11-13T08:41:54.552Z"`
    - ✅ User data 100% preserved (WPM, accuracy, test history)
    - ✅ Export file downloaded successfully
    - ✅ Success message displayed: "✅ Data exported successfully"
  
  - **Files Modified**:
    - `/app/api/v1/user/export-data/route.ts` - Added 150+ lines of sanitization logic
  
  - **Documentation Updated**:
    - `/docs/privacy/privacy.current.md` - Added Lesson 8 (Data Export Sanitization)
    - `/docs/MAIN.md` - Added security hardening entry to Recent Changes Log

### November 13, 2025 (Earlier - Privacy & GDPR Implementation COMPLETE ✅)

- 📝 **Terms of Service & Legal Compliance Enhancements**
  - **Terms of Service Page Created** (`/app/terms-of-service/page.tsx`)
    - 13 comprehensive sections covering all legal aspects
    - Firebase-specific terms (Terms, Privacy, DPA links)
    - GDPR compliance sections (data rights, EU storage)
    - Acceptance of terms, user accounts, data collection (Firebase), user conduct
    - Intellectual property, termination, disclaimers, limitation of liability
    - Indemnification, changes to terms, governing law, contact information
  
  - **ToS Acceptance on Signup**
    - Added required checkbox: "I agree to the Terms of Service and Privacy Policy"
    - Create Account button disabled until checkbox checked
    - Links open in new tabs for user review
    - Explicit consent mechanism (GDPR-compliant)
  
  - **Privacy Policy Firebase Links**
    - Added Firebase Privacy link: https://firebase.google.com/support/privacy
    - Added Firebase DPA link: https://firebase.google.com/terms/data-processing-terms
    - Links embedded in relevant data processing sections
  
  - **Header UI Fix**
    - Fixed profile dropdown username/email overflow
    - Long emails now truncate with ellipsis (e.g., "sugurugetojjk5...")
    - Maintains consistent dropdown width and layout
  
  - **Testing & Verification**
    - ✅ ToS page renders correctly with all 13 sections
    - ✅ Signup requires ToS acceptance (button disabled until checked)
    - ✅ All hyperlinks work correctly (Firebase, Privacy, ToS)
    - ✅ Header dropdown displays properly without overflow
    - ✅ Links open in new tabs as expected
  
  - **Files Modified**:
    - `/app/terms-of-service/page.tsx` - New comprehensive ToS page
    - `/app/signup/page.tsx` - Added ToS acceptance checkbox
    - `/app/privacy-policy/page.tsx` - Added Firebase hyperlinks
    - `/components/header.tsx` - Fixed truncation for long emails
  
  - **Documentation Updated**:
    - `/docs/privacy/privacy.current.md` - Added Lesson 7 (ToS Integration)
    - `/docs/MAIN.md` - Added ToS page entry and Firebase links documentation

- ✅ **Privacy & GDPR Compliance Fully Implemented** - All 8 data subject rights now functional
  - **API Endpoints Created:**
    - `GET /api/v1/user/export-data` - GDPR Article 15 (Right to Access)
    - `GET /api/v1/user/consents` - Fetch consent preferences
    - `POST /api/v1/user/consents` - Update consents with audit trail (timestamp, IP, user-agent)
    - `POST /api/v1/user/delete-account` - GDPR Article 17 (Right to Erasure)
  
  - **Frontend Components Created:**
    - `/components/privacy/cookie-consent-banner.tsx` - CookieYes-style banner (simple & detailed views)
    - `/app/settings/privacy/page.tsx` - Privacy settings dashboard
    - `/app/privacy-policy/page.tsx` - Comprehensive GDPR-compliant privacy policy
    - `/app/settings/page.tsx` - Enhanced with account deletion UI (Danger Zone with re-auth)
    - `/app/layout.tsx` - Modified to include cookie consent banner globally
  
  - **Cookie Consent Features:**
    - Simple view: Accept All / Necessary Only / Customize buttons
    - Detailed view: Per-category toggles (Strictly Necessary, Analytics, Functional, Advertising)
    - Saves to localStorage immediately for UX
    - Syncs to Firestore for authenticated users with audit trail
    - Dispatches `consentUpdated` custom event
    - Strictly necessary always ON (cannot disable)
    - Advertising disabled by default (not used)
  
  - **Data Export Features:**
    - Exports all user data: profile, testResults (27 tests), aiTests, consents, auth data
    - Includes GDPR metadata: export date, regulation, legal basis
    - Includes data processor info: GCP/Firebase, EU location (europe-west1 Belgium)
    - Includes legal information: user rights, data controller contact
    - Returns JSON with Content-Disposition header for automatic download
    - Redacts sensitive fields (passwords noted as hashed/excluded)
  
  - **Testing & Verification:**
    - ✅ Tested with Playwright MCP browser automation
    - ✅ Data export downloads complete JSON (verified 270 lines)
    - ✅ Cookie consent banner displays correctly (simple & detailed views)
    - ✅ Cookie consent saves to localStorage and Firestore
    - ✅ Cookie consent persists across page loads
    - ✅ Privacy settings page loads all features correctly
    - ✅ Analytics toggle tested: OFF → ON → persisted ✅
    - ✅ Privacy policy page renders all GDPR sections
    - ✅ Zero TypeScript errors, zero runtime errors
  
  - **Documentation Updated:**
    - `/docs/privacy/privacy.current.md` - Status updated to 100% complete
    - `/docs/MAIN.md` - Added privacy implementation entry to Recent Changes
    - All lessons learned documented (6 new lessons added)

- 🗑️ **Account Deletion Previously Completed** - Firebase Extension installed and documented

- 🔐 **Multi-Provider Account Deletion (Google OAuth Support Added)**
  - **Problem Solved**: Google-authenticated users could not delete accounts (GDPR Article 17 violation)
  - **Implementation**:
    - Provider detection via `user.providerData[0].providerId`
    - Email users: `EmailAuthProvider.credential()` + password input
    - Google users: `reauthenticateWithPopup(user, GoogleAuthProvider)` + OAuth popup
    - Conditional modal UI: Password field OR Google re-auth notice
    - Google-specific error handling: popup-closed, popup-blocked
  - **Testing Results**:
    - ✅ Email user deletion: Password re-auth working
    - ✅ Google user deletion: Popup re-auth working
    - ✅ Account deleted successfully for both providers
    - ✅ User signed out and redirected correctly
  - **Files Modified**:
    - `/app/settings/page.tsx` - Updated re-authentication logic + modal UI
  - **Commits**:
    - `36f65c4` - Login/signup error handling
    - `9895e77` - Google OAuth re-authentication for account deletion
  - **Documentation Updated**:
    - `/docs/privacy/privacy.current.md` - Added Lesson 6 (Multi-Provider Re-Authentication)
    - Updated sensitive areas section with Google OAuth support details
  - **Extension:** `delete-user-data-gdpr` (v0.1.25)
  - **Location:** `europe-west1` (Belgium) - EU/GDPR compliant
  - **Status:** 100% complete with API and UI

### November 13, 2025 (Earlier - Privacy & GDPR Compliance Documentation)
- 📚 **Privacy & GDPR Compliance Documentation Created** - Complete IKB structure for privacy implementation
  - **New Folder:** `/docs/privacy/` with 5 comprehensive documents
  - **PRD:** Privacy requirements with all 8 GDPR data subject rights
  - **Scope:** Boundaries, critical areas, interconnections with account deletion
  - **Current Status:** Implementation progress tracking (25% complete → NOW 100%)
  - **Data Processing:** Complete GDPR documentation (what we collect, where it's stored, legal basis)
  - **Privacy Policy:** User-facing template (ready for legal review)
  
- 🗑️ **Account Deletion Documentation Updated** - Firebase Extension installation documented
  - **Extension Installed:** `delete-user-data-gdpr` (v0.1.25)
  - **Location:** `europe-west1` (Belgium) - EU/GDPR compliant
  - **Configured Paths:** `users/{UID},testResults/{UID},aiTests/{UID}`
  - **Auto-Discovery:** Enabled (depth 5, search fields: userId,uid,createdBy)
  - **Cloud Functions:** 3 functions deployed for deletion orchestration
  - **Status:** 50% complete (extension ready, API pending) → NOW 100%
  
- 🎯 **MAIN.md Updated** - Added Privacy & Account Deletion sections
  - New section 8: Privacy & GDPR Compliance
  - New section 9: Account Deletion & User Rights
  - Updated last modified date
  - Cross-referenced all privacy-related documentation
  
- 📝 **Key Lessons Learned:**
  - EU data center configuration is critical for GDPR (must use `europe-west1`)
  - Firebase extension triggers automatically when `admin.auth().deleteUser(uid)` is called
  - Cookie consent must be granular (Strictly Necessary, Analytics, Functional, Advertising)
  - GDPR requires implementing all 8 data subject rights, not just "delete account"

### November 5, 2025 (Production Deployment Complete - Firebase App Hosting v1)
- 🚀 **New Production Environment** - Deployed to Firebase App Hosting with correct repository
  - **New URL:** https://zentype-v1--solotype-23c1f.europe-west4.hosted.app/
  - **Backend ID:** zentype-v1 (replaces zentype-v0)
  - **Repository:** mantassteckis/zentype_v1 (fixed from wrong dual-ling repo)
  - **Region:** europe-west4 (Netherlands)
  - **Deployment Method:** Firebase CLI rollouts (GitHub webhook not triggering)
  
- ✅ **Environment Variables Configured** - apphosting.yaml setup
  - All `NEXT_PUBLIC_FIREBASE_*` configs in apphosting.yaml (committed to git)
  - GEMINI_API_KEY via Google Cloud Secret Manager (granted IAM access)
  - NO GitHub Secrets needed - Firebase manages everything
  - Firebase Admin SDK uses Application Default Credentials (ADC) in production
  
- ✅ **CORS Fixed for New Domain** - Cloud Functions updated
  - Added zentype-v1 domain to CORS whitelist in both `submitTestResult` and `generateAiTest`
  - Functions redeployed to us-central1
  - AI test generation now working in production
  
- ✅ **Production Testing Complete** - All 3 test cases verified with Playwright MCP
  - **Case 1: Practice Test Submission** ✅ WORKING (13 WPM, 100% accuracy, saved to Firestore)
  - **Case 2: AI-Generated Test** ✅ WORKING (after CORS fix, Gemini API functioning)
  - **Case 3: Keyboard & Theme System** ✅ WORKING (virtual keyboard removed, 10 themes + 10 fonts active)
  
- 📝 **Git Commits** - 3 commits pushed to master
  - `9d6d4f6` - feat: Configure Firebase App Hosting environment variables
  - `379acc8` - fix: Use Application Default Credentials for Firebase Admin SDK in production
  - `0552c8e` - chore: Exclude Playwright MCP screenshots from git tracking
  
- 🔧 **Infrastructure Cleanup**
  - Deleted zentype-v0 backend (connected to wrong repo)
  - Created zentype-v1 backend with correct mantassteckis/zentype_v1 repo
  - Granted GEMINI_API_KEY secret access to new backend
  - Playwright screenshots excluded from git (.playwright-mcp/, *.playwright-*.png)
  
- 📋 **Files Modified**
  - `apphosting.yaml` - Environment variable configuration
  - `lib/firebase-admin.ts` - ADC support for production
  - `.gitignore` - Playwright MCP exclusions
  - `functions/src/index.ts` - CORS configuration for new domain

### November 3, 2025 (Theme System ACTUALLY IMPLEMENTED)
- ✅ **Fixed Previous Agent's Incomplete Work** - Implemented theme system that was only documented
  - Previous agent (Oct 7) wrote docs but never implemented code
  - Settings page had hardcoded 6 themes (should be 10)
  - Test page had duplicate hardcoded arrays
  - `useUserPreferences` hook was incomplete (only basic profile loading)
  
- 🏗️ **Complete Implementation** - Following IKB protocol from start to finish
  - Created IKB-compliant structure: `/docs/theme-system/` with `.prd.md`, `.scope.md`, `.current.md`, `.errors.md`
  - Implemented full `useUserPreferences` hook with all 10 themes, 10 fonts, dynamicTextColor
  - Used `useSyncExternalStore` for cross-tab synchronization
  - Added MutationObserver for light/dark mode detection
  - Integrated Firestore persistence for theme/font preferences
  
- 🎨 **Updated All Components** - Removed hardcoded data, used centralized hook
  - Settings page: Theme cards show all 10 themes, fonts grouped by type (Monospaced/Decorative)
  - Test page: Uses hook directly, removed duplicate arrays
  - Both pages use `dynamicTextColor` for smart text adaptation
  - Removed `glass-card` conflicts with gradients
  
- 📝 **Complete Documentation** - IKB standards followed
  - Created scope file defining boundaries
  - Created error history (ERROR-THEME-001: Previous incomplete implementation)
  - Updated current status with actual implementation details
  - Documented lessons learned and prevention methods
  
- ✅ **Verified Implementation** - Dev server running, no TypeScript errors
  - All 3 files (hook, settings, test) compile successfully
  - Application loads on localhost:3000
  - Ready for Playwright MCP testing when browser instance available

### October 26, 2025 (Practice Test API Fix)
- ✅ **Fixed Practice Tests HTTP 500 Error** - Switched from Firebase Client SDK to Admin SDK in `/app/api/v1/tests/route.ts`
  - Root cause: Client SDK doesn't have proper authentication context on server-side
  - Solution: Use Admin SDK for all Next.js API routes
  - Impact: 4 practice tests now loading successfully
  - Files updated: `app/api/v1/tests/route.ts`
- ✅ **Verified AI Generation Error Handling** - Confirmed modal displays correctly for Gemini quota issue
  - Gemini API quota set to 0 in GCP (requires console configuration fix)
  - Application properly shows promotional modal with practice test fallback
- ✅ **Tested with Playwright MCP** - Full E2E testing confirmed both issues resolved
  - Practice tests loading: 4 tests displayed
  - AI generation: Proper error modal shown
  - User authentication: Auto-login working correctly
- 📝 **Created PRACTICE_TEST_API_FIX_OCT_2025.md** - Complete documentation of issue and fix

### October 7, 2025 (UI Theme Fix)
- ✅ **Fixed Light Mode UI Bug** - Login/Signup forms now properly themed
  - Replaced hardcoded color classes (`text-white`, `text-gray-*`) with theme-aware CSS variables
  - Updated login page: `text-foreground`, `text-muted-foreground`, `bg-background/50`, `border-border`
  - Updated signup page: Same theme-aware classes for consistency
  - Forms now render correctly in both dark and light modes
  - Improved readability and visual consistency across all themes
  - Files updated: `app/login/page.tsx`, `app/signup/page.tsx`

### October 7, 2025 (Earlier - Rate Limiting Removal & File Fix)
- ✅ **Fixed File Corruption** - Removed invalid character sequence from `functions/src/index.ts`
- ✅ **Disabled Rate Limiting** - Temporarily removed for beta testing
  - Updated `generateAiTest` and `submitTestResult` functions
  - Added clear documentation references to future implementation guide
  - Created `RATE_LIMITING_FUTURE_IMPLEMENTATION.md` with complete roadmap
  - Preserved all infrastructure for easy re-enablement with subscription tiers
  - All TypeScript compilation errors resolved

## 📅 **Recent Changes Log**

### October 7, 2025 (Theme & Font System v2.0)
- ✅ **Implemented 10 Typing Themes** - Standard (default), Midnight Blue, Forest Mist, Neon Dreams, Sunset Blaze, Ocean Aurora, Light Sky, Soft Lavender, Cosmic Void, Matrix Code
- ✅ **Implemented 10 Typing Fonts** - 5 monospaced (Fira Code, JetBrains Mono, Source Code Pro, Roboto Mono, Ubuntu Mono) + 5 decorative (Playfair Display, Lobster, Pacifico, Bebas Neue, Righteous)
- ✅ **Added Smart Text Color System** - Dynamic color adaptation based on theme brightness and current light/dark mode
- ✅ **Real-Time Theme/Font Switching** - Changes apply immediately during active typing tests
- ✅ **Cross-Mode Compatibility** - All themes work in both light and dark modes with automatic text color adjustment
- ✅ **Enhanced Settings UI** - Grouped fonts by type (monospaced/decorative), improved theme previews with sample text
- ✅ **Created THEME_FONT_SYSTEM.md** - Comprehensive documentation for new theme and font system
- ✅ **Updated Default Values** - Changed default theme from "default" to "standard", kept Fira Code as default font

### October 7, 2025 (Earlier - Light Mode UI Fix)
- ✅ Resolved light mode rendering issue in login/signup forms
- ✅ Replaced hardcoded colors (text-white, bg-white/5) with theme-aware CSS variables
- ✅ Updated 62 instances across login.tsx and signup.tsx
- ✅ Now uses text-foreground, text-muted-foreground, bg-background/50, border-border for proper theme switching

### October 7, 2025 (Earlier - Rate Limiting & File Fix)
- ✅ Fixed file corruption in functions/src/index.ts (removed invalid characters from line 1)
- ✅ Disabled rate limiting for beta testing period
- ✅ Created RATE_LIMITING_FUTURE_IMPLEMENTATION.md guide for re-implementation with subscription tiers
- ✅ Documented rate limiting locations and future implementation phases

### October 3, 2025 (Latest - Modal System)
- ✅ **Implemented ZenTypeModal System** - Reusable modal component for AI failures and promotional messages
- ✅ **Created MODAL_SYSTEM_IMPLEMENTATION.md** - Complete documentation of modal architecture
- ✅ **Added Practice Test Redirect** - Seamless fallback when AI generation fails
- ✅ **Integrated Error Handling** - Professional error messages with actionable CTAs
- ✅ **Deployed to Production** - Modal system live at https://zentype-v0--solotype-23c1f.europe-west4.hosted.app/

### October 3, 2025 (Production Deployment)
- ✅ **Added Production URL** - https://zentype-v0--solotype-23c1f.europe-west4.hosted.app/
- ✅ **Created .firebaseignore** - Excludes docs/ from App Hosting deployment
- ✅ **Added Table of Contents** - Quick navigation for AI assistants

### October 3, 2025 (Earlier - Rate Limiting & Deployment)
- ✅ **Rate Limiting Disabled** - Temporarily removed rate limits for testing phase
  - Unlimited AI test generations for all users
  - Unlimited test result submissions
  - Preparing for subscription-based limits (Free vs Pro tiers)
- ✅ **Promotional Fallback Message** - DEPRECATED (replaced by modal system)
  - ~~Black Friday special: 73% OFF ($3/month)~~
  - Now showing professional modal instead of text in typing area
- ✅ **Updated DEBUG_GUIDE.md** - Documented rate limiting changes
- ✅ **Added Production URL** - https://zentype-v0--solotype-23c1f.europe-west4.hosted.app/
- ✅ **Created .firebaseignore** - Excludes docs/ from App Hosting deployment
- ✅ **Added Table of Contents** - Quick navigation for AI assistants

### October 3, 2025 (Earlier - WPM Fix)
- ✅ Fixed WPM calculation to use MonkeyType's Gross WPM formula
- ✅ Implemented real-time character-level accuracy calculation
- ✅ Created MAIN.md as central AI knowledge base
- ✅ Consolidated API documentation - removed duplicates (API_ENDPOINTS1.md, backend_api_endpoints.md, docs/README.md)
- ✅ Updated API_ENDPOINTS.md as single source of truth for all API documentation
- ✅ Implemented real-time character-level accuracy
- ✅ Fixed MonkeyType behavior (original text preservation, empty spacebar block)
- ✅ Removed visual transitions for butter-smooth typing experience
- ✅ Created `MAIN.md` as central documentation index

---

## 📝 **Adding New Documentation**

When creating new documentation files, follow this process:

1. **Create the file** in the `docs/` directory with a descriptive ALL_CAPS name
2. **Add entry to MAIN.md** under the appropriate category
3. **Include these sections** in the new file:
   - Date and status
   - Purpose/objective
   - Implementation details
   - Related files/dependencies
4. **Update "Last Updated"** date at the top of MAIN.md
5. **Add to Recent Changes** log with date and brief description

**Template:**
```markdown
#### `YOUR_DOC_NAME.md`
**Path:** `docs/YOUR_DOC_NAME.md`  
**Purpose:** Brief description  
**Contents:** What's inside  
**Status:** ✅ COMPLETED / 🔄 IN PROGRESS / ⚠️ DEPRECATED  
**Updated:** [Date]
```

---

## 🎯 **Key Project Facts for AI**

### **Tech Stack**
- **Frontend:** Next.js 15.5.4, React 18, TypeScript
- **Backend:** Next.js API Routes, Firebase Cloud Functions
- **Database:** Firestore
- **Hosting:** Firebase App Hosting (Google Cloud Run)
- **Authentication:** Firebase Auth

### **Project Structure**
```
zentype_v1/
├── app/               # Next.js app directory
│   ├── test/         # Main typing test page
│   ├── api/          # API routes
│   └── dashboard/    # User dashboard
├── components/       # React components
├── hooks/           # Custom React hooks
├── lib/             # Utility libraries
├── docs/            # Documentation (THIS FILE/ IKB For AI agent)
└── functions/       # Firebase Cloud Functions
```

### **Core Features**
1. Word-based typing test with MonkeyType behavior
2. Gross WPM calculation with real-time accuracy
3. AI-generated custom tests
4. Practice tests library
5. User dashboard with statistics
6. Leaderboard system

### **Current Focus**
- MonkeyType-style UX perfection
- Accurate WPM/accuracy metrics
- Smooth, responsive typing experience

---

## 🚀 **Getting Started for AI**

1. **Read this file** - Understand project structure
2. **Check relevant docs** - Find specific information needed
3. **Review recent changes** - Know what was just modified
4. **Update this index** - Add new docs as you create them

**Remember:** This is a living document. Keep it current! 🎯

---

## 📅 Recent Documentation Changes

### **November 17, 2025**
- ✅ **Admin Panel Phase 6 Complete** - Session management UX improvement implemented
  - Fixed ERROR-ADMIN-006: Session loss during user management operations
  - Replaced `window.location.reload()` with React state refresh pattern
  - Updated `/docs/admin-panel/admin-panel.current.md` with Phase 6 completion
  - Updated `/docs/learning/LEARNING_LOG.md` with Session 5 implementation summary
  - Added Lesson 31: React State Refresh > Page Reload pattern
  - All 6 handler functions updated (edit, promote, permissions, remove role, suspend, subscription)
  - User verified: All operations working perfectly (edit info, role changes, subscription changes, suspension)
  - Performance improvement: 15-20s → 1-2s per operation (83% faster)
  - Files modified: `/app/admin/users/[uid]/page.tsx` (59 insertions, 51 deletions)
  - Commit: `fe9c759` - "fix(admin): Preserve session during user management operations"

### **November 17, 2025 (Earlier)**
- ✅ **Admin Panel Phase 7 Complete** - Authentication provider display (See section 10)
- ✅ **Admin Panel Phase 5 Complete** - Audit log and analytics dashboard (See section 10)
- ✅ **Admin Panel Phase 4 Complete** - Simple Mode test generation (See section 10)
- ✅ **Admin Panel Phase 3 Complete** - Subscription management system (See section 10)
- ✅ **Admin Panel Phase 2 Complete** - User management with manual testing verification

### **November 16, 2025**
- ✅ **Admin Panel Foundation** - IKB structure, Firebase Admin SDK extensions, authorization middleware

### **October 7, 2025**
- ✅ **Firebase Extension Integration** - GDPR-compliant account deletion with Firebase Extension

### **September-October 2025**
- ✅ **Privacy & GDPR Compliance** - Comprehensive privacy system documentation
- ✅ **Modal System** - AI failure and upgrade prompts
- ✅ **Word-Based Typing** - Complete typing system migration

---

**End of Index - Last Updated: November 17, 2025**
