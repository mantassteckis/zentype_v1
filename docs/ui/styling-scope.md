# ZenType UI Styling Scope & Boundaries

## Overview
This document defines which files control styling, where styles are applied, and what areas are safe to modify without breaking the application.

---

## Global Styling Files

### 1. `app/globals.css`
**Purpose**: Application-wide CSS, theme definitions, utility classes

**Scope**:
- CSS variable definitions (`:root` and `.dark`)
- Global resets and base styles
- Custom utility classes (`.glass-card`, etc.)
- Typography base styles
- Animation keyframes

**⚠️ HIGH RISK ZONE**:
- Changing CSS variable values affects **entire application**
- Modifying `.glass-card` affects all components using it
- Changes here require full application testing

**Safe Modifications**:
- Adding new utility classes
- Adding new animation keyframes
- Adjusting existing values **with caution**

---

### 2. `tailwind.config.ts`
**Purpose**: Tailwind CSS configuration, theme extensions

**Scope**:
- Custom color definitions
- Custom spacing, typography, animations
- Plugin configurations
- Content path definitions (where Tailwind scans for classes)

**⚠️ HIGH RISK ZONE**:
- Changing `extend.colors` affects brand consistency
- Modifying `content` paths can break Tailwind compilation

**Safe Modifications**:
- Adding new colors to `extend.colors`
- Adding new animation variants
- Adding custom utilities via plugins

---

### 3. `components.json`
**Purpose**: shadcn/ui component configuration

**Scope**:
- Component installation paths
- CSS variable naming conventions
- TypeScript path aliases

**⚠️ CRITICAL - DO NOT MODIFY**:
- This file controls shadcn/ui component generation
- Changes here can break existing components
- Only modify when installing new shadcn components

---

## Component-Level Styling

### shadcn/ui Components (`components/ui/`)
**Files**: `button.tsx`, `input.tsx`, `label.tsx`, `card.tsx`, etc.

**Scope**:
- Individual component variants
- Base component styling
- Accessibility attributes

**Styling Approach**:
- Uses `class-variance-authority` (CVA) for variant management
- Uses `cn()` utility for conditional classes
- Uses CSS variable tokens (`bg-background`, `text-foreground`)

**⚠️ MEDIUM RISK ZONE**:
- Modifying these affects **all usages** of that component
- Changes to variants can break existing layouts
- Test thoroughly before committing changes

**Safe Modifications**:
- Adding new variants (e.g., new button sizes)
- Adjusting spacing within existing variants
- Updating to use CSS variable tokens

**Example - Safe Button Variant Addition**:
```tsx
// components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground...",
        // ✅ SAFE: Adding new variant
        brand: "bg-[#00A3FF] text-white hover:bg-[#0088cc]",
      },
      size: {
        default: "h-10 px-4 py-2",
        // ✅ SAFE: Adding new size
        xl: "h-14 px-8 py-4 text-lg",
      },
    },
  }
)
```

---

### Custom UI Components (`components/`)
**Files**: `header.tsx`, `theme-provider.tsx`, `dashboard/*`, `debug/*`

**Scope**:
- Feature-specific components
- Layout components
- Utility components

**Styling Approach**:
- Direct Tailwind classes in JSX
- May import shadcn/ui components
- May use custom utility classes from `globals.css`

**✅ LOW RISK ZONE** (for individual components):
- Changes only affect that specific component
- Safe to modify unless component is widely reused

**Safe Modifications**:
- Adjusting layout within component
- Changing colors using Tailwind classes
- Adding responsive breakpoints

**Example - Safe Component Styling**:
```tsx
// components/dashboard/stats-card.tsx
export function StatsCard({ title, value }: StatsCardProps) {
  return (
    // ✅ SAFE: Component-specific styling
    <div className="p-6 rounded-lg bg-card border border-border">
      <h3 className="text-sm text-muted-foreground">{title}</h3>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  )
}
```

---

### Page Components (`app/*/page.tsx`)
**Files**: `app/login/page.tsx`, `app/signup/page.tsx`, `app/dashboard/page.tsx`, etc.

**Scope**:
- Page-level layout
- Page-specific styling
- Integration of multiple components

**Styling Approach**:
- Direct Tailwind classes for layout
- Import and compose shadcn/ui and custom components
- Page background definitions

**✅ LOW RISK ZONE**:
- Changes only affect that specific page
- Safe to modify page-specific styles

**⚠️ WATCH FOR**:
- Shared layout components (Header, Footer)
- Authentication state checks
- Data fetching logic

**Safe Modifications**:
- Adjusting page layout and spacing
- Changing page-specific backgrounds
- Modifying form container styles

**Example - Safe Page Styling**:
```tsx
// app/login/page.tsx
export default function LoginPage() {
  return (
    // ✅ SAFE: Page-specific background
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        {/* ✅ SAFE: Page-specific form container */}
        <div className="max-w-md mx-auto bg-card border border-border rounded-lg p-6">
          {/* form content */}
        </div>
      </main>
    </div>
  )
}
```

---

## Styling Modification Risk Matrix

