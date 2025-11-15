# Keyboard Sound System - Product Requirements Document (PRD)

**Feature:** Keyboard Sound System  
**Status:** 🔄 IN PROGRESS (Phase 1: Research & Asset Collection)  
**Last Updated:** November 15, 2025  
**Owner:** ZenType Development Team

---

## 📋 **Overview**

Implement a professional keyboard sound system that plays mechanical keyboard sounds when users type during tests. This feature enhances the typing experience by providing audio feedback similar to real mechanical keyboards, with customizable sound packs for different switch types.

---

## 🎯 **Objectives**

### Primary Goals
1. **Enhance User Experience** - Provide satisfying audio feedback during typing tests
2. **Customization** - Allow users to choose from multiple keyboard sound packs
3. **Performance** - Maintain <10ms playback latency with minimal bundle size impact
4. **Quality** - Professional-grade mechanical keyboard sounds (Cherry MX, Topre, etc.)

### Success Criteria
- ✅ Sound plays within 10ms of keypress
- ✅ No audio glitches or overlap issues
- ✅ Bundle size increase < 15kb (code + initial sound pack)
- ✅ 5-8 sound packs available (different keyboard types)
- ✅ Sound preference persists across sessions
- ✅ Works seamlessly with existing typing test system
- ✅ Optional toggle to disable sounds (accessibility)

---

## 📦 **Technical Approach**

### Selected Library: `use-sound`
- **NPM Package:** `use-sound` (115k weekly downloads)
- **Bundle Size:** ~1kb (gzipped) + 10kb Howler.js (async loaded)
- **Features:**
  - React Hook for sound effects
  - Low latency (<10ms)
  - Multiple sound file support
  - Volume control
  - Playback rate adjustment
  - Works with Next.js

### Sound Asset Strategy
1. **Download free mechanical keyboard sounds** from:
   - Freesound.org (Creative Commons CC0/Public Domain)
   - ZapSplat.com (free tier)
   - GitHub open source projects (kbsim as reference)

2. **Sound Pack Structure:**
   ```
   /public/sounds/
   ├── cherry-mx-blue/
   │   ├── keypress.mp3
   │   ├── keypress-error.mp3
   │   └── spacebar.mp3
   ├── cherry-mx-brown/
   ├── cherry-mx-red/
   ├── topre/
   ├── typewriter/
   └── silent/
   ```

3. **File Format:**
   - Format: MP3 (best compatibility + small size)
   - Bitrate: 128kbps
   - Duration: 100-300ms per sound
   - File size: 5-10kb per MP3

### Proven Reference: kbsim Project
- GitHub: `tplai/kbsim` (200+ stars)
- Stores sounds in `/src/assets/audio/`
- Has 10+ switch types (Holy Pandas, Creams, Tealios)
- Proven to work in production

---

## 🏗️ **Implementation Checklist**

### Phase 1: Research & Asset Collection ✅ (Current Phase)
- [x] Research sound libraries (use-sound selected)
- [x] Research sound sources (Freesound.org identified)
- [x] Create IKB documentation structure
- [ ] Use Playwright MCP to browse Freesound.org
- [ ] Identify 5-8 high-quality mechanical keyboard sound samples
- [ ] Download sound files (keypress, error, spacebar)
- [ ] Optimize file sizes (convert to MP3, 128kbps)
- [ ] Store in `/public/sounds/` directory

### Phase 2: Core Implementation
- [ ] Install `use-sound` npm package
- [ ] Create `/hooks/useKeyboardSound.ts` hook
- [ ] Integrate into `/app/test/page.tsx` (hook into existing `handleKeyDown`)
- [ ] Implement sound playback on correct keypresses
- [ ] Implement error sound on incorrect keypresses
- [ ] Add spacebar sound (optional unique sound)
- [ ] Test performance (measure latency)

### Phase 3: User Preferences Integration
- [ ] Extend `useUserPreferences` hook (add soundPack field)
- [ ] Update Firestore `users` collection schema (add `preferences.soundPack`)
- [ ] Create sound pack selector UI component
- [ ] Add sound pack selector to `/app/settings/page.tsx`
- [ ] Implement sound toggle (enable/disable)
- [ ] Save preferences to Firestore
- [ ] Sync across devices

### Phase 4: UI Enhancements
- [ ] Add sound pack preview in settings (play sample)
- [ ] Create sound pack cards with visual identifiers
- [ ] Add volume control slider (0-100%)
- [ ] Implement mute toggle (quick access)
- [ ] Add sound pack descriptions (Cherry MX Blue: "Clicky tactile")

### Phase 5: Testing & Verification
- [ ] Test all sound packs with Playwright MCP
- [ ] Verify <10ms latency during typing
- [ ] Test rapid keypresses (no overlap/glitches)
- [ ] Verify localStorage persistence
- [ ] Test cross-device sync (Firestore)
- [ ] Test in both light/dark modes
- [ ] Verify no TypeScript errors
- [ ] Verify no runtime errors
- [ ] Test accessibility (keyboard navigation)

### Phase 6: Documentation & Deployment
- [ ] Update IKB current status
- [ ] Document lessons learned
- [ ] Create user guide (how to change sound packs)
- [ ] Update MAIN.md with feature entry
- [ ] Commit with verified working state
- [ ] Deploy to production
- [ ] Verify production functionality

---

