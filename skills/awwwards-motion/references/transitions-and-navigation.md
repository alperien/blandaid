# Transitions, navigation, and loading

Covers Layer 5 (page transitions via the View Transitions API and Framer Motion), Layer 6 (smooth scroll with Lenis, scroll progress indicator), and Layer 9 (loading and preloader sequences). Load this in the build phase when implementing navigation between views, smooth scroll, or a first-paint preloader.

Curves referenced here (`--ease-in-out`, `--ease-out`, `--ease-dramatic`) are defined in `references/easing-and-timing.md`.

---

## Layer 5: page transitions

Moving between pages or views with choreographed transitions.

### CSS View Transitions API (modern browsers)

```css
/* BLUEPRINT: View Transitions
   WHY: The View Transitions API (Chrome 111+) enables
   native page transitions without a framework. The browser
   snapshots the old page, navigates, then animates between
   the old snapshot and the new page. ::view-transition
   pseudo-elements let you customize the animation. */

::view-transition-old(root) {
  animation: fade-out 0.3s var(--ease-in-out);
}

::view-transition-new(root) {
  animation: fade-in 0.3s var(--ease-in-out);
}

@keyframes fade-out {
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(0.98); }
}

@keyframes fade-in {
  from { opacity: 0; transform: scale(1.02); }
  to   { opacity: 1; transform: scale(1); }
}

/* Element-level transitions (e.g., hero image persists across pages) */
.hero-image {
  view-transition-name: hero-image;
}

::view-transition-old(hero-image) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-new(hero-image) {
  animation: none;
  mix-blend-mode: normal;
}
```

```javascript
/* BLUEPRINT: Triggering View Transitions
   WHY: document.startViewTransition wraps the DOM update
   in a transition. The callback performs the actual navigation
   or content swap. If the API is not supported, it falls back
   to instant navigation. */

function navigateWithTransition(url) {
  if (!document.startViewTransition) {
    window.location.href = url;
    return;
  }

  document.startViewTransition(async () => {
    const response = await fetch(url);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Swap the main content
    document.querySelector("main").innerHTML =
      doc.querySelector("main").innerHTML;

    // Update the title
    document.title = doc.title;

    // Update URL
    history.pushState({}, "", url);
  });
}
```

### Framer Motion page transitions (React/Next.js)

```tsx
/* BLUEPRINT: Framer Motion AnimatePresence page transition
   WHY: AnimatePresence detects when children are removed from
   the React tree and plays their exit animation before unmounting.
   mode="wait" ensures the exit completes BEFORE the enter starts,
   preventing both pages from being visible simultaneously. */

import { AnimatePresence, motion } from "framer-motion";

const pageTransition = {
  initial: { opacity: 0, y: 20, filter: "blur(6px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: "blur(4px)",
    transition: { duration: 0.3, ease: [0.65, 0, 0.35, 1] },
  },
};

// In layout:
// <AnimatePresence mode="wait">
//   <motion.main key={pathname} {...pageTransition}>
//     {children}
//   </motion.main>
// </AnimatePresence>
```

---

## Layer 6: smooth scroll and navigation

### Smooth scroll with Lenis

```javascript
/* BLUEPRINT: Smooth scroll with Lenis
   WHY: Native CSS scroll-behavior: smooth is janky and
   non-configurable. Lenis provides inertia scrolling with
   configurable easing, duration, and scroll direction. It is
   the same library most Awwwards sites use for scroll feel.
   lerp (linear interpolation) controls smoothness: 0.1 is
   silky, 0.3 is more direct. */

import Lenis from "@studio-freight/lenis";

const lenis = new Lenis({
  lerp: 0.1,           // smoothness factor (0.05 = very smooth, 0.2 = snappier)
  duration: 1.2,       // base scroll duration
  smoothWheel: true,
  smoothTouch: false,   // never smooth-scroll on touch. it breaks native feel
  wheelMultiplier: 1,
  touchMultiplier: 2,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Connect to GSAP ScrollTrigger if using both:
// lenis.on("scroll", ScrollTrigger.update);
// gsap.ticker.add((time) => lenis.raf(time * 1000));
// gsap.ticker.lagSmoothing(0);
```

