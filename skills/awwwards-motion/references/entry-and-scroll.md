# Entry and scroll reveals

Covers Layer 1 (page-load entry animations) and Layer 2 (scroll-triggered reveals), with CSS, Framer Motion, and GSAP recipes plus IntersectionObserver, scroll-pinned sequences, and horizontal scroll. Load this in the build phase when implementing above-the-fold entrances and below-the-fold reveals.

Curves referenced here (`--ease-out`, `--ease-dramatic`) are defined in `references/easing-and-timing.md`.

---

## Layer 1: entry animations (page load)

The first impression. Every above-the-fold element needs a choreographed entrance.

### CSS-only entry system

```css
/* BLUEPRINT: CSS entry animation system
   WHY: Using CSS custom properties for delay values lets you
   stagger from HTML with data attributes. No JS required for
   basic entries. The blur-to-sharp adds perceived quality:
   elements feel like they are focusing into existence, not
   just fading in. */

@keyframes enter-up {
  from {
    opacity: 0;
    transform: translateY(var(--enter-y, 24px));
    filter: blur(var(--enter-blur, 6px));
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

@keyframes enter-scale {
  from {
    opacity: 0;
    transform: scale(var(--enter-scale, 0.95));
    filter: blur(var(--enter-blur, 4px));
  }
  to {
    opacity: 1;
    transform: scale(1);
    filter: blur(0);
  }
}

@keyframes enter-fade {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.enter-up {
  animation: enter-up 0.7s var(--ease-out) both;
  animation-delay: var(--stagger, 0ms);
}

.enter-scale {
  animation: enter-scale 0.6s var(--ease-out) both;
  animation-delay: var(--stagger, 0ms);
}

.enter-fade {
  animation: enter-fade 0.5s var(--ease-out) both;
  animation-delay: var(--stagger, 0ms);
}

/* Stagger via inline custom properties in HTML:
   <h1 class="enter-up" style="--stagger: 100ms">
   <p class="enter-up" style="--stagger: 220ms">
   <a class="enter-up" style="--stagger: 340ms">
*/

@media (prefers-reduced-motion: reduce) {
  .enter-up,
  .enter-scale {
    animation: enter-fade 0.3s ease both;
    animation-delay: 0ms;
  }
}
```

### Framer Motion entry system (React)

```tsx
/* BLUEPRINT: Framer Motion staggered entry
   WHY: variants + staggerChildren is the cleanest way to
   orchestrate multi-element entrances. The parent controls
   timing, children just declare their start/end states.
   This keeps animation logic declarative, not imperative. */

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const fadeUpBlur = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const fadeUpSubtle = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Usage:
// <motion.div variants={containerVariants} initial="hidden" animate="visible">
//   <motion.span variants={fadeUpBlur}>EYEBROW</motion.span>
//   <motion.h1 variants={fadeUpBlur}>Heading</motion.h1>
//   <motion.p variants={fadeUpSubtle}>Subtext</motion.p>
//   <motion.a variants={scaleIn}>CTA</motion.a>
// </motion.div>
```

### GSAP entry system

```javascript
/* BLUEPRINT: GSAP staggered entry with ScrollTrigger
   WHY: GSAP's timeline gives frame-perfect control over
   complex sequences. The "from" tween is cleaner than
   "to" for entries because you define the hidden state
   and GSAP animates TO the element's natural CSS state. */

// Hero entry (fires on page load)
const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

heroTl
  .from(".hero-eyebrow", {
    y: 20, opacity: 0, duration: 0.7, filter: "blur(8px)"
  })
  .from(".hero-heading", {
    y: 30, opacity: 0, duration: 0.8, filter: "blur(8px)"
  }, "-=0.55")  // overlap with previous
  .from(".hero-subtext", {
    y: 20, opacity: 0, duration: 0.6
  }, "-=0.5")
  .from(".hero-cta", {
    y: 20, opacity: 0, scale: 0.95, duration: 0.5
  }, "-=0.4");
```

---

## Layer 2: scroll-triggered reveals

Elements below the fold reveal as the user scrolls them into view.

### IntersectionObserver (vanilla JS)

```javascript
/* BLUEPRINT: Scroll reveal with IntersectionObserver
   WHY: IntersectionObserver is GPU-friendly. It does not fire
   on every scroll event. The threshold (0.15) means the element
   starts animating when 15% is visible, which feels natural.
   rootMargin "-50px" prevents elements at the very edge of the
   viewport from triggering prematurely. The "once" pattern
   (unobserve after first trigger) prevents re-animation on
   scroll-up, which looks janky. */

class ScrollReveal {
  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            this.observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "-50px 0px",
      }
    );

    document.querySelectorAll("[data-reveal]").forEach((el) => {
      this.observer.observe(el);
    });
  }
}

// Initialize after DOM ready
new ScrollReveal();
```

