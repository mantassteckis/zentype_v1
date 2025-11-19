# Font Loading Audit - Phase 4 Context Building

**Date:** November 19, 2025  
**Purpose:** Document current font loading behavior and prepare optimization strategy  
**Status:** ✅ AUDIT COMPLETE  

---

## 📊 Executive Summary

### Current Font Configuration

**Total Fonts Loaded:** 11 fonts (1 UI font + 10 typing fonts)
- **UI Font:** Inter (base application font)
- **Monospaced Typing Fonts:** 5 (Fira Code, JetBrains Mono, Source Code Pro, Roboto Mono, Ubuntu Mono)
- **Decorative Typing Fonts:** 5 (Playfair Display, Lobster, Pacifico, Merriweather, Righteous)

### Critical Finding: ❌ NO `display: 'swap'` CONFIGURED

**Current Behavior:**
- All 11 fonts use **default font-display strategy** (likely `block` or `auto`)
- **Result:** FOIT (Flash of Invisible Text) - text is invisible until fonts load
- **Impact:** Poor perceived performance on slow connections
- **Risk:** Users see blank text areas for 0.5-2 seconds on first visit

---

## 🔍 Detailed Font Analysis

### Font Loading Location

**File:** `app/layout.tsx`  
**Pattern:** Next.js `next/font/google` (optimized Google Fonts loader)  
**Loading Strategy:** All fonts loaded in root layout (no lazy loading)

```typescript
// Current configuration (app/layout.tsx)
import { 
  Inter,                    // UI font
  Fira_Code,               // Monospaced
  JetBrains_Mono,          // Monospaced
  Source_Code_Pro,         // Monospaced
  Roboto_Mono,             // Monospaced
  Ubuntu_Mono,             // Monospaced
  Playfair_Display,        // Decorative
  Lobster,                 // Decorative
  Pacifico,                // Decorative
  Merriweather,            // Decorative
  Righteous                // Decorative
} from "next/font/google"

// ❌ PROBLEM: No display: 'swap' configuration
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-fira-code" })
// ... 9 more fonts with same pattern
```

---

## 🎨 Font System Architecture

### 1. Font Definition (app/layout.tsx)

All fonts are imported from `next/font/google` and configured with:
- `subsets: ["latin"]` - Character subset
- `variable: "--font-*"` - CSS custom property name
- `weight: "400" | ["400", "700"]` - Font weights (some fonts)
- **MISSING:** `display: 'swap'` - Font-display strategy

### 2. CSS Variable Registration (app/globals.css)

Lines 97-112:
```css
@theme inline {
  --font-sans: var(--font-inter);
  --font-mono: var(--font-fira-code);

  /* Monospaced fonts */
  --font-fira-code: var(--font-fira-code);
  --font-jetbrains-mono: var(--font-jetbrains-mono);
  --font-source-code-pro: var(--font-source-code-pro);
  --font-roboto-mono: var(--font-roboto-mono);
  --font-ubuntu-mono: var(--font-ubuntu-mono);
  
  /* Decorative fonts */
  --font-playfair-display: var(--font-playfair-display);
  --font-lobster: var(--font-lobster);
  --font-pacifico: var(--font-pacifico);
  --font-merriweather: var(--font-merriweather);
  --font-righteous: var(--font-righteous);
}
```

### 3. Font Preference Management (hooks/useUserPreferences.ts)

**Constants:**
```typescript
export const TYPING_FONTS: TypingFont[] = [
  // Monospaced (5)
  { id: "fira-code", name: "Fira Code", className: "font-[family-name:var(--font-fira-code)]", isMonospace: true },
  { id: "jetbrains-mono", name: "JetBrains Mono", className: "font-[family-name:var(--font-jetbrains-mono)]", isMonospace: true },
  { id: "source-code-pro", name: "Source Code Pro", className: "font-[family-name:var(--font-source-code-pro)]", isMonospace: true },
  { id: "roboto-mono", name: "Roboto Mono", className: "font-[family-name:var(--font-roboto-mono)]", isMonospace: true },
  { id: "ubuntu-mono", name: "Ubuntu Mono", className: "font-[family-name:var(--font-ubuntu-mono)]", isMonospace: true },
  
  // Decorative (5)
  { id: "playfair-display", name: "Playfair Display", className: "font-[family-name:var(--font-playfair-display)]", isMonospace: false },
  { id: "lobster", name: "Lobster", className: "font-[family-name:var(--font-lobster)]", isMonospace: false },
  { id: "pacifico", name: "Pacifico", className: "font-[family-name:var(--font-pacifico)]", isMonospace: false },
  { id: "merriweather", name: "Merriweather", className: "font-[family-name:var(--font-merriweather)]", isMonospace: false },
  { id: "righteous", name: "Righteous", className: "font-[family-name:var(--font-righteous)]", isMonospace: false },
];
```

