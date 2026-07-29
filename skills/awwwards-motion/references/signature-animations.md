# Signature micro-animations (part 1 of 2)

Covers Layer 10 signature effects 1 through 10: text scramble, border draw, ripple click, shimmer skeleton, infinite marquee, morphing blob, hover color wipe, elastic spring hover, tilt parallax cards, and scroll-speed typography. Effects 11 through 20 and the selection guide are in `references/signature-animations-2.md`. Load either file in the build phase when you have chosen 4 to 6 signature moments for the page.

Curves referenced here (`--ease-out`, `--ease-snap`, `--ease-spring`) are defined in `references/easing-and-timing.md`.

These are the non-generic animations that separate a studio site from a nice website with some fade-ins. Use them selectively: 3 to 5 per page maximum. Each one is a single moment of delight, placed on your most important element.

---

## 1. Text scramble / decode effect

```javascript
/* BLUEPRINT: Text scramble that decodes random characters into final text
   WHY: Creates a hacking/decrypting feel. Each character position
   cycles through random characters before landing on the correct one.
   Used by studios like Active Theory and Monopo. The stagger between
   character locks creates a wave of resolution from left to right.
   Best on: headings, stat labels, nav links on hover. */

class TextScramble {
  constructor(element) {
    this.element = element;
    this.chars = '!<>-_\\/[]{}=+*^?#_abcdefghijklmnop';
    this.frame = 0;
    this.queue = [];
    this.resolve = null;
  }

  setText(newText) {
    const oldText = this.element.textContent;
    const length = Math.max(oldText.length, newText.length);
    return new Promise((resolve) => {
      this.resolve = resolve;
      this.queue = [];
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        const start = Math.floor(Math.random() * 40);
        const end = start + Math.floor(Math.random() * 40);
        this.queue.push({ from, to, start, end });
      }
      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();
    });
  }

  update() {
    let output = '';
    let complete = 0;
    for (let i = 0; i < this.queue.length; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span class="scramble-char">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.element.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(() => this.update());
      this.frame++;
    }
  }
}

// Usage on hover:
// const scrambler = new TextScramble(element);
// element.addEventListener('mouseenter', () => scrambler.setText('New Text'));
// element.addEventListener('mouseleave', () => scrambler.setText('Original Text'));

// Usage on scroll reveal:
// When element becomes visible, scramble from '' to final text
```

```css
.scramble-char {
  color: var(--color-accent);
  opacity: 0.6;
}
```

---

## 2. Border draw animation

```css
/* BLUEPRINT: Border that draws itself around an element
   WHY: Instead of a border appearing, it DRAWS around the
   element like a pen tracing the edges. Uses four separate
   pseudo-elements (two on the element, two on a wrapper) each
   scaling from 0 to full width/height. The stagger creates a
   clockwise drawing sequence. Used on featured cards, hero CTAs,
   and section highlights.
   Best on: feature cards on scroll reveal, CTAs on hover. */

.border-draw {
  position: relative;
}

/* Top and Bottom borders */
.border-draw::before,
.border-draw::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 1px;
  background: var(--color-accent);
  transform: scaleX(0);
  transition: transform 0.6s var(--ease-out);
}

.border-draw::before {
  top: 0;
  left: 0;
  transform-origin: left;
}

.border-draw::after {
  bottom: 0;
  right: 0;
  transform-origin: right;
}

/* Left and Right borders via inner wrapper */
.border-draw-inner::before,
.border-draw-inner::after {
  content: '';
  position: absolute;
  width: 1px;
  height: 100%;
  background: var(--color-accent);
  transform: scaleY(0);
  transition: transform 0.6s var(--ease-out);
}

.border-draw-inner::before {
  top: 0;
  right: 0;
  transform-origin: top;
  transition-delay: 0.2s;
}

.border-draw-inner::after {
  bottom: 0;
  left: 0;
  transform-origin: bottom;
  transition-delay: 0.4s;
}

/* Trigger: on hover or scroll reveal */
.border-draw:hover::before,
.border-draw:hover::after,
.border-draw.is-visible::before,
.border-draw.is-visible::after {
  transform: scaleX(1);
}

.border-draw:hover .border-draw-inner::before,
.border-draw:hover .border-draw-inner::after,
.border-draw.is-visible .border-draw-inner::before,
.border-draw.is-visible .border-draw-inner::after {
  transform: scaleY(1);
}
```

---

## 3. Ripple click effect (Material-inspired, premium)

```javascript
/* BLUEPRINT: Click ripple that expands from the click point
   WHY: The ripple originates from the EXACT cursor position,
   not from the center. This creates a direct spatial connection
   between the user's action and the visual feedback. The ripple
   expands as a circle using scale(0) to scale(4) and fades out.
   Unlike Material Design's harsh ripple, this version uses a
   softer gradient edge and custom easing for a premium feel.
   Best on: all buttons, cards, nav items. */

function initRipple() {
  document.querySelectorAll('[data-ripple]').forEach((el) => {
    el.style.position = 'relative';
    el.style.overflow = 'hidden';

    el.addEventListener('click', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 2;

      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      ripple.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        margin-left: ${-size / 2}px;
        margin-top: ${-size / 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
        transform: scale(0);
        opacity: 1;
        pointer-events: none;
        animation: ripple-expand 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      `;

      el.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}
