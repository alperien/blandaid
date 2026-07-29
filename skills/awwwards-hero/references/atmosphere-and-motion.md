# Atmosphere and motion

Covers background depth (glow, grain, warm radial), the hero entry animation and CTA physics, optional motion pieces (parallax, rotating badge), mobile collapse rules per architecture, and the performance constraints that keep it all at frame rate. Load this in Phase 3 after type and palette are set.

The easing vocabulary these recipes draw from lives in `skills/blandaid-core/SKILL.md` under "Shared easing vocabulary." The cubic-beziers below are the hero-specific applications.

---

## Atmosphere

A flat `bg-black` or flat `bg-white` reads as unfinished. Heroes need depth from the background itself.

### Dark mode: radial ambient glow

```css
/* BLUEPRINT: Ambient glow
   WHY: A barely-visible radial gradient centered slightly
   above the midpoint creates the illusion of a light source,
   adding depth without any visible element. At 0.03 opacity
   it is felt, not seen. */
.hero-dark::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 60% 50% at 50% 40%, rgba(255,255,255,0.03) 0%, transparent 70%);
  pointer-events: none;
}
```

### Noise grain overlay

```css
/* BLUEPRINT: Film grain
   WHY: Breaks the digital flatness of solid CSS backgrounds.
   position:fixed prevents the grain from scrolling with content.
   pointer-events:none makes it non-interactive.
   0.04 opacity is the threshold where grain is felt but
   does not interfere with text readability. */
.hero-dark::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 50;
}
```

### Light mode: subtle warm radial

```css
.hero-light {
  background: radial-gradient(ellipse at 30% 20%, rgba(250,235,215,0.4) 0%, transparent 50%), #FAFAF9;
}
```

---

## Motion

Every hero needs an entry animation. A static mount reads as broken.

### Staggered hero entry

```tsx
/* BLUEPRINT: Staggered hero entry (Motion / motion-react)
   WHY: The stagger (0.12s between children) creates a
   cascade effect. blur(8px) to blur(0) adds perceived quality
   beyond a simple fade-in. The custom cubic-bezier gives a
   snappy deceleration that feels physical, not computed. */
const heroVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1]  // custom ease-out
    }
  }
};

// Apply: <motion.div variants={heroVariants} initial="hidden" animate="visible">
//          <motion.h1 variants={itemVariants}>...</motion.h1>
//          <motion.p variants={itemVariants}>...</motion.p>
//          <motion.div variants={itemVariants}>CTA</motion.div>
//        </motion.div>
```

Sequence: background fades in first (0ms), heading slides up and deblurs (100ms), subtext slides up (220ms), CTA slides up (340ms). Total reveal under 800ms.

### CTA hover physics

```css
/* BLUEPRINT: CTA hover
   WHY: translateY(-2px) creates a subtle lift. The custom
   cubic-bezier makes the return-to-rest feel weighted, not
   springy. scale(0.98) on active gives tactile press feedback. */
.hero-cta {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.hero-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}
.hero-cta:active {
  transform: translateY(0) scale(0.98);
}
```

### Parallax structure (if the reference implies it)

```html
<!-- BLUEPRINT: Parallax-ready DOM
     WHY: Separate layers let you apply different scroll
     speeds via JS transform. will-change hints the GPU
     to prepare for animation. The actual parallax offset
     uses useScroll + useTransform from Motion, NOT
     window.addEventListener('scroll'). -->
<section class="hero relative min-h-[100dvh] overflow-hidden">
  <div class="hero-bg absolute inset-0 will-change-transform">
    <img ... class="w-full h-full object-cover" />
  </div>
  <div class="hero-content relative z-10">
    ...
  </div>
</section>
```

### Rotating text badge (if the reference shows it)

```css
/* BLUEPRINT: Rotating badge
   WHY: 12s is slow enough to be ambient, not distracting.
   Use SVG textPath along a circle for curved text.
   Place in a bottom corner (absolute bottom-8 left-8),
   not floating randomly. */
.rotating-badge {
  width: 100px;
  height: 100px;
  animation: spin 12s linear infinite;
}
@media (prefers-reduced-motion: reduce) {
  .rotating-badge { animation: none; }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

## Mobile collapse

Every architecture must degrade cleanly below `768px`.

| Element | Mobile behavior |
|---|---|
| Heading | Scale down via `clamp()`. Never smaller than `2rem` on mobile |
| Layout | All multi-column splits collapse to `flex-col` or `grid-cols-1` |
| Inline images (Architecture E) | Either scale proportionally with text or hide (`hidden md:inline-block`) |
| 3D perspective cards (Architecture F) | Remove all `rotateY` and `rotateX` transforms below `md`. Stack vertically or show only the focal card |
| Full-bleed images (Architecture C) | Increase scrim gradient opacity for text readability |
| Touch targets | All CTAs minimum `44px` tap target height |
| Horizontal overflow | Wrap hero in `overflow-x-hidden` to prevent 3D-transformed elements from creating scrollbars |

---

## Performance

| Rule | Why |
|---|---|
| Animate only `transform` and `opacity` | These are GPU-composited. Animating `top`, `left`, `width`, `height` triggers layout recalculation on every frame |
| `will-change: transform` only on actively animating elements | Overusing `will-change` wastes GPU memory. Remove it after the animation completes |
| `backdrop-filter: blur()` only on fixed or sticky elements | Applying blur to scrolling hero backgrounds tanks frame rate |
| Hero image uses `loading="eager"` (or `priority` in Next.js) | The hero image is above the fold. Lazy loading causes LCP failure |
| Noise and grain on a `position: fixed` pseudo-element | Never on a scrolling container. It repaints on every frame |
| Gate all animations behind `prefers-reduced-motion` | Use Motion's `useReducedMotion()` or CSS `@media (prefers-reduced-motion: reduce)` |
