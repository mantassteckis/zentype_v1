

<think>

The user wants me to explain the logic and important details of what we want to achieve WITHOUT writing code. They want me to explain it in a way that another Claude instance can understand and implement it. This is interesting - they're using me to architect/design and another Claude to implement.

Let me structure this as a comprehensive logical specification that covers:
1. The core problem we're solving
2. The user experience goals
3. The data structure and state management approach
4. The logic flow for different user actions
5. Visual feedback mechanisms
6. Edge cases and considerations
7. Performance considerations

I should be clear, detailed, and structured so another AI can implement this without ambiguity.

</think>

## 🎯 **Logical Architecture Specification for Word-Based Typing Test**

### **Core Problem Statement**
The current implementation advances the cursor position on EVERY keystroke (correct or incorrect), causing fast typers to lose track of their position. Monkeytype solves this by containing errors within word boundaries and providing visual feedback that doesn't block input flow.

---

## **1. Fundamental Paradigm Shift**

### **FROM: Character-Based Tracking**
- Single `currentIndex` pointer that moves through entire text
- `userInput` is a continuous string compared character-by-character
- Errors scattered throughout text with no containment

### **TO: Word-Based Tracking**
- Track which **word** user is currently typing (not just character position)
- Each word is an independent "bubble" where errors accumulate
- Spacebar is the **commit action** that finalizes current word and advances
- Errors are contained per-word and can extend beyond the target word length visually

---

## **2. State Management Architecture**

### **Primary Data Structures Needed:**

1. **Words Array** (`words: string[]`)
   - The target text split by spaces into individual words
   - Example: `"This is a test"` → `["This", "is", "a", "test"]`
   - Immutable reference during a test session

2. **Current Word Index** (`currentWordIndex: number`)
   - Which word in the array the user is currently typing
   - Starts at 0, increments only on spacebar press
   - Range: 0 to `words.length - 1`

3. **Current Word Input** (`userWordInput: string`)
   - What the user has typed for the CURRENT word only
   - Can be shorter, equal, or LONGER than target word
   - Resets to empty string when spacebar advances to next word
   - Example: Target "This", user types "Thiiiii" → `userWordInput = "Thiiiii"`