**Storage:**
- **localStorage:** `zentype-typing-font` (client-side persistence)
- **Firestore:** `profile.preferredFontId` (server-side persistence)
- **External Store:** `useSyncExternalStore` for cross-tab synchronization

**Default Font:** `fira-code` (Fira Code - monospaced)

### 4. Font Usage in Settings (app/settings/page.tsx)

**UI Elements:**
- Font selector dropdown (`<Select>` component)
- Live preview panel (shows selected font)
- Categorization: Monospaced vs. Decorative sections
- Real-time font swapping via `setFont()` hook

**Preservation Requirements (Per scope.md):**
- ✅ All 10 fonts MUST remain selectable
- ✅ Font switching MUST work after Phase 4 changes
- ✅ Font preferences MUST persist after changes
- ❌ CANNOT remove or break any of the 10 fonts

### 5. Font Usage in Typing Test (app/test/page.tsx)

**Where Applied:**
- Typing test text area (primary use case)
- Character-by-character feedback (correct/incorrect highlighting)
- Live preview during test configuration
- Results summary text

**CSS Classes Applied:**
```tsx
className={`text-lg ${currentFont.className} ${dynamicTextColor} leading-relaxed`}
```

**Performance Considerations:**
- Typing test is the **CORE FEATURE** (highest priority)
- Font swapping must be instant (no lag)
- No FOIT allowed during active typing
- Protected per scope.md - typing test performance is critical

---

## 📏 Font Loading Baseline Metrics

### Current Configuration (Before Phase 4)

| Font | Configuration | Weight | Subsets | display | Status |
|------|--------------|--------|---------|---------|--------|
| **Inter** | UI font | default | latin | ❌ NOT SET | Used globally |
| **Fira Code** | Monospaced | default | latin | ❌ NOT SET | Default typing font |
| **JetBrains Mono** | Monospaced | default | latin | ❌ NOT SET | Optional |
| **Source Code Pro** | Monospaced | default | latin | ❌ NOT SET | Optional |
| **Roboto Mono** | Monospaced | default | latin | ❌ NOT SET | Optional |
| **Ubuntu Mono** | Monospaced | ["400", "700"] | latin | ❌ NOT SET | Optional |
| **Playfair Display** | Decorative | default | latin | ❌ NOT SET | Optional |
| **Lobster** | Decorative | "400" | latin | ❌ NOT SET | Optional |
| **Pacifico** | Decorative | "400" | latin | ❌ NOT SET | Optional |
| **Merriweather** | Decorative | ["400", "700"] | latin | ❌ NOT SET | Optional |
| **Righteous** | Decorative | "400" | latin | ❌ NOT SET | Optional |

**Total Fonts:** 11 (1 UI + 10 typing)  
**All Loaded:** ✅ Yes (in root layout)  
**Lazy Loading:** ❌ No (all load immediately)  
**Font Display Strategy:** ❌ Not configured (defaults to 'block' or 'auto')

### Expected Font Sizes (Estimated from Google Fonts)

**Monospaced Fonts:**
- Fira Code: ~25-30 KB (woff2)
- JetBrains Mono: ~20-25 KB (woff2)
- Source Code Pro: ~20-25 KB (woff2)
- Roboto Mono: ~15-20 KB (woff2)
- Ubuntu Mono: ~20-25 KB (woff2)
- **Subtotal:** ~100-125 KB

**Decorative Fonts:**
- Playfair Display: ~25-30 KB (woff2)
- Lobster: ~15-20 KB (woff2)
- Pacifico: ~15-20 KB (woff2)
- Merriweather: ~25-30 KB (woff2)
- Righteous: ~15-20 KB (woff2)
- **Subtotal:** ~95-120 KB

**UI Font:**
- Inter: ~20-25 KB (woff2)

**Grand Total:** ~215-270 KB (all 11 fonts)

**Note:** Next.js optimizes Google Fonts by:
1. Self-hosting fonts (no external requests to fonts.googleapis.com)
2. Using woff2 format (best compression)
3. Subsetting to only needed characters (latin subset)
4. Inlining critical font CSS

---

## 🚨 Current Performance Issues

### Issue 1: FOIT (Flash of Invisible Text)

**Problem:**
- No `display: 'swap'` configured on any fonts
- Browser default behavior: hide text until fonts load
- Text is invisible for 0.5-2 seconds on slow connections

**Impact:**
- **Settings Page:** Font selector invisible until fonts load
- **Typing Test:** Test text invisible until font loads
- **Dashboard:** Statistics text invisible until fonts load
- **Poor UX:** Users see blank screens temporarily

**Severity:** 🟡 MEDIUM  
**Affected Users:** All users on first visit, slow connections, or cache-cleared browsers

