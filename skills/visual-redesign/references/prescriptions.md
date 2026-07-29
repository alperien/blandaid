# Prescriptions

Covers Phase 3: the full slop-to-gold replacement map. Tokens, typography, components, atmosphere, motion, and the non-destructive scroll-reveal script. Load this after the extraction gate passes, when you are ready to write the target CSS. It is the longest reference and the heart of the surgery.

For every slop item extracted in Phase 2, prescribe the gold replacement here. This is the transformation map: the surgical plan. Every code block below is a working recipe. Copy the value, adapt the accent to the brand, keep everything else.

The easing curves and spacing rhythm used throughout come from the shared vocabulary in `skills/blandaid-core/SKILL.md`. Use those values; do not reinvent them per component.

---

## Token prescription

Tokens are the foundation. Changing them first means every component that references them upgrades automatically, which makes this the single highest-value change in the whole pipeline.

```css
/* PRESCRIPTION: Design tokens, slop to gold
   WHY: Tokens are the foundation. Changing these first
   means every component that references them upgrades
   automatically. */

:root {
  /* Colors */

  /* Background: #ffffff to warm off-white.
     WHY: Pure white is harsh and clinical. Off-white
     with a warm undertone reads as intentional. The
     difference is subtle but the eye registers it as
     "designed" rather than "default." */
  --color-bg: #FAFAF9;        /* was: #ffffff */
  --color-surface: #FFFFFF;    /* was: #f8f9fa, cards sit ON the bg */
  --color-surface-2: #F5F4F2;  /* was: none, for alternating sections */

  /* Text: #000000 to warm near-black.
     WHY: Pure black on warm off-white creates a jarring
     temperature clash. Near-black (#1a1a1a) matches the
     warmth of the background and reduces eye strain. */
  --color-text: #1A1A1A;       /* was: #000000 or #212529 */
  --color-text-2: #6B7280;     /* was: #6c757d, muted, for secondary */
  --color-text-3: #9CA3AF;     /* was: none, for captions, placeholders */

  /* Accent: #0d6efd to a considered, non-Bootstrap hue.
     WHY: Bootstrap blue is the loudest "I didn't design
     this" signal on the web. Any other considered hue
     immediately reads as deliberate. Pick based on brand
     context from the user's brief. */
  --color-accent: #____;       /* MUST be chosen based on brand context */
  --color-accent-hover: #____; /* 10 to 15% darker or more saturated */

  /* Borders and shadows: warm, not gray.
     WHY: Cool gray borders (#dee2e6) clash with warm
     backgrounds. Use warm gray or very low-opacity black. */
  --color-border: rgba(0, 0, 0, 0.08);  /* was: #dee2e6 */
  --color-shadow: rgba(0, 0, 0, 0.04);  /* was: rgba(0,0,0,0.1) */

  /* Typography */

  /* Display font: Arial to a real display font.
     WHY: Arial or system-ui as a heading font is the
     typographic equivalent of serving fine dining on
     paper plates. Display fonts carry optical refinements
     for large sizes that body fonts lack. */
  --font-display: 'Outfit', system-ui, sans-serif;  /* was: Arial/system-ui */
  --font-body: 'Inter', system-ui, sans-serif;       /* was: same as display */
  --font-mono: 'JetBrains Mono', monospace;           /* was: none */

  /* Spacing */

  /* Section spacing: random values to a consistent scale.
     WHY: A spacing system creates rhythm. Random spacing
     creates visual noise. The eye detects inconsistency
     even when the brain cannot articulate it. */
  --space-section: clamp(5rem, 10vw, 8rem); /* was: random py values */
  --space-element: 1.5rem;                  /* was: 0.75rem to 1rem */
  --space-component: 2rem;                  /* was: 1rem to 1.5rem */

  /* Radius */

  /* Radius: 4px everywhere to a considered radius language.
     WHY: A design system commits to a radius language.
     Pick one and apply it consistently. */
  --radius-sm: 8px;          /* was: 4px (Bootstrap), inputs, badges */
  --radius-md: 12px;         /* was: 4px, cards, containers */
  --radius-lg: 16px;         /* was: 4px, modals, large cards */
  --radius-full: 9999px;     /* was: 50%, pills, avatars */

  /* Easing */

  /* Easing: ease-in-out to custom curves.
     WHY: CSS keyword easings are the typographic
     equivalent of Comic Sans: zero character, zero
     intent. Custom curves give every animation a
     deliberate feel. These three match core's shared
     easing vocabulary. */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-snap: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
}
```