## 🎨 **Sound Pack Specifications**

### Planned Sound Packs (5-8 total)

1. **Cherry MX Blue** (Default)
   - Type: Clicky tactile
   - Loudness: High
   - Character: Sharp, satisfying click

2. **Cherry MX Brown**
   - Type: Tactile
   - Loudness: Medium
   - Character: Soft bump, quiet

3. **Cherry MX Red**
   - Type: Linear
   - Loudness: Low
   - Character: Smooth, silent

4. **Topre**
   - Type: Electro-capacitive
   - Loudness: Medium
   - Character: "Thock" sound

5. **Typewriter**
   - Type: Vintage mechanical
   - Loudness: High
   - Character: Classic typewriter clack

6. **Holy Panda** (Optional)
   - Type: Custom tactile
   - Loudness: Medium-High
   - Character: Deep, resonant

7. **Silent Mode**
   - Type: No sound (disabled)
   - Loudness: Muted
   - Character: Visual feedback only

8. **Custom/Premium** (Future)
   - User-uploaded sounds
   - Subscription feature

---

## 🔒 **Scope Boundaries**

### ✅ IN SCOPE
- Keyboard sound playback during typing tests
- 5-8 pre-configured sound packs
- User preference storage (localStorage + Firestore)
- Settings UI for sound pack selection
- Volume control
- Enable/disable toggle
- Sound preview in settings

### ❌ NOT IN SCOPE
- System-wide keyboard sounds (only during tests)
- User-uploaded custom sounds (future feature)
- Mobile device sounds (mobile typing UX differs)
- Sound effects for UI interactions (buttons, modals)
- Background music
- Voice feedback
- Advanced audio processing (EQ, reverb)

---

## 📊 **Performance Impact**

### Bundle Size
- `use-sound` package: +1kb (gzipped)
- Howler.js (async): +10kb (lazy loaded)
- Initial sound pack: +30kb (6 MP3 files)
- **Total First Load:** +11kb code, +30kb assets (preloaded)

### Runtime Performance
- Playback latency: <10ms (Web Audio API)
- Memory: ~500kb per sound pack (preloaded, stays in memory)
- CPU: Negligible (Web Audio API hardware accelerated)

### Network
- Initial load: 30kb (default sound pack)
- Additional packs: Loaded on-demand when selected
- Caching: Service worker caching (future optimization)

---

## 🧪 **Testing Requirements**

### Functional Testing
- [ ] Sound plays on correct keypress
- [ ] Error sound plays on incorrect keypress
- [ ] Spacebar sound works (if implemented)
- [ ] Sound pack switching works immediately
- [ ] Volume control adjusts playback volume
- [ ] Mute toggle works
- [ ] Preferences persist across sessions
- [ ] Preferences sync across devices

### Performance Testing
- [ ] Measure playback latency (<10ms required)
- [ ] Test rapid keypresses (100+ keys/minute)
- [ ] Verify no audio glitches or overlap
- [ ] Check memory usage (should stay < 1MB)

### Compatibility Testing
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers (iOS Safari, Chrome Android)

### Accessibility Testing
- [ ] Screen reader compatible (sound toggle announced)
- [ ] Keyboard navigation works
- [ ] High contrast mode compatible
- [ ] Mute option easily accessible

---

## 🎯 **User Stories**

### As a typing enthusiast...
- I want to hear realistic mechanical keyboard sounds when I type
- So that I can enjoy the tactile experience of a real mechanical keyboard

### As a user with preferences...
- I want to choose from different keyboard sound packs
- So that I can customize the audio feedback to my liking

### As a user who dislikes sound effects...
- I want to easily disable keyboard sounds
- So that I can focus on typing without audio distractions

### As a user on multiple devices...
- I want my sound preferences to sync across devices
- So that I have a consistent experience everywhere

---

## 📝 **Open Questions**

- [ ] Should spacebar have a unique sound? (Decision: Yes, but optional per pack)
- [ ] Should we implement per-key sounds (different sounds for different keys)? (Decision: No, too complex for MVP)
- [ ] Should we add sound effects for backspace? (Decision: Maybe, test in Phase 2)
- [ ] Should we implement volume ducking (reduce volume during error)? (Decision: No, keep simple)
- [ ] Should we add haptic feedback on mobile? (Decision: Future feature)

---

## 🚀 **Future Enhancements**

### Phase 2 Features (Post-MVP)
- User-uploaded custom sound packs
- Per-key sound variations (randomization for realism)
- Sound pack marketplace (community contributions)
- Premium sound packs (subscription feature)
- Haptic feedback (mobile devices)
- Advanced audio settings (reverb, EQ)
- Sound pack previews before download
- Social sharing ("I'm using Cherry MX Blues!")

---

## 📚 **References**

### Research Sources
- **use-sound library:** https://www.npmjs.com/package/use-sound
- **kbsim project:** https://github.com/tplai/kbsim (200+ stars, proven approach)
- **Freesound.org:** Creative Commons licensed sounds
- **ZapSplat.com:** Free sound effects library

### Related Documentation
- `/docs/keyboard-sound/keyboard-sound.scope.md` - Scope definition
- `/docs/keyboard-sound/keyboard-sound.current.md` - Current status
- `/docs/keyboard-sound/keyboard-sound.errors.md` - Error history

---

**End of PRD - Ready for Implementation** 🚀