Drift warning: never use smooth scroll on touch devices. It destroys the native scroll feel that mobile users expect and creates accessibility problems. `smoothTouch: false` is mandatory.

### Scroll progress indicator

```css
/* BLUEPRINT: Reading progress bar
   WHY: A thin bar at the top of the viewport that fills
   as the user scrolls gives a sense of progression.
   Using scroll-timeline (CSS) instead of JS is more
   performant because it is handled by the compositor thread. */

.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--color-accent);
  transform-origin: left;
  transform: scaleX(0);
  z-index: 9999;
  animation: scroll-progress linear;
  animation-timeline: scroll();
}

@keyframes scroll-progress {
  to { transform: scaleX(1); }
}
```

---

## Layer 9: loading and preloader sequences

The first thing the user sees. A choreographed preloader signals quality before the content appears.

### Minimal progress preloader

```css
/* BLUEPRINT: Minimal preloader with line expansion
   WHY: A single expanding line is more premium than a spinner.
   The line grows from center (scaleX 0 to 1) while a counter
   ticks up. When loading completes, the preloader lifts away
   with a clip-path wipe. */

.preloader {
  position: fixed;
  inset: 0;
  background: var(--color-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  transition: clip-path 0.8s var(--ease-dramatic);
  clip-path: inset(0);
}

.preloader.is-done {
  clip-path: inset(0 0 100% 0);  /* wipes upward */
  pointer-events: none;
}

.preloader-line {
  width: 120px;
  height: 1px;
  background: var(--color-text-3);
  position: relative;
  overflow: hidden;
}

.preloader-line::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-text);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s linear;
}

/* JS sets --progress from 0 to 1 */
.preloader-line::after {
  transform: scaleX(var(--progress, 0));
}

.preloader-counter {
  font-family: var(--font-mono, monospace);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: var(--color-text-3);
  margin-top: 1rem;
}
```

```javascript
/* BLUEPRINT: Preloader controller
   WHY: We simulate loading progress based on font and image
   readiness. The counter formats to 3 digits (001...100).
   When all resources are loaded, we trigger the exit sequence
   and then fire the hero entry animation. */

class Preloader {
  constructor() {
    this.counter = document.querySelector(".preloader-counter");
    this.line = document.querySelector(".preloader-line");
    this.preloader = document.querySelector(".preloader");
    this.progress = 0;
    this.target = 0;
  }

  start() {
    // Track actual resource loading
    const promises = [
      document.fonts.ready,
      ...Array.from(document.images).map(
        (img) =>
          img.complete
            ? Promise.resolve()
            : new Promise((res) => {
                img.onload = res;
                img.onerror = res;
              })
      ),
    ];

    // Animate counter smoothly
    const tick = () => {
      this.progress += (this.target - this.progress) * 0.08;

      const rounded = Math.round(this.progress);
      this.counter.textContent = String(rounded).padStart(3, "0");
      this.line.style.setProperty("--progress", this.progress / 100);

      if (rounded < 100) {
        requestAnimationFrame(tick);
      } else {
        this.complete();
      }
    };

    // Simulate progress stages
    setTimeout(() => { this.target = 30; }, 100);
    setTimeout(() => { this.target = 60; }, 400);
    setTimeout(() => { this.target = 80; }, 700);

    Promise.all(promises).then(() => {
      this.target = 100;
    });

    requestAnimationFrame(tick);
  }

  complete() {
    setTimeout(() => {
      this.preloader.classList.add("is-done");
      // Trigger hero entry animation after preloader exits
      setTimeout(() => {
        document.body.classList.add("is-loaded");
      }, 800);
    }, 300);
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  new Preloader().start();
});
```
