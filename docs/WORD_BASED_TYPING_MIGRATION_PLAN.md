# Word-Based Typing Test Refactor: Pre-Implementation Audit & Migration Plan

## 1. Context & Objective
- **Goal:** Refactor the typing logic from character-based to word-based tracking (see `Logical Architecture Specification for Word-Based Typing Test.md`).
- **Prime Directive:** Do NOT break existing working code. All changes must be planned, audited, and migrated safely.

## 2. Core State/Logic Variables & Functions (Current)
- `currentIndex` (character position)
- `userInput` (entire typed string)
- `textToType` (target string)
- `errors` (error count)
- `status` (test state)
- `timeLeft` (timer)
- `finalWpm`, `finalAccuracy` (results)
- `handleKeyDown`, `endTest`, `renderText`, `handleFocus` (core logic functions)

## 3. Usage Audit (Where/How Used)
- **All core variables/functions are used almost exclusively in `app/test/page.tsx`.**
- **Some are also referenced in:**
  - `hooks/useTypingGame.ts` (alternative typing logic, stats, and state)
  - API routes and DB types (for `userInput`, `errors`, etc. as test result fields)
  - Display components (for results, stats, progress bar)

## 4. Migration Impact Analysis
- **`currentIndex`/`userInput`/`errors`/`textToType` are deeply coupled in `page.tsx` and `useTypingGame.ts`.**
- **API/DB expects `userInput` as a string and `errors` as a number.**
- **Stats calculations (WPM, accuracy) depend on these variables.**
- **UI rendering (progress bar, highlights, error display) is tied to character-based logic.**

## 5. Migration Plan
### A. State Refactor
- Replace `currentIndex` with `currentWordIndex` (word pointer) and `userWordInput` (current word input).
- Replace `userInput` with `completedWords: string[]` (typed words history) + `userWordInput`.
- `textToType` becomes `words: string[]` (split target text).
- `errors` becomes per-word or per-test, but must still be aggregated for API/DB.

### B. Logic Refactor
- Update `handleKeyDown` to:
  - Accumulate input in `userWordInput`.
  - On spacebar, commit `userWordInput` to `completedWords`, advance `currentWordIndex`, reset `userWordInput`.
  - Contain errors within word boundaries.
- Update `renderText` to render words as "bubbles" with per-word feedback.
- Update stats calculations to use joined `completedWords` for WPM/accuracy.

### C. API/DB Compatibility
- On test end, join `completedWords` with spaces to produce `userInput` for API/DB.
- Aggregate errors for API/DB as before.

### D. UI/UX
- Progress bar: use `currentWordIndex`/`words.length`.
- Error display: sum per-word errors.
- Visual feedback: shake/highlight current word on error.

### E. Hooks/Shared Logic
- Refactor or replace `useTypingGame.ts` to match new state shape if used.
- Ensure all props and state passed to child components are updated.

### F. Testing & Validation
- Unit test all new state transitions and logic.
- Manual regression test: ensure no breakage in test start, typing, error, finish, and result submission.
- Validate API/DB payloads for compatibility.

## 6. Edge Cases & Safeguards
- Backspace at start of word: move to previous word if needed.
- Extra spaces: ignore or treat as error.
- Long/short user input vs. target: handle gracefully.
- Timer, pause/resume, and focus logic must remain stable.

## 7. Rollout Strategy
- Implement behind a feature flag if possible.
- Keep old logic available for quick rollback.
- Document all changes and migration steps.

---
**Next Steps:**
1. Refactor state and logic in `app/test/page.tsx` per above.
2. Update all dependent calculations, UI, and API/DB payloads.
3. Test thoroughly before merging.

---
**References:**
- `Logical Architecture Specification for Word-Based Typing Test.md`
- `Pre Implementation Architecture Audit.md`
- All usages found in audit above.