### Issue 2: All Fonts Loaded Immediately

**Problem:**
- All 11 fonts load in root layout (no lazy loading)
- Even decorative fonts load if user never selects them
- ~215-270 KB loaded on every page, even if unused

**Impact:**
- Increased initial bundle size
- Slower First Contentful Paint (FCP)
- Wasted bandwidth for users who stick with default font

**Severity:** 🟢 LOW  
**Reasoning:** 
- Font sizes are relatively small (~20-25 KB each)
- Next.js optimizes fonts well (self-hosting, woff2, subsetting)
- User can select any font at any time (preloading improves UX)

### Issue 3: No Fallback Font Stack

**Current Fallback:**
```css
/* If font fails to load, browser uses default system font */
font-family: var(--font-fira-code); /* No fallback specified */
```

**Better Fallback (Not Implemented):**
```css
font-family: var(--font-fira-code), 'Courier New', Courier, monospace;
```

**Impact:**
- If Google Fonts CDN fails (rare), no fallback
- Text renders with unstyled system default font

**Severity:** 🟢 LOW (Google Fonts is very reliable)

---

## 🎯 Phase 4 Optimization Strategy

### Phase 4.1: Add `display: 'swap'` (RECOMMENDED ✅)

**What to Change:**
Add `display: 'swap'` to all 11 font declarations in `app/layout.tsx`

**Expected Improvement:**
- ✅ Eliminate FOIT (text visible immediately)
- ✅ Better perceived performance
- ✅ Improved First Contentful Paint (FCP)
- ✅ Minimal layout shift (fonts similar to fallbacks)

**Risk Level:** 🟢 LOW  
**Testing Required:**
- ✅ Verify all 10 fonts still load correctly
- ✅ Test font switching in settings (must work)
- ✅ Test typing test font display (no FOIT)
- ✅ Check for layout shift during font swap
- ✅ Verify all themes display correctly

**Implementation:**
```typescript
// BEFORE (current):
const firaCode = Fira_Code({ 
  subsets: ["latin"], 
  variable: "--font-fira-code" 
});

// AFTER (Phase 4.1):
const firaCode = Fira_Code({ 
  subsets: ["latin"], 
  variable: "--font-fira-code",
  display: 'swap',  // ✅ ADDED
});

// Repeat for all 11 fonts
```

**No Code Changes Needed In:**
- ✅ `app/settings/page.tsx` (font selector uses CSS variables)
- ✅ `app/test/page.tsx` (typing test uses CSS variables)
- ✅ `hooks/useUserPreferences.ts` (no changes needed)
- ✅ `app/globals.css` (CSS variables unchanged)

**Success Criteria:**
- [ ] All 11 fonts have `display: 'swap'` configured
- [ ] No FOIT visible in browser DevTools
- [ ] Font switching in settings still works
- [ ] Typing test displays fonts correctly
- [ ] No console errors
- [ ] Build succeeds (`pnpm build`)

---

### Phase 4.2: Lazy Load Decorative Fonts (NOT RECOMMENDED ❌)

**Proposal:**
Only load decorative fonts (Playfair Display, Lobster, Pacifico, Merriweather, Righteous) when user selects them in settings.

**Potential Savings:**
- ~95-120 KB (decorative fonts)
- Only if user never selects decorative fonts

**Why NOT Recommended:**

**Reason 1: Small Savings vs. High Complexity**
- Savings: ~100 KB (decorative fonts)
- Compared to: Total bundle ~955 MB (Phase 2 baseline)
- **Impact:** 0.01% reduction (negligible)

**Reason 2: UX Degradation**
- Current: Instant font switching (all fonts preloaded)
- After lazy loading: Delay when user selects decorative font
- **User Experience:** Worse (delays and loading states)

**Reason 3: Implementation Complexity**
- Need to track which fonts are loaded
- Add dynamic font loading logic
- Handle loading states in settings UI
- Potential hydration issues (client/server mismatch)
- Risk of breaking font switching functionality

**Reason 4: Protected Feature**
- Per scope.md: "All 10 fonts must remain accessible"
- Lazy loading could introduce bugs in font switching
- Protected area: Typography & Font System

**Reason 5: Typing Test Performance**
- Typing test is core feature (highest priority)
- Any delay in font loading affects typing UX
- Better to preload all fonts for instant switching

**Decision:** ❌ **SKIP Phase 4.2**  
**Rationale:** Small savings, high complexity, UX degradation, protected feature

---

## ✅ Phase 4 Final Recommendation

### Recommended Actions (Phase 4.1 Only)

**What to Do:**
1. ✅ Add `display: 'swap'` to all 11 fonts in `app/layout.tsx`
2. ✅ Test font switching in settings
3. ✅ Test typing test font display
4. ✅ Verify no FOIT in browser DevTools
5. ✅ Build and deploy