```

```css
@keyframes ripple-expand {
  0% {
    transform: scale(0);
    opacity: 0.5;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}
```

---

## 4. Shimmer / skeleton loading

```css
/* BLUEPRINT: Shimmer loading state that sweeps across elements
   WHY: While content loads, placeholder shapes with a sweeping
   shimmer convey progress better than a spinner. The gradient
   moves via translateX animation. The shimmer angle (-20deg)
   creates a natural light-sweep direction. This runs ONLY
   until real content replaces it, never as a permanent effect.
   Best on: cards, images, text blocks during async data fetch. */

.shimmer {
  background: var(--color-surface, #e0e0e0);
  background-image: linear-gradient(
    -20deg,
    transparent 25%,
    rgba(255, 255, 255, 0.5) 50%,
    transparent 75%
  );
  background-size: 200% 100%;
  animation: shimmer-sweep 1.5s ease-in-out infinite;
  border-radius: var(--radius-card, 8px);
}

@keyframes shimmer-sweep {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Dark mode variant */
.shimmer--dark {
  background: rgba(255, 255, 255, 0.05);
  background-image: linear-gradient(
    -20deg,
    transparent 25%,
    rgba(255, 255, 255, 0.08) 50%,
    transparent 75%
  );
  background-size: 200% 100%;
  animation: shimmer-sweep 1.5s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .shimmer, .shimmer--dark {
    animation: none;
  }
}
```

---

## 5. Infinite marquee / ticker

```css
/* BLUEPRINT: Infinite horizontal marquee
   WHY: A continuously scrolling strip of logos, testimonials,
   or text creates ambient motion that fills horizontal space.
   The trick: duplicate the content, place both copies side by
   side, and translate the container by -50% (one copy's width).
   When it reaches -50%, it snaps back to 0, but since the
   second copy is now where the first was, the loop has no seam.
   Speed: 30s for logos, 20s for text, 40s for slow ambient.
   Best on: client logos, testimonial strips, tech stack badges. */

.marquee {
  overflow: hidden;
  white-space: nowrap;
  position: relative;
}

.marquee-inner {
  display: inline-flex;
  animation: marquee-scroll 30s linear infinite;
}

.marquee:hover .marquee-inner {
  animation-play-state: paused;
}

@keyframes marquee-scroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* Fade edges so the loop has no visible seam */
.marquee::before,
.marquee::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100px;
  z-index: 2;
  pointer-events: none;
}

.marquee::before {
  left: 0;
  background: linear-gradient(to right, var(--color-bg), transparent);
}

.marquee::after {
  right: 0;
  background: linear-gradient(to left, var(--color-bg), transparent);
}

@media (prefers-reduced-motion: reduce) {
  .marquee-inner {
    animation: none;
  }
}
```

```html
<!-- Usage: duplicate content so the loop has no seam -->
<div class="marquee">
  <div class="marquee-inner">
    <!-- First copy -->
    <span class="marquee-item">Logo 1</span>
    <span class="marquee-item">Logo 2</span>
    <span class="marquee-item">Logo 3</span>
    <!-- Exact duplicate for the continuous loop -->
    <span class="marquee-item">Logo 1</span>
    <span class="marquee-item">Logo 2</span>
    <span class="marquee-item">Logo 3</span>
  </div>
</div>
```

---

## 6. Morphing blob background

```css
/* BLUEPRINT: Organic morphing blob
   WHY: An amorphous shape that slowly changes form creates
   a living, organic background element. Uses border-radius
   animation with 8-value syntax (4 corners times 2 axes) to
   create asymmetric, organic shapes. The slow duration (8s)
   makes it ambient. Pair with blur(40px) for a soft glow.
   Best on: hero backgrounds, behind pricing cards, CTA sections. */

.morph-blob {
  width: 400px;
  height: 400px;
  background: linear-gradient(
    135deg,
    var(--blob-color-1, rgba(99, 102, 241, 0.3)),
    var(--blob-color-2, rgba(168, 85, 247, 0.3))
  );
  filter: blur(40px);
  animation: morph 8s ease-in-out infinite;
  position: absolute;
  pointer-events: none;
}

@keyframes morph {
  0%, 100% {
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    transform: rotate(0deg) scale(1);
  }
  25% {
    border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
    transform: rotate(45deg) scale(1.05);
  }
  50% {
    border-radius: 50% 60% 30% 60% / 30% 40% 70% 60%;
    transform: rotate(90deg) scale(1);
  }
  75% {
    border-radius: 40% 60% 50% 40% / 60% 50% 40% 70%;
    transform: rotate(135deg) scale(0.95);
  }
}

@media (prefers-reduced-motion: reduce) {
  .morph-blob {
    animation: none;
    border-radius: 50%;
  }
}
```

---

## 7. Hover color wipe (button/card background)

```css
/* BLUEPRINT: Background color wipe on hover
   WHY: Instead of a flat background-color transition, the new
   color WIPES across from one edge. Uses a pseudo-element
   that scales from 0 to full width. The wipe direction (left
   to right) creates intentional, directional motion that a
   simple color fade cannot achieve. The z-index layering
   ensures text stays above the wipe layer.
   Best on: CTAs, nav links, feature list items. */

.hover-wipe {
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.hover-wipe::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.5s var(--ease-snap);
  z-index: -1;
}

.hover-wipe:hover::before {
  transform: scaleX(1);
}

/* Text color shifts when wipe is active */
.hover-wipe {
  transition: color 0.3s var(--ease-snap);
}

.hover-wipe:hover {
  color: white;
}

/* Variant: wipe from bottom */
.hover-wipe--up::before {
  transform: scaleY(0);
  transform-origin: bottom;
}

.hover-wipe--up:hover::before {
  transform: scaleY(1);
}
```

---

## 8. Elastic spring hover (bouncy scale)

```css
/* BLUEPRINT: Elastic spring scale on hover
   WHY: The spring easing (cubic-bezier 0.34, 1.56, 0.64, 1)
   overshoots the target scale and bounces back, creating a
   physically playful feel. The overshoot is ~1.56x which gives
   a visible bounce without feeling broken. Use on small,
   playful elements. Never on large containers.
   Best on: social icons, emoji reactions, small badges, toggles. */

.spring-hover {
  transition: transform 0.5s var(--ease-spring);
  will-change: transform;
}

.spring-hover:hover {
  transform: scale(1.15);
}

.spring-hover:active {
  transform: scale(0.9);
  transition-duration: 0.1s;
}

/* Variant: spring rotate */
.spring-rotate:hover {
  transform: rotate(12deg) scale(1.1);
}
```

---

## 9. Tilt parallax cards (layered depth on hover)

```javascript
/* BLUEPRINT: Multi-layer parallax within a card on hover
   WHY: Different elements inside the card move at different
   speeds relative to cursor position, creating depth WITHIN
   the card itself. The background shifts slightly, the main
   content shifts more, and a floating element shifts the most.
   This creates a convincing diorama / parallax box effect.
   Best on: feature cards, testimonial cards, product display. */

function initParallaxCards() {
  document.querySelectorAll('[data-parallax-card]').forEach((card) => {
    const layers = card.querySelectorAll('[data-depth]');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

      layers.forEach((layer) => {
        const depth = parseFloat(layer.dataset.depth) || 1;
        const moveX = x * depth * 20;
        const moveY = y * depth * 20;
        layer.style.transform = `translate(${moveX}px, ${moveY}px)`;
        layer.style.transition = 'transform 0.2s ease-out';
      });
    });

    card.addEventListener('mouseleave', () => {
      layers.forEach((layer) => {
        layer.style.transform = 'translate(0, 0)';
        layer.style.transition = 'transform 0.6s var(--ease-out)';
      });
    });
  });
}
```

```html
<!-- Usage -->
<div data-parallax-card class="card">
  <div data-depth="0.5" class="card-bg"><!-- subtle shift --></div>
  <div data-depth="1" class="card-content">
    <h3>Feature Title</h3>
    <p>Description text</p>
  </div>
  <div data-depth="2" class="card-float-icon"><!-- dramatic shift --></div>
