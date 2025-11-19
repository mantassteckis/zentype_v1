# Performance Optimization - Scope Definition

**Feature:** Next.js Application Performance Optimization  
**Version:** 1.0  
**Status:** 📝 PLANNING PHASE  
**Created:** November 19, 2025  
**Last Updated:** November 19, 2025  

---

## ⚠️ CRITICAL: 99% Certainty Rule Enforcement

Before ANY change, you MUST:
1. ✅ Read this scope file completely
2. ✅ Verify file is IN SCOPE (listed below)
3. ✅ Check PROTECTED AREAS (do not touch)
4. ✅ Review INTERCONNECTED FEATURES
5. ✅ Test locally before committing

**If <99% certain change is safe → STOP and ask user**

---

## ✅ IN SCOPE - Safe to Modify

### Phase 1: Safe Cleanup & Analysis

#### Files to DELETE (User Requested)
```
app/admin/analytics/page.tsx          ❌ DELETE - 474 lines (unused feature)
app/api/v1/admin/analytics/route.ts   ❌ DELETE - 285 lines (unused API)
```
**Reasoning:** User explicitly stated this feature is unused and overlaps with existing admin panel.

**Verification Required:**
- [ ] Check if analytics is linked in admin navigation
- [ ] Check if any other components import these files
- [ ] Search for "admin/analytics" in all docs
- [ ] Remove references from routing

**Commands to Verify:**
```bash
# Find references
grep -r "admin/analytics" app/ components/ --exclude-dir=node_modules
grep -r "AdminAnalytics\|AnalyticsData" app/ components/ --exclude-dir=node_modules

# Find navigation links
grep -r "/admin/analytics" app/admin --exclude-dir=node_modules
```

#### Files to CREATE
```
.lighthouserc.js                      ✅ CREATE - Performance budgets
docs/optimization/optimization.prd.md ✅ CREATED
docs/optimization/optimization.scope.md ✅ CREATING
docs/optimization/optimization.current.md ✅ CREATE
docs/optimization/optimization.errors.md ✅ CREATE
docs/optimization/BUNDLE_ANALYSIS.md  ✅ CREATE (after Phase 1)
docs/optimization/DEPENDENCY_AUDIT.md ✅ CREATE (after Phase 1)
```

#### Files to MODIFY (Configuration)
```
next.config.mjs                       ⚠️ MODIFY CAREFULLY
  - Add bundle analyzer plugin
  - DO NOT touch: eslint ignore, typescript ignore (Phase 6 only)
  - DO NOT touch: images.unoptimized (Phase 3 only)

package.json                          ⚠️ MODIFY CAREFULLY
  - Add: @next/bundle-analyzer (devDependency)
  - Add: bundle analysis scripts
  - Remove: confirmed unused dependencies (Phase 5 only)

.gitignore                            ✅ SAFE to modify
  - Add: /.next/analyze/
  - Add: /docs/optimization/*.report.html
```

---

### Phase 2: Code Splitting & Lazy Loading

#### Files to MODIFY (Add dynamic imports)
```
app/admin/dashboard/page.tsx          ⚠️ HIGH RISK - Admin dashboard entry
app/admin/users/page.tsx              ⚠️ HIGH RISK - User management
app/admin/users/[uid]/page.tsx        ⚠️ HIGH RISK - User detail page
app/admin/subscriptions/page.tsx      ⚠️ HIGH RISK - Subscription management
app/admin/audit-log/page.tsx          ⚠️ MEDIUM RISK - Audit log viewer
app/admin/performance/page.tsx        ⚠️ MEDIUM RISK - Performance dashboard

components/debug/EnhancedDebugPanel.tsx ⚠️ MEDIUM RISK - Debug overlay
components/ui/zentype-modal.tsx       ⚠️ LOW RISK - Modal component

app/dashboard/page.tsx                ⚠️ HIGH RISK - User dashboard (CRITICAL PATH)
```

**Pattern to Apply:**
```tsx
// BEFORE:
import AdminDashboard from '@/components/admin/AdminDashboard';

// AFTER:
import dynamic from 'next/dynamic';

const AdminDashboard = dynamic(() => import('@/components/admin/AdminDashboard'), {
  loading: () => <div className="flex items-center justify-center h-screen">
    <Spinner />
  </div>,
  ssr: true  // Keep SSR for admin (authenticated)
});
```

**Critical Rules:**
- ✅ Always provide loading component
- ✅ Keep `ssr: true` for authenticated pages
- ✅ Use `ssr: false` only for debug panel, modals
- ❌ Do NOT lazy load critical path components (test page, auth)

---

### Phase 3: Image Optimization

#### Files to ANALYZE FIRST
```
public/                               📸 AUDIT all images
app/**/*.tsx                          🔍 FIND all <img> tags
components/**/*.tsx                   🔍 FIND all <img> tags
```

**Analysis Commands:**
```bash
# Find all images
find public/ -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.webp" -o -name "*.svg" \)

# Find all <img> tags (should be zero)
grep -r "<img" app/ components/ --exclude-dir=node_modules

# Find all Image imports
grep -r "from 'next/image'" app/ components/ --exclude-dir=node_modules
```

#### Files to MODIFY (Only if analysis shows it's safe)
```
next.config.mjs                       ⚠️ EXTREME CAUTION
  - images.unoptimized: true → false
  - ONLY after thorough testing
  - REQUIRES user approval
```

