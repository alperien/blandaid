---
name: visual-redesign
description: |
  Surgical CSS-only aesthetic upgrade for existing React, HTML, and CSS
  codebases. Fires when a user hands over working but ugly code (Bootstrap
  defaults, default-palette Tailwind, amateur CSS) and asks to make it look
  better, more premium, or Awwwards-tier. Audits the code across seven layers,
  classifies every element as Sacred (JavaScript logic, never touched) or Slop
  (visual cruft, upgraded), then executes precise CSS-only surgery layer by
  layer with a rollback path. Scope is strictly visual: it never modifies state,
  effects, API calls, handlers, routing, or data flow. It does not rewrite code
  from scratch, and it declines when there is no existing code to preserve.
license: MIT
metadata:
  version: "2.0.0"
---

# Visual redesign: surgical aesthetic upgrade

Existing code, working logic, ugly surface. You upgrade the surface without touching the logic. The framing that governs every decision in this skill is a surgeon operating on a live patient: you cut precisely and the patient stays alive, which here means the app still runs when you are done.

## The Sacred Rule, read first

JavaScript logic is sacred. You do not touch it. Ever. This is the constraint that defines the skill, and it overrides any aesthetic preference. If a visual upgrade seems to require a logic change, find a CSS-only way or leave it alone.

```
SACRED (never modify):
  useState / useReducer declarations and updates
  useEffect / useCallback / useMemo bodies
  API calls (fetch, axios, SWR, React Query)
  Event handler LOGIC (what happens onClick, not how the button looks)
  Conditional rendering logic (ternaries, && chains, if blocks)
  Router / navigation logic
  Form validation logic
  Context providers and consumers
  Custom hook implementations
  Data transformations (map, filter, reduce on data)
  Error handling (try/catch, error boundaries)
  Prop drilling / prop interfaces
  Third-party library integration logic

SLOP (upgrade aggressively):
  className strings and CSS classes
  Inline styles that are static values (style={{ padding: '16px' }})
  CSS / SCSS files
  Tailwind utility classes
  Bootstrap classes
  Color values (hex, rgb, hsl)
  Font families and sizes
  Spacing values (padding, margin, gap)
  Border-radius values
  Shadow values
  Transition / animation declarations
  z-index values
  Layout structure (flex / grid configuration)
  Wrapper div nesting for layout, NOT for conditional logic
```

The single most common way an AI breaks an app is restructuring JSX to look cleaner and, in the process, dropping a conditional wrapper, moving a key prop, changing a ref, or reordering children that depend on DOM position. Never restructure JSX for aesthetic reasons when the existing structure works. Add CSS to the structure you were given.

### The gray zone

Some elements are both logic and style. Handle them with care.

| Element | Sacred or slop | Rule |
|---|---|---|
| `className={isActive ? 'active' : ''}` | Both: logic sacred, class values slop | Keep the ternary. Change only the class values: `className={isActive ? 'nav-link--active' : 'nav-link'}` |
| `style={{ display: isOpen ? 'block' : 'none' }}` | Sacred: conditional visibility logic | Do not replace with a CSS class. It is driven by state. Add styles alongside it |
| `{items.map((item) => <Card key={item.id} ... />)}` | Sacred: the map, key, and data flow | Style the Card internals. Do not change the map or the key |
| `ref={containerRef}` | Sacred: refs drive JS behavior | Never remove, move, or rename refs |
| `aria-*` attributes | Sacred: accessibility is functional | Never remove. You may add missing ones |
| `data-*` attributes | Probably sacred: often read by JS or tests | Never remove unless confirmed unused |
| `id` attributes | Probably sacred: may be a JS selector | Never change unless confirmed unused |
| `onClick={() => setOpen(!open)}` | Sacred: the handler is logic | Style the element. Do not touch the handler |
| A `<div>` wrapping conditional content | Sacred: may exist for rendering reasons | Do not remove "unnecessary" wrappers unless confirmed purely presentational |

If you are unsure whether something is logic or style, leave it alone and add your styles alongside it. A slightly less elegant CSS solution that keeps the app working beats an elegant refactor that introduces a bug.

## When this fires

The user hands you existing React, HTML, or CSS that works and asks to make it look better, upgrade the design, make it premium, or give it an Awwwards feel. The code has working state, API calls, handlers, and business logic, and the request is about the visual layer.

## When this does not fire

- The user wants a rewrite rather than a restyle. If they want the component rebuilt or the logic reworked, this is the wrong skill; it only changes the visual layer.
- There is no existing code. With nothing to upgrade, use a generative skill instead.
- The code is a fresh scaffold with nothing worth preserving. If it is boilerplate with no real logic and no real design, there is no patient to operate on; build it properly rather than restyling a placeholder.

## Modes

Default is direct.

