# Performance Optimization - Error History

**Feature:** Next.js Application Performance Optimization  
**Version:** 1.0  
**Created:** November 19, 2025  
**Last Updated:** November 19, 2025  

---

## 📋 ERROR LOG FORMAT

```
ERROR-OPT-XXX: Brief Description
Date: YYYY-MM-DD
Phase: Phase X
Severity: CRITICAL | HIGH | MEDIUM | LOW
Status: OPEN | IN PROGRESS | RESOLVED | WONTFIX

Description:
[Detailed description of the error]

Root Cause:
[What caused this error]

Impact:
[What broke or what was affected]

Solution Applied:
[How it was fixed]

Prevention:
[How to avoid this in the future]

Files Changed:
- path/to/file1.ts
- path/to/file2.tsx

Related Errors:
- ERROR-OPT-XXX (if applicable)
```

---

## 🎓 PREVENTIVE LESSONS (From Past ZenType Errors)

### Lesson 1: Always Check Authorization Properties
**Source:** ERROR-ADMIN-001 (Admin Panel)  
**Pattern:**
```typescript
// ❌ BAD: Object is always truthy
if (adminCheck) { return error; }

// ✅ GOOD: Check .authorized property
if (!adminCheck.authorized) { return error; }
```
**Apply to Optimization:** When modifying admin routes in Phase 2

---

### Lesson 2: React State Refresh Over Page Reload
**Source:** ERROR-ADMIN-006 (Admin Panel Session Management)  
**Pattern:**
```typescript
// ❌ BAD: Loses session, slow (15-20s)
window.location.reload();

// ✅ GOOD: Preserves session, fast (1-2s)
setRefreshTrigger(prev => prev + 1);
```
**Apply to Optimization:** When adding dynamic imports to admin pages in Phase 2

---

### Lesson 3: Sanitize Data Before Export
**Source:** Data Export Security Hardening (Privacy System)  
**Pattern:**
```typescript
// Always sanitize sensitive data
const sanitizedData = sanitizeExportData(userData);
// Mask UIDs, IPs, correlation IDs
```
**Apply to Optimization:** Maintain GDPR compliance during optimization

---

### Lesson 4: Firebase SDK Callable > Raw Fetch
**Source:** Admin Panel Phase 4 (Simple Mode)  
**Pattern:**
```typescript
// ❌ BAD: Manual authentication
fetch('/api', { headers: { Authorization: `Bearer ${token}` } })

// ✅ GOOD: Automatic authentication
const callable = httpsCallable(functions, 'functionName');
```
**Apply to Optimization:** Keep this pattern when optimizing API calls

---

### Lesson 5: Never Skip IKB Protocol
**Source:** Theme System Implementation  
**Issue:** Previous agent wrote docs but never implemented code  
**Prevention:**
```
1. Read MAIN.md first
2. Read scope.md to understand boundaries
3. Read current.md to know status
4. Read errors.md to learn from past mistakes
5. THEN implement
6. THEN update docs
```
**Apply to Optimization:** Follow this exact process for each phase

---

## 🚨 OPTIMIZATION-SPECIFIC ERRORS

### ERROR-OPT-001: [Placeholder - No Errors Yet]
**Date:** TBD  
**Phase:** TBD  
**Severity:** TBD  
**Status:** N/A

**Description:**
No errors have been encountered yet. This file will be updated as optimization work progresses.

---

## 🔮 ANTICIPATED RISKS (Proactive Prevention)

### RISK-OPT-001: Hydration Mismatch from Dynamic Imports
**Probability:** MEDIUM  
**Phase:** Phase 2 (Code Splitting)  
**Description:**
Adding `dynamic()` imports to SSR components could cause hydration mismatches.

**Prevention:**
- Always use `ssr: true` for authenticated pages
- Include loading component fallback
- Test in browser console for hydration errors
- Use `suppressHydrationWarning` only as last resort

**Detection:**
```
Console error: "Hydration failed because..."
Console warning: "Text content does not match..."
```

**Rollback:**
```bash
git revert <commit-hash>  # Revert dynamic import change
```

---

### RISK-OPT-002: Image URLs Break After Enabling Optimization
**Probability:** LOW  
**Phase:** Phase 3 (Image Optimization)  
**Description:**
Re-enabling `images.unoptimized: false` could break existing image paths.

