# Ambient motion and state transitions

Covers Layer 7 (ambient and atmospheric motion: Lissajous orbital drift, animated gradients, cursor glow, parallax depth layers) and Layer 8 (state transitions: modal, accordion, tab slide indicator, off-canvas menu). Load this in the build phase for the polish layer and for UI state changes.

Curves referenced here (`--ease-in-out`, `--ease-out`, `--ease-snap`) are defined in `references/easing-and-timing.md`.

---

## Layer 7: ambient and atmospheric motion

The final polish layer. These details make a page feel alive even when the user is not interacting.

### Orbital motion (Lissajous curves)

```css
/* BLUEPRINT: Lissajous orbital motion for decorative elements
   WHY: A simple up-down float is the cheapest-looking ambient
   animation on the web. It reads as a template site. Real
   objects do not bob up and down on a single axis. They drift
   in complex, organic paths.

   Lissajous curves create figure-8 and orbital trajectories
   by combining two sine waves at different frequencies on
   the X and Y axes. The result is a path that never repeats
   exactly and reads as high production value rather than
   "I added a float animation."

   The key: use DIFFERENT durations for X and Y movement.
   When X cycles at 7s and Y at 11s, the combined path takes
   77s to repeat, which is effectively infinite variety. */

/* Primary orbital. For hero decorative shapes */
.orbital {
  animation:
    orbital-x 7s var(--ease-in-out) infinite alternate,
    orbital-y 11s var(--ease-in-out) infinite alternate;
}

@keyframes orbital-x {
  0%   { transform: translateX(0); }
  100% { transform: translateX(15px); }
}

@keyframes orbital-y {
  0%   { transform: translateY(0); }
  100% { transform: translateY(-12px); }
}

/* Secondary orbital. Offset phase for second element */
.orbital-alt {
  animation:
    orbital-x 9s var(--ease-in-out) infinite alternate-reverse,
    orbital-y 13s var(--ease-in-out) infinite alternate;
}

/* Tertiary. With rotation for depth */
.orbital-spin {
  animation:
    orbital-x 8s var(--ease-in-out) infinite alternate,
    orbital-y 12s var(--ease-in-out) infinite alternate-reverse,
    orbital-rotate 20s linear infinite;
}

@keyframes orbital-rotate {
  to { transform: rotate(360deg); }
}

/* For elements that need true combined transforms,
   wrap in a container that handles one axis: */

/* Outer wrapper handles X drift */
.drift-x {
  animation: orbital-x 7s var(--ease-in-out) infinite alternate;
}

/* Inner element handles Y drift plus optional rotation */
.drift-y {
  animation: orbital-y 11s var(--ease-in-out) infinite alternate;
}

/* Scale pulse variant. Breathes in and out */
.orbital-breathe {
  animation:
    orbital-x 8s var(--ease-in-out) infinite alternate,
    orbital-y 13s var(--ease-in-out) infinite alternate,
    orbital-scale 6s var(--ease-in-out) infinite alternate;
}

@keyframes orbital-scale {
  0%   { scale: 1; }
  100% { scale: 1.08; }
}

@media (prefers-reduced-motion: reduce) {
  .orbital,
  .orbital-alt,
  .orbital-spin,
  .orbital-breathe,
  .drift-x,
  .drift-y {
    animation: none;
  }
}
```

```html
<!-- Usage: wrap for combined orbital path -->
<div class="drift-x">
  <div class="drift-y">
    <div class="decorative-blob"></div>
  </div>
</div>

<!-- Simple usage (single element): -->
<div class="orbital decorative-shape"></div>
<div class="orbital-alt decorative-shape-2"></div>
```

Why this replaces float: a `translateY(-8px)` bounce on a 6s loop is on every template, every tutorial, every "add some life to your page" blog post. Lissajous orbital motion creates a path that reads as hand-built. The mismatched X/Y durations mean the element never repeats the same path visually, which reads as organic and intentional.

### Gradient animation (living backgrounds)

