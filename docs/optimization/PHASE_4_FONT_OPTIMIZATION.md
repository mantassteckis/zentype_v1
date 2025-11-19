# Phase 4: Font Optimization

**Status:** 📋 NOT STARTED  
**Risk Level:** 🟡 MEDIUM RISK  
**Estimated Impact:** Improved CLS (Cumulative Layout Shift), faster text rendering  
**Dependencies:** None (independent phase)  
**Created:** November 19, 2025

---

## 📋 Overview

ZenType loads **10 fonts** in `/app/layout.tsx`. Currently missing critical performance optimization: **`display: 'swap'`**. This causes FOIT (Flash of Invisible Text) - users see blank text until fonts load.

Additionally, decorative fonts (5 of 10) are loaded even if users never select them in settings.

---

## 🎯 Objectives

1. **Add `display: 'swap'`** to all fonts → Prevents FOIT
2. **Lazy load decorative fonts** → Only load when user selects them
3. **Improve CLS** → Reduce layout shift from font loading
4. **Maintain typography system** → Don't break existing theme system

---

## 🔍 Current State Analysis

### Fonts Loaded in `/app/layout.tsx`

Based on theme system documentation (November 3, 2025):

**Monospaced Fonts (5):**
1. Fira Code (default)
2. JetBrains Mono
3. Source Code Pro
4. Roboto Mono
5. Ubuntu Mono

**Decorative Fonts (5):**
6. Playfair Display
7. Lobster
8. Pacifico
9. Bebas Neue
10. Righteous

### Current Implementation (Hypothetical)

```typescript
// app/layout.tsx
import { Fira_Code, JetBrains_Mono, Source_Code_Pro, Roboto_Mono, Ubuntu_Mono } from 'next/font/google';
import { Playfair_Display, Lobster, Pacifico, Bebas_Neue, Righteous } from 'next/font/google';

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
  // ❌ Missing: display: 'swap'
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  // ❌ Missing: display: 'swap'
});

// ... repeat for all 10 fonts
```

### Problems

1. **FOIT:** Text invisible until fonts download
2. **All Loaded:** All 10 fonts loaded on every page
3. **CLS:** Layout shifts when fonts load
4. **Bandwidth:** Decorative fonts downloaded even if unused

---

## 🔧 Phase 4.1: Add display: 'swap'

### What is `display: 'swap'`?

CSS font-display property with 4 values:
- `auto`: Browser default (usually `block`)
- `block`: Hide text until font loads (FOIT) ❌
- `swap`: Show fallback font, swap when ready ✅
- `fallback`: Show fallback, give up after 3s
- `optional`: Show fallback, only swap if cached

**Best for ZenType:** `swap` - Users see text immediately with fallback font.

### Implementation

#### File: `/app/layout.tsx`

**Find all font declarations and add `display: 'swap'`:**

```typescript
import { 
  Fira_Code, 
  JetBrains_Mono, 
  Source_Code_Pro, 
  Roboto_Mono, 
  Ubuntu_Mono,
  Playfair_Display,
  Lobster,
  Pacifico,
  Bebas_Neue,
  Righteous
} from 'next/font/google';

// Monospaced fonts
const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
  display: 'swap',  // ✅ Added
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',  // ✅ Added
});

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-source-code-pro',
  display: 'swap',  // ✅ Added
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  display: 'swap',  // ✅ Added
});

const ubuntuMono = Ubuntu_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-ubuntu-mono',
  display: 'swap',  // ✅ Added
});

// Decorative fonts
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  display: 'swap',  // ✅ Added
});

const lobster = Lobster({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-lobster',
  display: 'swap',  // ✅ Added
});

const pacifico = Pacifico({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-pacifico',
  display: 'swap',  // ✅ Added
});

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas-neue',
  display: 'swap',  // ✅ Added
});

const righteous = Righteous({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-righteous',
  display: 'swap',  // ✅ Added
});
```

### Testing Phase 4.1

**1. Visual Testing:**
```bash
pnpm dev
# Open localhost:3000
# Network tab → Throttle to "Slow 3G"
# Verify text is VISIBLE immediately (using fallback)
# Verify text swaps to custom font when loaded
```

**2. Lighthouse Audit:**
```bash
# Run Lighthouse on localhost
# Check "Cumulative Layout Shift" (CLS) score
# Should improve slightly
```

**3. Font Loading Behavior:**
- Text should never be invisible
- Brief flash of system font acceptable
- No layout jumps when font loads

---

## 🔧 Phase 4.2: Lazy Load Decorative Fonts

### Strategy

**Problem:** Decorative fonts are loaded even if user never selects them.

**Solution:** Only load decorative fonts when user selects them in settings.

### Implementation Approach

#### Option A: Dynamic Font Loading (Complex)

Load fonts dynamically based on user preference:

```typescript
// hooks/useFontLoader.ts
'use client';

import { useEffect } from 'react';

export function useFontLoader(fontName: string) {
  useEffect(() => {
    if (fontName.startsWith('decorative-')) {
      // Load decorative font dynamically
      const fontFamily = fontName.replace('decorative-', '');
      
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${fontFamily}:wght@400;700&display=swap`;
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [fontName]);
}

// In typing test component
const { font } = useUserPreferences();
useFontLoader(font);
```

**Pros:**
- Only loads selected font
- Maximum bandwidth savings

**Cons:**
- Complex implementation
- Potential flash of unstyled text
- May not work with next/font optimization

#### Option B: Conditional Loading (Simpler)

Check user preference, only load if needed:

```typescript
// app/layout.tsx
'use client';