**Decision Tree:**
```
Are there any images in the app?
├─ YES → Audit each image
│   ├─ Are all using next/image? 
│   │   ├─ YES → Consider enabling optimization
│   │   └─ NO → Convert to next/image first
│   └─ Test on localhost, then staging
└─ NO → Skip Phase 3 entirely
```

---

### Phase 4: Font Optimization

#### Files to MODIFY
```
app/layout.tsx                        ⚠️ MEDIUM RISK - Root layout
  - Add display: 'swap' to all fonts
  - Consider lazy loading decorative fonts
```

**Before:**
```tsx
const firaCode = Fira_Code({ 
  subsets: ["latin"], 
  variable: "--font-fira-code" 
});
```

**After:**
```tsx
const firaCode = Fira_Code({ 
  subsets: ["latin"], 
  variable: "--font-fira-code",
  display: 'swap'  // Prevent FOIT
});
```

**CAUTION:**
- ✅ Test font switching in settings still works
- ✅ Verify no FOIT/FOUT visible
- ✅ Check all themes display correctly

---

### Phase 5: Dependency Cleanup

#### Files to MODIFY
```
package.json                          ⚠️ MODIFY CAREFULLY
pnpm-lock.yaml                        🔄 AUTO-UPDATED by pnpm
```

**Confirmed Removals:**
```bash
pnpm remove @vercel/analytics  # Already documented as unused
```

**Requires Audit:**
```bash
# Check each @radix-ui package usage
# use-sound usage check
# Any other suspicious packages
```

**Commands:**
```bash
# List all dependencies
pnpm ls --depth=0

# Check if package is imported
grep -r "@vercel/analytics" app/ components/ lib/ hooks/
grep -r "use-sound" app/ components/ lib/ hooks/

# Remove unused package
pnpm remove <package-name>
```

---

### Phase 6: Build Configuration Hardening

#### Files to MODIFY
```
next.config.mjs                       ⚠️ EXTREME CAUTION
  - eslint.ignoreDuringBuilds: false (after fixing errors)
  - typescript.ignoreBuildErrors: false (after fixing errors)
```

**STRICT PROCESS:**
1. ✅ Document all current errors first
2. ✅ Create error fixing plan
3. ✅ Fix errors in separate PRs
4. ✅ Only then enable strict checks
5. ⚠️ DO NOT enable without fixing errors

---

### Phase 7: Production Optimizations

#### Files to MODIFY
```
next.config.mjs                       ⚠️ MODIFY CAREFULLY
  - Add compress: true
  - Add headers() function for caching
  - Add experimental.reactCompiler (optional)
```

**Safe Additions:**
```javascript
module.exports = {
  // Existing config...
  compress: true,  // ✅ SAFE - Enable gzip
  
  async headers() {
    return [
      {
        source: '/fonts/:path*',
        headers: [{
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        }],
      },
    ];
  },
};
```

---

### Phase 8: Monitoring

#### Files to CREATE
```
.lighthouserc.js                      ✅ CREATE
docs/optimization/PERFORMANCE_BENCHMARKS.md ✅ CREATE
docs/optimization/LIGHTHOUSE_REPORTS.md ✅ CREATE
```

**No Risk** - Only observability, no code changes.

---

## 🚫 PROTECTED AREAS - DO NOT TOUCH

### 🎨 FRONTEND DESIGN SYSTEM (ABSOLUTE PRESERVATION)

#### Theme Colors & Design Tokens
```
❌ DO NOT MODIFY ANY VISUAL STYLES:
app/globals.css                       # Theme color variables, CSS custom properties
components/theme-provider.tsx         # Dark/light mode system
hooks/useUserPreferences.ts           # Theme state management (10 themes)

PROTECTED CSS VARIABLES (DO NOT CHANGE):
--background, --foreground
--card, --card-foreground
--popover, --popover-foreground
--primary, --primary-foreground
--secondary, --secondary-foreground
--muted, --muted-foreground
--accent, --accent-foreground
--destructive, --destructive-foreground
--border, --input, --ring
--chart-1 through --chart-5
--radius (border radius system)

PROTECTED THEME CLASSES (DO NOT CHANGE):
.theme-standard, .theme-midnight-blue, .theme-forest-mist
.theme-neon-dreams, .theme-sunset-blaze, .theme-ocean-aurora
.theme-light-sky, .theme-soft-lavender, .theme-cosmic-void
.theme-matrix-code
```
**Why:** Users customize their experience with 10 themes. Breaking theme colors = breaking user preferences and visual identity.

**Testing Required If You Touch Near Themes:**
- [ ] All 10 themes display correctly
- [ ] Light/dark mode toggle works
- [ ] Theme switching in settings persists
- [ ] No color bleeding between themes
- [ ] Text remains readable in all themes

---

#### Typography & Font System
```
❌ DO NOT MODIFY FONT LOADING LOGIC:
app/layout.tsx                        # Font imports (10 fonts)
hooks/useUserPreferences.ts           # Font preferences state

PROTECTED FONTS (DO NOT REMOVE):
Monospaced:
- Fira_Code (default)
- JetBrains_Mono
- Source_Code_Pro
- Roboto_Mono
- Ubuntu_Mono

Decorative:
- Playfair_Display
- Lobster
- Pacifico
- Bebas_Neue
- Righteous

PROTECTED CSS VARIABLES:
--font-fira-code, --font-jetbrains-mono, --font-source-code-pro
--font-roboto-mono, --font-ubuntu-mono, --font-playfair-display
--font-lobster, --font-pacifico, --font-bebas-neue, --font-righteous
```
**Why:** 10 fonts are user-selectable preferences. Removing or breaking any font = breaking user choice.