---

## Typography prescription

The heading is the first thing the eye hits. A display font with tight tracking and compressed line-height reads as designed. The body font stays readable with comfortable line-height.

```css
/* PRESCRIPTION: Typography scale, slop to gold
   WHY: The heading is the first thing the eye hits.
   A display font with tight tracking and compressed
   line-height signals "designed." The body font stays
   readable with comfortable line-height. */

/* Import the fonts. Add to the top of your CSS or <head>. */
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

h1, h2, h3, h4 {
  font-family: var(--font-display);
  letter-spacing: -0.03em;   /* was: normal, too loose at display size */
  line-height: 1.1;          /* was: 1.2 (Bootstrap), tighten */
  text-wrap: balance;        /* prevents ugly orphan lines */
  color: var(--color-text);
}

h1 {
  font-size: clamp(2.25rem, 5vw, 3.75rem);  /* was: 2rem fixed */
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.05;
}

h2 {
  font-size: clamp(1.75rem, 3.5vw, 2.75rem); /* was: 1.5rem fixed */
  font-weight: 600;
}

h3 {
  font-size: clamp(1.25rem, 2vw, 1.5rem);    /* was: 1.25rem fixed */
  font-weight: 600;
}

body, p, span, li {
  font-family: var(--font-body);
  font-size: clamp(0.9375rem, 1.1vw, 1.0625rem); /* was: 1rem fixed */
  line-height: 1.65;     /* was: 1.5, slightly more generous */
  color: var(--color-text);
}

/* Body text max-width: prevent wall-to-wall text. */
p {
  max-width: 65ch;  /* was: none, text ran edge to edge */
}

/* Muted secondary text */
.text-muted, .text-secondary {
  color: var(--color-text-2) !important; /* override Bootstrap's gray */
}

/* Eyebrow / label style. Add where appropriate. */
.eyebrow {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-3);
}
```

---

## Component prescription

The button is the most interactive element on the page. Its hover feel communicates the quality level of the entire site. A snappy cubic-bezier with a physical lift and shadow reads as tactile in a way Bootstrap's default never does. Every prescription below keeps the same DOM structure: only class values and CSS change.