4. **Completed Words** (`completedWords: string[]`)
   - Array of all previously typed words (user's version, not target)
   - Length should match `currentWordIndex`
   - Used for backspace navigation and final accuracy calculation
   - Example: If user typed "Thiss" for "This", then "iss" for "is", array is `["Thiss", "iss"]`

5. **Visual Feedback States**
   - `shakeWordIndex: number | null` - Which word should shake (matches `currentWordIndex` when triggered)
   - `lastErrorTime: timestamp` - Tracks when last error occurred for 150ms debounce awareness

---

## **3. Core Logic Flows**

### **A. Character Input Logic (Key.length === 1)**

**Decision Tree:**
1. **Append character to `userWordInput`** regardless of correctness
   - This is crucial: NEVER block input, always accumulate

2. **Compare with target character at current position:**
   ```
   targetChar = words[currentWordIndex][userWordInput.length]
   isCorrect = (pressedKey === targetChar)
   ```

3. **If CORRECT:**
   - No additional action needed
   - Character appears in green in UI
   - Continue flow

4. **If INCORRECT:**
   - Check: Is `userWordInput.length >= words[currentWordIndex].length`?
     - **YES**: User is typing PAST the word boundary
       - Trigger shake animation on current word
       - Character appears in red extending beyond target word
       - Update `shakeWordIndex = currentWordIndex`
       - Set timeout to clear shake after 300ms
     - **NO**: User is within word bounds but wrong character
       - Character appears in red at that position
       - No shake yet
   
   - Update `lastErrorTime = currentTimestamp`
   - Increment global error counter for statistics

**Key Insight:** The cursor NEVER advances here. User stays "inside" the current word until spacebar.

---

### **B. Spacebar Logic (Advance Word)**

**Preconditions:**
- Only process if `userWordInput.length > 0` (user has typed something)
- Ignore if user hasn't started typing the word

**Actions:**
1. **Calculate word accuracy:**
   - Compare `userWordInput` with `words[currentWordIndex]` character-by-character
   - Count mismatches (including length differences)
   - Add to global error counter

2. **Save the word:**
   - Append `userWordInput` to `completedWords` array

3. **Advance position:**
   - Increment `currentWordIndex` by 1
   - Reset `userWordInput` to empty string
   - Clear `shakeWordIndex` to null

4. **Check test completion:**
   - If `currentWordIndex >= words.length`:
     - All words typed
     - Trigger `endTest()` function
     - Calculate final WPM and accuracy
     - Switch to results view

**Key Insight:** Spacebar is a "commit" - even if the word is completely wrong, it moves forward. This maintains typing flow for fast typers.

---

### **C. Backspace Logic**

**Two-Level Backspace System:**

1. **First Priority: Current Word Deletion**
   - If `userWordInput.length > 0`:
     - Remove last character from `userWordInput`
     - Update UI to show one less character
     - This is standard backspace within word

2. **Second Priority: Previous Word Navigation**
   - If `userWordInput.length === 0` AND `currentWordIndex > 0`:
     - User is at start of empty word, wants to go back
     - Decrement `currentWordIndex` by 1
     - Load previous word: `userWordInput = completedWords[currentWordIndex]`
     - Remove that word from `completedWords` (pop from array)
     - User can now edit the previous word

**Key Insight:** Backspace is hierarchical - first deletes current word characters, then navigates backwards through words.

---

### **D. Enter Key (Test Start)**
- Only active when `status === 'waiting'`
- Changes `status` to `'running'`
- Starts the timer countdown
- Focuses the hidden input element

---

## **4. Visual Rendering Logic**

### **Word Classification System**

For each word in the `words` array during rendering:

**A. PAST WORDS** (index < currentWordIndex)
- Status: Already typed and committed
- Data source: `completedWords[index]`
- Rendering:
  - Compare each character with target: `completedWords[index][i]` vs `words[index][i]`
  - Green if match, red if mismatch
  - Show extra characters in red if user typed more than target length

**B. CURRENT WORD** (index === currentWordIndex)
- Status: Actively being typed
- Data source: `userWordInput`
- Rendering (complex):
  - Iterate through `max(target.length, userInput.length)` positions
  - For each position `i`:
    - **If user has typed here** (`i < userWordInput.length`):
      - Display `userWordInput[i]`
      - Green if matches `words[index][i]`
      - Red if doesn't match OR if `i >= target.length` (overflow)
    - **If user hasn't typed here yet** (`i >= userWordInput.length`):
      - **If exactly at next position** (`i === userWordInput.length`):
        - Display target character with CURSOR STYLING (blue underline/highlight)
      - **If future positions** (`i > userWordInput.length`):
        - Display target character in muted gray
  - Apply shake animation class if `shakeWordIndex === currentWordIndex`

**C. FUTURE WORDS** (index > currentWordIndex)
- Status: Not yet reached
- Rendering: Display all characters in muted gray color
- No user data to compare

### **Layout Considerations**
- Words should be inline elements with space between them
- Use flexbox with wrap enabled so words flow naturally
- Remove rigid container borders to allow horizontal extension
- Red overflow characters should extend naturally without breaking layout
- Text should feel like a natural typing environment, not a fixed box

---

## **5. Visual Feedback Mechanisms**

### **A. Shake Animation**
- **Trigger Condition:** User types PAST the target word length
  - Example: Target "This" (4 chars), user types 5th+ character
- **Animation Properties:**
  - Horizontal oscillation (±3px)
  - Duration: 300ms
  - Timing function: Cubic bezier for natural feel
  - Applied to entire current word, not individual characters
- **State Management:**
  - Set `shakeWordIndex = currentWordIndex` on trigger
  - Use setTimeout to reset to null after 300ms
  - Ensures only one word shakes at a time

### **B. Color Feedback System**
- **Green (#22c55e or similar):** Correct character
- **Red (#ef4444 or similar):** Incorrect character
- **Muted Gray (#6b7280 or similar):** Untyped future characters
- **Blue Highlight (#00BFFF with opacity):** Current cursor position
- **Red Background (subtle, 10% opacity):** Wrong characters for emphasis

### **C. 150ms Debounce Awareness**
- **NOT an input blocker** - this is crucial
- **Purpose:** Track timing between errors for potential future enhancements
- **Current Implementation:** Simply record timestamp in `lastErrorTime`
- **Future Possibilities:**
  - Could add subtle color pulse on rapid errors
  - Could trigger audio feedback (optional)
  - Could show temporary tooltip/hint
- **Key Point:** User can still type during this window, it's purely for awareness

---

## **6. Statistics Calculation**

### **WPM (Words Per Minute) Calculation**
```
Formula: (totalWordsTyped / timeElapsedInSeconds) * 60

Where:
- totalWordsTyped = completedWords.length + (userWordInput.length > 0 ? 1 : 0)
- timeElapsedInSeconds = initialTime - timeLeft
- Or if time-based: use actual elapsed time from timer

Alternative (character-based):
- totalCharacters = sum of all word lengths in completedWords + userWordInput.length
- WPM = (totalCharacters / 5) / (timeElapsed / 60)
  - Dividing by 5 is standard typing test convention (average word length)
```

### **Accuracy Calculation**
```
Approach 1 - Character-by-character:
correctCharacters = count of matching characters at each position
totalCharacters = sum of max(typed.length, target.length) for each word
accuracy = (correctCharacters / totalCharacters) * 100

Approach 2 - Error-based:
totalCharactersTyped = sum of completedWords lengths
accuracy = ((totalCharactersTyped - errors) / totalCharactersTyped) * 100

Recommendation: Use Approach 1 for fairness (penalizes extra chars properly)
```

---

## **7. Edge Cases & Considerations**

### **Edge Case 1: Multiple Spaces**
- **User Action:** Presses space multiple times
- **Handling:** First space advances word (if input exists), subsequent spaces ignored
- **Logic:** Check `userWordInput.length > 0` before processing spacebar

### **Edge Case 2: Backspace at Test Start**
- **User Action:** Presses backspace when `currentWordIndex === 0` and `userWordInput === ''`
- **Handling:** Do nothing (can't go back further)
- **Logic:** Guard condition in backspace handler

### **Edge Case 3: Very Long Error Extensions**
- **User Action:** Types "Thisssssssssssssss" (many extra chars)
- **Handling:** All extra chars show in red, extend horizontally, shake continues
- **UI Consideration:** Container should overflow gracefully (horizontal scroll if needed)

### **Edge Case 4: Backspace During Shake**
- **User Action:** Types error → shake starts → immediately backspaces
- **Handling:** Allow backspace, but shake continues for its 300ms duration
- **Logic:** Shake state is independent, just clears on timer

### **Edge Case 5: Fast Typing During Debounce Window**
- **User Action:** Types multiple wrong chars within 150ms
- **Handling:** All characters are registered and shown
- **Logic:** Debounce doesn't block input, only tracks timing

### **Edge Case 6: Test Completion Mid-Word**
- **User Action:** Time runs out while typing a word
- **Handling:** Current `userWordInput` should be included in final stats
- **Logic:** In `endTest()`, count `userWordInput` even if not space-committed

### **Edge Case 7: Copy-Paste Attempts**
- **User Action:** Tries to paste text
- **Handling:** preventDefault on paste events, ignore clipboard input
- **Logic:** Only process individual keystrokes from onKeyDown

---

## **8. Performance Considerations**

### **Why This Approach is Efficient:**
1. **No Re-rendering of Past Words:** Once committed, they're static
2. **Only Current Word Updates:** State changes are localized
3. **Debounce is Non-Blocking:** Doesn't use setTimeout to delay state updates
4. **Animation is CSS-based:** Not JavaScript-driven repaints

### **Optimization Points:**
- Use `useCallback` for event handlers to prevent re-creation
- Memoize word rendering if necessary (React.memo on word components)
- Only re-render affected word, not entire text on each keystroke
- Keep shake animation in CSS for GPU acceleration

---

## **9. Testing Scenarios for Implementation**

### **Scenario 1: Perfect Typing**
```
Target: "The quick brown"
User types: "The<space>quick<space>brown<space>"
Expected: All green, 3 words completed, 0 errors, smooth advancement
```

### **Scenario 2: Error Within Word Bounds**
```
Target: "The quick brown"
User types: "Thr<backspace>e<space>..."
Expected: 'r' shows red briefly, backspace removes it, 'e' goes green
```

### **Scenario 3: Error Extension**
```
Target: "The quick brown"
User types: "Theee<backspace><backspace>e<space>..."
Expected: Extra 'e's show red, shake triggers, backspace removes them
```

### **Scenario 4: Fast Typer (100+ WPM)**
```
Target: "The quick brown fox"
User types rapidly with occasional errors
Expected: No lag, errors accumulate naturally, flow maintained
```

### **Scenario 5: Slow Typer (15 WPM)**
```
Target: "The quick brown fox"
User types slowly with pauses
Expected: Clear visual cues at each step, cursor visible, no confusion
```

---

## **10. Success Criteria**

The implementation is successful when:

✅ **User can type naturally without input blocking**  
✅ **Errors are contained per word, shown in red extending past target**  
✅ **Spacebar always advances to next word regardless of errors**  
✅ **Shake animation triggers only when typing past word boundary**  
✅ **Backspace works hierarchically (current word → previous word)**  
✅ **Fast typers (100+ WPM) experience no lag or disruption**  
✅ **Slow typers (15-30 WPM) get clear visual feedback**  
✅ **Layout is flexible, text flows naturally like real typing**  
✅ **Final WPM and accuracy calculations are correct**  
✅ **All existing features (timer, test selection, themes) continue working**

---

This specification should provide complete logical clarity for implementation without prescribing specific code syntax. The other Claude instance can choose implementation details (hook names, exact CSS values, etc.) while following this logical architecture.