**Optimization Rules for Fonts:**
- ✅ CAN add `display: 'swap'` to prevent FOIT
- ✅ CAN lazy load decorative fonts (Playfair, Lobster, Pacifico, Bebas, Righteous)
- ❌ CANNOT remove any of the 10 fonts
- ❌ CANNOT change font variable names
- ❌ CANNOT break font switching in settings

---

#### UI Components & Design Patterns
```
❌ DO NOT MODIFY COMPONENT VISUAL DESIGN:
components/ui/**                      # Shadcn/ui components (button, card, input, etc.)
  - button.tsx                        # Button variants and styles
  - card.tsx                          # Card component styling
  - input.tsx                         # Input field styling
  - select.tsx                        # Select dropdown styling
  - dialog.tsx                        # Modal/dialog styling
  - dropdown-menu.tsx                 # Dropdown menu styling
  - tabs.tsx                          # Tab component styling
  - badge.tsx                         # Badge component styling
  - toast.tsx                         # Toast notification styling
  - skeleton.tsx                      # Loading skeleton styling

PROTECTED TAILWIND PATTERNS:
- Glass morphism: bg-background/50, backdrop-blur-xl
- Gradients: from-theme-primary to-theme-secondary
- Shadows: shadow-sm, shadow-md, shadow-lg, shadow-xl
- Borders: border-border, border-2, rounded-lg
- Animations: animate-pulse, animate-spin, transition-all
- Hover states: hover:bg-accent, hover:text-accent-foreground
```
**Why:** Consistent UI/UX across entire app. Breaking component styles = inconsistent user experience.

**Optimization Rules for UI Components:**
- ✅ CAN add lazy loading (dynamic imports)
- ✅ CAN add loading states (Skeleton)
- ❌ CANNOT change button/card/input visual styles
- ❌ CANNOT modify Tailwind utility classes
- ❌ CANNOT change hover/focus/active states

---

#### Layout & Spacing System
```
❌ DO NOT MODIFY LAYOUT STRUCTURE:
app/layout.tsx                        # Root layout (header, main, footer)
components/header.tsx                 # Navigation header
components/ui/container.tsx           # Container width/padding

PROTECTED SPACING SYSTEM:
Padding: p-2, p-4, p-6, p-8, p-12, p-16, p-24
Margin: m-2, m-4, m-6, m-8, m-12, m-16, m-24
Gap: gap-2, gap-4, gap-6, gap-8, gap-12
Width: w-full, max-w-7xl, max-w-4xl
Height: h-screen, min-h-screen

PROTECTED LAYOUT PATTERNS:
- Container max-width: max-w-7xl
- Section padding: py-12, py-16, py-24
- Card padding: p-6, p-8
- Input padding: px-3, py-2
- Button padding: px-4, py-2
```
**Why:** Consistent spacing creates visual harmony. Breaking spacing = unprofessional look.

---

#### Animations & Transitions
```
❌ DO NOT MODIFY ANIMATION TIMING:
globals.css                           # Transition timing functions
components/ui/**                      # Component animations

PROTECTED ANIMATIONS:
- Fade in: opacity-0 → opacity-100
- Slide in: translate-y-2 → translate-y-0
- Scale: scale-95 → scale-100
- Rotate: rotate-0 → rotate-180
- Timing: transition-all duration-200 ease-in-out
```
**Why:** Smooth animations are part of UX. Removing transitions = janky user experience.

**Note:** In Phase 2 (Code Splitting), you removed some transitions for typing test. That was specific to typing performance. DO NOT remove transitions elsewhere.

---

### CRITICAL FUNCTIONALITY (User-Facing)

#### Authentication System
```
❌ DO NOT MODIFY:
lib/firebase/client.ts                # Firebase client config
lib/firebase-admin.ts                 # Firebase Admin SDK
context/AuthProvider.tsx              # Auth context
app/login/page.tsx                    # Login page
app/signup/page.tsx                   # Signup page
hooks/useAdminAuth.ts                 # Admin auth hook
```
**Why:** Any change could break user login/signup (critical path)

#### Typing Test (HIGHEST PRIORITY - Main Feature)
```
❌ DO NOT MODIFY:
app/test/page.tsx                     # Main typing test
hooks/useTypingEngine.ts              # Core typing logic
hooks/useKeyboardSound.ts             # Keyboard sounds
components/dashboard/TypingTest.tsx   # Typing UI
```
**Why:** This is the core feature. ANY change must be tested extensively.

#### Database & API Routes
```
❌ DO NOT MODIFY (without extreme caution):
app/api/**/*.ts                       # All API routes
lib/centralized-logger.ts             # Logging system
lib/firebase/firestore.ts             # Firestore helpers
functions/src/**                      # Cloud Functions

PROTECTED API ENDPOINTS:
/api/v1/tests                         # Practice tests (GET)
/api/v1/ai-tests                      # AI test generation (POST)
/api/v1/test-results                  # Submit test results (POST)
/api/v1/user/export-data              # GDPR data export (GET)
/api/v1/user/delete-account           # GDPR account deletion (POST)
/api/v1/user/consents                 # Cookie consent (GET/POST)
/api/v1/admin/**                      # All admin APIs

PROTECTED BACKEND LOGIC:
- Firebase Admin SDK initialization
- Firestore query logic
- Authentication middleware
- Rate limiting (currently disabled for beta)
- CORS configuration
- Error handling patterns
- Logging integration
```
**Why:** Could break data persistence, logging, backend functionality.

