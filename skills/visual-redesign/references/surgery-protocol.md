# Surgery protocol

Covers Phase 4 (execute the prescriptions layer by layer) and Phase 5 (post-op verification: functionality, visual, atmosphere, motion, responsive, rollback). Load this once the prescription gate passes and you are about to edit files. This is the operating room and the recovery ward.

---

## Phase 4: surgery

Execute the prescriptions from Phase 3. Follow the exact order below. Each layer builds on the previous one.

### Surgical order

```
Layer 1: Tokens     (CSS custom properties, the foundation)
Layer 2: Typography (font imports + heading/body styles)
Layer 3: Color      (replace all Bootstrap/generic color values)
Layer 4: Spacing    (padding, margins, gaps, breathing room)
Layer 5: Components (buttons, cards, inputs, nav, tables)
Layer 6: Atmosphere (grain, glow, section alternation)
Layer 7: Motion     (entry animations, hover states, scroll reveals)
```

### Surgical rules

| Rule | Why |
|---|---|
| One layer at a time | If you change tokens, typography, and components at once and something breaks, you cannot isolate the cause |
| Test after each layer | Run the app. Do all routes load? Do forms submit? Do API calls return? If yes, proceed to the next layer |
| CSS overrides, not replacements | Add a new stylesheet (`gold.css`) that overrides the existing styles. Do not delete the existing CSS files until the override is confirmed working |
| className changes are surgical | Before removing any class, search the whole codebase for it. A class read by JS (`document.querySelector('.btn-primary')`), by a test, or by another stylesheet is load-bearing. See the section below |
| Never rewrite JSX structure | You may add or change `className` and `style` props. You may not reorder children, remove wrapper divs, change component hierarchy, or touch props that are not purely visual |
| New files over modified files | Prefer creating `gold.css` and importing it after existing stylesheets over editing existing stylesheets directly. This makes rollback trivial |

### The override strategy

The safest approach is a single new stylesheet loaded after all existing stylesheets:

```css
/* gold.css, loaded LAST in the cascade.
   WHY: By loading after Bootstrap and existing CSS, our
   rules override the defaults without deleting any code.
   If something breaks, the user removes this one import
   to revert entirely.

   Import in the main entry file:
   import './gold.css'  // AFTER all other CSS imports */
```

This file holds all prescriptions from Phase 3 (tokens, typography, components, atmosphere, motion) in one unit that can be added or removed whole.

Drift warning: the temptation is to "clean up" the existing CSS by deleting Bootstrap imports or old stylesheets. Do not do this until the user has confirmed the gold override works. The old CSS is the safety net. Remove it only after the patient is confirmed stable.

### A className can be load-bearing even when it looks decorative

This is the failure mode the audit most often misses, and removing a class this way breaks the app silently, with no console error to point at the cause. A class name that looks like pure styling can be a live dependency:

- A test queries it: `screen.getByTestId` aside, plenty of suites use `container.querySelector('.btn-primary')` or `cy.get('.card--selected')`. Rename the class and the test goes red for a reason no one connects to a CSS change.
- JS reads it: `document.querySelector('.modal-open')`, `el.classList.contains('active')`, `closest('.dropdown')`. The class is an API between the markup and the script.
- Another stylesheet depends on it: a global stylesheet, a third-party CSS file, or a parent component's rules may target `.card .btn`. Removing `.card` from the markup breaks a rule you never opened.
- A `data-*` or `id` attribute that looks decorative is load-bearing: `data-testid`, `data-track`, `data-state`, and `id` values feed tests, analytics, and JS selectors. Never remove one to tidy the markup.

Before you delete or rename any class or attribute, grep the whole repo for it: the JS, the test files, and every stylesheet. If it appears anywhere outside the one CSS rule you are rewriting, it is sacred. Add your new class alongside it rather than swapping it out.

### High-risk file surgery (dashboards, forms, complex components)