```css
/* PRESCRIPTION: Button, Bootstrap to premium
   WHY: The button's hover feel communicates the whole
   quality level of the site. A snappy cubic-bezier with
   a physical lift and shadow creates a tactile impression
   that Bootstrap's default cannot achieve. */

/* Strip Bootstrap button defaults */
.btn {
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  padding: 0.75rem 1.75rem;             /* was: py-2 px-3, cramped */
  border-radius: var(--radius-full);     /* was: 4px, now pill */
  border: none;
  cursor: pointer;
  transition:
    transform 0.4s var(--ease-snap),
    box-shadow 0.4s var(--ease-snap),
    background-color 0.3s var(--ease-out);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px var(--color-shadow);
}

.btn:active {
  transform: translateY(0) scale(0.98);
  transition-duration: 0.1s;
}

/* Primary button */
.btn-primary {
  background: var(--color-accent);
  color: #ffffff;
  border: none;
  box-shadow: 0 1px 3px var(--color-shadow);
}

.btn-primary:hover {
  background: var(--color-accent-hover);
}

/* Ghost / outline button */
.btn-outline-primary,
.btn-secondary,
.btn-outline-secondary {
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-outline-primary:hover,
.btn-outline-secondary:hover {
  border-color: var(--color-text);
  background: rgba(0, 0, 0, 0.02);
}

/* PRESCRIPTION: Card, Bootstrap to premium */
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);        /* was: 4px */
  padding: var(--space-component);         /* was: 1rem, cramped */
  box-shadow: none;                        /* was: default Bootstrap shadow */
  transition:
    transform 0.4s var(--ease-snap),
    box-shadow 0.4s var(--ease-snap),
    border-color 0.3s var(--ease-snap);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.04),
    0 2px 8px rgba(0, 0, 0, 0.02);
  border-color: rgba(0, 0, 0, 0.12);
}

/* Reset Bootstrap card internals */
.card-body {
  padding: 0;  /* parent .card already has padding */
}

.card-title {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin-bottom: var(--space-element);
}

/* PRESCRIPTION: Input, Bootstrap to premium */
.form-control,
input[type="text"],
input[type="email"],
input[type="password"],
textarea,
select {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  padding: 0.75rem 1rem;                  /* was: py-1.5 px-3, cramped */
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  transition:
    border-color 0.3s var(--ease-snap),
    box-shadow 0.3s var(--ease-snap);
}

.form-control:focus,
input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(var(--color-accent-rgb), 0.15);
}

/* PRESCRIPTION: Navigation, Bootstrap to premium */
.navbar, nav {
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  background: rgba(250, 250, 249, 0.85);  /* semi-transparent for frost */
  border-bottom: 1px solid var(--color-border);
  padding: 0 clamp(1.5rem, 5vw, 5rem);
  height: 64px;
  display: flex;
  align-items: center;
}

.nav-link, .navbar-nav .nav-link {
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-2);
  transition: color 0.3s var(--ease-snap);
  position: relative;
}

.nav-link:hover {
  color: var(--color-text);
}

/* Sliding underline on nav links */
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 1.5px;
  background: var(--color-text);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s var(--ease-snap);
}

.nav-link:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

/* PRESCRIPTION: Table, Bootstrap to premium */
.table, table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
}

.table th, table th {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-3);
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
  text-align: left;
}

.table td, table td {
  font-size: 0.9375rem;
  padding: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  color: var(--color-text);
}

.table tbody tr:hover, table tbody tr:hover {
  background: rgba(0, 0, 0, 0.015);
}

/* Kill Bootstrap zebra striping. It looks cheap. */
.table-striped > tbody > tr:nth-of-type(odd) {
  background-color: transparent;
}
```

Note on table density: kill zebra stripes by default, but read the restraint section first. A dense admin table the user relies on may need its compact row height kept. Do not add generous padding to a table that exists to show maximum data per screen.

---

## Atmosphere prescription

Flat backgrounds feel like nothing. A subtle radial gradient, a grain texture, or a warm tint gives the background depth without adding a single visible element. Keep it subtle: grain opacity under 0.05, gradient opacity under 0.3.

```css
/* PRESCRIPTION: Atmosphere, flat to alive
   WHY: Flat backgrounds feel like nothing. A subtle
   radial gradient, grain texture, or warm tint gives
   the background depth without adding visual elements. */

/* Subtle warm radial on the body */
body {
  background:
    radial-gradient(ellipse at 30% 0%, rgba(250, 235, 215, 0.2) 0%, transparent 50%),
    var(--color-bg);
}

/* Noise grain overlay: felt, not seen. */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
}

/* Section dividers: subtle border instead of hard lines. */
section + section {
  border-top: 1px solid var(--color-border);
}

/* Alternating section backgrounds for rhythm */
section:nth-child(even) {
  background-color: var(--color-surface-2);
}
```

