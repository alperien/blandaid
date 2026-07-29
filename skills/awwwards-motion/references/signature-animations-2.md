# Signature micro-animations (part 2 of 2)

Covers Layer 10 signature effects 11 through 20 (staggered grid rain, focus glow ring, tooltip float-up, image hover distortion, rotating text badge, fan reveal, gradient border, text-to-image hover reveal, cursor trail, clip-path section reveal) and the micro-animation selection guide. Effects 1 through 10 are in `references/signature-animations.md`. Load this in the build phase when choosing signature moments.

Curves referenced here (`--ease-out`, `--ease-snap`, `--ease-dramatic`) are defined in `references/easing-and-timing.md`.

---

## 11. Staggered grid rain (cards cascading in)

```css
/* BLUEPRINT: Cards that cascade in like falling rain
   WHY: Instead of all cards fading up together, each card
   drops in from above with a stagger that creates a rainfall
   pattern. The slight rotation on entry (+2deg to 0deg) adds
   a physical settling feel, as if each card lands and rights
   itself. Combined with scale(0.9 to 1) for mass impression.
   Best on: portfolio grids, product grids, team member cards. */

@keyframes rain-drop {
  from {
    opacity: 0;
    transform: translateY(-60px) rotate(2deg) scale(0.9);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotate(0deg) scale(1);
    filter: blur(0);
  }
}

.grid-rain > * {
  animation: rain-drop 0.7s var(--ease-out) both;
}

/* Cascade stagger: top-left to bottom-right */
.grid-rain > *:nth-child(1)  { animation-delay: 0ms; }
.grid-rain > *:nth-child(2)  { animation-delay: 60ms; }
.grid-rain > *:nth-child(3)  { animation-delay: 120ms; }
.grid-rain > *:nth-child(4)  { animation-delay: 100ms; }
.grid-rain > *:nth-child(5)  { animation-delay: 160ms; }
.grid-rain > *:nth-child(6)  { animation-delay: 220ms; }
.grid-rain > *:nth-child(7)  { animation-delay: 200ms; }
.grid-rain > *:nth-child(8)  { animation-delay: 260ms; }
.grid-rain > *:nth-child(9)  { animation-delay: 320ms; }

@media (prefers-reduced-motion: reduce) {
  .grid-rain > * {
    animation: enter-fade 0.3s ease both;
    animation-delay: 0ms !important;
  }
}
```

---

## 12. Focus glow ring (input/button focus)

```css
/* BLUEPRINT: Animated glow ring on focus
   WHY: A pulsing, softly glowing ring on :focus-visible
   draws attention to the active input without the harshness
   of a solid outline. The box-shadow expands and contracts
   via animation, creating a breathing focus indicator.
   Uses :focus-visible (not :focus) so it only triggers
   on keyboard navigation, not mouse clicks.
   Best on: form inputs, search bars, interactive elements. */

.glow-focus:focus-visible {
  outline: none;
  animation: focus-glow 1.5s ease-in-out infinite;
}

@keyframes focus-glow {
  0%, 100% {
    box-shadow:
      0 0 0 2px var(--color-accent),
      0 0 0 4px rgba(var(--color-accent-rgb, 99, 102, 241), 0.2);
  }
  50% {
    box-shadow:
      0 0 0 3px var(--color-accent),
      0 0 0 8px rgba(var(--color-accent-rgb, 99, 102, 241), 0.1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .glow-focus:focus-visible {
    animation: none;
    box-shadow:
      0 0 0 2px var(--color-accent),
      0 0 0 4px rgba(var(--color-accent-rgb, 99, 102, 241), 0.3);
  }
}
```

---

## 13. Tooltip float-up

