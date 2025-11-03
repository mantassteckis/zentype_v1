# Theme System - Scope Definition

**Last Updated:** November 3, 2025  
**Feature:** Theme & Font Customization System  
**Status:** 🔧 FIXING BROKEN IMPLEMENTATION

---

## 🎯 What IS in Scope

### Files to Modify
1. **`/app/settings/page.tsx`** - Settings UI with theme/font selectors
   - Replace hardcoded theme/font arrays (lines 27-47)
   - Import and use `useUserPreferences` hook
   - Use `availableThemes`, `availableFonts`, `dynamicTextColor`
   - Update theme card rendering
   - Update font selector with categorization

2. **`/hooks/useUserPreferences.ts`** - ⚠️ NEEDS COMPLETE REWRITE
   - Currently only has basic profile loading
   - Does NOT have theme/font arrays
   - Does NOT have `dynamicTextColor` system
   - Does NOT have `setTheme` and `setFont` functions
   - **MUST IMPLEMENT ACCORDING TO DOCUMENTATION**

3. **`/app/test/page.tsx`** - Typing test page (MUST UPDATE)
   - Currently has hardcoded theme/font arrays
   - NOT using `useUserPreferences` hook
   - Uses local `typingCustomization` state
   - NEEDS TO BE UPDATED to use the new hook

### Changes Required
1. ✅ **Remove local state** - Delete `useState` for `selectedTheme` and `selectedFont`
2. ✅ **Remove hardcoded arrays** - Delete `typingThemes` and `fontOptions` arrays
3. ✅ **Import useUserPreferences** - Use centralized hook
4. ✅ **Update rendering** - Use `availableThemes` and `availableFonts` from hook
5. ✅ **Fix theme IDs** - Migrate from old IDs (`default` → `standard`, `neon-wave` → `neon-dreams`)
6. ✅ **Add font categorization** - Group fonts as Monospaced / Decorative with icons
7. ✅ **Use dynamic text color** - Replace `currentTheme.textColor` with `dynamicTextColor`

---

## ❌ What is NOT in Scope

### Protected Files (DO NOT TOUCH)
1. **`/hooks/useUserPreferences.ts`** - Already correctly implemented
2. **`/app/layout.tsx`** - Font loading already configured
3. **`/app/globals.css`** - CSS variables already set up
4. **`/lib/firebase/firestore.ts`** - Profile saving already working
5. **`/components/ui/*`** - UI components (Select, Switch, Button, etc.)
6. **`/components/header.tsx`** - Navigation component

### Features NOT to Change
- Authentication system
- Profile saving mechanism
- Database schema
- API routes
- Other settings (keyboard sounds, visual feedback, auto-save)
- Delete account functionality

---

## ⚠️ Critical Areas (HIGH RISK)

### Lines to Pay Attention To

#### `/app/settings/page.tsx`
- **Lines 27-47** - Hardcoded theme/font arrays (DELETE THESE)
- **Lines 59-71** - Profile loading useEffect (DO NOT BREAK)
- **Lines 73-80** - Local storage fallback (DELETE THIS)
- **Lines 82-102** - Manual theme/font change handlers (REPLACE WITH HOOK FUNCTIONS)
- **Lines 200-230** - Theme preview and card rendering (UPDATE TO USE HOOK DATA)
- **Lines 270-290** - Font selector rendering (UPDATE WITH CATEGORIZATION)

#### Common Mistakes to Avoid
1. ❌ **Don't break profile loading** - Existing useEffect for profile must still work
2. ❌ **Don't break settings switches** - Keyboard sounds, visual feedback, auto-save must stay functional
3. ❌ **Don't break save button** - "Save Changes" button must still update Firestore
4. ❌ **Don't break delete account** - Danger zone functionality must remain intact
5. ❌ **Don't modify useUserPreferences hook** - It's already correct

---

## 🔗 Interconnected Features

### Dependencies (What Depends on Theme System)
1. **Typing Test Page** (`/app/test/page.tsx`)
   - Uses `currentTheme` for typing area background
   - Uses `currentFont` for text rendering
   - Uses `dynamicTextColor` for text visibility
   - **Impact:** If we break theme system, typing area won't render correctly

2. **User Profile System** (`/lib/firebase/firestore.ts`)
   - Saves `preferredThemeId` and `preferredFontId` to Firestore
   - **Impact:** Profile saving must continue working

3. **Settings Page** (`/app/settings/page.tsx`)
   - Displays theme/font previews
   - Allows theme/font selection
   - **Impact:** This is what we're fixing

### What This Feature Expects
- `useUserPreferences` hook to provide:
  - `availableThemes` array (10 themes)
  - `availableFonts` array (10 fonts)
  - `currentTheme` object (selected theme)
  - `currentFont` object (selected font)
  - `dynamicTextColor` string (smart text color)
  - `setTheme(themeId)` function
  - `setFont(fontId)` function

---

## 📚 Files to Reference