direct: the user invoked the redesign as the task. Run the full pipeline and show the work: the audit table, the extraction sheet, the prescription, the diff, and the gate results. The ceremony is part of the deliverable.

embedded: another skill or a larger job uses this as one step. Run the same pipeline internally and output only the artifact (the gold.css and the edited files). No tables, no commentary.

audit: point the skill at existing code and report only, changing nothing. Return the seven-layer audit, the crimes catalog, and a PASS/FAIL list of what would change, with the highest-severity items first. This is a genuine dry run: the user sees exactly what the surgery would do before any file is touched.

## The pipeline

```
CODE IN
  -> Phase 1: Audit       read every file, classify Sacred vs Slop,
                          catalog the aesthetic crimes
  -> Phase 2: Extraction  extract current design across 7 layers,
                          build the Slop Sheet
  -> Phase 3: Prescription define target aesthetic, map every slop
                          item to its gold replacement
  -> Phase 4: Surgery     execute layer by layer: tokens, typography,
                          color, spacing, components, atmosphere, motion
  -> Phase 5: Post-Op     verify nothing broke, then visual, atmosphere,
                          motion, responsive, rollback checks

Each phase has a quality gate. Failing a gate blocks the next.
```

## Hard rules

### 1. Never restructure JSX for aesthetics

Reject: reshaping the DOM tree (removing wrappers, reordering children, hoisting elements) to fit a CSS idea.
Why: a wrapper or child order can be load-bearing for conditional rendering, refs, or DOM-position-dependent logic. Restyle the tree you have.

Bad:
```tsx
// "cleaned up" the wrapper away to simplify the markup
<>
  {items.map((item) => <Card key={item.id} {...item} />)}
</>
```

Good:
```tsx
// wrapper kept; it may exist for a layout or rendering reason
<div className="card-grid">
  {items.map((item) => <Card key={item.id} {...item} />)}
</div>
```

### 2. Keep the ternary, change only the class value

Reject: replacing a state-driven className expression with a static class or an inline style.
Why: the conditional is logic. The class strings inside it are the only slop. Swap the strings, keep the branch.

Bad:
```tsx
<div className="card border-primary" />
```

Good:
```tsx
<div className={isSelected ? 'card card--selected' : 'card'} />
```

### 3. Do not touch inline styles computed from state

Reject: converting a computed style prop into a CSS class because it looks hardcoded.
Why: a style built from a variable, a ternary, or a template literal is driven by runtime state. Only a fully static inline value is slop.

Bad:
```tsx
// moved a live value into a class; the transform no longer tracks state
<div className="slider-track" />
```

Good:
```tsx
// computed style stays inline; static styling added via className
<div className="slider-track" style={{ transform: `translateX(${offset}px)` }} />
```

### 4. Do not rename a class or attribute that something else reads

Reject: renaming or deleting a className, `data-*`, or `id` that a test, a script, or another stylesheet depends on.
Why: the removal breaks silently, with no console error. A class that looks decorative can be a live selector for a test or another rule.

Bad:
```tsx
// a test does container.querySelector('.btn-primary'); this breaks it
<button className="button-cta">Save</button>
```

Good:
```tsx
// original class kept for the selector; new styling class added beside it
<button className="btn-primary button-cta">Save</button>
```

### 5. Override in a new stylesheet, do not edit or delete the old CSS

Reject: deleting Bootstrap imports or editing existing stylesheets in place to force new styles through.
Why: the old CSS is the rollback path. A single `gold.css` loaded last wins by cascade and can be removed in one line to revert.

Bad:
```css
/* editing bootstrap.min.css in place, or deleting the import */
.btn-primary { background: #7C5CFF; }
```

Good:
```css
/* gold.css, imported AFTER Bootstrap; original file untouched */
.btn-primary { background: var(--color-accent); }
```

### 6. No CSS keyword easing

Reject: `ease`, `ease-in`, `ease-out`, `ease-in-out` on any transition or animation.
Why: keyword easings read as undesigned motion. Custom cubic-beziers give every animation a deliberate feel. Use the shared curves from `skills/blandaid-core/SKILL.md`.

Bad:
```css
transition: all 0.15s ease-in-out;
```

Good:
```css
transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
```

### 7. Body font is not a heading font

Reject: Arial, Inter, Roboto, or system-ui set as the display face at a large size.
Why: body fonts lack the optical refinement large sizes need. A real display font is the highest-impact single change in the pipeline.

Bad:
```css
h1 { font-family: Arial, sans-serif; font-size: 2rem; }
```

Good:
```css
h1 { font-family: 'Outfit', system-ui, sans-serif; font-size: clamp(2.25rem, 5vw, 3.75rem); letter-spacing: -0.04em; }
```

### 8. Give elements room to breathe

Reject: cramped padding and gaps (`p-3` on cards, `gap-3` in grids, tight heading-to-body spacing).
Why: cramped spacing is the clearest amateur tell, and increasing it is the change with the most dramatic effect per line.