```css
/* BLUEPRINT: Tooltip that floats up from the trigger element
   WHY: Tooltips that appear instantly feel mechanical. This
   tooltip translates from 8px below and fades in, creating
   a gentle rising motion. The 100ms delay prevents accidental
   triggers when the cursor is just passing over the element.
   The tail (::after arrow) is included for spatial anchoring.
   Best on: icon buttons, truncated text, info indicators. */

.tooltip-trigger {
  position: relative;
}

.tooltip-trigger .tooltip {
  position: absolute;
  bottom: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%) translateY(8px);
  padding: 6px 12px;
  background: var(--color-text);
  color: var(--color-bg);
  font-size: 0.75rem;
  border-radius: 6px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition:
    opacity 0.25s var(--ease-out),
    transform 0.25s var(--ease-out);
  transition-delay: 0ms;
}

.tooltip-trigger:hover .tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
  transition-delay: 100ms;
}

/* Arrow */
.tooltip-trigger .tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: var(--color-text);
}
```

---

## 14. Image hover distortion (CSS scale shift)

```css
/* BLUEPRINT: Image that distorts slightly on hover
   WHY: A subtle scale plus skew on hover creates a warped-lens
   effect that feels photographic and editorial. The asymmetric
   scale (scaleX slightly different from scaleY) creates an
   anamorphic distortion. The mix-blend-mode shift changes
   the image's color relationship to its container.
   Best on: portfolio images, blog thumbnails, gallery grids. */

.image-distort {
  overflow: hidden;
  border-radius: var(--radius-card, 8px);
}

.image-distort img {
  transition:
    transform 0.8s var(--ease-out),
    filter 0.8s var(--ease-out);
  will-change: transform;
}

.image-distort:hover img {
  transform: scale(1.08) skew(-1deg, 0.5deg);
  filter: contrast(1.1) saturate(1.15);
}

/* Variant: desaturate-to-color on hover */
.image-distort--desat img {
  filter: grayscale(100%);
  transition: filter 0.6s var(--ease-out), transform 0.8s var(--ease-out);
}

.image-distort--desat:hover img {
  filter: grayscale(0%);
  transform: scale(1.03);
}
```

---

## 15. Rotating text badge

```css
/* BLUEPRINT: Circular text that rotates continuously
   WHY: A slow-spinning circular badge with text on a path
   creates an ambient decorative element. The 12s duration
   is slow enough to be meditative, not distracting. Use SVG
   textPath for the curved text. Position absolutely in a
   corner or near a CTA.
   Best on: hero corners, next to CTAs, portfolio project cards. */

.rotating-badge {
  width: 120px;
  height: 120px;
  animation: spin-slow 12s linear infinite;
}

.rotating-badge svg text {
  font-family: var(--font-mono, monospace);
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  fill: var(--color-text-2);
}

@keyframes spin-slow {
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .rotating-badge {
    animation: none;
  }
}
```

```html
<!-- Usage -->
<div class="rotating-badge">
  <svg viewBox="0 0 120 120">
    <defs>
      <path id="circle-path" d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0" />
    </defs>
    <text>
      <textPath href="#circle-path">SCROLL TO EXPLORE . SCROLL TO EXPLORE . </textPath>
    </text>
  </svg>
</div>
```

---

## 16. Stagger reveal with rotation (fanning cards)

```css
/* BLUEPRINT: Cards that fan in from a central point
   WHY: Instead of a simple stagger fade-up, each card starts
   rotated and off-position, then fans into its final place.
   This creates a playing-card-spread effect. The rotation
   starts at plus or minus 8deg (alternating) and settles to 0.
   Combined with translateX to create lateral spread.
   Best on: testimonial cards, team grids, pricing cards. */

@keyframes fan-in-left {
  from {
    opacity: 0;
    transform: translateX(-30px) rotate(-8deg) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateX(0) rotate(0) scale(1);
  }
}

@keyframes fan-in-right {
  from {
    opacity: 0;
    transform: translateX(30px) rotate(8deg) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateX(0) rotate(0) scale(1);
  }
}

.fan-reveal > *:nth-child(odd) {
  animation: fan-in-left 0.7s var(--ease-out) both;
}

.fan-reveal > *:nth-child(even) {
  animation: fan-in-right 0.7s var(--ease-out) both;
}

.fan-reveal > *:nth-child(1) { animation-delay: 0ms; }
.fan-reveal > *:nth-child(2) { animation-delay: 80ms; }
.fan-reveal > *:nth-child(3) { animation-delay: 160ms; }
.fan-reveal > *:nth-child(4) { animation-delay: 240ms; }

@media (prefers-reduced-motion: reduce) {
  .fan-reveal > * {
    animation: enter-fade 0.3s ease both !important;
    animation-delay: 0ms !important;
  }
}
```