```css
/* BLUEPRINT: Animated gradient background
   WHY: A slowly shifting gradient makes the background feel
   alive. background-size: 400% 400% creates a large gradient
   that pans across the element. 15s duration is slow enough
   to be ambient. This works for hero sections and full-page
   backgrounds. */

.gradient-animate {
  background: linear-gradient(
    -45deg,
    var(--grad-1, #0a0a0a),
    var(--grad-2, #1a1a2e),
    var(--grad-3, #16213e),
    var(--grad-4, #0f3460)
  );
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}

@keyframes gradient-shift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@media (prefers-reduced-motion: reduce) {
  .gradient-animate {
    animation: none;
    background-size: 100% 100%;
  }
}
```

### Cursor glow (custom cursor follower)

```javascript
/* BLUEPRINT: Cursor glow that follows mouse position
   WHY: A soft radial glow following the cursor creates an
   ambient light effect. Using CSS custom properties (--mx, --my)
   set from JS is more performant than moving a DOM element,
   because the browser can composite the radial-gradient on the
   GPU. requestAnimationFrame is NOT needed here. mousemove
   fires at monitor refresh rate already. */

function initCursorGlow() {
  const glow = document.querySelector(".cursor-glow");
  if (!glow) return;

  // Respect reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    glow.style.display = "none";
    return;
  }

  document.addEventListener("mousemove", (e) => {
    glow.style.setProperty("--mx", `${e.clientX}px`);
    glow.style.setProperty("--my", `${e.clientY}px`);
  });
}
```

```css
/* BLUEPRINT: Cursor glow CSS
   WHY: The glow is a fixed-position pseudo-element using
   radial-gradient positioned by custom properties.
   pointer-events: none makes it non-interactive.
   The large spread (600px) and low opacity (0.06) create
   a subtle ambient effect, not a spotlight. */

.cursor-glow {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9998;
  background: radial-gradient(
    600px circle at var(--mx, 50%) var(--my, 50%),
    rgba(var(--color-accent-rgb, 99, 102, 241), 0.06),
    transparent 70%
  );
  transition: background 0.15s ease;
}
```

### Parallax depth layers

```javascript
/* BLUEPRINT: Lightweight CSS-variable parallax
   WHY: Instead of transforming elements directly on scroll
   (which requires JS on every frame), we update a single
   CSS custom property (--scroll) on the document. Individual
   elements use calc() with --scroll to compute their own
   parallax offset. This is one JS listener, zero per-element
   JS calculations. */

function initParallax() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        document.documentElement.style.setProperty(
          "--scroll",
          window.scrollY.toString()
        );
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}
```

```css
/* BLUEPRINT: Parallax layers via CSS calc()
   WHY: Each layer multiplies --scroll by a different speed
   factor. Negative values move the element against scroll
   direction (up when scrolling down), creating depth. The
   speed factor determines the distance of the layer:
   0.05 = close (subtle), 0.2 = far (dramatic). */

.parallax-slow {
  transform: translateY(calc(var(--scroll, 0) * -0.05px));
  will-change: transform;
}

.parallax-medium {
  transform: translateY(calc(var(--scroll, 0) * -0.12px));
  will-change: transform;
}

.parallax-fast {
  transform: translateY(calc(var(--scroll, 0) * -0.2px));
  will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
  .parallax-slow,
  .parallax-medium,
  .parallax-fast {
    transform: none !important;
    will-change: auto;
  }
}
```

---

## Layer 8: state transitions

Transitions between UI states: modals, accordions, tabs, menus.

### Modal open/close