</div>
```

---

## 10. Scroll-speed typography (text velocity effect)

```javascript
/* BLUEPRINT: Text that shifts weight/style based on scroll speed
   WHY: The faster the user scrolls, the more the text stretches
   or shifts weight. This creates a direct physical metaphor:
   speed = force = visual distortion. When scrolling stops, the
   text eases back to its resting state. Used by experimental
   typography sites and studios like Locomotive.
   Best on: large display headings in editorial/portfolio sites. */

function initScrollTypography() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const elements = document.querySelectorAll('[data-scroll-type]');
  let lastScroll = 0;
  let velocity = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const currentScroll = window.scrollY;
        velocity = Math.abs(currentScroll - lastScroll);
        lastScroll = currentScroll;

        // Clamp velocity to usable range
        const clampedVelocity = Math.min(velocity, 50);
        const skewAmount = clampedVelocity * 0.15; // max ~7.5deg
        const scaleY = 1 + clampedVelocity * 0.002; // max ~1.1

        elements.forEach((el) => {
          el.style.transform = `skewY(${currentScroll > lastScroll ? -skewAmount : skewAmount}deg) scaleY(${scaleY})`;
          el.style.transition = 'transform 0.1s ease-out';
        });

        // Reset when scroll stops
        clearTimeout(window._scrollTypeTimer);
        window._scrollTypeTimer = setTimeout(() => {
          elements.forEach((el) => {
            el.style.transform = 'skewY(0deg) scaleY(1)';
            el.style.transition = 'transform 0.6s var(--ease-out)';
          });
        }, 150);

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}
```

Continue to `references/signature-animations-2.md` for effects 11 through 20 and the selection guide.
