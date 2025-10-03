# Modal System Testing Notes

**Date:** October 3, 2025  
**Status:** Ready for Local Testing

---

## Testing Instructions

### 1. Local Development Server
The app is running at: **http://localhost:3001**

### 2. Test Buttons (Development Only)
Navigate to `/test` page and you'll see two yellow test buttons at the top:
- **🧪 Test Promotional Modal** - Shows the AI failure promotional popup
- **🧪 Test Error Modal** - Shows the general error popup

**Important:** These buttons only appear in development mode (`NODE_ENV === 'development'`) and will NOT be visible in production.

### 3. What to Test

#### Promotional Modal (AI Failure)
- [ ] Click "🧪 Test Promotional Modal" button
- [ ] Verify modal appears with:
  - Title: "🎉 Unlimited AI Tests with Pro"
  - Description: "Our AI service is experiencing high demand..."
  - Primary button: "Get Pro - 73% OFF"
  - Secondary button: "Use Practice Test"
- [ ] Test closing methods:
  - [ ] Escape key
  - [ ] X button (top-right)
  - [ ] Click backdrop (outside modal)
- [ ] Test "Get Pro" button → should show alert (Stripe integration TODO)
- [ ] Test "Use Practice Test" button → should switch to practice tab

#### Error Modal (General Errors)
- [ ] Click "🧪 Test Error Modal" button
- [ ] Verify modal appears with:
  - Title: "❌ AI Generation Failed"
  - Description: "Something went wrong..."
  - Primary button: "Try Again"
  - Secondary button: "Use Practice Test"
- [ ] Test all closing methods (Escape, X, backdrop)
- [ ] Test both action buttons

#### Theme Testing
- [ ] Test modal in **dark mode** (check theme toggle in header)
- [ ] Test modal in **light mode**
- [ ] Verify:
  - Backdrop blur effect works
  - Colors are readable in both themes
  - Gradient borders visible
  - Navigation stays visible behind modal

#### Responsive Testing
- [ ] Test on desktop (full width)
- [ ] Test on tablet (medium width)
- [ ] Test on mobile (narrow width)
- [ ] Verify buttons stack vertically on small screens

---

## Production Verification

### Real AI Failure Test
To test the modal with actual AI failures in production:

1. **Option 1: Force an Error (Firebase Console)**
   - Temporarily disable Gemini API key in Firebase Console
   - Try generating an AI test
   - Should trigger promotional modal

2. **Option 2: Wait for Natural Failure**
   - Gemini API occasionally rate limits or fails
   - When it happens, modal should appear automatically

3. **Option 3: Load Test**
   - Generate many AI tests rapidly
   - Should hit rate limit and show modal

---

## Debug Logging Verification

Check the debug panel (`/debug` or browser console) for these log entries:

### When Modal Shows:
```json
{
  "action": "modal_shown",
  "element": "AI Service Unavailable Promotional Modal",
  "metadata": {
    "trigger": "manual_test", // or "ai_generation_failure"
    "modalType": "promotional"
  }
}
```

### When User Clicks "Get Pro":
```json
{
  "action": "clicked",
  "element": "Get Pro Offer Button",
  "metadata": {
    "source": "modal",
    "modalType": "promotional",
    "offer": "73% OFF Black Friday"
  }
}
```

### When User Clicks "Use Practice Test":
```json
{
  "action": "clicked",
  "element": "Use Practice Test Button",
  "metadata": {
    "source": "modal",
    "modalType": "promotional"
  }
}
```

### When Modal Closes:
```json
{
  "action": "modal_closed",
  "element": "AI Modal Closed",
  "metadata": {
    "modalType": "promotional",
    "method": "user_action"
  }
}
```

---

## Known Issues / Edge Cases

1. **Test buttons in yellow warning box:**
   - This is intentional to make them stand out as temporary
   - They will NOT appear in production builds

2. **Git push failed:**
   - Permission issue with GitHub credentials
   - Need to push manually with correct credentials
   - Changes are committed locally (commit hash: `f722c1c`)

3. **Body scroll lock:**
   - When modal opens, page scrolling should be disabled
   - Should re-enable when modal closes
   - Test by trying to scroll with modal open

---

## Next Steps After Testing

### If Everything Works:
1. Remove test buttons (they're dev-only anyway)
2. Push changes to GitHub with correct credentials
3. App Hosting will auto-deploy frontend changes
4. Modal system ready for production use

### If Issues Found:
1. Document the issue
2. Check browser console for errors
3. Check debug panel for unexpected logs
4. Make necessary fixes

---

## Deployment Status

### Already Deployed to Production:
- ✅ Cloud Functions (with HttpsError for AI failures)
- ✅ Backend error handling

### Pending Deployment:
- ⏳ Frontend (ZenTypeModal component)
- ⏳ Test page integration
- ⏳ Documentation updates

**Note:** Frontend will auto-deploy when pushed to main branch via Firebase App Hosting.

---

## Quick Reference

**Local Dev Server:** http://localhost:3001  
**Test Page:** http://localhost:3001/test  
**Debug Panel:** Check browser console or `/debug` route  
**Production URL:** https://zentype-v0--solotype-23c1f.europe-west4.hosted.app/

**Modal Component Location:** `components/ui/zentype-modal.tsx`  
**Integration Location:** `app/test/page.tsx`  
**Documentation:** `docs/MODAL_SYSTEM_IMPLEMENTATION.md`