```css
/* BLUEPRINT: Modal with backdrop and content animation
   WHY: The backdrop fades while the modal content scales and
   fades separately. This two-layer animation creates depth:
   the dark overlay lowers and the modal lifts into view.
   Using the <dialog> element gives us native accessibility
   (focus trapping, Escape key, aria roles) for free. */

dialog::backdrop {
  background: rgba(0, 0, 0, 0);
  transition: background 0.3s var(--ease-in-out);
}

dialog[open]::backdrop {
  background: rgba(0, 0, 0, 0.5);
}

dialog {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
  transition:
    opacity 0.3s var(--ease-out),
    transform 0.3s var(--ease-out),
    display 0.3s allow-discrete,
    overlay 0.3s allow-discrete;
}

dialog[open] {
  opacity: 1;
  transform: scale(1) translateY(0);
}

/* Starting style for entry animation (CSS allow-discrete) */
@starting-style {
  dialog[open] {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  dialog[open]::backdrop {
    background: rgba(0, 0, 0, 0);
  }
}
```

### Accordion expand/collapse

```css
/* BLUEPRINT: Smooth accordion with CSS grid
   WHY: The grid-template-rows trick (0fr to 1fr) animates
   the height of an unknown-height element, which CSS cannot
   do with height: auto. The inner wrapper (min-height: 0)
   prevents content from showing below the 0fr collapsed state.
   This is pure CSS. No JS height calculations needed. */

.accordion-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s var(--ease-out);
}

.accordion-content[data-expanded="true"] {
  grid-template-rows: 1fr;
}

.accordion-content > .accordion-inner {
  overflow: hidden;
  min-height: 0;
}
```

### Tab switch with sliding indicator

```javascript
/* BLUEPRINT: Tab indicator that slides to the active tab
   WHY: Instead of hiding/showing a fixed indicator, the indicator
   MOVES from the previous tab to the new one using transform.
   This creates a direct spatial connection between tabs.
   The indicator's width and position are set from the active
   tab's getBoundingClientRect() for pixel-perfect alignment. */

function initTabs() {
  const tabContainer = document.querySelector("[data-tabs]");
  const indicator = tabContainer.querySelector(".tab-indicator");
  const tabs = tabContainer.querySelectorAll("[data-tab]");

  function moveIndicator(tab) {
    const rect = tab.getBoundingClientRect();
    const containerRect = tabContainer.getBoundingClientRect();

    indicator.style.width = `${rect.width}px`;
    indicator.style.transform = `translateX(${rect.left - containerRect.left}px)`;
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      moveIndicator(tab);
    });
  });

  // Initialize on the active tab
  const activeTab = tabContainer.querySelector("[data-tab].active");
  if (activeTab) moveIndicator(activeTab);
}
```

```css
.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: var(--color-accent);
  transition:
    transform 0.4s var(--ease-snap),
    width 0.4s var(--ease-snap);
}
```

### Menu slide-in

```css
/* BLUEPRINT: Off-canvas menu with staggered link entry
   WHY: The menu slides in from the right (translateX(100%))
   while individual links stagger down with a delay. The
   two-layer animation (container slides, children stagger)
   creates a choreographed feel. The container uses
   visibility plus pointer-events to prevent interaction when
   closed, not display:none (which cannot be animated). */

.mobile-menu {
  position: fixed;
  inset: 0;
  background: var(--color-bg);
  transform: translateX(100%);
  transition: transform 0.5s var(--ease-out);
  visibility: hidden;
  pointer-events: none;
  z-index: 100;
}

.mobile-menu.is-open {
  transform: translateX(0);
  visibility: visible;
  pointer-events: auto;
}

.mobile-menu .menu-link {
  opacity: 0;
  transform: translateX(30px);
  transition:
    opacity 0.4s var(--ease-out),
    transform 0.4s var(--ease-out);
}

.mobile-menu.is-open .menu-link:nth-child(1) { transition-delay: 100ms; opacity: 1; transform: translateX(0); }
.mobile-menu.is-open .menu-link:nth-child(2) { transition-delay: 160ms; opacity: 1; transform: translateX(0); }
.mobile-menu.is-open .menu-link:nth-child(3) { transition-delay: 220ms; opacity: 1; transform: translateX(0); }
.mobile-menu.is-open .menu-link:nth-child(4) { transition-delay: 280ms; opacity: 1; transform: translateX(0); }
.mobile-menu.is-open .menu-link:nth-child(5) { transition-delay: 340ms; opacity: 1; transform: translateX(0); }
```
