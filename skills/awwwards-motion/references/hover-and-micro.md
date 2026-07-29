# Hover and interactive micro-animations

Covers Layer 3: button hover physics, card lift, 3D cursor-tracking tilt, Apple-style pressure buttons (JS and CSS), sliding link underlines, and image hover reveals. Load this in the build phase when adding hover, focus, and active feedback to interactive elements.

Curves referenced here (`--ease-snap`, `--ease-out`, `--ease-dramatic`, `--spring-snappy`, `--spring-bouncy`) are defined in `references/easing-and-timing.md`.

This is the layer that separates "works" from "feels premium." Every interactive element needs physical-feeling feedback.

---

## Button hover physics

```css
/* BLUEPRINT: Premium button hover
   WHY: translateY(-2px) creates a subtle lift that mimics
   physical buttons rising when your finger approaches.
   The shadow expansion reinforces the lift illusion.
   scale(0.98) on :active gives tactile press feedback.
   The cubic-bezier gives a snappy response with a gentle
   settle. It feels weighted, not springy. */

.btn {
  transition:
    transform 0.5s var(--ease-snap),
    box-shadow 0.5s var(--ease-snap),
    background-color 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.08),
    0 16px 40px rgba(0, 0, 0, 0.06);
}

.btn:active {
  transform: translateY(0px) scale(0.98);
  box-shadow:
    0 1px 4px rgba(0, 0, 0, 0.08);
  transition-duration: 0.1s;
}
```

---

## Card hover lift

```css
/* BLUEPRINT: Card hover with lift and glow
   WHY: The card lifts (translateY) AND its shadow expands,
   creating a convincing depth change. The border-color
   shift adds a subtle glow. will-change prevents the
   browser from recalculating layout on every hover. */

.card {
  transition:
    transform 0.4s var(--ease-snap),
    box-shadow 0.4s var(--ease-snap),
    border-color 0.4s var(--ease-snap);
  will-change: transform;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.06),
    0 24px 60px rgba(0, 0, 0, 0.04);
  border-color: var(--color-accent, rgba(0, 0, 0, 0.08));
}
```

---

## 3D card tilt (cursor-tracking)

