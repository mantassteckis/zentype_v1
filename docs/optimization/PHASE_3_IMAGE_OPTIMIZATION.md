# Phase 3: Image Optimization Strategy

**Status:** 📋 NOT STARTED  
**Risk Level:** 🔴 HIGH RISK  
**Estimated Impact:** Unknown (depends on audit results)  
**Dependencies:** Phase 1 complete (baseline established)  
**Created:** November 19, 2025

---

## ⚠️ CRITICAL WARNING

**Image optimization is currently DISABLED** in `next.config.mjs`:
```javascript
images: {
  unoptimized: true  // ← Why is this here?
}
```

**Reason unknown.** This phase is about **investigating** why it's disabled and **deciding** whether it's safe to re-enable. **DO NOT blindly enable optimization without completing the audit.**

---

## 📋 Overview

Next.js's built-in Image component provides automatic optimization:
- Responsive images (srcset generation)
- Modern formats (WebP, AVIF)
- Lazy loading
- Placeholder blur
- Automatic sizing

When disabled (`unoptimized: true`), none of these optimizations occur. Images are served as-is.

---

## 🎯 Objectives

1. **Audit All Images:** Find every image in the codebase
2. **Identify Risk Factors:** Why might optimization have been disabled?
3. **Test Locally:** If safe, try enabling optimization on localhost
4. **Make Decision:** Enable, keep disabled, or partially enable
5. **Document Decision:** Record reasoning for future reference

---

## 🔍 Phase 3.1: Image Audit

### Step 1: Find All Image Usage

Run these grep searches:

```bash
# Find all <img> tags (unoptimized HTML)
grep -r "<img" app/ components/ --include="*.tsx" --include="*.jsx" > image-audit-img-tags.txt

# Find all Next.js <Image> components
grep -r "from 'next/image'" app/ components/ --include="*.tsx" --include="*.jsx" > image-audit-next-image.txt

# Find background-image CSS
grep -r "background-image" app/ components/ styles/ --include="*.tsx" --include="*.jsx" --include="*.css" > image-audit-css-bg.txt

# Find all files in /public/ directory
find public/ -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.svg" -o -iname "*.webp" -o -iname "*.avif" \) > image-audit-public-files.txt
```

### Step 2: Categorize Images

Create `/docs/optimization/IMAGE_AUDIT.md` with this structure:

```markdown
# Image Audit - Phase 3

**Date:** November 19, 2025
**Total Images Found:** ___

## Local Images (/public/)

| File | Size | Format | Usage | Can Optimize? |
|------|------|--------|-------|---------------|
| /public/logo.png | ___ KB | PNG | Header logo | ✅ Yes |
| /public/hero-bg.jpg | ___ KB | JPEG | Homepage background | ✅ Yes |
| ... | ... | ... | ... | ... |

## External Images (URLs)

| URL | Domain | Usage | Can Optimize? |
|-----|--------|-------|---------------|
| https://firebase.com/... | Firebase Storage | User avatars | ⚠️ Requires configuration |
| https://cdn.example.com/... | External CDN | ... | ❌ No (external) |

## Component Usage

### Using Next.js <Image>
- components/Header.tsx: Logo
- app/page.tsx: Hero image
- [List all usages]

### Using <img> tags (not optimized)
- [List all usages]
- **Action:** Consider migrating to <Image>

### CSS background-image
- [List all usages]
- **Action:** Consider if optimization needed

## Firebase Storage Usage

- **User Avatars:** Stored in Firebase Storage?
- **Test Images:** Stored in Firebase Storage?
- **Domain:** gs://solotype-23c1f.appspot.com or public URL?

**Firebase Image URLs pattern:**
```
https://firebasestorage.googleapis.com/v0/b/[bucket]/o/[path]?alt=media&token=[token]
```

## Total Size Analysis

- **Local Images:** ___ MB
- **Potential Savings with Optimization:** ___% (estimated)
```

---

## 🔍 Phase 3.2: Risk Assessment

### Reasons Optimization Might Be Disabled

#### 1. External Images (Firebase Storage)

**Problem:** Next.js Image optimization requires configuring allowed domains.

**Solution Required:**
```javascript
// next.config.mjs
images: {
  unoptimized: false,
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'firebasestorage.googleapis.com',
      port: '',
      pathname: '/v0/b/solotype-23c1f/**',
    },
  ],
}
```

**Testing:** Verify all Firebase images still load correctly.