| File/Area | Risk Level | Impact Scope | Testing Required |
|-----------|------------|--------------|------------------|
| `app/globals.css` | 🔴 HIGH | Entire app | Full app regression test |
| `tailwind.config.ts` | 🔴 HIGH | Entire app | Full app regression test |
| `components.json` | 🔴 CRITICAL | Component system | Don't modify unless necessary |
| `components/ui/*.tsx` | 🟡 MEDIUM | All uses of component | Test all pages using component |
| `components/*.tsx` | 🟢 LOW | Specific component | Test component usage |
| `app/*/page.tsx` | 🟢 LOW | Single page | Test that page only |

---

## Safe Styling Modification Workflow

### 1. Identify Scope
- **Question**: "Does this change affect one page or the entire app?"
- **Action**: Check the risk matrix above

### 2. Use CSS Variable Tokens
- **Prefer**: `bg-background`, `text-foreground`, `border-border`
- **Avoid**: Hardcoded colors like `bg-white`, `text-black`
- **Exception**: Brand colors (`#00A3FF`) can be hardcoded

### 3. Test in Both Themes
- **Before committing**: Toggle light/dark mode
- **Verify**: Component looks correct in both modes
- **Check**: Text contrast, border visibility, background opacity

### 4. Check Component Reusability
- **Question**: "Is this component used in multiple places?"
- **Action**: Search codebase for component imports
- **If yes**: Test all usages before committing

---

## Common Styling Patterns & Scope

### Pattern 1: Page Container
```tsx
// ✅ SAFE: Page-specific, low impact
<div className="min-h-screen bg-background">
  <Header />
  <main className="container mx-auto px-4 py-16">
    {/* content */}
  </main>
</div>
```

**Scope**: Single page
**Risk**: Low
**Testing**: Test that page in both themes

---

### Pattern 2: Card/Form Container
```tsx
// ✅ SAFE: Component-specific, low impact
<div className="rounded-lg bg-card border border-border p-6 shadow-lg">
  {/* content */}
</div>
```

**Scope**: Single component or page
**Risk**: Low
**Testing**: Test component in both themes

---

### Pattern 3: Glass Morphism Container (PROBLEMATIC)
```tsx
// ⚠️ AVOID: Causes transparency issues
<div className="glass-card rounded-lg">
  {/* content */}
</div>
```

**Scope**: Uses global `.glass-card` class
**Risk**: Medium (readability issues)
**Alternative**: Use explicit solid backgrounds

---

### Pattern 4: Input Field
```tsx
// ✅ RECOMMENDED: Theme-aware
<Input
  className="bg-background border-input text-foreground"
/>

// ⚠️ AVOID: Dark-mode-only styling
<Input
  className="bg-white/5 border-white/20 text-white"
/>
```

**Scope**: Component-specific
**Risk**: Low if using CSS variable tokens, Medium if hardcoded

---

## Interconnected Styling Systems

### System 1: Theme Provider
**Files**: `components/theme-provider.tsx`, `context/ThemeContext.tsx`
**Purpose**: Manages light/dark mode switching
**Scope**: Entire application

**Dependencies**:
- CSS variables in `globals.css`
- `next-themes` package
- Local storage for persistence

**⚠️ DO NOT MODIFY WITHOUT REASON**

---

### System 2: Header Component
**File**: `components/header.tsx`
**Purpose**: Global navigation, theme toggle, user menu
**Scope**: Every authenticated page

**Styling Impact**:
- Uses brand colors (`#00A3FF`)
- Theme toggle button switches global theme
- Profile dropdown uses `glass-card` (may need review)

**Safe Modifications**:
- Adjusting spacing, alignment
- Adding/removing navigation items
- Updating dropdown menu items

---

### System 3: Auth Pages (Login/Signup)
**Files**: `app/login/page.tsx`, `app/signup/page.tsx`
**Purpose**: User authentication
**Scope**: Unauthenticated users only

**Current Issues**:
- Form containers use `glass-card` (transparency issue)
- Input fields have dark-mode-only styling
- White-on-white contrast problem in light mode

**Recommended Fix Scope**:
- Replace `glass-card` with explicit styling
- Update input field classes to use CSS variable tokens
- Test both light and dark modes thoroughly

---

## Files You Should NEVER Modify

1. **`node_modules/`** - Dependency packages
2. **`components.json`** - shadcn/ui config (only for component installation)
3. **`.next/`** - Build output (auto-generated)
4. **`package-lock.json`** / `pnpm-lock.yaml`** - Dependency lock files (only via npm/pnpm commands)

---

## Quick Decision Tree: "Should I Modify This File?"

```
START: Need to change styling
   ↓
Q: Is it a global style (affects entire app)?
   ├─ YES → Modify `globals.css` or `tailwind.config.ts`
   │         ⚠️ HIGH RISK - Test entire app
   │
   └─ NO → Is it a reusable component?
            ├─ YES → Modify component file in `components/`
            │         🟡 MEDIUM RISK - Test all usages
            │
            └─ NO → Is it page-specific?
                     └─ YES → Modify `app/*/page.tsx`
                              ✅ LOW RISK - Test that page
```

---

**Last Updated**: November 14, 2025
**Maintainer**: ZenType Development Team