Bad:
```css
.card { padding: 1rem; }
```

Good:
```css
.card { padding: var(--space-component); } /* 2rem, from the token scale */
```

## Quality gates, condensed

Each phase gate lives in full in its reference file. The conditions that must hold to advance:

- Audit: every file read and classified, Sacred elements named, risk levels set, crimes cataloged with specifics, nothing modified yet.
- Extraction: all seven layers filled with exact values, the gap to target visible, nothing modified yet.
- Prescription: every slop item mapped to a gold value, temperatures consistent, the accent chosen from brand context (the `#____` placeholder filled), motion additions non-destructive.
- Surgery: app runs clean, all routes, forms, API calls, state, and handlers work, no test or external selector renamed, gold.css loads last and removes cleanly.
- Post-op: functionality passes first and gates the rest, then visual, atmosphere, motion, responsive, and rollback checks pass, and design-humanizer in audit mode reports no FAIL.

## Restraint

The maximalist reflex is to treat everything neutral or dense or hardcoded as a defect. Often it is a decision. Read the signals before you cut, and when restraint wins, say so in one sentence rather than silently skipping a step.

Signals to preserve:

- An existing design system or component library the company mandates. If the code imports a corporate system, work inside its tokens; do not replace its look with your own.
- Brand colors set by marketing. A specific hex that recurs deliberately is a brand asset, not Bootstrap blue. Keep it, even if it is a blue.
- A dense admin table built to show maximum data per screen. Keep the compact row height. Do not add generous padding that pushes rows below the fold.
- A deliberate high-contrast choice made for accessibility. Pure black on white can be an AA/AAA decision. Do not warm it into a lower contrast ratio.
- An inline style computed from state that only looks like hardcoded slop. If the value comes from a variable, a ternary, or a template literal, it is logic. Leave it inline.
- A test selector or `data-*` attribute that looks decorative but is load-bearing. A class or attribute read by a test, a script, or another stylesheet is a live dependency. Add beside it; never rename it away.
- A className that other stylesheets or tests target. Global CSS and test suites reach across files. Grep before you remove.

When the constraint does not apply:

- A data-dense internal tool or admin dashboard where scannability beats atmosphere. Grain, big type, and generous whitespace fight the job. Improve contrast and consistency; skip the ambiance.
- A government, compliance, or regulated interface where a mandated style guide governs. Follow the guide, not this aesthetic.
- Documentation or a content-first reading surface where the existing restraint is the design. Do not add motion and depth to a page whose point is calm reading.
- A codebase where the user named a specific design system or brand kit. They have already chosen the look; your job is to apply it cleanly, not to substitute yours.

## Core principles

The patient must survive. A beautiful app that no longer functions is worse than an ugly app that works. Test after every surgery layer; functionality always beats aesthetics.

CSS overrides, never JS rewrites. Your tools are className changes, new CSS files, and data attributes. If a visual upgrade seems to need a logic change, find a CSS-only alternative.

The gold.css is a single unit. One file, loaded last, holding the entire visual upgrade. The user adds it to upgrade or removes it to revert, in one import. Clean entry, clean exit.

Warmth over neutrality. Off-white backgrounds, warm near-black text, and warm gray borders read as designed; pure gray, white, and black read as clinical. Replacing color temperature is the fastest single upgrade.

Spacing is the largest lever. Increasing section padding, card padding, heading gaps, and grid gaps has the most dramatic effect of any single change. When in doubt, add space.

Display fonts separate amateur from professional. Swapping the heading face from Arial or system-ui to a real display font is the highest-impact change, and everything else builds on it.

## Reference index

| File | What is in it | When to load |
|---|---|---|
| `references/audit-and-extraction.md` | Phase 1 audit and Phase 2 extraction: the audit table, the crimes catalog, all seven extraction layers, both read-only gates | At the start of a redesign, before writing any CSS |
| `references/prescriptions.md` | Phase 3: token, typography, component, atmosphere, and motion prescriptions plus the non-destructive scroll-reveal script | After the extraction gate, when writing the target CSS |
| `references/surgery-protocol.md` | Phase 4 surgery and Phase 5 post-op: surgical order and rules, load-bearing-selector guidance, high-risk file handling, all post-op check tables | When editing files and verifying the result |
| `references/slop-catalog-react.md` | Framework-specific defaults and overrides: Bootstrap, Tailwind, MUI, Chakra, Ant, styled-components, vanilla | In Phase 3 when you hit a specific stack |
| `skills/blandaid-core/SKILL.md` | Shared quality bar, easing and spatial vocabulary, palette discipline, universal restraint, modes | For any shared value; do not restate it here |
| `skills/design-humanizer/SKILL.md` | The AI-design-tell detector and the general slop catalog | For general visual tells, and as the final audit-mode gate |