#### 2. Build Time Issues

**Problem:** Image optimization can slow down builds significantly.

**Symptoms:**
- Very long build times
- Vercel/Firebase timeouts during deployment

**Solution:**
- May need to keep `unoptimized: true` for faster builds
- Alternative: Use external image CDN (Cloudinary, Imgix)

#### 3. Cost Concerns

**Problem:** Next.js image optimization on Vercel has cost implications for high-traffic sites.

**Symptoms:**
- High Vercel bills
- Bandwidth overages

**Solution:**
- Firebase App Hosting may handle this differently
- Need to check Firebase pricing for image optimization

#### 4. Dynamic Image URLs

**Problem:** Images with dynamic query parameters or tokens might not cache well.

**Example:**
```
https://firebasestorage.googleapis.com/.../image.jpg?alt=media&token=abc123def456
```

**Token changes** invalidate cache, defeating optimization.

#### 5. Deployment Environment

**Problem:** Image optimization might not work correctly on Firebase App Hosting.

**Testing Required:**
- Enable optimization locally
- Test build works
- Deploy to staging
- Verify images load in production

---

## 🧪 Phase 3.3: Local Testing

### Only proceed if audit shows optimization is feasible

### Step 1: Backup Current Config

```bash
cp next.config.mjs next.config.mjs.backup
```

### Step 2: Enable Optimization

```javascript
// next.config.mjs
export default {
  images: {
    unoptimized: false,  // ← Change from true
    // Add domains if needed:
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/solotype-23c1f/**',
      },
    ],
  },
  // ... rest of config
};
```

### Step 3: Test Locally

```bash
# Clean build
rm -rf .next/
pnpm build

# Check for errors
# Look for: "Error: Invalid src prop"
```

### Step 4: Verify Images Load

```bash
pnpm dev
```

**Manual Testing:**
1. Open `http://localhost:3000`
2. Check browser DevTools > Network tab
3. Verify images load correctly
4. Check for WebP format served (if browser supports)
5. Check responsive srcset attributes

**Playwright MCP Testing:**
```
- Navigate to homepage
- Verify logo visible
- Navigate to dashboard
- Verify user avatar visible (if applicable)
- Navigate to test page
- Verify any images visible
```

### Step 5: Check Build Size

```bash
# With optimization
pnpm build
du -sh .next/ > image-opt-enabled-size.txt

# Restore backup and build again
cp next.config.mjs.backup next.config.mjs
rm -rf .next/
pnpm build
du -sh .next/ > image-opt-disabled-size.txt

# Compare
diff image-opt-enabled-size.txt image-opt-disabled-size.txt
```

---

## 📊 Phase 3.4: Decision Matrix

### Scenario A: All Images Are Local

**Audit Result:**
- All images in `/public/` directory
- No external URLs
- No Firebase Storage images

**Decision:** ✅ **ENABLE OPTIMIZATION**

**Configuration:**
```javascript
images: {
  unoptimized: false,
  formats: ['image/webp', 'image/avif'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}
```

**Expected Benefits:**
- 30-50% image size reduction (WebP/AVIF)
- Automatic responsive images
- Lazy loading
- Faster page loads

---

### Scenario B: Firebase Storage Images Only

**Audit Result:**
- All images from Firebase Storage
- Dynamic tokens in URLs
- User-uploaded content

**Decision:** ⚠️ **PARTIAL ENABLEMENT** or ❌ **KEEP DISABLED**

**Problems:**
1. Dynamic tokens invalidate cache
2. Optimization might not work with signed URLs
3. Firebase App Hosting might not support it

**Alternative Solution:**
```javascript
// Keep unoptimized: true
// Use Firebase Extensions for image optimization instead
// Extension: https://extensions.dev/extensions/googlecloud/storage-resize-images
```

**Action Items:**
1. Research Firebase image optimization extensions
2. Test if optimization works with signed URLs
3. If not, document why it must stay disabled

---

### Scenario C: Mix of Local and External

**Audit Result:**
- Some images in `/public/`
- Some images from Firebase Storage
- Some external CDN images

**Decision:** ⚠️ **SELECTIVE OPTIMIZATION**

**Configuration:**
```javascript
images: {
  unoptimized: false,  // Enable for <Image> components
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'firebasestorage.googleapis.com',
      pathname: '/v0/b/solotype-23c1f/**',
    },
    // Add other allowed domains
  ],
}
```