**Optimization Rules for Backend:**
- ✅ CAN add performance monitoring
- ✅ CAN optimize query patterns (carefully)
- ❌ CANNOT change API response structure
- ❌ CANNOT modify authentication logic
- ❌ CANNOT break GDPR compliance
- ❌ CANNOT remove logging

---

### 🔒 SECURITY (DOUBLE PROTECTION)

#### Authentication & Authorization
```
❌ ABSOLUTE NO-TOUCH ZONE (SECURITY CRITICAL):
lib/firebase/client.ts                # Firebase client config
lib/firebase-admin.ts                 # Firebase Admin SDK
context/AuthProvider.tsx              # Auth context provider
hooks/useAuth.ts                      # Auth state hook
hooks/useAdminAuth.ts                 # Admin auth hook
lib/admin-middleware.ts               # Admin authorization

PROTECTED SECURITY PATTERNS:
1. Firebase Admin SDK Service Account (NEVER expose to client)
2. Environment variables (NEVER log or expose)
3. Custom claims verification (admin, superAdmin, canDeleteUsers)
4. Session management (Firebase auth tokens)
5. CORS whitelist (zentype-v1 domain)
6. API key rotation (Gemini API key in Secret Manager)

CRITICAL SECURITY RULES:
- ❌ NEVER move server-side code to client
- ❌ NEVER expose Firebase Admin credentials
- ❌ NEVER log sensitive data (passwords, tokens, API keys)
- ❌ NEVER disable authentication checks
- ❌ NEVER weaken CORS restrictions
- ❌ NEVER expose user data without authorization
```

#### Data Privacy & GDPR Compliance
```
❌ ABSOLUTE NO-TOUCH ZONE (LEGAL COMPLIANCE):
app/api/v1/user/export-data/route.ts  # GDPR Article 15 (Right to Access)
app/api/v1/user/delete-account/route.ts # GDPR Article 17 (Right to Erasure)
app/api/v1/user/consents/route.ts     # Cookie consent storage
components/privacy/**                 # Privacy components
app/privacy-policy/page.tsx           # Privacy policy page
app/terms-of-service/page.tsx         # Terms of service page

Firebase Extension: delete-user-data-gdpr (v0.1.25)
Location: europe-west1 (EU compliance)
Paths: users/{UID}, testResults/{UID}, aiTests/{UID}

PROTECTED PRIVACY FEATURES:
- Data export (all user data in JSON)
- Data sanitization (mask UIDs, IPs, correlation IDs)
- Account deletion (complete data removal)
- Cookie consent (granular choices)
- Re-authentication before deletion
- Multi-provider support (email, Google OAuth)

CRITICAL PRIVACY RULES:
- ❌ NEVER break data export functionality
- ❌ NEVER skip re-authentication before deletion
- ❌ NEVER expose unsanitized user data
- ❌ NEVER disable cookie consent
- ❌ NEVER remove GDPR-required features
- ❌ NEVER store data outside EU (europe-west1 only)
```

#### Input Validation & Sanitization
```
❌ DO NOT WEAKEN VALIDATION:
All API routes with input validation
Form validation (login, signup, settings)
TypeScript type checking
Zod schemas (if implemented)

PROTECTED VALIDATION PATTERNS:
- Email format validation
- Password strength requirements
- Input length limits
- SQL injection prevention (Firestore = NoSQL, but still careful)
- XSS prevention (React escapes by default, keep it)
- CSRF protection (Firebase handles this)

CRITICAL VALIDATION RULES:
- ❌ NEVER accept unvalidated user input
- ❌ NEVER disable TypeScript strict mode
- ❌ NEVER trust client-side data on server
- ❌ NEVER skip sanitization before database writes
- ❌ NEVER allow arbitrary file uploads without validation
```

#### Rate Limiting & Abuse Prevention
```
⚠️ CURRENTLY DISABLED (Beta Testing):
lib/firebase-functions-rate-limiter.ts # Rate limiter (disabled)
functions/src/index.ts                 # Rate limit checks (commented out)

WHEN RE-ENABLING (Future):
- Free tier: 5 AI tests per day
- Premium tier: Unlimited AI tests
- Practice tests: Unlimited (always)
- Login attempts: Max 5 per 15 minutes
- API calls: Rate limits per endpoint

CRITICAL RATE LIMITING RULES:
- ❌ NEVER remove rate limiting infrastructure
- ❌ NEVER allow unlimited API calls in production
- ⚠️ Currently disabled for beta = acceptable
- ✅ Document re-enablement plan in RATE_LIMITING_FUTURE_IMPLEMENTATION.md
```

#### Secrets Management
```
❌ ABSOLUTE NO-TOUCH ZONE (CREDENTIAL SECURITY):
.env.local (local development, gitignored)
apphosting.yaml (Firebase App Hosting config)
Google Cloud Secret Manager (production secrets)

PROTECTED SECRETS:
- GEMINI_API_KEY (Google Cloud Secret Manager)
- Firebase service account JSON (server-only)
- Firebase config (public, but still careful)
- API endpoints (documented, not secret, but protected)

CRITICAL SECRETS RULES:
- ❌ NEVER commit secrets to git
- ❌ NEVER log secrets (even masked)
- ❌ NEVER expose secrets to client-side code
- ❌ NEVER use hardcoded credentials
- ❌ NEVER share secrets in documentation
- ✅ ALWAYS use environment variables
- ✅ ALWAYS use Secret Manager for production
```

