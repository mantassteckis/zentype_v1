# ZenType Documentation Index - AI Knowledge Base

**Last Updated:** October 7, 2025 (Security Audit Report)
**Purpose:** Central index for all project documentation - use this as entry point for AI assistance
**Production URL:** https://zentype-v0--solotype-23c1f.europe-west4.hosted.app/

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
- [8. Agent Logs](#8-agent-logs)
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
- `MULTI_REPO_ARCHITECTURE_ANALYSIS.md` - **NEW** - Parallel development readiness assessment
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
- `MODAL_SYSTEM_IMPLEMENTATION.md` - **NEW** - Modal system for AI failures and promotions
- `MODAL_SYSTEM_DEPLOYMENT_SUMMARY.md` - **NEW** - Final deployment summary and checklist

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
- `VERCEL_LOG_DRAIN_SETUP.md` - Vercel logging config
- `CORS_FIX_SUMMARY.md` - CORS configuration

### **Security & Compliance**
- `SECURITY_AUDIT_REPORT.md` - **NEW** - Comprehensive security vulnerability assessment
- `SECURITY_REMEDIATION_PLAN.md` - **NEW** - Step-by-step fix implementation guide

---

## 📚 **Complete Documentation List**

### **1. Architecture & Design**

#### `MULTI_REPO_ARCHITECTURE_ANALYSIS.md` **NEW**
**Path:** `docs/MULTI_REPO_ARCHITECTURE_ANALYSIS.md`
**Purpose:** Comprehensive analysis of architecture for multi-repository/parallel development readiness
**Contents:**
- Executive summary with 3 critical blocking issues
- Detailed analysis of monolithic components (2,095-line test page)
- Tightly coupled context providers assessment
- Firebase abstraction layer gaps
- Proposed monorepo structure with clear boundaries
- 9-week migration roadmap (5 phases)
- Risk assessment and success metrics
**Status:** 🔴 NOT READY for parallel development - refactoring required
**Key Findings:**
- Current architecture blocks parallel work on separate features
- Merge conflicts guaranteed in test page, contexts, and type definitions
- Recommendation: Monorepo with workspaces (not multi-repo split)
- Packages: `shared-types`, `ui-components`, `firebase-client`, `auth-system`, `theme-system`, `typing-engine`, `debug-system`
**Updated:** October 7, 2025

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

#### `THEME_FONT_SYSTEM.md` **NEW**
**Path:** `docs/THEME_FONT_SYSTEM.md`  
**Purpose:** Complete theme and font customization system  
**Contents:** 10 typing themes (standard, vibrant, light, complex), 10 fonts (5 monospaced + 5 decorative), real-time switching, smart text color adaptation  
**Status:** ✅ COMPLETED - Production Ready  
**Updated:** October 7, 2025

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

#### `VERCEL_LOG_DRAIN_SETUP.md`
**Path:** `docs/VERCEL_LOG_DRAIN_SETUP.md`  
**Purpose:** Vercel log drainage configuration  
**Contents:** Log export setup, external logging services integration  
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

#### `MODAL_SYSTEM_DEPLOYMENT_SUMMARY.md` **NEW**
**Path:** `docs/MODAL_SYSTEM_DEPLOYMENT_SUMMARY.md`  
**Purpose:** Final deployment summary and production readiness checklist  
**Contents:** Git status, deployment instructions, testing verification results, success metrics, troubleshooting guide  
**Status:** ✅ READY FOR DEPLOYMENT  
**Updated:** October 3, 2025

---

### **6. Bug Fixes & Issues**

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

### **8. Agent Logs**

#### `AGENT_LOG.md`
**Path:** `docs/AGENT_LOG.md`
**Purpose:** AI agent conversation log
**Contents:** Historical log of AI assistant interactions and changes
**Updated:** October 3, 2025

---

### **9. Security & Compliance**

#### `SECURITY_AUDIT_REPORT.md` **NEW**
**Path:** `docs/SECURITY_AUDIT_REPORT.md`
**Purpose:** Comprehensive security and vulnerability assessment
**Contents:** 19 identified vulnerabilities (3 Critical, 8 High, 8 Medium), detailed remediation logic, implementation roadmap, security hardening checklist
**Status:** 🔴 CRITICAL ISSUES IDENTIFIED - Production Blocker
**Updated:** October 7, 2025

**Key Findings:**
- **CRITICAL**: Open Firestore rules allowing unrestricted data access
- **CRITICAL**: Authentication bypass via test fallback mechanism
- **CRITICAL**: Hardcoded Firebase API keys in source files
- **HIGH**: Missing authentication on admin endpoints
- **HIGH**: Manual JWT parsing without signature verification
- **Deployment Status**: NOT PRODUCTION READY - Phase 1 fixes required (5 hours)

#### `SECURITY_REMEDIATION_PLAN.md` **NEW**
**Path:** `docs/SECURITY_REMEDIATION_PLAN.md`
**Purpose:** Step-by-step implementation guide for security fixes
**Contents:** Phased remediation plan with code examples, testing procedures, deployment steps, rollback procedures
**Status:** 🔵 ACTIVE - Ready for Phase 1 implementation
**Updated:** October 7, 2025

**Phase Breakdown:**
- **Phase 1 (CRITICAL)**: 6 fixes, 5 hours - Firestore rules, auth bypass, hardcoded keys, admin auth, JWT verification, profile auth
- **Phase 2 (HIGH)**: 5 fixes, 12 hours - Rate limiting, input validation, error sanitization, logging, SDK migration
- **Phase 3 (MEDIUM)**: 8 fixes, 12 hours - Environment config, unified rate limiting, XSS protection, dependencies, privacy enhancements

**Includes:**
- Complete code implementation steps for each fix
- Testing scripts and validation checklists
- Deployment procedures with rollback plans
- IKB documentation references for context

---

## 🔄 **Recent Changes Log**

### October 7, 2025 (Latest - Security Remediation Plan)
- 🔵 **ACTIVE: Security Remediation Plan Created** - Detailed fix implementation guide
  - Created `SECURITY_REMEDIATION_PLAN.md` with step-by-step instructions for all 19 security fixes
  - **Phase 1 (5 hours)**: 6 critical fixes with complete code examples and testing procedures
    - Fix 1.1: Firestore security rules (30 min) - Granular collection-level permissions
    - Fix 1.2: Remove auth bypass (15 min) - Eliminate test-user-fallback
    - Fix 1.3: Remove hardcoded keys (20 min) - Environment-only configuration
    - Fix 1.4: Admin authentication (2 hours) - Middleware + custom claims
    - Fix 1.5: JWT verification (1 hour) - Remove manual parsing, use Admin SDK
    - Fix 1.6: Profile authentication (1 hour) - Token-based user validation
  - Created implementation artifacts:
    - `lib/admin-auth.ts` - Admin authentication middleware
    - `scripts/set-admin.js` - Admin claim management
    - `scripts/test-firestore-rules.js` - Security rules testing
    - `scripts/audit-api-auth.sh` - Authentication audit tool
    - `scripts/test-authentication.sh` - E2E auth testing
  - Deployment procedures with rollback plans
  - Integration with IKB: References to DEPLOYMENT_GUIDE.md, FIRESTORE_SCHEMA.md, J.chatmode.md
  - **NEXT STEP**: Begin Phase 1 implementation (~5 hours to production-ready state)

### October 7, 2025 (Earlier - Security Audit)
- 🔴 **CRITICAL: Security Audit Completed** - Comprehensive vulnerability assessment
  - Created `SECURITY_AUDIT_REPORT.md` with 19 findings (3 Critical, 8 High, 8 Medium)
  - Identified production blockers: Open Firestore rules, auth bypass, hardcoded keys
  - Documented admin endpoint security gaps and JWT verification issues
  - Provided phased remediation roadmap (Phase 1: 5 hours, Phase 2: 12 hours, Phase 3: 12 hours)
  - **STATUS**: Application NOT PRODUCTION READY until Phase 1 critical fixes deployed
  - Rate limiting findings contextualized with RATE_LIMITING_FUTURE_IMPLEMENTATION.md
  - Security hardening checklist created for pre-deployment validation

### October 7, 2025 (Earlier - Multi-Repo Architecture Analysis)
- ✅ **Created MULTI_REPO_ARCHITECTURE_ANALYSIS.md** - Comprehensive architecture audit for parallel development
  - Identified 3 critical blocking issues preventing multi-agent work
  - Analyzed 2,095-line monolithic test page component
  - Documented tightly coupled context providers (AuthProvider, DebugProvider, ThemeProvider)
  - Assessed Firebase abstraction layer gaps (15+ files with direct Firestore access)
  - Proposed monorepo structure with 7 packages + 2 apps
  - Created 9-week migration roadmap with 5 phases
  - Risk assessment: Current state 🔴 NOT READY for parallel development
  - Recommendation: Refactor to monorepo with clear boundaries (not multi-repo split)
  - Success metrics: From 0 → 3+ features developed in parallel, <10% merge conflicts

### October 7, 2025 (Earlier - UI Theme Fix)
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
- **Hosting:** Vercel
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

**End of Index - Last Updated: October 7, 2025**