```javascript
/* BLUEPRINT: 3D tilt card that follows cursor position
   WHY: The card tilts toward the cursor, creating a tangible
   depth feel. The rotation is clamped to plus or minus 8deg to
   prevent extreme angles. The glare overlay simulates light
   reflection. getBoundingClientRect() is called on mousemove.
   This is acceptable because it only fires on hovered cards
   (1-2 elements), not on scroll (hundreds of elements). */

function initTiltCards() {
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    const maxTilt = 8; // degrees

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;   // 0 to 1
      const y = (e.clientY - rect.top) / rect.height;    // 0 to 1

      const rotateX = (0.5 - y) * maxTilt;  // tilt up/down
      const rotateY = (x - 0.5) * maxTilt;  // tilt left/right

      card.style.transform = `
        perspective(800px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale3d(1.02, 1.02, 1.02)
      `;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform =
        "perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)";
      card.style.transition = "transform 0.6s var(--ease-out)";
    });

    card.addEventListener("mouseenter", () => {
      card.style.transition = "transform 0.1s ease-out";
    });
  });
}
```

---

## Apple-style pressure button (tactile depth)

```javascript
/* BLUEPRINT: Button that compresses with spring physics on hover
   WHY: Apple's buttons do not float toward your cursor. They
   COMPRESS under your touch, like pressing a physical key.
   The button scales down slightly (0.97), gains an inner shadow
   that simulates depth (as if pressing into the surface), and
   the text subtly brightens. On mouse-leave, a spring easing
   brings it back with a settle. This feels physical, like
   touching a real button, not like a gimmick.

   The magnetic button effect (cursor pull) is overused on
   Awwwards sites and reads as a parlor trick. Apple never uses
   it. Linear never uses it. Stripe never uses it. Pressure
   depth is what premium products use.

   Best on: primary CTAs, nav buttons, pricing buttons,
   all interactive buttons. */

function initPressureButtons() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('[data-pressure]').forEach((btn) => {
    const depth = parseFloat(btn.dataset.pressure) || 0.97;

    btn.addEventListener('mouseenter', () => {
      btn.style.transform = `scale(${depth})`;
      btn.style.boxShadow = 'inset 0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.1)';
      btn.style.transition = `transform 0.5s var(--spring-snappy), box-shadow 0.3s var(--ease-snap)`;
      btn.style.filter = 'brightness(1.05)';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'scale(1)';
      btn.style.boxShadow = '';
      btn.style.transition = `transform 0.55s var(--spring-snappy), box-shadow 0.4s var(--ease-out)`;
      btn.style.filter = 'brightness(1)';
    });

    btn.addEventListener('mousedown', () => {
      btn.style.transform = `scale(${depth - 0.03})`; // deeper press
      btn.style.boxShadow = 'inset 0 3px 12px rgba(0,0,0,0.25), 0 0 0 rgba(0,0,0,0)';
      btn.style.transition = 'transform 0.08s ease, box-shadow 0.08s ease';
    });

    btn.addEventListener('mouseup', () => {
      btn.style.transform = `scale(${depth})`;
      btn.style.boxShadow = 'inset 0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.1)';
      btn.style.transition = `transform 0.5s var(--spring-bouncy), box-shadow 0.3s var(--ease-snap)`;
    });
  });
}
```

CSS-only version (no JS needed):

```css
/* BLUEPRINT: CSS-only pressure button
   WHY: For cases where JS is not desired, this CSS-only version
   uses :hover and :active pseudo-classes to achieve the same
   compress-and-spring-back feel. The spring comes from the
   --spring-snappy linear() curve on the transition. */

.btn-pressure {
  transition:
    transform 0.55s var(--spring-snappy),
    box-shadow 0.3s var(--ease-snap),
    filter 0.3s var(--ease-snap);
  will-change: transform;
}

.btn-pressure:hover {
  transform: scale(0.97);
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08);
  filter: brightness(1.05);
}

.btn-pressure:active {
  transform: scale(0.94);
  box-shadow: inset 0 3px 12px rgba(0,0,0,0.2);
  transition-duration: 0.08s;
  transition-timing-function: ease;
}
```

---

## Animated link underlines

```css
/* BLUEPRINT: Sliding underline on hover
   WHY: The underline starts from the left (scaleX(0) with
   transform-origin: left) and grows to full width on hover.
   This creates directional motion that guides the eye.
   Using scaleX instead of width means the animation is
   GPU-composited (transform) rather than layout-triggering. */

.link-underline {
  position: relative;
  text-decoration: none;
}

.link-underline::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 1.5px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.4s var(--ease-snap);
}

.link-underline:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}
```

---

## Image reveal on hover (portfolio/gallery)

```css
/* BLUEPRINT: Image reveal with clip-path
   WHY: clip-path creates a cinematic wipe reveal that feels
   more intentional than opacity. The inset() function clips
   from all edges, going from inset(0) (full image) to
   inset(50%) (invisible) and back. The scale adds a Ken Burns
   subtle zoom. */

.image-reveal {
  overflow: hidden;
}

.image-reveal img {
  transition:
    transform 1.2s var(--ease-out),
    clip-path 0.8s var(--ease-out);
  clip-path: inset(0);
}

.image-reveal:hover img {
  transform: scale(1.05);
}

/* Variant: reveal from left */
.image-reveal--wipe img {
  clip-path: inset(0 100% 0 0);  /* hidden: clipped from right */
  transition: clip-path 0.9s var(--ease-dramatic);
}
.image-reveal--wipe.is-visible img {
  clip-path: inset(0 0 0 0);  /* visible: no clipping */
}
```