**Prevention:**
- Complete image audit first (find all images)
- Test on staging environment
- Check Firebase App Hosting image optimization costs
- Have list of all image URLs before enabling

**Detection:**
```
Browser: 404 errors for images
Console: Failed to load image
Broken image icons on page
```

**Rollback:**
```javascript
// next.config.mjs
images: {
  unoptimized: true,  // Revert to current state
}
```

---

### RISK-OPT-003: Font Display Changes Cause FOIT/FOUT
**Probability:** LOW  
**Phase:** Phase 4 (Font Optimization)  
**Description:**
Adding `display: 'swap'` could cause Flash of Unstyled Text (FOUT).

**Prevention:**
- Test locally with throttled network (DevTools)
- Check for font flashing on page load
- Verify font switching in settings still works
- Test all 10 fonts individually

**Detection:**
```
Visual: Text appears briefly in fallback font
Visual: Text "pops" when custom font loads
User complaint: "Text looks weird on load"
```

**Rollback:**
```tsx
// Remove display: 'swap' from font configs
const firaCode = Fira_Code({ 
  subsets: ["latin"], 
  variable: "--font-fira-code"
  // Remove: display: 'swap'
});
```

---

### RISK-OPT-004: Removing Used Dependency Breaks Feature
**Probability:** LOW  
**Phase:** Phase 5 (Dependency Cleanup)  
**Description:**
Accidentally removing a dependency that's actually used.

**Prevention:**
- Always grep search before removing: `grep -r "package-name" app/ components/`
- Check package-lock.json for transitive dependencies
- Test all features after removal
- Remove one package at a time, not bulk removal

**Detection:**
```
Build error: Module not found: 'package-name'
Runtime error: Cannot find module 'package-name'
Feature stops working
```

**Rollback:**
```bash
pnpm install package-name  # Reinstall
git revert <commit-hash>   # Revert package.json change
```

---

### RISK-OPT-005: Enabling Strict TypeScript Reveals Critical Bugs
**Probability:** MEDIUM  
**Phase:** Phase 6 (Build Configuration)  
**Description:**
Disabling `ignoreBuildErrors` could reveal hundreds of TypeScript errors.

**Prevention:**
- Document all errors BEFORE enabling strict checks
- Fix critical errors first (undefined variables, type mismatches)
- Accept minor errors (external library types)
- Enable strict checks only after fixing critical errors

**Detection:**
```
Build fails with TypeScript errors
pnpm build fails
Cannot deploy to production
```

**Rollback:**
```javascript
// next.config.mjs
typescript: {
  ignoreBuildErrors: true,  // Re-enable temporarily
}
```

---

### RISK-OPT-006: Bundle Analyzer Plugin Breaks Build
**Probability:** VERY LOW  
**Phase:** Phase 1 (Analysis)  
**Description:**
@next/bundle-analyzer plugin could conflict with existing webpack config.

**Prevention:**
- Install as devDependency only
- Use conditional enabling (only when ANALYZE=true)
- Test build with analyzer enabled
- Keep analyzer separate from production builds

**Detection:**
```
Build error: webpack configuration error
Build error: Invalid plugin
Build fails when ANALYZE=true
```

**Rollback:**
```bash
pnpm remove @next/bundle-analyzer
# Remove from next.config.mjs
```

---

## 🔍 ERROR INVESTIGATION CHECKLIST

When an error occurs:
- [ ] 1. **STOP IMMEDIATELY** - Don't make more changes
- [ ] 2. **Reproduce Error** - Verify it's consistent
- [ ] 3. **Check Console** - Browser and terminal
- [ ] 4. **Review Last Changes** - What was just modified
- [ ] 5. **Git Diff** - `git diff` to see exact changes
- [ ] 6. **Rollback Test** - Does reverting fix it?
- [ ] 7. **Document Here** - Add to this file
- [ ] 8. **Root Cause** - Understand WHY it broke
- [ ] 9. **Fix Properly** - Don't just patch symptoms
- [ ] 10. **Prevent Future** - Update scope/current docs

---

## 📚 EXTERNAL REFERENCES

### ZenType Error History
```
docs/admin-panel/admin-panel.errors.md  # Admin panel errors
docs/theme-system/theme-system.errors.md # Theme system errors
docs/privacy/privacy.current.md         # Privacy implementation lessons
docs/PRACTICE_TEST_API_FIX_OCT_2025.md  # Client vs Admin SDK issue
```