import { useUserPreferences } from '@/hooks/useUserPreferences';

export default function RootLayout({ children }) {
  const { font } = useUserPreferences();
  
  // Only load decorative fonts if user has selected one
  const shouldLoadDecorative = [
    'Playfair Display',
    'Lobster', 
    'Pacifico',
    'Bebas Neue',
    'Righteous'
  ].includes(font);
  
  return (
    <html className={cn(
      firaCode.variable,  // Always load monospaced
      jetbrainsMono.variable,
      sourceCodePro.variable,
      robotoMono.variable,
      ubuntuMono.variable,
      shouldLoadDecorative && playfairDisplay.variable,  // Conditional
      shouldLoadDecorative && lobster.variable,
      shouldLoadDecorative && pacifico.variable,
      shouldLoadDecorative && bebasNeue.variable,
      shouldLoadDecorative && righteous.variable,
    )}>
      <body>{children}</body>
    </html>
  );
}
```

**Pros:**
- Simpler implementation
- Works with next/font

**Cons:**
- Must load preference before rendering
- Potential hydration issues

#### Option C: Keep All Fonts, Accept Trade-off (Recommended)

**Decision:** Load all fonts with `display: 'swap'`, accept the bandwidth cost.

**Reasoning:**
1. Decorative fonts are small (~20-30KB each)
2. Total savings: ~150KB (minor compared to JS bundles)
3. No hydration issues
4. No flash of unstyled text
5. Simpler maintenance

**If bandwidth becomes issue:** Revisit Option A or B.

### Recommendation for Phase 4.2

**SKIP lazy loading for now.** Focus on `display: 'swap'` which has bigger impact with less risk.

**Document Decision:**
```markdown
## Phase 4.2 Decision: Keep All Fonts Loaded

**Reasoning:**
- Decorative fonts total ~150KB
- Complexity of lazy loading not worth savings
- `display: 'swap'` already improves perceived performance
- Can revisit if bandwidth becomes issue

**Alternative Considered:**
- Dynamic font loading via `useEffect`
- Rejected due to hydration complexity
```

---

## ✅ Success Criteria

Phase 4 is complete when:

1. **Font Display Property Added:**
   - [ ] All 10 fonts have `display: 'swap'`
   - [ ] No FOIT (text always visible)
   - [ ] Text swaps to custom font smoothly

2. **Testing Passed:**
   - [ ] Lighthouse CLS score improved
   - [ ] Network throttling test (Slow 3G)
   - [ ] Playwright MCP: Typing test renders correctly
   - [ ] Playwright MCP: Settings font selector works
   - [ ] No layout shifts during font swap

3. **Documentation Updated:**
   - [ ] Font loading behavior documented
   - [ ] Phase 4.2 decision recorded (skip lazy loading)
   - [ ] Lighthouse scores before/after recorded

4. **Git Commit:**
   - [ ] Commit message: `perf: Add font-display swap to prevent FOIT`

5. **IKB Updated:**
   - [ ] `/docs/optimization/optimization.current.md` updated: Phase 4 → 100%

---

## 📊 Expected Improvements

### Cumulative Layout Shift (CLS)

**Before:**
- Text invisible → Font loads → Layout shift
- CLS: 0.05-0.15 (poor to needs improvement)

**After:**
- Fallback text → Font swaps (minimal shift)
- CLS: 0.01-0.05 (good)

### User Experience

**Before:**
- Blank text for 0.5-2 seconds (depending on connection)
- Confusing empty state

**After:**
- Immediate text visibility
- Smooth font swap
- Better perceived performance

### Lighthouse Score

**Performance:**
- Before: 75-85
- After: 78-88 (+3-5 points)

---

## 🚨 Rollback Plan

If issues occur:

```bash
# Revert font changes
git checkout HEAD~1 app/layout.tsx

# Test
pnpm dev
```

**Potential Issues:**

1. **Font doesn't load:**
   - Check browser console for errors
   - Verify Google Fonts availability

2. **Flash of unstyled text too jarring:**
   - Consider `display: 'fallback'` instead
   - Adjust fallback font stack

3. **Layout shift still occurs:**
   - Check if font size differs from fallback
   - Adjust line-height, letter-spacing to match

---

## 🔗 Related Documentation

- `/docs/theme-system/theme-system.current.md` - Theme and font system implementation
- `/docs/optimization/optimization.scope.md` - Root layout in MEDIUM RISK zones
- Next.js Font Optimization: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Web.dev Font Best Practices: https://web.dev/font-best-practices/

---

## 📝 Notes for Future Agents

1. **`display: 'swap'` is Low Risk** - Safe to add to all fonts
2. **Lazy Loading is Complex** - Not worth the effort for 150KB savings
3. **CLS Improvement is Subtle** - Don't expect dramatic changes
4. **Test on Slow Network** - FOIT only visible on slow connections
5. **Fallback Font Matters** - Choose similar fallback for minimal shift
6. **Typing Test Most Affected** - Verify font swapping doesn't disrupt typing

---

**Last Updated:** November 19, 2025  
**Previous Phase:** [Phase 3: Image Optimization](/docs/optimization/PHASE_3_IMAGE_OPTIMIZATION.md)  
**Next Phase:** [Phase 5: Dependency Cleanup](/docs/optimization/PHASE_5_DEPENDENCY_CLEANUP.md)