#### Security Headers & Configuration
```
⚠️ VERIFY BUT DON'T BREAK:
next.config.mjs                       # Security headers (if configured)
Firebase App Hosting configuration
CORS configuration in Cloud Functions

PROTECTED SECURITY HEADERS (if present):
- Content-Security-Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy

CRITICAL SECURITY CONFIG RULES:
- ❌ NEVER weaken security headers
- ❌ NEVER allow unsafe-inline in CSP
- ❌ NEVER expose sensitive headers
- ✅ CAN add stricter security headers
- ✅ CAN improve CORS configuration
```

#### User Data & GDPR
```
❌ DO NOT MODIFY:
app/api/v1/user/export-data/route.ts  # Data export (GDPR)
app/api/v1/user/delete-account/route.ts # Account deletion (GDPR)
app/api/v1/user/consents/route.ts     # Cookie consent (GDPR)
components/privacy/**                 # Privacy components
```
**Why:** Legal compliance, user rights. Breaking these = GDPR violations.

#### Admin Panel Core Features (Keep Working)
```
⚠️ MODIFY WITH EXTREME CAUTION:
app/admin/users/[uid]/page.tsx        # User management (critical)
app/admin/subscriptions/page.tsx      # Subscription management
app/api/v1/admin/users/**             # Admin user APIs
lib/admin-middleware.ts               # Admin authorization
```
**Why:** Admin needs these to manage users and subscriptions.

---

## 🔗 INTERCONNECTED FEATURES

### If You Modify Admin Pages:
```
AFFECTS:
- lib/admin-middleware.ts             # Authorization checks
- hooks/useAdminAuth.ts               # Admin authentication
- All /app/api/v1/admin/** routes     # Admin APIs
- docs/admin-panel/*.md               # Admin panel docs
```

**Verification Required:**
- [ ] Admin login still works
- [ ] Admin can view users
- [ ] Admin can modify subscriptions
- [ ] Audit logging still works
- [ ] No session refresh issues (Lesson 31)

### If You Modify Font System:
```
AFFECTS:
- app/layout.tsx                      # Font loading
- hooks/useUserPreferences.ts         # Font preferences
- app/settings/page.tsx               # Settings UI
- All typing tests                    # Font display
```

**Verification Required:**
- [ ] Font switching works in settings
- [ ] Selected font persists across sessions
- [ ] All 10 fonts display correctly
- [ ] No FOIT/FOUT visible

### If You Modify Theme System:
```
AFFECTS:
- hooks/useUserPreferences.ts         # Theme preferences
- app/settings/page.tsx               # Settings UI
- app/test/page.tsx                   # Test page themes
- All components                      # Global theme
```

**Verification Required:**
- [ ] Theme switching works
- [ ] Light/dark mode toggle works
- [ ] All 10 themes display correctly
- [ ] Dynamic text color adapts

---

## 🔍 FILES TO REFERENCE (Read-Only)

### Existing Documentation
```
docs/MAIN.md                          # Project overview
docs/admin-panel/admin-panel.prd.md   # Admin panel requirements
docs/admin-panel/admin-panel.scope.md # Admin panel scope
docs/admin-panel/admin-panel.current.md # Admin panel status
docs/theme-system/theme-system.prd.md # Theme system requirements
docs/FIRESTORE_SCHEMA.md              # Database schema
docs/API_ENDPOINTS.md                 # API reference
docs/DEPLOYMENT_GUIDE.md              # Deployment process
```

### Code References
```
hooks/useUserPreferences.ts           # User preferences hook
lib/centralized-logger.ts             # Logging patterns
lib/firebase-admin.ts                 # Firebase Admin patterns
components/ui/**                      # UI component patterns
```

---

## 🎯 HIGH RISK ZONES

### 1. Root Layout Modifications
```
File: app/layout.tsx
Risk: 🔴 EXTREME
Why: Any error here breaks entire app
```
**Safety Checklist:**
- [ ] Backup file before modifying
- [ ] Test font display: 'swap' doesn't break fonts
- [ ] Verify all 10 fonts still load
- [ ] Check dev server starts successfully
- [ ] Test build: `pnpm build`

### 2. Next.js Configuration
```
File: next.config.mjs
Risk: 🔴 EXTREME
Why: Wrong config = build failure or runtime errors
```
**Safety Checklist:**
- [ ] Test each config change individually
- [ ] Run `pnpm build` after each change
- [ ] Test production mode: `pnpm start`
- [ ] Verify all routes still work

### 3. Dynamic Imports in Admin Panel
```
Files: app/admin/*/page.tsx
Risk: 🟡 MEDIUM
Why: Could cause hydration errors, session loss
```
**Safety Checklist:**
- [ ] Always include loading component
- [ ] Keep `ssr: true` for authenticated routes
- [ ] Test admin login flow completely
- [ ] Verify no "window is not defined" errors
- [ ] Check for hydration mismatches in console

### 4. Package.json Changes
```
File: package.json
Risk: 🟡 MEDIUM
Why: Removing wrong dependency breaks features
```
**Safety Checklist:**
- [ ] Verify package is truly unused (grep search)
- [ ] Run `pnpm install` after changes
- [ ] Run `pnpm build` to verify build works
- [ ] Test all features manually