### Documentation
- `/docs/theme-system/theme-system.prd.md` - Complete theme/font specifications
- `/docs/theme-system/theme-system.current.md` - Implementation summary
- `/docs/MAIN.md` - Central IKB index

### Helper Files
- `/hooks/useUserPreferences.ts` - THE SOURCE OF TRUTH for theme/font data
- `/app/test/page.tsx` - Example of correct usage

### Constants
- Theme IDs: `standard`, `midnight-blue`, `forest-mist`, `neon-dreams`, `sunset-blaze`, `ocean-aurora`, `light-sky`, `soft-lavender`, `cosmic-void`, `matrix-code`
- Font IDs: `fira-code`, `jetbrains-mono`, `source-code-pro`, `roboto-mono`, `ubuntu-mono`, `playfair-display`, `lobster`, `pacifico`, `merriweather`, `righteous`

---

## 🧪 Testing Requirements

### Before Commit - Playwright MCP Testing
1. ✅ **Settings Page Loads** - No errors, all sections visible
2. ✅ **Theme Selector Shows 10 Themes** - All theme cards render
3. ✅ **Font Selector Shows 10 Fonts** - Grouped by type (Monospaced/Decorative)
4. ✅ **Theme Change Works** - Click theme card, preview updates
5. ✅ **Font Change Works** - Select font, preview updates
6. ✅ **Preview Matches Typing Area** - Colors and fonts match
7. ✅ **Save Button Works** - No errors when saving
8. ✅ **Profile Persistence** - Reload page, preferences remain
9. ✅ **Other Settings Work** - Switches for sounds/feedback still functional
10. ✅ **Typing Test Uses Theme** - Navigate to /test, verify theme applied

---

## 🚨 Known Issues to Fix

### Issue 1: Hardcoded Theme/Font Arrays
**Problem:** Settings page has only 6 themes and 5 fonts instead of 10 each  
**Solution:** Remove local arrays, use `useUserPreferences` hook  
**Files:** `/app/settings/page.tsx` lines 27-47

### Issue 2: Wrong Theme IDs
**Problem:** Using old IDs like `default` instead of `standard`  
**Solution:** Update theme IDs to match hook  
**Files:** `/app/settings/page.tsx` line 27

### Issue 3: No Font Categorization
**Problem:** Fonts not grouped by type (Monospaced vs Decorative)  
**Solution:** Add grouping and icons (⌨️ / 🎨)  
**Files:** `/app/settings/page.tsx` lines 270-290

### Issue 4: Manual State Management
**Problem:** Using local `useState` instead of centralized hook  
**Solution:** Remove local state, use hook state  
**Files:** `/app/settings/page.tsx` lines 19-20

### Issue 5: Static Text Color
**Problem:** Using `currentTheme.textColor` instead of `dynamicTextColor`  
**Solution:** Replace with `dynamicTextColor` from hook  
**Files:** `/app/settings/page.tsx` lines 200+

---

## 📝 Implementation Checklist

- [ ] Read `/docs/theme-system/theme-system.prd.md` for theme specifications
- [ ] Read `/docs/theme-system/theme-system.current.md` for known issues
- [ ] Read `/hooks/useUserPreferences.ts` to understand hook API
- [ ] Import `useUserPreferences` in settings page
- [ ] Remove local `selectedTheme` and `selectedFont` state
- [ ] Remove hardcoded `typingThemes` and `fontOptions` arrays
- [ ] Destructure hook values: `availableThemes`, `availableFonts`, `currentTheme`, `currentFont`, `dynamicTextColor`, `setTheme`, `setFont`
- [ ] Update theme cards to render all 10 themes
- [ ] Update font selector to show all 10 fonts with categories
- [ ] Replace `handleThemeChange` with direct `setTheme` calls
- [ ] Replace `handleFontChange` with direct `setFont` calls
- [ ] Update preview to use `dynamicTextColor`
- [ ] Remove localStorage fallback useEffect (hook handles this)
- [ ] Test with Playwright MCP on localhost:3000
- [ ] Verify no regressions in other settings
- [ ] Verify typing test page still works
- [ ] Single git commit after verification

---

## 🎯 Success Criteria

### Functional Requirements
✅ Settings page shows all 10 themes  
✅ Settings page shows all 10 fonts  
✅ Theme changes apply immediately  
✅ Font changes apply immediately  
✅ Preview matches typing area  
✅ Persistence works (Firestore + localStorage)  
✅ No breaking changes to other settings  

### Code Quality
✅ No hardcoded arrays  
✅ Single source of truth (useUserPreferences)  
✅ TypeScript type safety maintained  
✅ No console errors  
✅ Clean, readable code  

### User Experience
✅ All themes render correctly  
✅ Fonts grouped by type  
✅ Dynamic text color always readable  
✅ Smooth transitions  
✅ Cross-tab synchronization works  

---

**Last Updated:** November 3, 2025  
**Status:** Ready for implementation following IKB protocol
