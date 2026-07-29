---
name: awwwards-motion
description: |
  Motion design pipeline for web interfaces: entry animations, scroll-triggered
  reveals, hover and pressure micro-interactions, kinetic typography, page
  transitions, ambient motion, and signature effects. Fires when the user asks
  to animate a page or make an interface feel physical and premium. Enforces
  intentional easing (spring linear() over CSS keywords), staggered choreography,
  60fps transform/opacity-only motion, and reduced-motion fallbacks. Does not
  cover static layout, color, copy, or information architecture, and yields to
  existing design-system transition tokens and to interfaces that are quiet on
  purpose. Detail lives in references/; this file routes to it.
license: MIT
metadata:
  version: "2.0.0"
---

# Awwwards motion

Shared vocabulary lives in `skills/blandaid-core/SKILL.md` (the quality bar, the named easing curves, spatial vocabulary, palette discipline, universal restraint, and the mode definitions). This skill specializes that doctrine for motion and does not restate it.

## When this fires

- The user asks for animations, transitions, micro-interactions, scroll effects, page transitions, kinetic typography, parallax, hover physics, or loading sequences.
- The user says a page feels static, flat, cheap, or lifeless and wants it to feel physical.
- Another skill (hero, redesign) delegates the motion pass for a page it is building.

## When this does not fire

- The user set `prefers-reduced-motion` or asked to minimize or remove motion. Honor it. Do not add motion back.
- The work is static layout, color, typography, copy, or information architecture with no motion request.
- The surface is a data dashboard, admin panel, or internal tool where animation delays reading and comprehension.
- A checkout, form, or transactional flow where added motion increases perceived latency.
- The project names a design system (Material, Carbon, a house system) with defined transition tokens. Use those tokens, do not overwrite them.
- Documentation, government, or compliance interfaces where stillness is the correct default.

## Modes

Default mode is `direct`. Semantics match core; the motion-specific reading follows.

`direct`. The user asked for motion as the task. Run all four phases. Show the motion audit, the timing sheet, the quality gates, and the Motion Diff table. The process is part of the deliverable.

`embedded`. Another skill or a larger job is using motion as one step. Run the same four phases internally. Output only the code. No audit sheets, no gate tables, no commentary.

`audit`. Point the skill at existing output and report only. Do not modify anything. Return the Motion Diff table with PASS and FAIL rows and the highest-severity failures.

## The pipeline

```
BRIEF IN
  -> Phase 1: Motion audit      (classify context, tag layers, write brief)
  -> Phase 2: Choreography      (easing palette, timing sheet, stagger map)
  -> Phase 3: Build             (entry -> scroll -> hover -> text ->
                                 transitions -> ambient -> state -> signature)
  -> Phase 4: Motion diff       (coverage, feel, easing, perf, a11y gates)

Each phase has a quality gate. Failing a gate blocks the next.
```

## Core doctrine (condensed)

Every animation needs a functional reason: guide attention, communicate a state change, give feedback, or establish a spatial relationship. If you cannot name the reason, remove the animation.

The best motion is not noticed as motion. If the user thinks "nice animation" instead of "this feels good," it is too much. The animation serves the interaction, not the reverse.

Easing carries the character. A 300ms linear move and a 300ms spring move share a duration and share nothing else. Use spring-derived easing (`--spring-snappy` and its siblings) for primary motion; reserve cubic-bezier for ambient and secondary motion. Curves and their physics are in `references/easing-and-timing.md`.

Stagger is hierarchy in time. When several elements move, sequence them so the eye reads first, second, third. Stagger order follows visual hierarchy, not DOM order.

Slow or janky motion makes an interface read as broken. Keep total entry under 800ms, scroll reveals under 900ms, and hover response perceived under 150ms. Hold 60fps by animating only `transform`, `opacity`, and `filter`.

## The animation coverage mandate

Every visible element gets motion: an entry animation, a scroll reveal, a hover state, or an ambient effect. Not most elements. Every element. Walk the page top to bottom and assign motion to each. An element with no motion at all reads as a dead spot the eye catches immediately.

The most common failure is animating the hero and first section, then leaving everything below the fold static. Every section gets a scroll-triggered reveal. Every interactive element gets hover feedback.

### Coverage check (run first)

After building, scroll the page top to bottom at reading pace. For every element that enters the viewport:

1. Does it animate into view? If no, add a scroll reveal.
2. Can it be hovered? If yes, does it have hover feedback? If no, add it.
3. Is it interactive (clickable, focusable)? If yes, does it have active and focus states? If no, add them.
4. Is it decorative? If yes, does it have ambient motion (float, rotate, pulse)? If no, add it.
5. Is it a text element? If yes, does it have at minimum a fade-up reveal? If no, add it.

A page at 100% coverage feels alive. A page at 80% has dead spots. Full per-element assignments (nav, hero, cards, footer, and the rest) are in `references/entry-and-scroll.md` and the layer references.

## Phase 1: Motion audit

Before writing code, classify the motion requirements.

Classify the context: page type (marketing, product app, portfolio, e-commerce, editorial, dashboard), motion density (minimal, moderate, rich), primary purpose (guide attention, communicate state, create atmosphere, reveal content, delight), scroll behavior (standard, scroll-linked, sticky reveals), page transitions (none, crossfade, slide, morph), and framework.

Tag every moving element to a layer: entry (P0), scroll (P0), hover/focus (P0), state (P1), ambient (P2), kinetic (P2).

Write a two to three line motion brief stating density, the entry pattern, the scroll threshold, the hover treatment, the transition style, and the easing choices. Example: minimal density, staggered fade-up-deblur entries, scroll reveals at 20% viewport, pressure-depth hover on CTAs, word-mask reveals on headings, crossfade transitions, no ambient particles.

### Gate: audit

- Context is classified (page type, density, purpose).
- Every moving element is tagged to a layer.
- Every element on the page has an assigned motion (no element left without one).
- The motion brief is written and the framework is chosen.

## Phase 2: choreography

Build the timing sheet: the score of the page. Every element gets a trigger, a delay, a duration, an easing curve, and a relationship to its neighbors. Define the easing palette from `references/easing-and-timing.md` and map staggers to visual hierarchy.

### Gate: choreography

- Easing palette is defined (no CSS keyword easings).
- Timing sheet covers every moving element.
- No animation exceeds 900ms; total entry sequence is under 800ms.
- Stagger increments are 80 to 150ms and follow hierarchy, not DOM order.
- No more than 6 to 8 items are individually staggered.

## Phase 3: build

Implement layer by layer. Each reference holds the CSS, Framer Motion, and GSAP recipes for its layer. See the reference index below. Do not skip layers.

## Hard rules

Each rule names a pattern a competent model produces by default, states the mechanism, and shows the fix.

### 1. No CSS keyword easings on visible motion

Reject: `ease`, `ease-in`, `ease-out`, `ease-in-out` on any animation the user sees.
Why: the keywords are browser defaults, not chosen curves. They read as generic because nothing about them was decided.

Bad:
```css
transition: transform 0.3s ease;
```

Good:
```css
transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
```

### 2. Never animate `all`

Reject: `transition: all`.
Why: it transitions layout properties too, which forces reflow and drops frames. It also animates properties you did not intend to.

Bad:
```css
transition: all 0.3s ease;
```

Good:
```css
transition: transform 0.4s var(--ease-snap), box-shadow 0.4s var(--ease-snap);
```

### 3. Animate only compositable properties

Reject: animating `width`, `height`, `top`, `left`, `margin`, `padding`, or `border-radius`.
Why: these trigger layout on every frame. `transform` and `opacity` run on the compositor and hold 60fps.

Bad:
```css
.card:hover { width: 320px; height: 240px; }
```

Good:
```css
.card:hover { transform: scale(1.04); }
```

### 4. Primary motion uses spring physics

Reject: cubic-bezier on hero entries, reveals, modals, and page transitions when `linear()` is available.
Why: springs overshoot and settle, which reads as physical. Cubic-bezier cannot exceed its endpoint, so it reads as computed.

Bad:
```css
.modal { transition: transform 0.3s ease-out; }
```

Good:
```css
.modal { transition: transform var(--spring-smooth-duration) var(--spring-smooth); }
```

### 5. Every animation gates behind reduced motion

Reject: any transform, parallax, scale, or scroll-linked motion with no `prefers-reduced-motion` fallback.
Why: users set this flag for vestibular disorders and motion sensitivity. The fallback is opacity-only at a shorter duration, not zero feedback.