---

## 🧪 TESTING REQUIREMENTS

### Before Each Phase:
```bash
# 1. Git safety
git status  # Ensure clean working tree
git checkout -b optimization/phase-X

# 2. Baseline test
pnpm dev  # Verify app starts
# Open http://localhost:3000
# Test login/signup
# Test typing test
# Test admin panel

# 3. Bundle analysis (after Phase 1)
pnpm build
pnpm analyze  # If bundle analyzer installed
```

### After Each Change:
```bash
# 1. Build test
pnpm build

# 2. TypeScript check (optional)
pnpm tsc --noEmit

# 3. ESLint check (optional)
pnpm lint

# 4. Dev server
pnpm dev
```

### Critical User Flows to Test:
1. ✅ **Authentication Flow**
   - Sign up new account
   - Log in existing account
   - Log out
   - Admin login

2. ✅ **Typing Test Flow** (CRITICAL)
   - Load /test page
   - Start practice test
   - Complete test
   - View results
   - Check accuracy/WPM calculation

3. ✅ **Admin Panel Flow**
   - Admin login
   - View users list
   - View user detail
   - Change subscription tier
   - View audit log

4. ✅ **Settings Flow**
   - Change theme
   - Change font
   - Verify preferences persist

---

## 📝 DOCUMENTATION CROSS-REFERENCES

### Related IKB Documents
```
docs/admin-panel/admin-panel.scope.md
  - HIGH RISK zones overlap
  - Admin route authorization patterns
  - Lesson 31: Session refresh issues

docs/theme-system/theme-system.scope.md
  - Font loading patterns
  - Theme switching implementation
  - User preferences persistence

docs/privacy/privacy.scope.md
  - GDPR-critical areas
  - Cookie consent implementation
  - Data export/deletion flows
```

### Lessons Learned to Apply
```
Lesson 15 (Admin Auth): Always check .authorized property
Lesson 31 (Session Refresh): Use React state, not window.location.reload()
Lesson 8 (Data Export): Sanitize sensitive data before export
```

---

## 🚀 DEPLOYMENT CONSIDERATIONS

### Staging Environment Testing
```
# Before production deployment:
1. Deploy to staging environment
2. Run full test suite
3. Run Lighthouse audit
4. Test with real users (internal)
5. Monitor for 24 hours
6. If all clear → production
```

### Production Rollout Strategy
```
1. Deploy during low-traffic hours
2. Monitor error logs immediately
3. Check Core Web Vitals metrics
4. Verify no increase in error rates
5. Be ready to rollback if needed
```

### Rollback Plan
```
# Emergency rollback
git revert <commit-hash>
git push origin main

# OR immediate revert
git checkout main~1
git push origin main --force  # Nuclear option
```

---

## ✅ APPROVAL CHECKLIST

Before implementing optimization:
- [ ] User reviewed PRD
- [ ] User approved phased approach
- [ ] User confirmed admin/analytics can be removed
- [ ] Scope boundaries understood
- [ ] High-risk zones identified
- [ ] Testing strategy agreed upon
- [ ] Rollback plan in place

---

## 🎓 SCOPE ENFORCEMENT EXAMPLES

### ✅ GOOD: Within Scope
```tsx
// Example 1: Adding dynamic import to admin analytics (to be deleted anyway)
import dynamic from 'next/dynamic';
const AdminAnalytics = dynamic(() => import('./AdminAnalyticsInner'));
```

```javascript
// Example 2: Adding bundle analyzer to next.config.mjs
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports = withBundleAnalyzer(nextConfig);
```

```tsx
// Example 3: Adding display: 'swap' to fonts in layout
const firaCode = Fira_Code({ 
  subsets: ["latin"], 
  display: 'swap',  // ✅ SAFE addition
  variable: "--font-fira-code" 
});
```

### ❌ BAD: Out of Scope
```tsx
// Example 1: Modifying typing test logic (PROTECTED)
// ❌ DO NOT DO THIS
export function TypingTest() {
  // Changing WPM calculation
  const wpm = (characters / 5) / (timeElapsed / 60);  // ❌ BREAKS FEATURE
}
```

```tsx
// Example 2: Changing authentication flow (PROTECTED)
// ❌ DO NOT DO THIS
async function login(email, password) {
  // Modifying Firebase auth logic
  await signInWithCustomToken(token);  // ❌ BREAKS AUTH
}
```

```tsx
// Example 3: Removing GDPR-required API (PROTECTED)
// ❌ DO NOT DO THIS
// Deleting /app/api/v1/user/export-data/route.ts  // ❌ GDPR VIOLATION
```

---

## 📊 SCOPE DECISION MATRIX

Use this matrix when uncertain if a file is in scope:

| File Type | Example | Risk Level | In Scope? | Requires Approval? |
|-----------|---------|------------|-----------|-------------------|
| Admin analytics | `app/admin/analytics/page.tsx` | 🟢 LOW | ✅ YES (delete) | ❌ NO (user requested) |
| Admin users | `app/admin/users/page.tsx` | 🟡 MEDIUM | ⚠️ YES (lazy load only) | ✅ YES |
| Typing test | `app/test/page.tsx` | 🔴 HIGH | ❌ NO | N/A |
| Auth system | `lib/firebase/client.ts` | 🔴 HIGH | ❌ NO | N/A |
| GDPR APIs | `app/api/v1/user/export-data/route.ts` | 🔴 HIGH | ❌ NO | N/A |
| Next config | `next.config.mjs` | 🟡 MEDIUM | ⚠️ YES (specific changes) | ✅ YES |
| Package.json | `package.json` | 🟡 MEDIUM | ⚠️ YES (remove confirmed unused) | ❌ NO |
| Root layout | `app/layout.tsx` | 🟡 MEDIUM | ⚠️ YES (font optimization only) | ✅ YES |
| UI components | `components/ui/**` | 🟢 LOW | ✅ YES (lazy load) | ❌ NO |
| Debug panel | `components/debug/**` | 🟢 LOW | ✅ YES (lazy load) | ❌ NO |

