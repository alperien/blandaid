---
name: awwwards-hero
description: |
  Builds Awwwards and FWA-tier hero sections. Reads design direction from
  reference images or a brief, commits to one of six hero architectures, then
  builds type, palette, atmosphere, motion, and mobile collapse to a fixed
  standard: viewport-scale typography, a single focal point, extreme whitespace,
  a two-to-three hue palette. Fires when the request is a hero, a landing header,
  an above-the-fold section, or reference screenshots of hero designs. Hero only.
  Does not govern full pages, navigation systems, footers, or feature sections.
  Pair it with page-level skills for anything past the fold.
license: MIT
metadata:
  version: "2.0.0"
---

# Awwwards-tier hero section

This skill builds one thing well: the section a visitor sees before scrolling. It
reads the design direction, commits to a single architecture, and holds the
fundamentals that keep a hero off the generic pile.

Shared doctrine lives in `skills/blandaid-core/SKILL.md`: the quality bar, easing
and spatial vocabulary, palette discipline, and the universal restraint clause.
This skill applies that doctrine to heroes and does not restate it.

## When this fires

- The user asks for a hero, a landing header, or an above-the-fold section.
- The user hands over reference screenshots of hero designs and wants them built.
- Another skill building a full page needs the hero section produced.

## When this does not fire

- The request is a full page, a nav system, a footer, or a feature block below
  the fold. Those are other skills' jobs. Build only the hero here.
- The user named a design system (Material, Carbon, a company kit). The system's
  rules win over this skill's aesthetic.
- The surface is an admin dashboard, a data-dense internal tool, a settings
  screen, or documentation. There is no hero to build.
- The brief is copy, IA, or backend. Nothing above the fold is in scope.

If the aesthetic is wrong for the surface, say so in one sentence and stop. Do
not build a maximalist hero onto a page that does not want one.

## Modes

Default mode is `direct`.

- `direct`: the user invoked this skill as the task. Run the full pipeline. Show
  the Hero Extraction, the quality gates, and the Phase 4 diff table. The ceremony
  is part of the deliverable.
- `embedded`: a larger job is using the hero as one step. Run the same pipeline
  internally. Output only the hero code. No extraction sheet, no gate tables, no
  commentary.
- `audit`: point the skill at an existing hero and report only. Do not modify it.
  Return the Phase 4 diff table with PASS and FAIL rows and the highest-severity
  failures listed first.

## The pipeline

```
BRIEF IN
   |
   v
Phase 1: Read          extract signals, write Hero Extraction   -> gate
   |
   v
Phase 2: Architecture  pick one of A-F, commit, no blending     -> gate
   |
   v
Phase 3: Build         type, palette, atmosphere, motion, mobile -> gate
   |
   v
Phase 4: Verify        diff against reference, any FAIL blocks
```

A failing gate blocks the next phase. Detail for each phase lives in the
reference files indexed at the end.

### Phase 1: read the reference

Extract eight signals from each reference image, or infer them from the brief:
mode (light or dark), focal element, typography style, text-to-image
relationship, layout gravity, color count, navigation style, and micro-details.
Do not project your own aesthetic onto the reference. Read what is there.

Then write a Hero Extraction in two or three lines before any code:

> Hero Extraction: Dark mode, centered 3D card carousel with CSS perspective as
> focal element, massive sans-serif heading below in mixed-case, monospace
> micro-label above, single ghost CTA, floating pill nav. Palette: off-black plus
> white plus one muted accent. Reads as a dark cinematic agency with depth-layered
> cards.

If no references are given, ask one question: closer to dark cinematic or light
editorial, and what is the brand name plus one-line value prop. If context makes
it obvious (the user said "luxury agency" or "AI startup"), skip the question and
declare the extraction.

### Phase 2: pick an architecture

Choose one architecture from the six in `references/hero-architectures.md`. Do
not blend two. The choice must match the Hero Extraction.

### Phase 3: build

Build type and palette from `references/typography-and-palette.md`, then
atmosphere, motion, mobile collapse, and performance from
`references/atmosphere-and-motion.md`. The hard rules below apply throughout.

### Phase 4: verify

Walk the diff table in the quality gates. Any FAIL blocks delivery. In `audit`
mode this table is the entire output.

## Hard rules

Every rule catches a default a capable model produces on its own. The Good line
is the fix.

### 1. Viewport-scale headings, not big text

**Reject:** a hero heading sized with a fixed Tailwind step and default tracking.
**Why:** a hero heading is the structural element of the viewport. At a fixed step it reads as a large paragraph, not architecture, and it does not track the viewport.

Bad:
```html
<h1 class="text-5xl font-bold">Design that ships</h1>
```