A z-index of 9999 on the grain overlay sits above most content. If the app has fixed overlays, modals, or tooltips that must render above the grain, drop the grain z-index below theirs or scope the overlay to a lower stacking context. Do not let a decorative layer swallow interactive UI.

---

## Motion prescription

An element that appears with no animation reads as a page that half-loaded. A staggered fade-up with deblur signals an intentional mount. Every value below is CSS-only and additive: new keyframes, new classes, a reduced-motion guard. No existing behavior changes.

```css
/* PRESCRIPTION: Motion, static to alive
   WHY: Every element that appears without animation
   feels like the page is broken. A staggered fade-up
   with deblur signals that the page loaded on purpose. */

/* Entry animation keyframe */
@keyframes enter-up {
  from {
    opacity: 0;
    transform: translateY(24px);
    filter: blur(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

/* Apply to major elements. Use inline style for stagger:
   <h1 class="enter-up" style="--stagger: 0ms">
   <p class="enter-up" style="--stagger: 120ms">
   <button class="enter-up" style="--stagger: 240ms"> */
.enter-up {
  animation: enter-up 0.7s var(--ease-out) both;
  animation-delay: var(--stagger, 0ms);
}

/* Scroll reveal: elements below the fold. */
[data-reveal] {
  opacity: 0;
  transform: translateY(30px);
  transition:
    opacity 0.8s var(--ease-out),
    transform 0.8s var(--ease-out);
}

[data-reveal].is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Universal interactive transition. Replaces Bootstrap's
   transition: all 0.15s ease-in-out on every interactive
   element. */
a, button, [role="button"],
input, select, textarea,
.card, .nav-link, .badge {
  transition: all 0.3s var(--ease-snap);
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .enter-up {
    animation: none;
    opacity: 1;
    transform: none;
    filter: none;
  }

  [data-reveal] {
    opacity: 1;
    transform: none;
    transition: none;
  }

  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

The `transition: all` on interactive elements is a deliberate broad stroke to overwrite Bootstrap's default. If the app has elements where animating every property causes a visible glitch (a layout-shifting element, a canvas), scope the transition to `transform` and `color` for those instead of `all`.

---

## Scroll reveal script (non-destructive)

This script observes `[data-reveal]` elements and adds `.is-visible` when they enter the viewport. It does not modify any existing JS. It is a new, separate file that runs on its own. This is the only JavaScript this skill ever writes, and it adds behavior rather than changing it.

```javascript
/* PRESCRIPTION: Scroll reveal, add as a separate script
   WHY: This script observes [data-reveal] elements and
   adds .is-visible when they enter the viewport. It does
   NOT modify any existing JS. It is a new, separate file
   that runs independently.

   Add to the end of the page or import in the main entry. */

class ScrollReveal {
  constructor() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            this.observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '-50px 0px' }
    );

    document.querySelectorAll('[data-reveal]').forEach((el) => {
      this.observer.observe(el);
    });
  }
}

// Initialize after DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ScrollReveal());
} else {
  new ScrollReveal();
}
```

This script only reads the DOM and toggles one class. It never touches state, effects, handlers, or data. It is the reference example of the non-destructive addition: separate file, additive behavior, removable in one line.

---

## Quality gate: prescription

Before moving to Phase 4, confirm each of these. Any one that fails blocks surgery.

- Every slop item from Phase 2 has a gold replacement prescribed.
- Token prescriptions are internally consistent: warm background with warm text, not mixed temperatures.
- The accent color is chosen from the user's brand context, not another generic blue.
- The `#____` accent placeholder is filled with an actual hex value, and `--color-accent-rgb` is set if the focus-glow rule is used.
- Typography uses a display font for headings and a separate body font for body copy.
- Component prescriptions keep the same DOM structure: class changes only, no reordered or removed elements.
- Atmosphere additions are subtle: grain opacity under 0.05, gradient opacity under 0.3.
- Motion additions are non-destructive: new CSS classes and one new script, no existing JS modified.