**Legend:**
- ✅ YES = Safe to modify per scope
- ⚠️ YES = Conditional, follow specific rules
- ❌ NO = Protected, do not modify

---

## 🔄 SCOPE UPDATES

### When to Update This Scope File:
1. **New risk discovered** during implementation → Add to HIGH RISK ZONES
2. **New protected area identified** → Add to PROTECTED AREAS
3. **New interconnected feature found** → Add to INTERCONNECTED FEATURES
4. **Phase completed** → Mark phase as COMPLETE in IN SCOPE section
5. **Error encountered** → Cross-reference with optimization.errors.md

### Scope Update Process:
```markdown
1. Identify issue/risk during implementation
2. Document in optimization.current.md first
3. If recurring risk → Add to this scope file
4. Update last updated timestamp
5. Cross-reference in other IKB docs if needed
6. Commit scope update separately from code changes
```

---

## 🔗 QUICK LINKS

### Phase Implementation Guides
- [Phase 1: Safe Cleanup](/docs/optimization/PHASE_1_SAFE_CLEANUP.md)
- [Phase 2: Code Splitting](/docs/optimization/PHASE_2_CODE_SPLITTING.md)
- [Phase 3: Image Optimization](/docs/optimization/PHASE_3_IMAGE_OPTIMIZATION.md)
- [Phase 4: Font Optimization](/docs/optimization/PHASE_4_FONT_OPTIMIZATION.md)
- [Phase 5: Dependency Cleanup](/docs/optimization/PHASE_5_DEPENDENCY_CLEANUP.md)
- [Phase 6: Build Hardening](/docs/optimization/PHASE_6_BUILD_HARDENING.md)
- [Phase 7: Production Optimizations](/docs/optimization/PHASE_7_PRODUCTION_OPTIMIZATIONS.md)
- [Phase 8: Monitoring](/docs/optimization/PHASE_8_MONITORING.md)

### Related IKB Files
- [PRD](/docs/optimization/optimization.prd.md) - Requirements and success criteria
- [Current Status](/docs/optimization/optimization.current.md) - Implementation progress
- [Error History](/docs/optimization/optimization.errors.md) - Issues and solutions
- [MAIN.md](/docs/MAIN.md) - Central documentation index

---

---

## 🎨 FRONTEND PRESERVATION CHECKLIST

### Before Modifying ANY Frontend Code:
- [ ] Will this change affect theme colors? → Test all 10 themes
- [ ] Will this change affect fonts? → Test all 10 fonts
- [ ] Will this change affect layout/spacing? → Test responsive design
- [ ] Will this change affect animations? → Test transitions
- [ ] Will this change affect user preferences? → Test persistence
- [ ] Will this change affect dark/light mode? → Test both modes
- [ ] Will this change affect UI components? → Test all variants
- [ ] Will this change affect navigation? → Test all routes
- [ ] Will this change affect forms? → Test validation
- [ ] Will this change affect modals/dialogs? → Test open/close

### After ANY Frontend Change:
- [ ] All 10 themes display correctly
- [ ] All 10 fonts work correctly
- [ ] Light/dark mode toggle works
- [ ] Theme switching persists across sessions
- [ ] Font switching persists across sessions
- [ ] No broken layouts (mobile, tablet, desktop)
- [ ] No missing animations/transitions
- [ ] No CSS conflicts or bleeding styles
- [ ] Text remains readable in all themes
- [ ] Buttons/inputs/cards look consistent
- [ ] No console errors or warnings
- [ ] Lighthouse accessibility score unchanged

---

## 🔒 SECURITY DOUBLE-CHECK PROTOCOL

### Before Modifying ANY Backend Code:
- [ ] Does this touch authentication? → Get explicit user approval
- [ ] Does this touch authorization? → Test admin roles
- [ ] Does this touch user data? → Verify GDPR compliance
- [ ] Does this touch API endpoints? → Test all endpoints
- [ ] Does this touch database queries? → Test data integrity
- [ ] Does this expose secrets? → Verify no leaks
- [ ] Does this weaken validation? → Strengthen instead
- [ ] Does this change CORS? → Test cross-origin requests
- [ ] Does this modify headers? → Verify security headers
- [ ] Does this touch Firebase config? → Test both client/admin SDK

### After ANY Backend Change:
- [ ] Authentication still works (login/signup/logout)
- [ ] Authorization still works (admin/user roles)
- [ ] GDPR features still work (export/delete/consent)
- [ ] All API endpoints respond correctly
- [ ] Database writes succeed
- [ ] No secrets exposed in logs
- [ ] No secrets exposed in client code
- [ ] Input validation still active
- [ ] CORS configuration correct
- [ ] Security headers present
- [ ] No TypeScript errors
- [ ] No ESLint security warnings
- [ ] Playwright MCP security tests pass

---