---

## 17. Gradient border animation

```css
/* BLUEPRINT: Animated gradient border that rotates around an element
   WHY: A border that shifts colors creates a living, iridescent
   edge. Uses a conic-gradient on a pseudo-element slightly larger
   than the element, with the element's own background masking the
   center. The @property rule enables smooth angle animation.
   Best on: featured cards, pricing cards, CTA buttons, hero elements. */

@property --gradient-angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

.gradient-border {
  position: relative;
  border-radius: var(--radius-card, 12px);
  padding: 2px; /* border width */
  background: conic-gradient(
    from var(--gradient-angle),
    var(--grad-1, #6366f1),
    var(--grad-2, #a855f7),
    var(--grad-3, #ec4899),
    var(--grad-4, #6366f1)
  );
  animation: gradient-rotate 3s linear infinite;
}

.gradient-border > * {
  background: var(--color-bg);
  border-radius: calc(var(--radius-card, 12px) - 2px);
}

@keyframes gradient-rotate {
  to { --gradient-angle: 360deg; }
}

@media (prefers-reduced-motion: reduce) {
  .gradient-border {
    animation: none;
    background: var(--color-border);
  }
}
```

---

## 18. Hover image reveal (text to image transition)

```css
/* BLUEPRINT: Text item that reveals an image on hover
   WHY: A list of text items where hovering reveals a floating
   image next to the cursor creates an editorial, gallery-like
   experience. The image scales from 0 and fades in, positioned
   relative to the hovered list item. Used heavily on portfolio
   sites (Locomotive, Aristide Benoist, Dennis Snellenberg).
   Best on: project lists, blog post lists, portfolio items. */

.reveal-list-item {
  position: relative;
  cursor: pointer;
}

.reveal-list-item .reveal-image {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%) scale(0.8);
  width: 300px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  opacity: 0;
  pointer-events: none;
  transition:
    opacity 0.4s var(--ease-snap),
    transform 0.4s var(--ease-snap);
  z-index: 10;
}

.reveal-list-item:hover .reveal-image {
  opacity: 1;
  transform: translateY(-50%) scale(1);
}

/* Stagger effect: shift image position per item */
.reveal-list-item:nth-child(even) .reveal-image {
  right: auto;
  left: 20%;
}
```

---

## 19. Cursor trail / custom cursor

```javascript
/* BLUEPRINT: Custom cursor with trailing dot
   WHY: A custom cursor with a smaller leading dot and a larger
   trailing circle creates a fluid, living cursor feel. The
   trailing circle uses lerp (linear interpolation) to smoothly
   follow the cursor with delay, creating an elastic tether.
   The cursor changes shape/color on interactive elements.
   Best on: portfolio sites, agency sites, creative studios. */

function initCustomCursor() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if ('ontouchstart' in window) return; // No custom cursor on touch

  const dot = document.createElement('div');
  const circle = document.createElement('div');
  dot.className = 'cursor-dot';
  circle.className = 'cursor-circle';
  document.body.append(dot, circle);

  let mouseX = 0, mouseY = 0;
  let circleX = 0, circleY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
  });

  // Lerp the trailing circle
  function animate() {
    circleX += (mouseX - circleX) * 0.15;
    circleY += (mouseY - circleY) * 0.15;
    circle.style.transform = `translate(${circleX - 20}px, ${circleY - 20}px)`;
    requestAnimationFrame(animate);
  }
  animate();

  // Expand on interactive elements
  document.querySelectorAll('a, button, [role="button"]').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      circle.classList.add('cursor-active');
    });
    el.addEventListener('mouseleave', () => {
      circle.classList.remove('cursor-active');
    });
  });
}
```