Good:
```css
.hero-heading {
  font-size: clamp(2.5rem, 7vw, 8rem);
  letter-spacing: -0.03em;
  line-height: 0.95;
  text-wrap: balance;
  max-width: 18ch;
}
```

### 2. Display font, not a body font

**Reject:** Inter, Roboto, Open Sans, Poppins, Arial, or Helvetica as the heading face.
**Why:** these are body fonts. At hero scale they look ordinary no matter how good the layout is, and they are the fonts a model reaches for by habit.

Bad:
```css
.hero-heading { font-family: Inter, system-ui, sans-serif; }
```

Good:
```css
/* Display face chosen from the vibe row in typography-and-palette.md */
.hero-heading { font-family: "Clash Display", "Geist", sans-serif; }
```

### 3. One focal point

**Reject:** a heading, a product shot, a card cluster, and trust badges all competing at the same scale.
**Why:** with three or more elements at equal visual weight, the eye has nowhere to land and the composition reads as a template. One element dominates; the rest support it.

Bad: heading center, product mockup right, five client logos below, a rotating badge in the corner, all at full contrast and similar size.

Good: the product mockup is the focal element at full scale and contrast. The heading is set below it, smaller. No logos in the hero. The badge, if present, sits muted in one corner.

### 4. Two to three hues, no default gradient

**Reject:** a purple-to-blue (or indigo-to-violet) gradient background, or more than one saturated accent.
**Why:** the purple-blue gradient is the single most recognizable AI hero background. More than one saturated accent removes the focal hierarchy from color.

Bad:
```css
.hero { background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); }
```

Good:
```css
.hero-dark {
  background: #0a0a0a;
  color: #f5f5f5;
  /* one muted accent, on the CTA and active states only */
}
```

### 5. Atmosphere, not a flat fill

**Reject:** a hero painted with a single flat `bg-black` or `bg-white`.
**Why:** a flat fill reads as unfinished. A hero needs depth from the background itself: a faint radial glow, film grain, or a warm tint that is felt more than seen.

Bad:
```html
<section class="hero min-h-screen bg-black">...</section>
```

Good:
```css
.hero-dark::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 60% 50% at 50% 40%, rgba(255,255,255,0.03) 0%, transparent 70%);
  pointer-events: none;
}
```

### 6. One CTA

**Reject:** a primary button plus a "Learn more" link plus a scroll-to-explore chevron.
**Why:** every extra action dilutes the primary one. A hero states a single next step. Secondary links and scroll cues belong lower on the page, if anywhere.

Bad:
```html
<a class="btn-primary">Get started</a>
<a class="btn-ghost">Learn more</a>
<div class="scroll-indicator animate-bounce">Scroll to explore</div>
```

Good:
```html
<a class="hero-cta rounded-full px-8 py-3.5">Get started</a>
```

### 7. Entry animation on transform and opacity, gated for reduced motion

**Reject:** a static mount, or an entry that animates layout properties.
**Why:** a hero that snaps in with no motion reads as broken. Animating `height`, `top`, `left`, or `width` recalculates layout every frame and drops the frame rate. Only `transform` and `opacity` are GPU-composited, and motion must respect `prefers-reduced-motion`.

Bad:
```css
@keyframes drop { from { height: 0; } to { height: 100%; } }
.hero-content { animation: drop 0.6s ease; }
```

Good:
```css
.hero-item {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.hero-item.is-in { opacity: 1; transform: translateY(0); }
@media (prefers-reduced-motion: reduce) {
  .hero-item { transition: none; opacity: 1; transform: none; }
}
```

### 8. Full-viewport height that survives mobile browser chrome

**Reject:** `h-screen` (or `100vh`) for the hero container.
**Why:** `100vh` ignores mobile browser toolbars, so the hero gets clipped or overflows on phones. `100dvh` tracks the dynamic viewport.

Bad:
```html
<section class="hero h-screen">...</section>
```

Good:
```html
<section class="hero min-h-[100dvh] overflow-hidden">...</section>
```

## Quality gates

Each gate is a self-check. Do not advance a phase until every line passes.

### Gate: read (after Phase 1)

- All eight signals are extracted from the reference or inferred from the brief.
- The Hero Extraction summary is written.
- Mode (light or dark), focal element, and palette direction are decided.

### Gate: architecture (after Phase 2)

- Exactly one architecture (A through F) is selected.
- The selection matches the Hero Extraction.
- Two architectures are not blended.

### Gate: build (after Phase 3)

- The chosen architecture was built without blending.
- The heading font is a display font, not a body font.
- The heading uses fluid `clamp()` and reaches at least a `text-5xl` equivalent on desktop.
- The heading wraps to at most two or three lines at 1440px.
- The heading has negative tracking and line-height under 1.1.
- The palette uses at most three hues.
- The container uses `min-h-[100dvh]`, not `h-screen`.
- An entry animation is present and runs only on `transform` and `opacity`.
- Mobile collapse is explicit for the chosen architecture.

