# Keyboard Sound System - Scope Definition

**Feature:** Keyboard Sound System  
**Purpose:** Define clear boundaries for what IS and IS NOT in scope  
**Last Updated:** November 15, 2025

---

## ✅ **What IS In Scope**

### Files to Create
```
/hooks/useKeyboardSound.ts          - Custom React hook for sound playback
/public/sounds/                     - Sound assets directory
  ├── cherry-mx-blue/
  │   ├── keypress.mp3
  │   ├── keypress-error.mp3
  │   └── spacebar.mp3 (optional)
  ├── cherry-mx-brown/
  ├── cherry-mx-red/
  ├── topre/
  ├── typewriter/
  └── silent/ (empty - muted mode)
```

### Files to Modify
```
✅ /app/test/page.tsx               - Integrate sound hook into handleKeyDown
✅ /hooks/useUserPreferences.ts     - Add soundPack field
✅ /app/settings/page.tsx           - Add sound pack selector UI
✅ /lib/firebase-admin.ts           - (No changes needed - uses existing Firestore)
✅ package.json                     - Add use-sound dependency
```

### Firestore Schema Changes
```typescript
// users/{uid}/preferences (EXTEND EXISTING)
{
  theme: string,           // Existing
  font: string,            // Existing
  soundPack: string,       // NEW: 'cherry-mx-blue' | 'cherry-mx-brown' | etc.
  soundEnabled: boolean,   // NEW: true/false toggle
  soundVolume: number      // NEW: 0-100 (default: 70)
}
```

### Dependencies to Add
```json
{
  "use-sound": "^4.0.3"  // React hook for sound effects
}
```

---

## ❌ **What is NOT In Scope**

### Protected Files (DO NOT TOUCH)
```
❌ /app/api/v1/**/*                     - All API routes (no backend changes needed)
❌ /functions/src/index.ts              - Cloud Functions (no changes)
❌ /lib/firebase-admin.ts               - Admin SDK (already handles Firestore)
❌ /components/header.tsx               - Header component (no sound controls here)
❌ /app/dashboard/**/*                  - Dashboard (no sound integration)
❌ /app/history/**/*                    - History page (no sound integration)
❌ /app/leaderboard/**/*                - Leaderboard (no sound integration)
❌ /context/AuthProvider.tsx            - Auth context (unrelated)
❌ /context/DebugProvider.tsx           - Debug context (unrelated)
```

### Features NOT Included
- ❌ System-wide keyboard sounds (only during typing tests)
- ❌ User-uploaded custom sounds (future feature)
- ❌ Sound effects for UI buttons/modals (only typing)
- ❌ Background music or ambient sounds
- ❌ Voice feedback or text-to-speech
- ❌ Mobile haptic feedback (future enhancement)
- ❌ Advanced audio processing (EQ, reverb, compression)
- ❌ Sound pack marketplace (future feature)
- ❌ Per-key sound variations (too complex for MVP)

### Other Features (Separate Scope)
- ❌ Theme system (already implemented)
- ❌ Font system (already implemented)
- ❌ Privacy/GDPR system (already implemented)
- ❌ Account deletion (already implemented)
- ❌ Modal system (already implemented)

---

## ⚠️ **Critical Areas (Pay Attention)**

### HIGH RISK - Existing Typing System
**Location:** `/app/test/page.tsx` (Lines 200-400 approximately)