### Error Patterns to Watch:
1. **Authentication Errors** - Always test login/logout after changes
2. **Hydration Errors** - Check console after adding dynamic imports
3. **Build Errors** - Run `pnpm build` frequently
4. **Type Errors** - Run `pnpm tsc --noEmit` periodically
5. **Runtime Errors** - Monitor production logs

---

## 🎯 ERROR SEVERITY LEVELS

### CRITICAL (Blocks Production Deployment)
- App won't build
- Authentication broken
- Data loss possible
- GDPR compliance broken
- Security vulnerability

**Action:** Immediate rollback, fix before proceeding

---

### HIGH (Major Feature Broken)
- Admin panel broken
- Typing test broken
- User dashboard broken
- API routes failing
- Database writes failing

**Action:** Fix before moving to next phase

---

### MEDIUM (Minor Feature Broken)
- Settings page issue
- Theme switching glitch
- Font loading delay
- Non-critical UI bug
- Performance regression

**Action:** Fix if time allows, or document for later

---

### LOW (Cosmetic or Edge Case)
- Console warning
- Minor visual glitch
- Edge case bug
- Documentation typo
- Test flakiness

**Action:** Document, fix later if time allows

---

## 🔄 ERROR RESOLUTION WORKFLOW

```
ERROR DETECTED
    ↓
1. STOP & ASSESS
    ├─ Severity?
    ├─ Impact?
    └─ Rollback needed?
    ↓
2. DOCUMENT
    ├─ Add to this file
    ├─ Assign ERROR-OPT-XXX ID
    └─ Describe fully
    ↓
3. REPRODUCE
    ├─ Consistent?
    ├─ Only in dev or also prod?
    └─ Affects which features?
    ↓
4. ROOT CAUSE ANALYSIS
    ├─ What changed?
    ├─ Why did it break?
    └─ Was it predictable?
    ↓
5. FIX
    ├─ Implement proper fix
    ├─ Test thoroughly
    └─ Verify no side effects
    ↓
6. PREVENT
    ├─ Update scope.md
    ├─ Update current.md
    ├─ Add to prevention checklist
    └─ Share lesson learned
    ↓
RESOLVED
```

---

## ✅ PREVENTION CHECKLIST (Use Before Each Change)

### Before Modifying Any File:
- [ ] Read optimization.scope.md - Is file IN SCOPE?
- [ ] Read optimization.current.md - What's current status?
- [ ] Read this file - Any related past errors?
- [ ] Check PROTECTED AREAS - Am I touching forbidden code?
- [ ] Check INTERCONNECTED FEATURES - What else will be affected?
- [ ] Git commit current state - Can I rollback easily?
- [ ] Test locally first - Does it work in dev?
- [ ] Run build test - Does `pnpm build` succeed?

### After Making Any Change:
- [ ] Dev server starts - `pnpm dev` works?
- [ ] No console errors - Browser console clean?
- [ ] No build errors - `pnpm build` succeeds?
- [ ] Features work - Test critical paths?
- [ ] Playwright MCP test - Automated testing passed?
- [ ] Git commit - Save working state?
- [ ] Update current.md - Document progress?

---

## 📚 COMMON ERROR PATTERNS & SOLUTIONS

### Pattern 1: "Module not found" After Removing Dependency
**Error:**
```
Module not found: Can't resolve 'package-name'
```

**Root Cause:** Package was actually used, or transitive dependency

**Solution:**
```bash
# Reinstall package
pnpm install package-name

# Or check if it's a transitive dependency
pnpm why package-name
```

**Prevention:** Always grep search before removing

---

### Pattern 2: "Hydration failed" After Adding Dynamic Import
**Error:**
```
Hydration failed because the initial UI does not match what was rendered on the server
```

**Root Cause:** SSR/CSR mismatch with dynamic imports

**Solution:**
```tsx
// Ensure ssr: true for authenticated pages
const Component = dynamic(() => import('./Component'), {
  ssr: true,  // Match server rendering
  loading: () => <Skeleton />
});
```

**Prevention:** Always test in browser after adding dynamic imports

---

### Pattern 3: "window is not defined" in SSR
**Error:**
```
ReferenceError: window is not defined
```

**Root Cause:** Client-only code running on server

**Solution:**
```tsx
// Use ssr: false for client-only components
const ClientComponent = dynamic(() => import('./ClientComponent'), {
  ssr: false
});
```