Bad:
```css
.reveal { transform: translateY(40px); transition: transform 0.8s var(--ease-out); }
```

Good:
```css
.reveal { transform: translateY(40px); transition: transform 0.8s var(--ease-out); }
@media (prefers-reduced-motion: reduce) {
  .reveal { transform: none; transition: opacity 0.3s ease; }
}
```

### 6. Keep durations inside the budget

Reject: reveals over 900ms, hover responses over 500ms, total entry over 800ms.
Why: motion the user waits on reads as loading, not revealing. Slow feedback reads as an unresponsive interface.

Bad:
```css
.section { transition: opacity 1.5s ease, transform 1.5s ease; }
```

Good:
```css
.section { transition: opacity 0.8s var(--ease-out), transform 0.8s var(--ease-out); }
```

### 7. Scroll reveals use IntersectionObserver, not scroll events

Reject: reading `window.scrollY` in a `scroll` handler to toggle reveals.
Why: scroll handlers fire many times per frame and force layout reads. IntersectionObserver reports visibility off the main thread.

Bad:
```javascript
window.addEventListener('scroll', () => {
  document.querySelectorAll('.reveal').forEach((el) => {
    if (el.getBoundingClientRect().top < innerHeight) el.classList.add('is-visible');
  });
});
```

Good:
```javascript
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
}, { threshold: 0.15, rootMargin: '-50px 0px' });
document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
```

### 8. One reveal animation, not one per element

Reject: sliding one element left, bouncing the next, rotating the third.
Why: mixed reveals read as undirected. A single consistent reveal reads as a decision.

Bad (prose): each section chooses its own entrance, so the page has five competing motions and no through-line.
Good (prose): every scroll reveal uses fade-up-deblur; signature effects are reserved for 4 to 6 named moments.

### 9. Never smooth-scroll on touch

Reject: Lenis or a smooth-scroll library with smoothing left on for touch input.
Why: it overrides the native momentum mobile users expect and creates accessibility problems.

Bad:
```javascript
const lenis = new Lenis({ smoothTouch: true });
```

Good:
```javascript
const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, smoothTouch: false });
```

### 10. Split text stays small and stays accessible

Reject: character-splitting paragraphs or more than 3 elements per page, or splitting without preserving the readable string.
Why: a `<span>` per character bloats the DOM and stalls paint. Screen readers then read letters instead of words.

Bad:
```javascript
document.querySelectorAll('p').forEach((p) => splitChars(p)); // every paragraph
```

Good:
```javascript
const h = document.querySelector('.hero-heading');
h.setAttribute('aria-label', h.textContent); // readable string preserved
splitChars(h); // one heading only
```

## Phase 4: Motion diff

Compare the build against the brief and timing sheet. Any FAIL blocks delivery. Run the coverage check first.

Coverage: every heading, paragraph, card, button, link, image, input, section, divider, icon, and decorative element has its assigned motion. Stats count up on reveal. Nav enters on load. Footer reveals on scroll. Scroll top to bottom: zero static elements.

Feel: entry completes under 800ms. Nothing pops in with no animation. Stagger follows hierarchy. Reveals trigger at 15 to 20% visibility. Hover feedback starts under 150ms. No animation makes the user wait or draws attention to itself. 3 to 5 signature effects present, one memorable moment.

Easing: no CSS keyword easings on visible motion. Entries use the snappy decel curve. Hovers use the snap curve. State changes use the smooth curve. The palette is consistent across the page.

Performance: only `transform`, `opacity`, and `filter` animate (plus clip-path reveals). No layout-property animation. `will-change` is applied only while animating and removed after one-shot animations. Scroll listeners use `{ passive: true }`. 60fps holds on a throttled CPU. No read-then-write layout thrashing.

Accessibility: all motion respects `prefers-reduced-motion` with an opacity-only fallback. Split text keeps its `aria-label`. No information is conveyed by animation alone. Focus states stay visible. Auto-playing loops (marquee, float, gradient) can be paused. Custom cursor is off on touch.

Technical and composition: scroll reveals use IntersectionObserver; scroll-linked animation uses scrub, not scroll events. No unjustified scroll-jacking. Parallax and custom cursor are disabled on mobile. Preloader shows content within 3 seconds and adds no artificial delay. No more than 2 to 3 complex animations run at once, and ambient motion does not compete with interactive motion.

