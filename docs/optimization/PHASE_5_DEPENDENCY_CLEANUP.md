# Phase 5: Dependency Cleanup & Bundle Size Reduction

**Status:** 📋 NOT STARTED  
**Risk Level:** 🟢 LOW RISK  
**Dependencies:** Phase 1 complete (DEPENDENCY_AUDIT.md exists)  
**Estimated Impact:** 2-5% bundle size reduction  
**Created:** November 19, 2025

---

## 📋 Table of Contents

- [Overview](#overview)
- [Objectives](#objectives)
- [Pre-Phase Checklist](#pre-phase-checklist)
- [Step 1: Review Phase 1 Audit](#step-1-review-phase-1-audit)
- [Step 2: Remove Confirmed Unused Packages](#step-2-remove-confirmed-unused-packages)
- [Step 3: Measure Bundle Size Impact](#step-3-measure-bundle-size-impact)
- [Step 4: Verify Application Stability](#step-4-verify-application-stability)
- [Testing Requirements](#testing-requirements)
- [Success Criteria](#success-criteria)
- [Rollback Plan](#rollback-plan)
- [Expected Results](#expected-results)
- [Notes for Future Agents](#notes-for-future-agents)

---

## 🎯 Overview

**Purpose:** Remove confirmed unused dependencies to reduce bundle size and improve build times.

**Scope:** This phase focuses on dependencies that were identified as unused in Phase 1's dependency audit. We will NOT remove dependencies that are ambiguous or might be used indirectly.

**Conservative Approach:** We remove only what we're 100% certain is unused. Better to keep a few KB of unused code than to break the application.

**Key Principle:** Measure before and after. Every removal must be verified with bundle analysis and full application testing.

---

## 🎯 Objectives

1. ✅ Remove `@vercel/analytics` package (confirmed unused)
2. ✅ Review Phase 1 audit for other safe removal candidates
3. ✅ Measure bundle size reduction after each removal
4. ✅ Verify no broken imports or runtime errors
5. ✅ Document all changes for future reference

---

## ✅ Pre-Phase Checklist

Before starting this phase, verify:

- [ ] Phase 1 complete (DEPENDENCY_AUDIT.md exists)
- [ ] `DEPENDENCY_AUDIT.md` contains list of flagged packages
- [ ] BUNDLE_ANALYSIS.md exists with baseline metrics
- [ ] Git working directory is clean (`git status`)
- [ ] Dev server can start successfully (`pnpm dev`)
- [ ] Build succeeds (`pnpm build`)
- [ ] You're on a feature branch (NOT master/main)

**Create Phase 5 branch:**
```bash
git checkout -b optimization/phase-5-dependency-cleanup
```

---

## 📖 Step 1: Review Phase 1 Audit

### Read DEPENDENCY_AUDIT.md

```bash
cat /docs/optimization/DEPENDENCY_AUDIT.md
```

**Look for:**
- Packages marked as "UNUSED" with HIGH confidence
- Packages with zero grep results in codebase
- Packages not listed in any import statements

### Confirmed Removal Candidate: @vercel/analytics

**Evidence from Phase 1:**
- ✅ VERCEL_CLEANUP_SUMMARY.md confirms this was supposed to be removed
- ✅ Never imported anywhere in the codebase
- ✅ Not a peer dependency of any other package
- ✅ Not used in build scripts or configuration files

**Grep Verification (before removal):**
```bash
grep -r "@vercel/analytics" app/ components/ lib/ hooks/
# Expected: No results

grep -r "vercel/analytics" package.json
# Expected: Shows it's installed
```

### Other Potential Candidates

Review each package in DEPENDENCY_AUDIT.md:

**Questions to ask:**
1. Does `grep -r "package-name"` return zero results?
2. Is it NOT listed in `peerDependencies` of any other package?
3. Can we verify it's not used by Next.js/Firebase internally?

**Conservative Rule:** If you're not 100% certain, SKIP IT. Document why you skipped it.

---

## 🗑️ Step 2: Remove Confirmed Unused Packages

### Removal 1: @vercel/analytics

#### Before Removal - Capture Baseline

```bash
# Measure current bundle size
pnpm run build
# Note the output sizes from Next.js build report

# Or use bundle analyzer
ANALYZE=true pnpm run build
# Open .next/analyze/client.html and note sizes
```

**Document in working notes:**
```markdown
## Before @vercel/analytics Removal

- Total JS: ___ KB
- Initial JS: ___ KB
- Package count: ___ packages
```

#### Remove Package

```bash
pnpm remove @vercel/analytics
```

**Verify removal:**
```bash
grep "vercel/analytics" package.json
# Should return no results

# Check lock file updated
git diff pnpm-lock.yaml
# Should show @vercel/analytics removed
```

#### After Removal - Measure Impact

```bash
# Rebuild
pnpm run build

# Or with analyzer
ANALYZE=true pnpm run build
```

**Document impact:**
```markdown
## After @vercel/analytics Removal

- Total JS: ___ KB (reduction: ___ KB / ___%)
- Initial JS: ___ KB (reduction: ___ KB / ___%)
- Package count: ___ packages (reduction: 1 package)
```

#### Test Application

```bash
# Start dev server
pnpm dev

# Open http://localhost:3000
# Verify application loads with no console errors
```

**Check console for import errors:**
- No `Module not found` errors
- No `Cannot resolve module` errors
- No runtime errors related to analytics

#### Commit This Change

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: Remove unused @vercel/analytics package

- Package was never imported in codebase
- Confirmed by VERCEL_CLEANUP_SUMMARY.md
- Bundle size reduction: ___ KB
- No breaking changes detected"
```

---

### Removal 2: Other Candidates (If Any)

**Only proceed if Phase 1 audit identified other packages with HIGH confidence.**

#### Example Process for Each Package

```bash
# 1. Verify unused
grep -r "package-name" app/ components/ lib/ hooks/

# 2. Check if it's a peer dependency
pnpm list --depth=0 | grep "package-name"

# 3. Remove
pnpm remove package-name

# 4. Test
pnpm build
pnpm dev

# 5. Commit
git commit -m "chore: Remove unused [package-name]"
```

**If uncertain about ANY package:**
- Document why you're uncertain
- Skip the removal
- Note it in optimization.current.md as "Needs further investigation"

---

## 📊 Step 3: Measure Bundle Size Impact

### Bundle Analyzer Report

```bash
ANALYZE=true pnpm run build
```

**Open `.next/analyze/client.html`**

**Compare with Phase 1 baseline:**

| Metric | Phase 1 Baseline | Phase 5 After Cleanup | Change |
|--------|------------------|----------------------|--------|
| Total JS | ___ KB | ___ KB | -___ KB (___%) |
| Initial JS | ___ KB | ___ KB | -___ KB (___%) |
| Main chunk | ___ KB | ___ KB | -___ KB (___%) |
| Package count | ___ | ___ | -___ |

### Update DEPENDENCY_AUDIT.md

Add section at the end:

```markdown
## Phase 5 Cleanup Results (November 19, 2025)

### Packages Removed
1. @vercel/analytics - ___ KB saved
2. [Other packages if any]

### Total Impact
- Bundle size reduction: ___ KB (___%)
- Build time change: ___ seconds
- Package count reduction: ___

### Packages Skipped (Uncertain)
- [List any packages you were unsure about]
- [Reasoning for each]
```

---

## 🧪 Step 4: Verify Application Stability

### Build Verification

```bash
# Clean build
rm -rf .next
pnpm build

# Should complete with no errors
# Note: TypeScript/ESLint errors may still show (ignoreBuildErrors: true)
# That's expected - Phase 6 will address those
```

**Success indicators:**
- ✅ Build completes
- ✅ No "Module not found" errors
- ✅ No new errors compared to Phase 1 baseline

### Development Server Test

```bash
pnpm dev
```

**Open http://localhost:3000 and verify:**
- [ ] Homepage loads
- [ ] No console errors related to removed packages
- [ ] No red error overlays

---

## ✅ Testing Requirements

### Manual Testing Checklist

- [ ] Homepage loads without errors
- [ ] Login/Signup pages work
- [ ] Typing test page loads
- [ ] Dashboard displays correctly
- [ ] Settings page functional
- [ ] No console errors in browser devtools

### Playwright MCP Testing (Recommended)

```bash
# Launch Playwright MCP browser
# Navigate to http://localhost:3000
```

**Test scenarios:**
1. **Homepage:**
   - Page loads
   - No JavaScript errors
   
2. **Authentication Flow:**
   - Login with saved credentials
   - Verify dashboard access
   
3. **Typing Test:**
   - Start a practice test
   - Verify test works correctly
   
4. **Navigation:**
   - Test all main navigation links
   - Verify no broken pages

**Screenshot comparison:**
- Compare before/after screenshots
- Should look identical (no visual regressions)

### Critical Path Testing

**Must verify these core features work:**

1. ✅ User can log in
2. ✅ User can start typing test
3. ✅ Test results save to Firestore
4. ✅ Dashboard displays statistics
5. ✅ Settings can be changed

**If ANY of these fail, ROLLBACK IMMEDIATELY.**

---

## ✅ Success Criteria

### Required (Must Complete All)

- [ ] `@vercel/analytics` removed from package.json
- [ ] pnpm-lock.yaml updated
- [ ] Build succeeds with no new errors
- [ ] Dev server starts successfully
- [ ] No console errors related to removed packages
- [ ] Bundle size reduction measured and documented
- [ ] DEPENDENCY_AUDIT.md updated with Phase 5 results
- [ ] Git commit created with clear message
- [ ] optimization.current.md updated: Phase 5 → 100%

### Optional (Bonus)

- [ ] Additional packages removed (if found safe)
- [ ] Playwright MCP testing completed
- [ ] Before/after bundle analyzer screenshots saved

---

## 🔄 Rollback Plan

### If ANY Issues Detected

**Immediate rollback:**

```bash
# Revert last commit
git reset --hard HEAD~1

# Or if multiple commits
git reset --hard [commit-hash-before-phase-5]

# Reinstall original dependencies
pnpm install

# Rebuild
pnpm build

# Test
pnpm dev
```

### Partial Rollback (If One Package Causes Issues)

```bash
# Reinstall just the problematic package
pnpm add @vercel/analytics

# Test
pnpm build
pnpm dev

# Remove that package from "removed" list in docs
```

---

## 📈 Expected Results

### Bundle Size Reduction

**Conservative estimate:**
- @vercel/analytics: ~50-100 KB (gzipped)
- Total reduction: 2-5% of bundle size

**Realistic expectation:**
```
Before Phase 5: ~1.2 MB total JS
After Phase 5: ~1.15-1.18 MB total JS
Savings: ~20-50 KB (1.7-4.2%)
```

### Build Time Impact

- Minimal or no change
- Fewer packages to process during dependency resolution
- Slightly faster `pnpm install` in CI/CD

### Application Behavior

- ✅ No user-facing changes
- ✅ Application functions identically
- ✅ No performance regressions
- ✅ Cleaner package.json

---

## 📝 Notes for Future Agents

### Why This Phase is Low Risk

1. **Only removing unused code** - Nothing active is being modified
2. **Verification at every step** - Build and test after each removal
3. **Easy rollback** - Git makes it trivial to undo
4. **Small impact** - Even if we remove nothing, no harm done

### Common Pitfalls to Avoid

1. ❌ **Don't remove packages used by other packages**
   - Always check `pnpm list` for peer dependencies
   
2. ❌ **Don't remove packages used in config files**
   - Check next.config.mjs, tailwind.config.ts, etc.
   
3. ❌ **Don't remove packages used in build scripts**
   - Check package.json scripts section
   
4. ❌ **Don't assume zero grep results = unused**
   - Some packages are used by Next.js/Firebase internally
   - Conservative approach: when in doubt, keep it

### Decision Matrix: Should I Remove This Package?

| Scenario | Action | Reasoning |
|----------|--------|-----------|
| Zero grep results + documented as unused | ✅ REMOVE | Safe |
| Zero grep results + no documentation | ⚠️ INVESTIGATE | Need more confidence |
| Used in other package's peerDependencies | ❌ KEEP | Required by ecosystem |
| Used in config files | ❌ KEEP | Build dependency |
| Uncertain about usage | ❌ KEEP | 99% Certainty Rule |

### Documentation Requirements

After completing this phase, you MUST update:

1. **optimization.current.md**
   - Phase 5 progress: 0% → 100%
   - Lessons learned (if any issues encountered)
   
2. **DEPENDENCY_AUDIT.md**
   - Add "Phase 5 Cleanup Results" section
   - Document what was removed and impact
   
3. **MAIN.md**
   - Add entry to Recent Changes Log
   - Update Last Updated timestamp

### Integration with Other Phases

**Phase 1 provided:** List of removal candidates  
**Phase 5 executes:** Actual removal and verification  
**Phase 6 may reveal:** More dependencies can be removed after fixing TypeScript errors  
**Phase 8 validates:** Bundle size improvements in Lighthouse audit

---

## 🔗 Related Documentation

- [Phase 1: Safe Cleanup & Analysis](/docs/optimization/PHASE_1_SAFE_CLEANUP.md) - Source of audit
- [Phase 2: Code Splitting](/docs/optimization/PHASE_2_CODE_SPLITTING.md) - Complementary bundle reduction
- [optimization.scope.md](/docs/optimization/optimization.scope.md) - Scope boundaries
- [VERCEL_CLEANUP_SUMMARY.md](/docs/VERCEL_CLEANUP_SUMMARY.md) - Historical context for @vercel/analytics

---

## ✅ Phase 5 Completion Checklist

Before marking this phase complete, verify:

- [ ] All required success criteria met
- [ ] Build succeeds
- [ ] Dev server runs
- [ ] Application tested and functional
- [ ] Bundle size reduction measured
- [ ] Documentation updated (DEPENDENCY_AUDIT.md, optimization.current.md)
- [ ] Git commit created
- [ ] No regressions detected

**Sign-off:**
```markdown
Phase 5: Dependency Cleanup - ✅ COMPLETE
Date: November [XX], 2025
Packages Removed: [count]
Bundle Size Reduction: [X] KB ([X]%)
Status: All success criteria met, no issues detected
```

---

**Last Updated:** November 19, 2025  
**Phase Navigation:** [← Phase 4: Font Optimization](/docs/optimization/PHASE_4_FONT_OPTIMIZATION.md) | [Phase 6: Build Hardening →](/docs/optimization/PHASE_6_BUILD_HARDENING.md)