**Prevention:** Use dynamic import with ssr: false for browser APIs

---

### Pattern 4: Build Fails with TypeScript Errors
**Error:**
```
Type error: Cannot find name 'X'
```

**Root Cause:** Enabled ignoreBuildErrors: false

**Solution:**
```javascript
// Temporarily revert to allow builds
typescript: {
  ignoreBuildErrors: true
}

// Then fix errors one by one
```

**Prevention:** Document all errors before enabling strict checks

---

### Pattern 5: Bundle Size Increases After Optimization
**Error:**
```
Bundle size: 1.5MB (was 1.2MB before)
```

**Root Cause:** Added bundle analyzer or didn't tree-shake properly

**Solution:**
```bash
# Check what increased
ANALYZE=true pnpm build
# Review bundle analysis

# Remove bundle analyzer from production
pnpm remove @next/bundle-analyzer
```

**Prevention:** Only use ANALYZE=true for analysis, not production

---

## 🎯 ERROR PREVENTION STRATEGIES

### Strategy 1: Incremental Testing
```
Change 1 file → Test → Commit
Change 2 files → Test → Commit
NOT: Change 10 files → Test → Debug hell
```

### Strategy 2: Grep Before Delete
```bash
# Before removing any file or package
grep -r "filename" app/ components/ lib/ hooks/
grep -r "package-name" app/ components/ lib/ hooks/
```

### Strategy 3: Backup Before Risky Changes
```bash
# Before modifying next.config.mjs or app/layout.tsx
cp next.config.mjs next.config.mjs.backup
cp app/layout.tsx app/layout.tsx.backup
```

### Strategy 4: Test Critical Paths After Every Change
```
Change → Dev Server → Manual Test → Playwright → Commit
Never skip testing critical paths (auth, typing test, admin)
```

### Strategy 5: Monitor Console Religiously
```
Browser Console: Check for errors/warnings
Terminal: Check dev server logs
Build logs: Check for warnings
```

---

## 🔍 DEBUG CHECKLIST

When investigating an error:
- [ ] **Reproduce:** Can you reproduce consistently?
- [ ] **Isolate:** What was the last change before error?
- [ ] **Console:** Any errors in browser console?
- [ ] **Terminal:** Any errors in dev server logs?
- [ ] **Git Diff:** What exactly changed? `git diff`
- [ ] **Rollback Test:** Does reverting fix it?
- [ ] **Dependencies:** Did package.json change?
- [ ] **Build:** Does `pnpm build` work?
- [ ] **TypeScript:** Does `pnpm tsc --noEmit` show errors?
- [ ] **ESLint:** Does `pnpm lint` show issues?

---

## 📖 ERROR DOCUMENTATION TEMPLATE

Copy this when documenting a new error:

```markdown
### ERROR-OPT-XXX: [Brief Description]
**Date:** YYYY-MM-DD  
**Phase:** Phase X  
**Severity:** CRITICAL | HIGH | MEDIUM | LOW  
**Status:** OPEN | IN PROGRESS | RESOLVED | WONTFIX  

**Description:**
[What went wrong? What was the symptom?]

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Error occurs

**Expected Behavior:**
[What should have happened]

**Actual Behavior:**
[What actually happened]

**Root Cause:**
[Why did this happen? What was the underlying issue?]

**Impact:**
- Feature X broken
- Performance degraded by Y%
- User experience affected: [how]

**Solution Applied:**
[How was it fixed? Include code snippets]

**Verification:**
- [x] Error no longer reproduces
- [x] Feature works correctly
- [x] No regressions introduced

**Prevention:**
[How to avoid this in the future]

**Files Changed:**
- path/to/file1.ts (reverted X)
- path/to/file2.tsx (fixed Y)

**Related Errors:**
- ERROR-OPT-XXX (if applicable)
- ERROR-ADMIN-XXX (if cross-feature)

**Lessons Learned:**
- Lesson 1: Description
- Lesson 2: Description

**Time to Resolve:** X hours/days

**Git Commits:**
- revert-hash: "revert: description"
- fix-hash: "fix: description"
```

---

## 🎓 OPTIMIZATION-SPECIFIC LESSONS

### Lesson OPT-1: Bundle Analyzer Environment Variables
**What:** Use ANALYZE env var to conditionally enable bundle analyzer  
**Why:** Prevents analyzer from running in production  
**How:**
```javascript
// next.config.mjs
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',  // Only when ANALYZE=true
});
```