**Code Changes:**
```tsx
// Optimize local images
import Image from 'next/image';
<Image src="/logo.png" width={100} height={50} alt="Logo" />

// Keep external images unoptimized
<img src={firebaseUrl} alt="User avatar" />
```

---

### Scenario D: Build Issues Detected

**Audit Result:**
- Build times increase 5x
- Deployment timeouts
- Out of memory errors

**Decision:** ❌ **KEEP DISABLED**

**Reasoning:**
- Image optimization adds significant build overhead
- Firebase App Hosting may have build time limits
- Trade-off not worth it

**Alternative:**
- Use external image CDN (Cloudinary, Imgix)
- Pre-optimize images before committing
- Use smaller image files

**Document in optimization.errors.md:**
```markdown
## ERROR-OPT-001: Image Optimization Build Timeout

**Problem:** Enabling Next.js image optimization caused build times to increase from 2 minutes to 10+ minutes, causing Firebase App Hosting deployment timeouts.

**Decision:** Keep `unoptimized: true`

**Alternatives Considered:**
1. External CDN (not implemented yet)
2. Manual image optimization (current approach)
3. Firebase Storage image extension (not tested)
```

---

## ✅ Success Criteria

Phase 3 is complete when ONE of these decisions is made and documented:

### Option 1: Optimization Enabled

- [ ] `next.config.mjs` changed to `unoptimized: false`
- [ ] All images load correctly locally
- [ ] All images load correctly in production (after deployment)
- [ ] Build time acceptable (<5 min)
- [ ] No console errors related to images
- [ ] Playwright MCP verification passed
- [ ] Git commit: `perf: Enable Next.js image optimization`
- [ ] Documentation: `IMAGE_AUDIT.md` and decision recorded in `optimization.current.md`

### Option 2: Optimization Stays Disabled

- [ ] `IMAGE_AUDIT.md` documents all images
- [ ] Clear reasoning for keeping disabled documented
- [ ] Alternative solutions explored and documented
- [ ] Error entry created in `optimization.errors.md`
- [ ] Git commit: `docs: Document image optimization decision (keep disabled)`
- [ ] Documentation: Reasoning in `optimization.current.md`

### Option 3: Partial Optimization

- [ ] `remotePatterns` configured for allowed domains
- [ ] Local images use Next.js <Image>
- [ ] External images use <img> tags
- [ ] Testing passed for both types
- [ ] Git commit: `perf: Enable selective image optimization`
- [ ] Documentation: Mixed approach documented

---

## 🚨 Rollback Plan

If optimization breaks images:

```bash
# Immediate revert
cp next.config.mjs.backup next.config.mjs
rm -rf .next/
pnpm build
pnpm dev

# Verify images load again
```

**DO NOT DEPLOY** broken image optimization to production.

---

## 📈 Expected Metrics (If Enabled)

### Image Size Reductions

| Format | Original | WebP | Savings |
|--------|----------|------|---------|
| PNG | 100 KB | 60 KB | 40% |
| JPEG | 150 KB | 80 KB | 47% |

### Lighthouse Scores

- **Performance:** +5-10 points
- **LCP (Largest Contentful Paint):** -0.5-1.0 seconds
- **Total Page Weight:** -20-40% (if many images)

---

## 🔗 Related Documentation

- `/docs/optimization/optimization.scope.md` - Image optimization in HIGH RISK zones
- `/docs/optimization/optimization.errors.md` - Error tracking
- Next.js Image Docs: https://nextjs.org/docs/app/building-your-application/optimizing/images
- Firebase Storage: https://firebase.google.com/docs/storage

---

## 📝 Notes for Future Agents

1. **HIGH RISK PHASE** - Proceed with extreme caution
2. **Audit First** - Do not skip image inventory
3. **Test Locally** - Never enable directly in production
4. **Firebase URLs** - Check if optimization works with signed URLs
5. **Build Times Matter** - Monitor deployment times carefully
6. **Decision is Reversible** - Can always revert if issues arise
7. **Document Everything** - Future agents need to know why it's disabled
8. **No Shame in Skipping** - Keeping disabled is a valid decision

---

**Last Updated:** November 19, 2025  
**Previous Phase:** [Phase 2: Code Splitting](/docs/optimization/PHASE_2_CODE_SPLITTING.md)  
**Next Phase:** [Phase 4: Font Optimization](/docs/optimization/PHASE_4_FONT_OPTIMIZATION.md)