```css
/* BLUEPRINT: Scroll reveal CSS states
   WHY: The element starts in its hidden state via CSS.
   When JS adds .is-visible, the CSS transition takes over.
   This means elements are hidden by default (no flash of
   unstyled content), and the transition uses the easing
   palette for consistency. */

[data-reveal] {
  opacity: 0;
  transform: translateY(40px);
  transition:
    opacity 0.8s var(--ease-out),
    transform 0.8s var(--ease-out),
    filter 0.8s var(--ease-out);
  will-change: transform, opacity;
}

[data-reveal].is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Variant: reveal with blur */
[data-reveal="blur"] {
  filter: blur(8px);
}
[data-reveal="blur"].is-visible {
  filter: blur(0);
}

/* Variant: reveal with scale */
[data-reveal="scale"] {
  transform: scale(0.92);
}
[data-reveal="scale"].is-visible {
  transform: scale(1);
}

/* Stagger children within a revealed container */
[data-reveal-stagger] > * {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.7s var(--ease-out),
    transform 0.7s var(--ease-out);
}
[data-reveal-stagger].is-visible > *:nth-child(1) { transition-delay: 0ms; opacity: 1; transform: translateY(0); }
[data-reveal-stagger].is-visible > *:nth-child(2) { transition-delay: 80ms; opacity: 1; transform: translateY(0); }
[data-reveal-stagger].is-visible > *:nth-child(3) { transition-delay: 160ms; opacity: 1; transform: translateY(0); }
[data-reveal-stagger].is-visible > *:nth-child(4) { transition-delay: 240ms; opacity: 1; transform: translateY(0); }
[data-reveal-stagger].is-visible > *:nth-child(5) { transition-delay: 320ms; opacity: 1; transform: translateY(0); }
[data-reveal-stagger].is-visible > *:nth-child(6) { transition-delay: 400ms; opacity: 1; transform: translateY(0); }

@media (prefers-reduced-motion: reduce) {
  [data-reveal] {
    transform: none !important;
    filter: none !important;
    transition: opacity 0.3s ease;
  }
  [data-reveal-stagger] > * {
    transform: none !important;
    transition: opacity 0.3s ease;
    transition-delay: 0ms !important;
  }
}
```

```html
<!-- Usage in HTML -->
<section data-reveal>
  <h2>Section heading</h2>
</section>

<div data-reveal="blur">
  <p>Blurs into focus</p>
</div>

<div data-reveal-stagger>
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
</div>
```

### Scroll-linked progress animations (GSAP ScrollTrigger)

```javascript
/* BLUEPRINT: Scroll-pinned reveal sequence
   WHY: "pin: true" locks the section in place while the user
   scrolls through the animation. scrub: 1 ties the animation
   progress 1:1 to scroll position with a 1-second smoothing.
   This creates the Apple-style "the page tells a story as you
   scroll" effect. Without pinning, the animation plays once
   and the user scrolls past it. */

// Sticky section with scroll-driven content changes
gsap.timeline({
  scrollTrigger: {
    trigger: ".feature-section",
    start: "top top",
    end: "+=300%",   // 3x viewport height of scroll distance
    pin: true,
    scrub: 1,        // smooth 1:1 scroll linking
  },
})
.to(".feature-text-1", { opacity: 0, y: -30, duration: 0.3 })
.from(".feature-text-2", { opacity: 0, y: 30, duration: 0.3 })
.to(".feature-image-1", { scale: 0.9, opacity: 0, duration: 0.3 }, "<")
.from(".feature-image-2", { scale: 1.1, opacity: 0, duration: 0.3 })
.to(".feature-text-2", { opacity: 0, y: -30, duration: 0.3 })
.from(".feature-text-3", { opacity: 0, y: 30, duration: 0.3 });
```

### Horizontal scroll section

```javascript
/* BLUEPRINT: Horizontal scroll gallery
   WHY: This converts vertical scroll into horizontal movement.
   The "x" tween moves the container by its total overflow width.
   "end" is set to the scrollable width so 1px of vertical scroll
   equals 1px of horizontal movement. The pin keeps the section in
   view during the entire horizontal traverse. */

const horizontalSection = document.querySelector(".horizontal-gallery");
const scrollWidth = horizontalSection.scrollWidth - window.innerWidth;

gsap.to(".horizontal-gallery-inner", {
  x: -scrollWidth,
  ease: "none",
  scrollTrigger: {
    trigger: ".horizontal-gallery",
    start: "top top",
    end: () => `+=${scrollWidth}`,
    pin: true,
    scrub: 1,
    invalidateOnRefresh: true,
  },
});
```

Drift warning: scroll-jacking (overriding native scroll to control animation) is the most contested motion pattern. Use scroll-linked animations (scrub) rather than scroll-jacking (onScroll then preventDefault). Scroll-linked lets the user scroll naturally and ties animation progress to scroll position. Scroll-jacking hijacks scroll input entirely, and users hate it. Studios like Apple get away with it because their content is worth pausing for. Yours may not be.