### Lesson OPT-2: Dynamic Imports for Admin Routes
**What:** Keep ssr: true for authenticated routes  
**Why:** Prevents "window is not defined" and preserves auth state  
**How:**
```tsx
const AdminComponent = dynamic(() => import('./AdminComponent'), {
  ssr: true,  // Server-side render (auth is server-side)
  loading: () => <Skeleton />
});
```

### Lesson OPT-3: Font Display Swap
**What:** Add display: 'swap' to prevent FOIT  
**Why:** Better UX, no invisible text during font load  
**How:**
```tsx
const font = Font({ 
  subsets: ["latin"],
  display: 'swap',  // Show fallback immediately
  variable: '--font-name'
});
```

### Lesson OPT-4: Gradual Error Fixing
**What:** Document all errors before enabling strict checks  
**Why:** Prevents build from suddenly failing  
**How:**
1. Run `pnpm tsc --noEmit` → Document errors
2. Categorize (critical vs minor)
3. Fix critical errors first
4. Accept some minor errors
5. Then enable `ignoreBuildErrors: false`

### Lesson OPT-5: Test Image Optimization Costs First
**What:** Check Firebase pricing before enabling image optimization  
**Why:** Could significantly increase hosting costs  
**How:**
1. Audit all images first
2. Check Firebase pricing docs
3. Test on staging
4. Monitor costs after enabling
5. Rollback if too expensive

---

## 🔗 CROSS-REFERENCE INDEX

### Errors by Phase
```
Phase 1 (Cleanup): [No errors yet]
Phase 2 (Code Splitting): [No errors yet]
Phase 3 (Image Optimization): [No errors yet]
Phase 4 (Font Optimization): [No errors yet]
Phase 5 (Dependency Cleanup): [No errors yet]
Phase 6 (Build Hardening): [No errors yet]
Phase 7 (Production): [No errors yet]
Phase 8 (Monitoring): [No errors yet]
```

### Errors by Severity
```
CRITICAL: 0
HIGH: 0
MEDIUM: 0
LOW: 0
```

### Errors by Feature
```
Authentication: 0
Typing Test: 0
Admin Panel: 0
GDPR/Privacy: 0
Build System: 0
Dependencies: 0
```

---

## 📞 ESCALATION PATH

### Error Severity Levels & Actions

**CRITICAL (App Broken)**
- Authentication fails → STOP & ROLLBACK immediately
- Typing test broken → STOP & ROLLBACK immediately
- Data loss possible → STOP & ROLLBACK immediately
- Action: `git revert` or `git reset --hard`, alert user

**HIGH (Major Feature Broken)**
- Admin panel broken → STOP, fix before continuing
- Dashboard broken → STOP, fix before continuing
- API routes failing → STOP, fix before continuing
- Action: Fix immediately, don't proceed to next phase

**MEDIUM (Minor Feature Broken)**
- Settings page glitch → Document, fix if time allows
- Theme switching issue → Document, may continue
- Performance regression → Document, reassess approach
- Action: Fix if possible, or document for later

**LOW (Cosmetic or Edge Case)**
- Console warning → Document, fix later
- Minor visual glitch → Document, fix later
- Edge case bug → Document, fix later
- Action: Document, continue with optimization

---

## 💾 ERROR DATA BACKUP

### Backup Strategy
```bash
# Before each phase
git tag "optimization-phase-X-start"

# After each phase
git tag "optimization-phase-X-complete"

# If error occurs
git checkout "optimization-phase-X-start"  # Rollback to start
```

### Error Log Backup
```bash
# Save error logs
pnpm build 2>&1 | tee build-errors.log
pnpm tsc --noEmit 2>&1 | tee typescript-errors.log
pnpm lint 2>&1 | tee eslint-errors.log
```

---

## 📊 ERROR STATISTICS (Updated After Each Phase)

```
Total Errors Encountered: 0
Total Errors Resolved: 0
Total Rollbacks: 0
Average Resolution Time: N/A
Most Common Error Type: N/A
Most Affected Phase: N/A
```

---

**Last Updated:** November 19, 2025  
**Total Errors:** 0 (Planning Phase)  
**Next Review:** After Phase 1 completion  
**Error Log Status:** Clean (No errors encountered yet)