### Gate: verify (Phase 4 diff, blocks delivery)

Mark each PASS or FAIL. Any FAIL blocks delivery.

| Category | Check |
|---|---|
| Composition | One focal point dominates; hero fits one 1440x900 viewport; heading at most 2-3 lines; content centered or anchored on purpose; whitespace is extreme and intentional |
| Typography | Heading font is not Inter, Roboto, Open Sans, Poppins, or Arial; size is fluid `clamp()`; tracking is negative; line-height is under 1.1; subtext is under 20 words, muted, width-constrained |
| Color | At most three hues; background has atmosphere, not a flat fill; no purple-blue gradient; no neon, mesh blobs, or rainbow |
| Component | One CTA only; CTA has hover and active states with custom easing; no scroll chevron; no trust logos in the hero; no version labels unless the brief is a product launch |
| Motion | Entry animation present; total reveal under 800ms; `prefers-reduced-motion` respected; nothing animates `top`, `left`, `width`, or `height` |
| Mobile | Layout collapses cleanly below 768px; no horizontal overflow; touch targets at least 44px; heading at least 2rem; text readable over images |
| Content | No AI marketing cliches in the copy (the "Next-Gen", "Revolutionize" register); no em dashes; placeholder images use `picsum.photos/seed/{keyword}/{w}/{h}`, not generic stock |

Final gate: run `skills/design-humanizer/SKILL.md` in audit mode against the hero
and resolve every FAIL it returns before delivery. That skill owns the full
AI-design-tell catalog. Do not ship a hero with an open design-humanizer FAIL.

## Restraint

The stop condition. A hero can look like it has defects to a maximalist when the
choices are deliberate. Read the input before overriding it. When restraint wins,
say so in one sentence and explain the call. Do not silently apply the skill's
default aesthetic. This is the hero-specific reading of the "Universal restraint"
section in `skills/blandaid-core/SKILL.md`.

### Signals to preserve

- A deliberately small headline set in a quiet brand voice. A restrained
  wordmark-scale heading is a choice, not a missing `clamp()`. Do not inflate it
  to viewport scale.
- An existing brand palette in the reference or brand kit. Two brand hues that
  are not off-black and cream are still the brand. Do not swap them for the dark
  or light default.
- A hero whose real job is a search box or a booking widget (travel, real
  estate, docs search). The input is the focal point. Do not bury it under a
  statement headline.
- A brand serif or a specified typeface that is not on the display-font list. If
  the brand ships GT America or a custom face, use it. The font table is a
  fallback, not an override.
- A single considered accent color the brand already owns, even a saturated one.
  Brand red on the CTA is not the AI purple gradient. Keep it.
- Copy that is intentionally plain and product-specific. A concrete value prop
  beats a punchier line that drifts from what the product does. Do not rewrite
  accurate copy to sound more premium.
- A calm, near-static hero when the brief is trust or gravity (legal, finance,
  memorial, healthcare). Stillness is the design. A subtle fade is enough. Do not
  add stagger, parallax, and a rotating badge.

### When the constraint does not apply

- Admin dashboards, settings screens, and data-dense internal tools. There is no
  hero. Build the layout the data needs.
- Government, compliance, and accessibility-first interfaces. Legibility and
  contrast rules outrank the maximalist look. A grain overlay or a low-contrast
  glow can fail an audit.
- Documentation and knowledge-base landing pages. Scannability and search beat a
  viewport-scale statement.
- Any surface where the user named a design system. Its tokens, type scale, and
  components win. Do not restyle the hero away from the system.

## Reference index

| File | What is in it | When to load |
|---|---|---|
| `references/hero-architectures.md` | The six architectures A-F: layout blueprints, DOM shapes, the perspective and inline-image CSS recipes, and the drift warnings for D and F | Phase 2, and through Phase 3 for the chosen layout |
| `references/typography-and-palette.md` | Font selection by vibe, the heading CSS blueprint, supporting-text hierarchy, and the dark and light palette recipes | Phase 3, building type and color |
| `references/atmosphere-and-motion.md` | Glow, grain, and warm-radial backgrounds; the entry animation and CTA physics; parallax and rotating-badge recipes; mobile collapse per architecture; performance rules | Phase 3, building atmosphere and motion |
| `skills/blandaid-core/SKILL.md` | Shared quality bar, easing vocabulary, spatial vocabulary, palette discipline, universal restraint, and modes | Whenever a general design principle is needed |
| `skills/design-humanizer/SKILL.md` | The AI-design-tell catalog and audit mode | Final quality gate, before delivery |