### Final gate: humanizer audit

Run `skills/design-humanizer/SKILL.md` in audit mode against the output and resolve every FAIL before delivery. A motion pass that reintroduces AI design tells has not shipped.

## Anti-patterns (condensed)

- The slow reveal: everything fades over 1.5s. Fix: reveals under 800ms.
- The scroll carnival: a different animation per element. Fix: one reveal for all scroll reveals.
- The hover disco: cards rotate, buttons scale to 1.1x, links flash. Fix: 2px lift plus shadow for cards, background shift for buttons.
- The parallax soup: five parallax layers per section. Fix: 2 layers per viewport, maximum.
- The text disassembly: every heading character-splits. Fix: one character-split heading per page.
- The infinite preloader: a 5-second intro before content. Fix: 2.5 seconds maximum, no artificial delay.
- The missing reduced motion: no `prefers-reduced-motion` anywhere. Fix: gate every animation with an opacity-only fallback.
- The layout animator: animating width, height, top, left, margin, padding. Fix: transform and opacity only.

## Restraint

Motion is a tool with a cost: latency, distraction, and accessibility risk. When the input signals restraint, match it and say so in one sentence rather than silently maximizing.

Signals to preserve:

- The user set `prefers-reduced-motion` or asked for less motion. That is a decision, not an omission.
- An existing design system with defined transition tokens (duration and easing variables already in the code). Use them; do not replace them with the spring palette.
- A page that is already fast and quiet by design. Deliberate stillness is a style, not a gap to fill.
- A dense data table or dashboard that should stay readable and static. Comprehension beats reveals here.
- Accessibility requirements that forbid parallax or scroll-jacking. A stated constraint outranks the aesthetic.
- A checkout or transactional flow tuned for perceived speed. Do not add motion that reads as latency between the tap and the result.

When the constraint does not apply (skip or minimize the skill, and name why):

- Admin dashboards and internal tools: reveals slow down repeated scanning. Keep entry motion to a single fast fade at most.
- Documentation and reference sites: readers scan and search. Animate nothing that intercepts reading.
- Government and compliance interfaces: stillness and predictability are the standard. Do not introduce ambient or signature motion.
- Any surface where the user named a design system: conform to its motion tokens instead of running the palette.

When restraint wins, state the call: for example, "This is a data dashboard, so I kept motion to a single 150ms fade on load and skipped scroll reveals and ambient motion."

## Reference index

| File | What is in it | When to load |
|---|---|---|
| `references/easing-and-timing.md` | Three easing tiers with full spring `linear()` values, tier selection table, Framer Motion and GSAP equivalents, timing sheet, stagger rules | Phase 2, before writing any curve or duration |
| `references/entry-and-scroll.md` | Layer 1 entry (CSS, Framer, GSAP) and Layer 2 scroll reveals (IntersectionObserver, scroll-pin, horizontal scroll) | Phase 3, above and below the fold |
| `references/hover-and-micro.md` | Layer 3 button and card hover, 3D tilt, pressure buttons, link underlines, image hover reveal | Phase 3, interactive feedback |
| `references/kinetic-typography.md` | Layer 4 text-split utility, char/word/line reveals, number counter | Phase 3, animating headings and stats |
| `references/transitions-and-navigation.md` | Layer 5 page transitions, Layer 6 smooth scroll and progress, Layer 9 preloader | Phase 3, navigation and first paint |
| `references/ambient-and-state.md` | Layer 7 orbital drift, gradient, cursor glow, parallax; Layer 8 modal, accordion, tabs, menu | Phase 3, polish and UI state |
| `references/signature-animations.md` | Layer 10 effects 1 to 10 (scramble, border draw, ripple, shimmer, marquee, blob, wipe, spring hover, tilt cards, scroll typography) | Phase 3, after picking 4 to 6 signature moments |
| `references/signature-animations-2.md` | Layer 10 effects 11 to 20 (grid rain, focus glow, tooltip, distortion, badge, fan, gradient border, image reveal, cursor trail, clip-path) plus the selection guide | Phase 3, with the signature file above |
| `references/framework-matrix.md` | Framework-to-stack matrix, GSAP-versus-CSS guidance, the motion standards that set the floor | Phase 1 for framework choice, before Phase 4 for the standards |
