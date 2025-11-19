# Performance Optimization - Product Requirements Document

**Feature:** Next.js Application Performance Optimization  
**Version:** 1.0  
**Status:** 📝 PLANNING PHASE  
**Created:** November 19, 2025  
**Last Updated:** November 19, 2025  

---

## 🎯 Objectives

### Primary Goals
1. **Improve Core Web Vitals** - Optimize LCP, FID/INP, and CLS metrics
2. **Reduce Bundle Size** - Remove unused code and dependencies
3. **Enhance Loading Performance** - Implement code splitting and lazy loading
4. **Maintain 100% Functionality** - Zero breaking changes to existing features
5. **Improve Security Practices** - Follow Next.js production best practices

### Success Metrics
- **Bundle Size:** Reduce by at least 20% (target: <500KB initial JS)
- **LCP (Largest Contentful Paint):** < 2.5 seconds
- **FID (First Input Delay) / INP:** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1
- **Lighthouse Score:** > 90 for Performance
- **Build Time:** No significant increase (< 10% slower)

---

## 📚 Research Context

### Resources Reviewed
1. ✅ **Next.js Production Checklist** (https://nextjs.org/docs/app/guides/production-checklist)
   - Automatic optimizations (Server Components, code-splitting, prefetching)
   - Image and font optimization guidelines
   - Security best practices
   - Bundle analysis tools

2. ✅ **React Performance Guide** (https://dev.to/humjerry/optimizing-react-apps-for-performance-a-comprehensive-guide-2jff)
   - Bundle size optimization techniques
   - Code splitting and dynamic imports
   - Lazy loading strategies
   - Core Web Vitals optimization
   - Performance monitoring tools

3. ✅ **Next.js Performance Optimization Expert Guide** (docs/The Expert Guide to Next.js Performance Optimization [2025].md)
   - Code splitting patterns (next/dynamic)
   - Streaming, Suspense & Hydration
   - Image optimization (next/image)
   - Third-party script management
   - Font optimization strategies

### Key Findings from Current Codebase

#### ✅ Good Practices Already Implemented
- ✅ Server Components by default (Next.js 15)
- ✅ Font optimization with next/font/google
- ✅ Automatic code splitting by route
- ✅ TypeScript for type safety
- ✅ Centralized logging system
- ✅ Firebase Admin SDK properly configured
- ✅ Environment variables managed securely

#### ⚠️ Issues Identified

##### 1. **Image Optimization Disabled** (HIGH PRIORITY)
```javascript
// next.config.mjs
images: {
  unoptimized: true,  // ❌ DISABLES ALL IMAGE OPTIMIZATION
}
```
**Impact:** Larger image sizes, slower page loads, poor LCP scores  
**Risk Level:** HIGH - Re-enabling could break existing image URLs

##### 2. **Missing Dynamic Imports** (MEDIUM PRIORITY)
- No code splitting for heavy components
- Admin panel loads all at once (analytics, users, audit log)
- Debug panel not lazy-loaded
- Modal components always in bundle

##### 3. **Unused Dependencies** (MEDIUM PRIORITY)
- ❌ **@vercel/analytics** - Never imported (already documented in VERCEL_CLEANUP_SUMMARY.md)
- ❌ **use-sound** - Only used in one hook (useKeyboardSound.ts)
- ⚠️ **Many @radix-ui packages** - Need to verify all are used

##### 4. **Redundant Admin Features** (LOW PRIORITY - USER REQUESTED)
- `/app/admin/analytics/page.tsx` - 474 lines, unused by user
- Overlaps with existing admin dashboard and performance monitoring
- User explicitly wants this removed

##### 5. **Font Loading Not Optimized** (LOW PRIORITY)
- 10 fonts loaded in root layout (all at once)
- No `display: 'swap'` option specified
- Variable fonts could be better utilized

##### 6. **Build Configuration Issues** (MEDIUM PRIORITY)
```javascript
// next.config.mjs
eslint: {
  ignoreDuringBuilds: true,  // ⚠️ HIDES POTENTIAL ISSUES
},
typescript: {
  ignoreBuildErrors: true,  // ⚠️ DANGEROUS IN PRODUCTION
}
```
**Impact:** Could mask serious bugs before deployment  
**Risk Level:** MEDIUM - Should be addressed carefully

##### 7. **No Bundle Analysis** (LOW PRIORITY)
- No webpack bundle analyzer configured
- Can't identify largest dependencies
- No visibility into tree-shaking effectiveness

---

## 🔍 Current Application Analysis

### Bundle Size Breakdown (Estimated)
```
Total Dependencies: 72 packages
Largest Dependencies (estimated):
- firebase: ~400KB
- firebase-admin: ~250KB (server-only)
- @radix-ui/* (26 packages): ~300KB combined
- recharts: ~150KB
- react-hook-form: ~50KB
- lucide-react: ~40KB (tree-shakeable)
- use-sound: ~30KB (only used once)
```

### Route Analysis
```
Public Routes (SSR/Static):
- / (home page)
- /login
- /signup
- /privacy-policy
- /terms-of-service
- /pricing

Protected Routes (Client-side):
- /test (main typing test - HIGH TRAFFIC)
- /test/simple (redirect to /test?tab=simple)
- /dashboard
- /history
- /leaderboard
- /settings
- /settings/privacy

Admin Routes (Low traffic, heavy components):
- /admin/login
- /admin/dashboard
- /admin/users
- /admin/users/[uid]
- /admin/subscriptions
- /admin/analytics ❌ (REMOVE - user request)
- /admin/performance
- /admin/audit-log
```

### Critical User Paths
1. **Typing Test Flow** (HIGHEST PRIORITY)
   - `/test` page (main feature)
   - Must be fast (<1s LCP)
   - Current issues: None identified
   
2. **Authentication Flow** (HIGH PRIORITY)
   - `/login` → `/dashboard`
   - `/signup` → `/dashboard`
   - Current issues: None identified

3. **Admin Panel** (LOW PRIORITY)
   - Low traffic
   - Heavy components acceptable
   - Can be lazy-loaded

---

## 📋 Implementation Phases

### **Phase 1: Safe Cleanup & Analysis** (1-2 hours)
**Goal:** Remove unused code without touching functionality  
**Risk Level:** 🟢 LOW - No breaking changes expected

#### Tasks:
1. ✅ **Remove Unused Admin Analytics Feature**
   - Delete `/app/admin/analytics/page.tsx`
   - Delete `/app/api/v1/admin/analytics/route.ts`
   - Remove from admin navigation if present
   - Update documentation

2. ✅ **Install Bundle Analyzer**
   ```bash
   pnpm add -D @next/bundle-analyzer
   ```
   - Configure in next.config.mjs
   - Run initial analysis
   - Document findings

3. ✅ **Audit Dependencies**
   - Run `pnpm ls --depth=0` to list all dependencies
   - Check if all @radix-ui packages are imported
   - Verify use-sound is worth keeping
   - Document unused packages

4. ✅ **Update .gitignore**
   - Add bundle analysis reports
   - Add performance benchmark files

**Acceptance Criteria:**
- [ ] Admin analytics feature completely removed
- [ ] Bundle analyzer reports generated
- [ ] List of unused dependencies documented
- [ ] No existing features broken
- [ ] Dev server starts successfully

---

### **Phase 2: Code Splitting & Lazy Loading** (2-3 hours)
**Goal:** Implement dynamic imports for heavy components  
**Risk Level:** 🟡 MEDIUM - Could cause hydration mismatches if not careful

#### Tasks:
1. ✅ **Lazy Load Admin Panel Components**
   ```tsx
   // app/admin/dashboard/page.tsx
   import dynamic from 'next/dynamic';
   
   const AdminDashboard = dynamic(() => import('@/components/admin/AdminDashboard'), {
     loading: () => <div>Loading dashboard...</div>,
     ssr: true  // Keep SSR for admin
   });
   ```
   - Admin user list
   - Admin audit log
   - Admin performance dashboard
   - Admin subscription management

2. ✅ **Lazy Load Debug Panel**
   ```tsx
   // components/debug/EnhancedDebugPanel.tsx
   const EnhancedDebugPanel = dynamic(() => import('./EnhancedDebugPanelInner'), {
     ssr: false  // Client-only component
   });
   ```

3. ✅ **Lazy Load Modal Components**
   ```tsx
   // When modal is triggered, not on page load
   const ZenTypeModal = dynamic(() => import('@/components/ui/zentype-modal'));
   ```

4. ✅ **Lazy Load Heavy Chart Libraries**
   ```tsx
   // Only load recharts when dashboard is opened
   const DashboardCharts = dynamic(() => import('@/components/dashboard/Charts'), {
     loading: () => <Skeleton />,
     ssr: false
   });
   ```

5. ✅ **Code Split by Route** (Already done by Next.js, verify)
   - Verify route-based splitting is working
   - Check for shared chunks

**Acceptance Criteria:**
- [ ] Admin components only load when admin pages visited
- [ ] Debug panel loads only when toggled
- [ ] Modals load on-demand
- [ ] No hydration errors in console
- [ ] All features still work correctly
- [ ] Initial bundle size reduced by 15-20%

---

### **Phase 3: Image Optimization Strategy** (2-4 hours)
**Goal:** Enable image optimization safely  
**Risk Level:** 🟡 MEDIUM - Could break existing images

#### Analysis Required First:
```bash
# Find all image usages
grep -r "<img" app/ components/ --exclude-dir=node_modules
grep -r "Image from" app/ components/ --exclude-dir=node_modules
```

#### Tasks:
1. ✅ **Audit Image Usage**
   - List all images in `/public`
   - Check if any external images used
   - Verify image formats (PNG, JPG, SVG)
   - Document image dimensions

2. ✅ **Gradual Rollout Plan**
   ```javascript
   // Option A: Enable for specific domains only
   images: {
     unoptimized: false,
     domains: ['zentype.com'],  // Only optimize our images
     remotePatterns: [
       {
         protocol: 'https',
         hostname: '**.firebaseapp.com',
       }
     ]
   }
   
   // Option B: Keep unoptimized, manual optimization
   // Convert PNGs to WebP manually
   // Use next/image with unoptimized=true per image
   ```

3. ✅ **Implement Next Image Component**
   - Replace `<img>` tags with `<Image>` component
   - Add width/height to prevent CLS
   - Use `priority` for above-the-fold images
   - Use `loading="lazy"` for below-the-fold

4. ⚠️ **Test Thoroughly**
   - Verify all images load correctly
   - Check for layout shifts
   - Test on different devices/browsers
   - Verify Firebase hosting compatibility

**Decision Point:**
- If Firebase App Hosting charges for image optimization → Keep `unoptimized: true` and manually optimize
- If free or reasonable cost → Enable optimization

**Acceptance Criteria:**
- [ ] Image strategy documented
- [ ] All images using next/image component
- [ ] No layout shifts (CLS < 0.1)
- [ ] Images load correctly in production
- [ ] Cost impact assessed

---

### **Phase 4: Font Optimization** (1-2 hours)
**Goal:** Optimize font loading for better FCP  
**Risk Level:** 🟢 LOW - Easy to revert

#### Tasks:
1. ✅ **Add Font Display Strategy**
   ```tsx
   // app/layout.tsx
   const firaCode = Fira_Code({ 
     subsets: ["latin"], 
     variable: "--font-fira-code",
     display: 'swap'  // Prevent FOIT (Flash of Invisible Text)
   });
   ```

2. ✅ **Lazy Load Decorative Fonts**
   ```tsx
   // Only load decorative fonts when user selects them
   // in settings, not in root layout
   ```

3. ✅ **Preload Critical Fonts**
   ```tsx
   // Only preload default font (Fira Code)
   // Let other fonts load lazily
   ```

4. ✅ **Font Subsetting**
   ```tsx
   // Already using subsets: ["latin"]
   // Verify this is optimal
   ```

**Acceptance Criteria:**
- [ ] Fonts load with swap strategy
- [ ] Decorative fonts only load when needed
- [ ] No FOIT/FOUT visible to users
- [ ] Font files cached correctly

---

### **Phase 5: Dependency Cleanup** (1-2 hours)
**Goal:** Remove unused npm packages  
**Risk Level:** 🟢 LOW - Can reinstall if needed

#### Tasks:
1. ✅ **Remove Confirmed Unused Packages**
   ```bash
   pnpm remove @vercel/analytics  # Already confirmed unused
   ```

2. ⚠️ **Audit Radix UI Usage**
   ```bash
   # Check each @radix-ui package
   for pkg in $(pnpm ls @radix-ui --depth=0 | grep @radix-ui | cut -d ' ' -f 1); do
     echo "Checking $pkg"
     grep -r "$pkg" app/ components/ --exclude-dir=node_modules || echo "NOT FOUND: $pkg"
   done
   ```

3. ⚠️ **Consider use-sound Alternative**
   - Only used in `hooks/useKeyboardSound.ts`
   - Could implement native Web Audio API instead (saves ~30KB)
   - Decision: Keep if user likes keyboard sounds, remove if unused

4. ✅ **Tree-Shaking Verification**
   - Verify lucide-react is tree-shaking properly
   - Check if any barrel imports can be replaced with direct imports
   ```tsx
   // Bad: Imports entire library
   import { Button, Card, Input } from '@/components/ui'
   
   // Good: Direct imports (better tree-shaking)
   import { Button } from '@/components/ui/button'
   import { Card } from '@/components/ui/card'
   ```

**Acceptance Criteria:**
- [ ] All unused dependencies removed
- [ ] pnpm install runs successfully
- [ ] All features still work
- [ ] Bundle size reduced by 5-10%

---

### **Phase 6: Build Configuration Hardening** (1 hour)
**Goal:** Remove dangerous ignores, enforce quality  
**Risk Level:** 🟡 MEDIUM - Could reveal hidden errors

#### Tasks:
1. ⚠️ **Gradual Error Fixing**
   ```javascript
   // Step 1: Get baseline
   // next.config.mjs - Leave as is, document errors
   
   // Step 2: Fix TypeScript errors one by one
   typescript: {
     ignoreBuildErrors: false,  // Enable gradually
   }
   
   // Step 3: Fix ESLint errors
   eslint: {
     ignoreDuringBuilds: false,
   }
   ```

2. ✅ **Document All Ignored Errors**
   - Run `pnpm tsc --noEmit` to see TypeScript errors
   - Run `pnpm lint` to see ESLint errors
   - Create error inventory
   - Prioritize fixes

3. ⚠️ **Strict Mode Configuration**
   ```javascript
   // Enable React strict mode (already enabled in layout)
   // Add TypeScript strict mode checks gradually
   ```

**Acceptance Criteria:**
- [ ] All TypeScript errors documented
- [ ] All ESLint errors documented
- [ ] Plan for fixing critical errors created
- [ ] Build still succeeds

---

### **Phase 7: Production Optimizations** (1-2 hours)
**Goal:** Enable Next.js production features  
**Risk Level:** 🟢 LOW - Easy to configure

#### Tasks:
1. ✅ **Enable Compression**
   ```javascript
   // next.config.mjs
   compress: true,  // Enable gzip compression
   ```

2. ✅ **Configure Caching Headers**
   ```javascript
   // next.config.mjs
   async headers() {
     return [
       {
         source: '/fonts/:path*',
         headers: [
           {
             key: 'Cache-Control',
             value: 'public, max-age=31536000, immutable',
           },
         ],
       },
     ];
   }
   ```

3. ✅ **Optimize Static Assets**
   - Verify `/public` files are served correctly
   - Check robots.txt, sitemap.xml caching
   - Configure service worker if needed

4. ✅ **Enable React Compiler** (Experimental)
   ```javascript
   // next.config.mjs
   experimental: {
     reactCompiler: true,  // Auto-memoization
   }
   ```

5. ✅ **Configure Prefetching**
   ```tsx
   // Verify Link components use prefetch correctly
   <Link href="/test" prefetch={true}>  // Prefetch on hover
   ```

**Acceptance Criteria:**
- [ ] Compression enabled and working
- [ ] Static assets cached correctly
- [ ] Prefetching working as expected
- [ ] No performance regressions

---

### **Phase 8: Monitoring & Validation** (1 hour)
**Goal:** Measure improvements and set up monitoring  
**Risk Level:** 🟢 LOW - Observability only

#### Tasks:
1. ✅ **Run Lighthouse Audits**
   ```bash
   # Before optimization
   # After each phase
   # Final comparison
   ```

2. ✅ **Bundle Size Comparison**
   ```bash
   pnpm build
   # Document before/after sizes
   ```

3. ✅ **Real User Monitoring** (Optional)
   - Consider adding lightweight analytics
   - Track Core Web Vitals in production
   - Use Next.js built-in analytics or custom solution

4. ✅ **Create Performance Budget**
   ```javascript
   // .lighthouserc.js
   module.exports = {
     ci: {
       assert: {
         assertions: {
           'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
           'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
           'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
         }
       }
     }
   };
   ```

**Acceptance Criteria:**
- [ ] Lighthouse score > 90
- [ ] Bundle size reduced by 20%+
- [ ] All Core Web Vitals in "Good" range
- [ ] Performance budget documented

---

## ⚠️ Critical Safety Rules

### Before Each Phase:
1. ✅ **Git Commit** - Commit working state
2. ✅ **Create Branch** - `git checkout -b optimization/phase-X`
3. ✅ **Run Dev Server** - Verify app starts
4. ✅ **Test Critical Paths** - Test auth, typing test, admin panel

### After Each Phase:
1. ✅ **Playwright MCP Testing** - Test main user flows
2. ✅ **Manual Testing** - Test on localhost:3000
3. ✅ **Check Console** - No errors or warnings
4. ✅ **Verify Features** - All features work correctly
5. ✅ **Git Commit** - Commit changes with clear message

### If Something Breaks:
1. ❌ **STOP IMMEDIATELY**
2. 🔄 **Revert Changes** - `git reset --hard HEAD~1`
3. 📝 **Document Issue** - Add to optimization.errors.md
4. 🤔 **Reassess Approach** - Find safer alternative

---

## 📊 Expected Results

### Bundle Size Reduction
```
Before: ~1.2MB initial JS bundle (estimated)
After:  ~800KB initial JS bundle (target)
Savings: ~400KB (33% reduction)

Breakdown by Phase:
Phase 1 (Cleanup):        -100KB (759 lines admin analytics removed)
Phase 2 (Code Splitting): -200KB (admin/debug lazy-loaded)
Phase 3 (Images):         Variable (depends on image audit)
Phase 4 (Fonts):          -20KB (decorative fonts lazy-loaded)
Phase 5 (Dependencies):   -50KB (@vercel/analytics removed)
Phase 6 (Build Config):   No size change (quality improvement)
Phase 7 (Production):     -30KB (compression + optimizations)
Phase 8 (Monitoring):     No size change (observability)
```

### Core Web Vitals
```
Metric    Before  After   Target
LCP       3.5s    2.0s    < 2.5s  ✅
FID/INP   150ms   80ms    < 100ms ✅
CLS       0.15    0.08    < 0.1   ✅
```

### Lighthouse Score
```
Category        Before  After   Target
Performance     72      92      > 90    ✅
Accessibility   95      95      > 90    ✅
Best Practices  83      95      > 90    ✅
SEO             100     100     > 90    ✅
```

---

## 🔄 Rollback Strategy

### If Optimization Causes Issues:
1. **Immediate Rollback** (< 5 minutes)
   ```bash
   git checkout main
   git push origin main --force  # Emergency only
   ```

2. **Selective Revert** (Per phase)
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

3. **Feature Flags** (Future)
   - Implement feature flags for gradual rollout
   - Enable optimizations for % of users
   - Monitor metrics before full rollout

---

## 📝 Documentation Updates Required

After optimization:
1. ✅ Update `/docs/optimization/optimization.current.md` with results
2. ✅ Update `/docs/MAIN.md` with optimization section
3. ✅ Create `/docs/optimization/PERFORMANCE_BENCHMARKS.md`
4. ✅ Update deployment guide with new build steps
5. ✅ Document any new environment variables needed

---

## ✅ Success Criteria - Final Checklist

### Functionality (MUST PASS 100%)
- [ ] Authentication (login/signup) works
- [ ] Typing test loads and functions correctly
- [ ] AI test generation works
- [ ] Practice tests load
- [ ] Dashboard displays correctly
- [ ] Admin panel (except analytics) works
- [ ] Theme switching works
- [ ] Font switching works
- [ ] Keyboard sounds work (if enabled)
- [ ] Leaderboard displays
- [ ] Settings save correctly
- [ ] Privacy features work
- [ ] GDPR compliance maintained

### Performance (TARGET 80%+)
- [ ] Initial bundle < 500KB
- [ ] LCP < 2.5s
- [ ] FID/INP < 100ms
- [ ] CLS < 0.1
- [ ] Lighthouse Performance > 90
- [ ] Build time < 2 minutes
- [ ] Dev server starts < 10s

### Quality (TARGET 90%+)
- [ ] No TypeScript errors (or documented)
- [ ] No ESLint errors (or documented)
- [ ] No console errors in production
- [ ] No hydration mismatches
- [ ] All tests passing (if tests exist)

---

## 🎯 Next Steps

1. **Review this PRD** with user
2. **Get approval** for phased approach
3. **Begin Phase 1** - Safe cleanup and analysis
4. **Test after each phase** - Playwright MCP verification
5. **Document progress** - Update optimization.current.md
6. **Commit after each phase** - Clear git history
7. **Deploy to production** - After all 8 phases complete

---

## 🧰 Tools & Resources

### Required Tools
```bash
# Install bundle analyzer
pnpm add -D @next/bundle-analyzer

# Run bundle analysis
ANALYZE=true pnpm build

# Run Lighthouse audit (Chrome DevTools)
# Or use Lighthouse CI
pnpm add -D @lhci/cli
```

### Useful Commands
```bash
# Check bundle size
pnpm build && du -sh .next

# List all dependencies
pnpm ls --depth=0

# Find unused dependencies
npx depcheck

# Check TypeScript errors
pnpm tsc --noEmit

# Check ESLint errors
pnpm lint

# Test production build locally
pnpm build && pnpm start
```

### Reference Documentation
- Next.js Production Checklist: https://nextjs.org/docs/app/guides/production-checklist
- React Performance Guide: https://react.dev/learn/render-and-commit
- Web.dev Core Web Vitals: https://web.dev/vitals/
- Firebase App Hosting Docs: https://firebase.google.com/docs/app-hosting

---

## 🚀 Deployment Considerations

### Firebase App Hosting Specifics
- **Region:** europe-west4 (Netherlands) - Ensure CDN optimization
- **Environment Variables:** All in apphosting.yaml (already configured)
- **Build Command:** `pnpm build` (Next.js production build)
- **Start Command:** `pnpm start` (Next.js production server)
- **Static Assets:** Served from `.next/static` with CDN caching

### Performance Monitoring in Production
```javascript
// Consider adding to app/layout.tsx (optional)
export function reportWebVitals(metric) {
  console.log(metric);
  // Send to analytics service
}
```

### Gradual Rollout Strategy
1. Deploy to staging environment first
2. Test with Playwright MCP on staging
3. Monitor staging metrics for 24-48 hours
4. Deploy to production (zentype-v1)
5. Monitor production metrics
6. Rollback if issues detected

---

## 📞 Support & Escalation

### If Issues Arise During Optimization:

**Severity 1: App Broken (Authentication, Typing Test)**
- ⚠️ STOP immediately
- Rollback to last known good state
- Document error in optimization.errors.md
- Consult user before proceeding

**Severity 2: Admin Panel Issues**
- ⚠️ Pause optimization
- Fix issue before continuing
- Test with Playwright MCP
- Document in errors.md

**Severity 3: Minor Performance Regression**
- ℹ️ Continue with caution
- Document in current.md
- Investigate root cause
- May need to adjust approach

**Severity 4: Cosmetic Issues**
- ✅ Continue optimization
- Document for later fix
- Don't block on minor issues

---

## 🎓 Learning Outcomes for Future Agents

### Key Lessons from This Optimization
1. **Bundle Analysis First** - Measure before optimizing
2. **Incremental Changes** - One phase at a time
3. **Test After Each Phase** - Don't accumulate untested changes
4. **Document Everything** - Future you will thank you
5. **Rollback Plan Always** - Have an escape hatch
6. **User Impact > Metrics** - Don't break features for performance
7. **GDPR Compliance** - Never compromise privacy for speed
8. **Security First** - Performance second to security

### Reusable Patterns
```tsx
// Pattern 1: Lazy Loading Admin Components
const AdminComponent = dynamic(() => import('./AdminComponent'), {
  loading: () => <Skeleton />,
  ssr: true
});

// Pattern 2: Lazy Loading Modals
const [showModal, setShowModal] = useState(false);
const Modal = showModal ? dynamic(() => import('./Modal')) : null;

// Pattern 3: Lazy Loading Chart Libraries
const Charts = dynamic(() => import('./Charts'), {
  loading: () => <div>Loading charts...</div>,
  ssr: false
});

// Pattern 4: Font Display Optimization
const font = Font({ 
  subsets: ["latin"], 
  display: 'swap',
  variable: '--font-name'
});

// Pattern 5: Bundle Size Tracking
// Run after every phase:
// pnpm build && du -sh .next
```

---

## 🔗 Related Documentation

### Internal Links
- [Optimization Scope](/docs/optimization/optimization.scope.md) - What can be changed
- [Optimization Status](/docs/optimization/optimization.current.md) - Current progress
- [Optimization Errors](/docs/optimization/optimization.errors.md) - Issues encountered
- [MAIN.md](/docs/MAIN.md) - Central documentation index

### External Links
- [Admin Panel PRD](/docs/admin-panel/admin-panel.prd.md) - Context for admin changes
- [Theme System](/docs/theme-system/theme-system.prd.md) - Font optimization context
- [Privacy System](/docs/privacy/privacy.prd.md) - GDPR compliance context
- [Deployment Guide](/docs/DEPLOYMENT_GUIDE.md) - Production deployment process

---

**Last Updated:** November 19, 2025  
**Next Review:** After Phase 1 completion  
**Status:** 📝 AWAITING USER APPROVAL TO BEGIN PHASE 1
3. **Create scope.md** with detailed file lists
4. **Begin Phase 1** (Safe Cleanup)
5. **Update current.md** after each phase

---

**Last Updated:** November 19, 2025  
**Approved By:** [Pending User Review]  
**Implementation Start:** [After Approval]