**What to be careful about:**
- ✅ **DO:** Hook into existing `handleKeyDown` function
- ✅ **DO:** Play sound AFTER state updates (don't block typing)
- ✅ **DO:** Use `useCallback` to prevent re-renders
- ❌ **DON'T:** Modify existing state management logic
- ❌ **DON'T:** Change WPM/accuracy calculations
- ❌ **DON'T:** Alter visual rendering of text
- ❌ **DON'T:** Add synchronous blocking code (sounds must be async)

**Why this is critical:**
- Typing system is battle-tested and MonkeyType-compliant
- Any delay in handleKeyDown will be felt by user (<10ms tolerance)
- State management is carefully orchestrated (userInput, currentWordIndex, etc.)

**Integration point:**
```typescript
// CORRECT APPROACH: Add sound playback AFTER state updates
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  // ... existing logic ...
  
  // NEW: Play sound at the end (non-blocking)
  if (soundEnabled && soundPack) {
    playSound(isCorrect ? 'keypress' : 'error');
  }
};
```

---

### MEDIUM RISK - useUserPreferences Hook
**Location:** `/hooks/useUserPreferences.ts`

**What to be careful about:**
- ✅ **DO:** Add soundPack, soundEnabled, soundVolume fields
- ✅ **DO:** Maintain existing theme/font logic
- ✅ **DO:** Use existing Firestore update pattern
- ❌ **DON'T:** Change existing preference fields (theme, font)
- ❌ **DON'T:** Modify cross-tab synchronization logic (useSyncExternalStore)
- ❌ **DON'T:** Change MutationObserver (light/dark mode detection)

**Why this is critical:**
- This hook manages ALL user preferences (theme, font, sound)
- Cross-tab sync is complex (useSyncExternalStore)
- Any bug here affects theme/font system too

**Integration point:**
```typescript
// CORRECT APPROACH: Extend existing preferences
interface UserPreferences {
  theme: string;
  font: string;
  // NEW FIELDS (add these):
  soundPack: string;
  soundEnabled: boolean;
  soundVolume: number;
}

const defaultPreferences: UserPreferences = {
  theme: 'standard',
  font: 'Fira Code',
  // NEW DEFAULTS:
  soundPack: 'cherry-mx-blue',
  soundEnabled: false,  // Default OFF (opt-in)
  soundVolume: 70
};
```

---

### MEDIUM RISK - Settings Page
**Location:** `/app/settings/page.tsx`

**What to be careful about:**
- ✅ **DO:** Add new "Sound" section (similar to Theme/Font sections)
- ✅ **DO:** Use existing UI patterns (cards, buttons, sliders)
- ✅ **DO:** Follow existing Tailwind styling conventions
- ❌ **DON'T:** Modify existing theme/font sections
- ❌ **DON'T:** Change profile section (email, display name)
- ❌ **DON'T:** Touch account deletion "Danger Zone"

**Why this is critical:**
- Settings page has critical features (account deletion, profile)
- Theme/font sections are working perfectly
- UI consistency is important

**Integration point:**
```tsx
// CORRECT APPROACH: Add new section below fonts
<div className="space-y-6">
  {/* Existing Theme Section */}
  <div>...</div>
  
  {/* Existing Font Section */}
  <div>...</div>
  
  {/* NEW Sound Section */}
  <div>
    <h3>Keyboard Sound</h3>
    <div className="grid grid-cols-2 gap-4">
      {soundPacks.map(pack => (
        <SoundPackCard key={pack.id} {...pack} />
      ))}
    </div>
    <VolumeSlider />
  </div>
</div>
```

---

## 🔗 **Interconnected Features**

### Depends On (Features This Relies On)
1. **useUserPreferences Hook**
   - Location: `/hooks/useUserPreferences.ts`
   - Why: Sound preferences must sync with existing preference system
   - Risk: Any changes to preference structure affect this feature
   - Documentation: `/docs/theme-system/theme-system.scope.md`

2. **Settings Page**
   - Location: `/app/settings/page.tsx`
   - Why: Sound pack selector goes in settings
   - Risk: UI changes must match existing theme/font sections
   - Documentation: `/docs/theme-system/theme-system.current.md`

3. **Typing Test System**
   - Location: `/app/test/page.tsx`
   - Why: Sound playback hooks into handleKeyDown
   - Risk: Any delay breaks typing experience
   - Documentation: `/docs/WORD_BASED_TYPING_IMPLEMENTATION_COMPLETE.md`

### Depended On By (Features That Rely On This)
- None (this is a standalone enhancement feature)
- Future: Sound pack marketplace (if implemented)
- Future: Haptic feedback (would extend this system)

---

## 📁 **Files to Reference**

### Constants & Helpers
```
/lib/constants.ts          - (Create) Sound pack definitions
/lib/soundUtils.ts         - (Create) Sound loading utilities (optional)
```

### Existing Systems to Study
```
/hooks/useUserPreferences.ts   - Pattern for preference management
/app/settings/page.tsx         - UI patterns for settings sections
/app/test/page.tsx             - Typing system integration point
```

### Related Documentation
```
/docs/keyboard-sound/keyboard-sound.prd.md      - Requirements
/docs/keyboard-sound/keyboard-sound.current.md  - Status tracking
/docs/keyboard-sound/keyboard-sound.errors.md   - Error history
/docs/theme-system/theme-system.scope.md        - useUserPreferences reference
```

---

## 🧪 **Testing Scope**

### Must Test
- ✅ Sound playback latency (<10ms required)
- ✅ Rapid typing (no audio glitches)
- ✅ Sound pack switching (immediate effect)
- ✅ Volume control (0-100% range)
- ✅ Mute toggle (immediate silence)
- ✅ Preference persistence (localStorage + Firestore)
- ✅ Cross-device sync (Firestore)
- ✅ No TypeScript errors
- ✅ No runtime errors
- ✅ No regression in typing system performance

### Don't Need to Test (Out of Scope)
- ❌ API endpoints (no backend changes)
- ❌ Dashboard functionality
- ❌ Leaderboard functionality
- ❌ Authentication flows
- ❌ Account deletion
- ❌ Theme/font system (already tested)

---

## 🎯 **Success Criteria (Scope Validation)**

### Code Changes
- [ ] Modified exactly 3 files: test/page.tsx, useUserPreferences.ts, settings/page.tsx
- [ ] Created 1 new hook: useKeyboardSound.ts
- [ ] Added 5-8 sound packs in /public/sounds/
- [ ] Added 1 dependency: use-sound
- [ ] No changes to API routes or Cloud Functions

### Functionality
- [ ] Sounds play during typing tests only
- [ ] Sound preferences persist across sessions
- [ ] No impact on typing system performance
- [ ] No regressions in existing features

### Documentation
- [ ] Updated keyboard-sound.current.md with implementation details
- [ ] Updated MAIN.md with feature entry
- [ ] Documented lessons learned
- [ ] Created error history (if any issues encountered)

---

## 🚨 **Out of Scope Warnings**

### If You're Tempted to Do These, STOP:
1. **"Let's add sound effects to UI buttons too!"**
   - ❌ OUT OF SCOPE - Only typing test sounds in MVP
   - Rationale: Keeps feature focused, avoids scope creep

2. **"Let's allow users to upload custom sounds!"**
   - ❌ OUT OF SCOPE - File upload system not in MVP
   - Rationale: Requires backend changes, file validation, storage

3. **"Let's add per-key sounds (different sound for 'A' vs 'B')!"**
   - ❌ OUT OF SCOPE - Too complex for MVP
   - Rationale: Requires 26+ sound files, loading complexity

4. **"Let's add reverb/EQ/audio effects!"**
   - ❌ OUT OF SCOPE - No advanced audio processing
   - Rationale: Increases complexity, minimal user value

5. **"Let's refactor the typing system while we're here!"**
   - ❌ OUT OF SCOPE - Typing system is working perfectly
   - Rationale: Don't fix what isn't broken (99% Certainty Rule)

---

## 📊 **Scope Summary Table**

| Category | In Scope | Out of Scope |
|----------|----------|--------------|
| **Files** | 3 modified, 1 new hook, sound assets | API routes, Cloud Functions, other pages |
| **Features** | Sound playback, 5-8 packs, preferences | Custom uploads, UI sounds, mobile haptics |
| **Dependencies** | use-sound (1 new) | No backend dependencies |
| **Firestore** | Extend users/preferences | No new collections |
| **Testing** | Sound playback, preferences, performance | API, dashboard, leaderboard |
| **Documentation** | keyboard-sound/ folder (4 files) | No changes to other feature docs |

---

**Scope Defined - Boundaries Clear** 🎯  
**Last Updated:** November 15, 2025