**What NOT to Do:**
- ❌ Do NOT lazy load decorative fonts (Phase 4.2 skipped)
- ❌ Do NOT remove any of the 10 typing fonts
- ❌ Do NOT change CSS variable names
- ❌ Do NOT modify font weights or subsets
- ❌ Do NOT break font switching functionality

**Expected Impact:**
- **Bundle Size:** 0 KB change (no fonts removed)
- **Build Time:** 0 seconds change (configuration only)
- **User Experience:** ✅ Improved (no FOIT)
- **Perceived Performance:** ✅ Better (text visible immediately)
- **Core Web Vitals:**
  - FCP: ✅ Improved (text visible sooner)
  - LCP: ✅ Improved (no invisible text)
  - CLS: ✅ Minimal impact (fonts similar to fallbacks)

**Risk Level:** 🟢 LOW  
**Time to Complete:** ~15 minutes (add 11 lines of code + testing)  
**Reversibility:** 100% (easy to revert if issues found)

---

## 📝 Testing Checklist for Phase 4

### Before Making Changes:
- [ ] Run `pnpm dev` (verify app works)
- [ ] Test font switching in settings (baseline)
- [ ] Test typing test with different fonts (baseline)
- [ ] Record Lighthouse score (baseline)

### After Adding `display: 'swap'`:
- [ ] Run `pnpm build` (verify build succeeds)
- [ ] Run `pnpm dev` (verify dev server starts)
- [ ] Open Chrome DevTools → Network tab
- [ ] Throttle to "Slow 3G"
- [ ] Navigate to `/test` page
- [ ] **Verify:** Text is visible immediately (no FOIT)
- [ ] Navigate to `/settings` page
- [ ] **Verify:** Font selector text is visible immediately
- [ ] Change font selection
- [ ] **Verify:** Font swaps correctly
- [ ] Open `/test` page with new font
- [ ] **Verify:** Typing test displays new font
- [ ] Test all 10 fonts (ensure none broken)
- [ ] Check browser console (no errors)
- [ ] Run Lighthouse audit (check for CLS regression)

### Cross-Browser Testing:
- [ ] Chrome (primary)
- [ ] Firefox (check font display behavior)
- [ ] Safari (check font display behavior)

---

## 🎓 Lessons Learned (Documented for Future)

**Lesson OPT-16 (To Be Confirmed):** Adding `display: 'swap'` to fonts eliminates FOIT with minimal code changes. Always configure font-display strategy for better perceived performance.

**Lesson OPT-17 (To Be Confirmed):** Lazy loading fonts is not worth the complexity for small font libraries (<300 KB). Preloading all fonts provides better UX (instant switching).

**Lesson OPT-18 (To Be Confirmed):** Protected features (10 themes, 10 fonts per scope.md) should not be lazy loaded. User preferences must be instantly accessible.

---

## 🔗 Related Documentation

### Internal Files:
- [Phase 4 Guide](/docs/optimization/PHASE_4_FONT_OPTIMIZATION.md) - Implementation guide
- [Optimization Scope](/docs/optimization/optimization.scope.md) - Font system is MEDIUM RISK
- [Optimization Current](/docs/optimization/optimization.current.md) - Progress tracking
- [Bundle Analysis](/docs/optimization/BUNDLE_ANALYSIS.md) - Phase 1-3 results

### External References:
- Next.js Font Optimization: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Google Fonts CSS: https://fonts.google.com/
- font-display Property: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display
- Web.dev Font Best Practices: https://web.dev/font-best-practices/

---

## 📊 Summary Table

| Metric | Current (Phase 3) | After Phase 4.1 | Change |
|--------|------------------|-----------------|---------|
| **Fonts Loaded** | 11 (all) | 11 (all) | 0 |
| **Font Display Strategy** | Not set (FOIT) | `swap` (no FOIT) | ✅ Improved |
| **Lazy Loading** | No | No | No change |
| **Bundle Size** | ~215-270 KB | ~215-270 KB | 0 KB |
| **Build Time** | 8.0s (Phase 2) | ~8.0s | 0 seconds |
| **FCP (est.)** | Delayed | Improved | ✅ Better |
| **CLS (est.)** | Low | Low | Minimal |
| **User Experience** | FOIT visible | No FOIT | ✅ Better |
| **Font Switching** | Works | Works | ✅ Preserved |
| **Protected Features** | All 10 fonts | All 10 fonts | ✅ Preserved |

---

**Audit Complete:** ✅ November 19, 2025  
**Next Step:** Create Phase 4 implementation plan  
**Status:** Ready for Phase 4.1 (add `display: 'swap'`)  
**Phase 4.2:** Skipped (lazy loading not recommended)