```css
/* Hide default cursor on the page */
.has-custom-cursor {
  cursor: none;
}
.has-custom-cursor a,
.has-custom-cursor button {
  cursor: none;
}

.cursor-dot {
  position: fixed;
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  background: var(--color-accent);
  border-radius: 50%;
  pointer-events: none;
  z-index: 99999;
  mix-blend-mode: difference;
}

.cursor-circle {
  position: fixed;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  border: 1.5px solid var(--color-accent);
  border-radius: 50%;
  pointer-events: none;
  z-index: 99998;
  transition: width 0.3s var(--ease-snap), height 0.3s var(--ease-snap), border-color 0.3s ease;
  mix-blend-mode: difference;
}

.cursor-circle.cursor-active {
  width: 60px;
  height: 60px;
  border-color: var(--color-accent);
  background: rgba(var(--color-accent-rgb, 99,102,241), 0.08);
}
```

---

## 20. Scroll-triggered clip-path section reveal

```css
/* BLUEPRINT: Section that reveals via expanding clip-path
   WHY: Instead of a simple fade-in, the entire section reveals
   through an expanding circle (or polygon) clip-path. This
   creates a cinematic iris transition between sections.
   Uses intersection observer to trigger. The circle starts
   at 0% radius and expands to cover the full section.
   Best on: hero-to-content transitions, portfolio section entries. */

.clip-reveal {
  clip-path: circle(0% at 50% 50%);
  transition: clip-path 1.2s var(--ease-dramatic);
}

.clip-reveal.is-visible {
  clip-path: circle(150% at 50% 50%);
}

/* Variant: reveal from bottom-left corner */
.clip-reveal--corner {
  clip-path: circle(0% at 0% 100%);
}

.clip-reveal--corner.is-visible {
  clip-path: circle(200% at 0% 100%);
}

/* Variant: polygon wipe from left */
.clip-reveal--wipe {
  clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
  transition: clip-path 0.9s var(--ease-out);
}

.clip-reveal--wipe.is-visible {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}

@media (prefers-reduced-motion: reduce) {
  .clip-reveal,
  .clip-reveal--corner,
  .clip-reveal--wipe {
    clip-path: none !important;
    transition: opacity 0.3s ease;
    opacity: 0;
  }
  .clip-reveal.is-visible,
  .clip-reveal--corner.is-visible,
  .clip-reveal--wipe.is-visible {
    opacity: 1;
  }
}
```

---

## Micro-animation selection guide

Do not use all 20 effects on one page. Select 4 to 6 that match the project's personality.

| Project type | Recommended signature effects |
|---|---|
| Tech/SaaS landing | Text scramble on hero, gradient border on pricing, shimmer loading, hover wipe buttons |
| Creative agency | Custom cursor trail, image hover reveal on project list, clip-path section reveals, morphing blob background |
| Portfolio | Tilt parallax cards, fan reveal on grid, image distortion hover, text scramble on project titles |
| Editorial/blog | Scroll-speed typography, marquee ticker, word-by-word masked reveals, border draw on features |
| E-commerce | Ripple click on CTAs, shimmer loading for products, elastic spring on cart icons, gradient border on featured products |
| Luxury/brand | Rotating text badge, cursor glow, clip-path reveals, border draw animation, morphing blob |

Drift warning: signature micro-animations are spice, not the main dish. 4 to 6 per page maximum. If every element has a unique animation, none of them feel special. Put the signature effects on your most important elements: the hero heading, the primary CTA, the featured card, the section transition. Everything else uses the standard fade-up-deblur reveal.