## 🚨 ABSOLUTE RED LINES (NEVER CROSS)

### Frontend Design System:
1. ❌ **NEVER** remove or modify any of the 10 theme color schemes
2. ❌ **NEVER** remove or modify any of the 10 font options
3. ❌ **NEVER** break theme switching functionality
4. ❌ **NEVER** break font switching functionality
5. ❌ **NEVER** change CSS variable names (--background, --foreground, etc.)
6. ❌ **NEVER** modify Tailwind utility classes in UI components
7. ❌ **NEVER** remove animations/transitions without explicit user approval
8. ❌ **NEVER** change spacing system (padding, margin, gap values)
9. ❌ **NEVER** break responsive design (mobile, tablet, desktop)
10. ❌ **NEVER** modify layout structure (header, main, footer)

### Backend & Security:
1. ❌ **NEVER** expose Firebase Admin SDK credentials to client
2. ❌ **NEVER** disable authentication checks
3. ❌ **NEVER** weaken authorization (admin middleware)
4. ❌ **NEVER** break GDPR compliance (export, delete, consent)
5. ❌ **NEVER** log sensitive data (passwords, tokens, API keys)
6. ❌ **NEVER** commit secrets to git
7. ❌ **NEVER** skip input validation
8. ❌ **NEVER** weaken CORS restrictions
9. ❌ **NEVER** remove security headers
10. ❌ **NEVER** store data outside EU (europe-west1)

### User Experience:
1. ❌ **NEVER** break typing test functionality (core feature)
2. ❌ **NEVER** break authentication flow
3. ❌ **NEVER** break admin panel (except analytics - user approved)
4. ❌ **NEVER** break user preferences persistence
5. ❌ **NEVER** break keyboard sounds (if user has enabled)
6. ❌ **NEVER** break leaderboard
7. ❌ **NEVER** break dashboard statistics
8. ❌ **NEVER** break settings page
9. ❌ **NEVER** break AI test generation
10. ❌ **NEVER** break practice tests

---

## ✅ ENHANCED APPROVAL CHECKLIST

Before implementing optimization:
- [ ] User reviewed PRD
- [ ] User approved phased approach
- [ ] User confirmed admin/analytics can be removed
- [ ] Scope boundaries understood
- [ ] High-risk zones identified
- [ ] Testing strategy agreed upon
- [ ] Rollback plan in place
- [ ] **Frontend preservation rules understood** ← NEW
- [ ] **Security double-check protocol understood** ← NEW
- [ ] **Absolute red lines acknowledged** ← NEW
- [ ] **All 10 themes documented and protected** ← NEW
- [ ] **All 10 fonts documented and protected** ← NEW
- [ ] **Design system preservation acknowledged** ← NEW
- [ ] **GDPR compliance double-checked** ← NEW
- [ ] **Secrets management rules understood** ← NEW

---

**Last Updated:** November 19, 2025 (Enhanced with frontend & security x2 preservation)  
**Reviewed By:** [Pending User Review]  
**Approved By:** [Pending User Approval]  
**Next Review:** After Phase 1 completion or when new risks identified

---

## 🎓 FINAL NOTE TO FUTURE AGENTS

**This scope file now protects (per user request: "preserve exact theme colors, design, UX, frontend, backend functional, security x2"):**

### 🎨 Frontend Design System (Exact Preservation):
1. ✅ All 10 theme colors with exact CSS variable names documented
2. ✅ All 10 fonts with exact font family names documented
3. ✅ Complete spacing system (padding, margin, gap) protected
4. ✅ All animations and transitions preserved
5. ✅ UI component visual design locked
6. ✅ Layout structure (header, main, footer) protected
7. ✅ Glass morphism, gradients, shadows documented
8. ✅ Responsive design (mobile, tablet, desktop) protected
9. ✅ User preference persistence protected
10. ✅ Dark/light mode system protected

### 🔒 Security x2 (Double Protection):
1. ✅ Authentication system (Firebase Auth) - ABSOLUTE NO-TOUCH
2. ✅ Authorization system (custom claims, admin middleware) - ABSOLUTE NO-TOUCH
3. ✅ GDPR compliance (export, delete, consent) - LEGAL REQUIREMENT
4. ✅ Secrets management (never expose Admin SDK, API keys) - CRITICAL
5. ✅ Input validation (all user inputs) - ALWAYS ACTIVE
6. ✅ CORS configuration (zentype-v1 domain) - STRICT
7. ✅ Security headers (CSP, X-Frame-Options) - PROTECTED
8. ✅ Data privacy (EU-only storage) - LEGAL REQUIREMENT
9. ✅ Re-authentication (before account deletion) - SECURITY CRITICAL
10. ✅ Rate limiting infrastructure (currently disabled, but protected) - ABUSE PREVENTION

### ⚙️ Backend Functional (Complete Protection):
1. ✅ All API endpoints documented and protected
2. ✅ Firebase Admin SDK protected (server-only)
3. ✅ Firestore query logic protected
4. ✅ Cloud Functions protected
5. ✅ Centralized logging protected
6. ✅ Error handling patterns protected
7. ✅ API response structure protected
8. ✅ Database schema protected
9. ✅ Authentication middleware protected
10. ✅ CORS configuration protected

**When in doubt, READ THIS SCOPE FILE AGAIN. Every protected area has a reason. Every checklist has a purpose.** 🔒

**User's love acknowledged. Documentation created with love. Go optimize safely!** ❤️🚀