For files marked High risk in the audit table:

1. Read the entire file first. Understand every state variable, effect, and handler.
2. Map every className and style prop. Note which ones are referenced in JS, in tests, or in other stylesheets.
3. Change only className string values. The attribute stays; only the value changes.
4. Never touch inline styles that reference state. `style={{ display: isOpen ? 'block' : 'none' }}` is sacred.
5. Test immediately after changes. Run the app, trigger every state change, submit every form, verify every API call.

```tsx
/* EXAMPLE: Safe className surgery on a complex component

   BEFORE (Bootstrap):
   <div className={`card ${isSelected ? 'border-primary' : ''}`}>

   AFTER (Gold):
   <div className={`card ${isSelected ? 'card--selected' : ''}`}>

   The ternary logic is IDENTICAL. Only the class name value
   changed, and only after confirming 'border-primary' is not
   queried by a test or another stylesheet. Then in gold.css:
   .card--selected {
     border-color: var(--color-accent);
     box-shadow: 0 0 0 2px rgba(var(--color-accent-rgb), 0.2);
   }
*/
```

### Some inline styles only look like hardcoded slop

An inline style computed from state is logic, not a defect. It looks like the kind of hardcoded value the skill exists to remove, but it is driven by a variable and must stay inline.

```tsx
/* Sacred: these values are computed at runtime. Leave them. */
<div style={{ transform: `translateX(${offset}px)` }} />
<div style={{ height: `${progress}%` }} />
<div style={{ opacity: isVisible ? 1 : 0 }} />

/* Slop: a static value hardcoded inline. This you may move
   into gold.css as a class. */
<div style={{ padding: '16px', color: '#000' }} />
```

If a style prop contains a template literal, a ternary, or any reference to a variable or prop, it is Sacred. Add your styling through a className on the same element instead.

### Adding data-reveal attributes (non-destructive)

To add scroll-reveal animations, add `data-reveal` attributes to existing JSX elements. This is safe because `data-*` attributes do not affect React's rendering logic:

```tsx
/* BEFORE: */
<section className="features">
  <h2>Features</h2>
  {features.map(f => <FeatureCard key={f.id} {...f} />)}
</section>

/* AFTER, added data-reveal, nothing else changed: */
<section className="features" data-reveal>
  <h2>Features</h2>
  {features.map(f => <FeatureCard key={f.id} {...f} />)}
</section>

/* The data-reveal attribute is inert until the ScrollReveal
   script observes it. It does not interfere with React's
   reconciliation, event handling, or state. Do NOT reuse an
   existing data-* name that a test or script already reads. */
```

### Adding entry animation classes (non-destructive)

```tsx
/* BEFORE: */
<h1 className="hero-heading">Build faster.</h1>
<p className="hero-subtext">The platform for modern teams.</p>
<button className="btn btn-primary" onClick={handleSignup}>Get Started</button>

/* AFTER, added enter-up class and stagger variable: */
<h1 className="hero-heading enter-up" style={{ '--stagger': '0ms' } as React.CSSProperties}>Build faster.</h1>
<p className="hero-subtext enter-up" style={{ '--stagger': '120ms' } as React.CSSProperties}>The platform for modern teams.</p>
<button className="btn btn-primary enter-up" style={{ '--stagger': '240ms' } as React.CSSProperties} onClick={handleSignup}>Get Started</button>

/* The onClick handler is UNTOUCHED. Only className and style
   were added. The style prop uses a CSS custom property for
   the stagger delay. In TypeScript, cast as React.CSSProperties
   to avoid type errors. */
```

### Quality gate: surgery

After all seven layers are applied, confirm each of these. Any one that fails means you revert the last layer and diagnose before continuing.

- The app runs without errors (console is clean).
- All routes load correctly.
- All forms submit and validate correctly.
- All API calls return data and render correctly.
- All state changes work (toggles, modals, dropdowns, selections).
- All event handlers fire correctly (clicks, submits, keypresses).
- No ref errors or "cannot read property of undefined" errors.
- No class or attribute read by a test, a script, or another stylesheet was renamed or removed.
- The new CSS imports load after existing stylesheets.
- The gold.css file can be removed to fully revert.

---

## Phase 5: post-op

Verify the surgery worked. Walk every check. Any FAIL requires diagnosis and correction. Functionality is checked first and gates everything else: a beautiful app that no longer works is a failed operation.

### Functionality check (sacred integrity)

| Check | PASS/FAIL |
|---|---|
| All pages/routes load without error | |
| All forms submit correctly | |
| All API calls return and render data | |
| All state toggles work (open/close, show/hide, select/deselect) | |
| All event handlers fire (onClick, onSubmit, onChange, onKeyDown) | |
| Authentication flow works (login, logout, protected routes) | |
| No console errors | |
| No TypeScript errors (if a TS project) | |
| No broken refs or undefined property errors | |
| All conditional rendering works (loading, error, empty states) | |
| Test suite still passes (no selector broke) | |

If any functionality check fails, revert the last surgery layer and diagnose. Do not proceed to visual checks until all functionality passes.

### Visual upgrade check

| Check | PASS/FAIL |
|---|---|
| No Bootstrap blue (#0d6efd) visible anywhere | |
| No pure black (#000) text on pure white (#fff) backgrounds | |
| Heading font is a display font (not Arial/system-ui) | |
| Heading letter-spacing is negative (tight, not loose) | |
| Heading line-height is compressed (under 1.15) | |
| Body text has a comfortable max-width (not edge-to-edge) | |
| Cards have generous padding (not cramped 16px) | |
| Buttons are pill-shaped or use the prescribed radius | |
| Buttons have hover lift plus shadow expansion | |
| Buttons have active press feedback | |
| Nav has frosted glass treatment | |
| Color palette is warm and consistent (no cold grays mixed with warm tones) | |
| Shadows are subtle and warm (not default Bootstrap) | |
| Border-radius is consistent across same component types | |

### Atmosphere check

| Check | PASS/FAIL |
|---|---|
| Background has subtle warmth (not flat white/gray) | |
| Grain overlay is present and subtle (felt, not seen) | |
| Section alternation creates rhythm (not all same background) | |
| No flat, dead-feeling sections remain | |

### Motion check

| Check | PASS/FAIL |
|---|---|
| Hero elements animate in on page load (staggered fade-up-deblur) | |
| Scroll reveals trigger on below-fold sections | |
| All buttons have hover transitions (not instant state change) | |
| All cards have hover lift | |
| Nav links have animated underlines | |
| Input focus has a border-glow transition | |
| No animation uses CSS keyword easing (ease, ease-in, ease-out, ease-in-out) | |
| `prefers-reduced-motion` is respected (no motion on reduce) | |

### Responsive check

| Check | PASS/FAIL |
|---|---|
| Layout works at 1440px (desktop) | |
| Layout works at 768px (tablet) | |
| Layout works at 375px (mobile) | |
| No horizontal overflow at any viewport | |
| Touch targets minimum 44px on mobile | |
| Heading does not wrap beyond 3 lines at any viewport | |
| Cards stack properly on mobile (single column) | |

### Rollback check

| Check | PASS/FAIL |
|---|---|
| Removing the gold.css import reverts all visual changes cleanly | |
| No existing CSS files were deleted (intact as fallback) | |
| No JSX structural changes were made (only className and data-* additions) | |
| The user can accept or reject the entire upgrade as one unit | |

### Final gate: run design-humanizer

The last check is not in these tables. Run `skills/design-humanizer/SKILL.md` in audit mode against the redesigned result and resolve every FAIL it reports before you call the job done. The post-op tables confirm the app still works and the crimes from the audit are gone; design-humanizer confirms the result does not read as AI-generated design. Both must pass.
