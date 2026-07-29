---
name: pixel-perfect
description: |
  Image-to-code replication pipeline. Fires when the user gives a screenshot,
  mockup, Figma export, or any design image and asks to reproduce it in code. Runs
  a seven-layer extraction (grid, type, color, spacing, components, atmosphere,
  interaction), fills an extraction sheet before writing code, builds to exact
  fidelity, and verifies with a visual diff. The reference is the specification and
  the code is a translation, not an interpretation. Does not cover original design
  or inspiration-led work: for "make me something like this", route to
  awwwards-hero. Unlike every other blandaid skill, this one reproduces AI-design
  tells faithfully when the reference contains them.
license: MIT
metadata:
  version: "2.0.0"
---

# Pixel-perfect design replication

The reference image is the specification. Your role is translator, not designer. Every visual decision, font size, spacing, color, radius, shadow, layout proportion, comes from the image, not from your preferences. When the reference contradicts your aesthetic instincts, the reference wins.

## When this fires

- The user provides a screenshot, mockup, Figma frame, design-tool export, or live-site capture and asks you to build it.
- The user says "match this", "replicate this", "make it look exactly like this image".
- Another skill hands you a reference and needs a faithful implementation as one step.

## When this does not fire

- The user wants inspiration, not replication ("make me something like this", "in this style", "vibe of X"). That is original design. Route to awwwards-hero.
- There is no reference image, only a text description. This skill needs pixels to measure.
- The user wants a redesign or improvement of the reference, not a copy. That is a different job with a different bar for taste.
- The reference is a competitor's live product and the ask is to clone it wholesale for shipping. See restraint.
- The task is to fix or audit code that already exists against a spec you were not given.

## Modes

Default mode is `direct`.

`direct`. The user invoked replication as the task. Run the full pipeline. Show the extraction sheets, the quality gates, and the visual diff table. The ceremony is part of the deliverable: it proves the output matches the reference rather than merely resembling it.

`embedded`. Another skill or a larger job uses this as one step. Run the same pipeline internally. Output only the code. No extraction sheets, no gate tables, no diff commentary. The caller wants the artifact, not the process.

`audit`. Point the skill at existing output and report only. Do not modify anything. Return the Phase 4 diff table with PASS and FAIL rows, then a short list of the highest-severity mismatches against the reference.

## The pipeline

```
IMAGE IN
   |
   v
Phase 1  Intake            classify the image, write the summary
   |     [gate: intake]
   v
Phase 2  Deep extraction   seven layers, fill every sheet
   |     [gate: extraction]     -> references/extraction-layers.md
   v
Phase 3  Build             structure-first, exact values
   |     [gate: build]           -> references/build-steps.md
   v
Phase 4  Visual diff       PASS/FAIL every category vs reference
   |     [gate: delivery]
   v
DELIVER
```

A failing gate blocks the next phase.

## Phase 1: image intake

Receive the reference. Before anything else, classify what you are looking at.

### Classify the image

Fill this table for every reference image:

| Field | Your answer |
|---|---|
| Image type | Full-page screenshot / single section / component detail / mobile view / desktop view / Figma frame / design-tool export / live-site screenshot |
| Sections visible | List top to bottom, e.g. "Nav, Hero, Features, Testimonials, Footer" |
| Target viewport | Estimated width: 1440px (desktop), 1280px (laptop), 768px (tablet), 375px (mobile) |
| Fidelity | High-res export (sub-pixel details are intentional) / compressed screenshot (some lossy artifacts) |
| Theme | Light / Dark / Mixed |

### Output the extraction summary

Before any code, state what you see in structured natural language. This anchors every decision that follows.

Example:

"Light mode, 1440px desktop. Five sections: sticky frosted nav with logo left, links center, CTA right; hero with massive serif heading left-aligned over full-bleed photography; 3-col feature grid with icon-top cards; testimonial carousel with large quotation marks; minimal footer with 4-col link grid. Palette: warm cream base, near-black text, terracotta accent on CTAs. Typography: serif display heading (likely Playfair Display), geometric sans body (likely Outfit). Cards are sharp-cornered, buttons are pill-shaped. No visible shadows, flat design with subtle border separators."

### If the image is unclear

Do not guess. Ask specifically:

"The nav links are too compressed to read at this resolution. The body font could be Outfit or Satoshi, they share near-identical geometry at this size. Can you provide a closer crop of the nav, or confirm the font stack?"

### Quality gate: intake

Before Phase 2, confirm each of these. If any is false, stop.

- Image type, section count, viewport, and fidelity are classified.
- The extraction summary is written.
- Every unclear area is flagged and a clarifying question asked, or everything is confirmed readable.

## Hard rules

Numbered. Each has a real Bad case and its Good replacement.

### 1. Extract before you build

Reject: writing CSS or JSX before the extraction sheet exists.
Why: values pulled from memory drift from the reference. The sheet is the contract the build implements.

Bad:
```css
/* saw the screenshot, started typing */
.hero h1 { font-size: 3rem; font-weight: bold; }
```

Good:
```css
/* Layer 2 sheet: H1 = Playfair Display, 600, ~76px, lh 0.95, tracking -0.03em */
.hero h1 {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 4.75rem);
  font-weight: 600;
  line-height: 0.95;
  letter-spacing: -0.03em;
}
```

### 2. Off-white and off-black, not pure values

Reject: defaulting backgrounds to `#FFFFFF` and text to `#000000` when the reference shows tinted neutrals.
Why: pure white and pure black are rare in considered design. The tint carries the mood, and losing it makes the page read as generic.

Bad:
```css
body { background: #FFFFFF; color: #000000; }
```

Good:
```css
/* Layer 3 sheet: warm cream base, near-black ink */
body { background: #F5F0EB; color: #14110E; }
```

### 3. Use the exact measured sizes

Reject: rounding `15px` body to `1rem` or a `76px` heading to `5rem` because it is tidier.
Why: rounding accumulates across every element and the whole page slips out of proportion.

Bad:
```css
.body-text { font-size: 1rem; }   /* reference measured 15px */
```

Good:
```css
.body-text { font-size: 0.9375rem; } /* 15px, as measured */
```

### 4. Name the transitioned properties

Reject: `transition: all`, and CSS keyword easings like `ease` on anything the eye tracks.
Why: `all` animates layout and paint properties you never meant to touch, which janks. `ease` is the browser default that reads as unconsidered. Name the property and use a real curve.

Bad:
```css
.btn { transition: all 0.3s ease; }
```

Good:
```css
.btn {
  transition: transform 240ms cubic-bezier(0.16, 1, 0.3, 1),
              background 240ms cubic-bezier(0.16, 1, 0.3, 1);
}
```

### 5. Match the radius language

Reject: substituting `rounded-lg` for buttons that are pill-shaped in the reference, or any radius the image does not show.
Why: radius mismatches are the fastest visual tell. The eye catches them before it catches color or spacing.

Bad:
```html
<button class="rounded-lg">Get started</button> <!-- reference shows a pill -->
```

Good:
```html
<button class="rounded-full">Get started</button>
```

### 6. Measure top and bottom section padding independently

Reject: assuming symmetric vertical padding (`py-24`) when the reference is asymmetric.
Why: many designs weight bottom padding heavier than top for optical balance. A symmetric guess shifts every section boundary.

Bad:
```css
.section { padding-top: 6rem; padding-bottom: 6rem; }
```

Good:
```css
/* Layer 4 sheet: pt 80px, pb 112px */
.section { padding-top: 5rem; padding-bottom: 7rem; }
```

### 7. No atmosphere the reference does not show

Reject: adding grain, ambient glow, gradient washes, or backdrop-blur the image does not contain.
Why: adding texture the reference lacks is interpretation, not replication. It is the same defect as dropping texture the reference has.

Bad:
```css
/* reference is flat; this invents depth */
.hero { backdrop-filter: blur(20px); }
.page::after { content: ""; opacity: 0.05; background: url(noise.svg); }
```

Good:
```css
/* reference is flat: ship it flat, no overlay */
.hero { background: var(--color-bg); }
```

### 8. Real image assets, never CSS approximations of art

Reject: standing in for a photograph, illustration, or organic texture with a CSS gradient, stripes, or a blob.
Why: geometric CSS has a fundamentally different visual quality than a photo or a brush stroke. The substitution always reads as wrong.

Bad:
```css
/* reference shows a hand-painted stroke */
.brush { background: linear-gradient(135deg, #ff5c8a, #ff2d6f); }
```

Good:
```html
<!-- generate or source a real asset -->
<img class="brush" src="/assets/brush-stroke.png" alt="" />
```

### 9. Full-viewport height uses dvh, never vh

Reject: `h-screen`, `height: 100vh`, or `min-height: 100vh` for full-height sections.
Why: `vh` ignores the mobile browser chrome and jumps when the address bar collapses on iOS Safari. This is a browser bug, not a design choice. It is the one technical override the reference cannot veto.

Bad:
```css
.section--full { min-height: 100vh; }
```

Good:
```css
.section--full { min-height: 100dvh; }
```

### 10. Read heading weight from stem thickness

Reject: setting headings to `700` because "headings are bold".
Why: many premium designs run headings at `500` or `600` on a heavier face. The wrong weight changes the entire tone of the type.

Bad:
```css
.heading-section { font-weight: 700; } /* assumed */
```

Good:
```css
/* stems are moderate against the counters: 600 */
.heading-section { font-weight: 600; }
```

## Phase 4: visual diff

Compare the implementation against the reference. Mark each item PASS or FAIL. Any FAIL blocks delivery. The full check tables live below as the delivery gate.

### Quality gate: extraction

Before Phase 3, confirm. Any false answer stops the build.

- All seven extraction sheets are filled (see references/extraction-layers.md).
- Font candidates are named with the character that distinguishes them.
- Every distinct color has a hex value.
- Spacing values are measured, not assumed.
- The component inventory records radius, border, and shadow per component.
- Anything unclear is flagged to the user.

### Quality gate: build

Before Phase 4, confirm. Any false answer stops delivery.

- Global tokens come from extraction values, not defaults.
- The layout skeleton matches the reference section structure and order.
- Every typography property is set explicitly, no browser defaults.
- Components match their sheets for radius, border, shadow, and padding.
- Atmosphere effects appear only where the reference shows them.
- Responsive collapse is implemented and no viewport overflows horizontally.
- Hover and focus-visible states exist on every interactive element.

### Quality gate: delivery

Walk every category. Record PASS or FAIL per row. Any FAIL blocks delivery.

| Category | Checks |
|---|---|
| Layout | section count and order; container max-width proportion; horizontal padding; grid column counts and ratios; section heights; vertical section spacing; per-section alignment; z-axis layering |
| Typography | font family renders; heading size vs viewport; heading weight; heading line-height; heading letter-spacing; body size; body line-height and max-width; eyebrow styling; per-element text colors |
| Color | primary background (not `#FFF` when it should be tinted); primary and secondary text; accent; borders and dividers; no unexpected shifts between sections |
| Component | button radius (pill vs rounded vs sharp); button padding; button text styling; card radius, padding, border, shadow; nav height, background treatment, link styling; image radius, aspect ratio, object-fit |
| Spacing | heading-to-subtext gap; subtext-to-CTA gap; card internal padding; grid gap; section top and bottom padding independently; overall negative space |
| Atmosphere | background treatment (flat/grain/gradient/glow); shadow presence and intensity; blur where the reference shows it; no effects the reference does not show |
| Technical | zero console errors; fonts loaded (no FOUT/FOIT); images loaded; no horizontal overflow at any viewport; hover and focus-visible states; `min-h-[100dvh]` not `h-screen`; `prefers-reduced-motion` respected |

## The core principle

The reference image is the specification. The code is a translation. You are a translator, not a designer. Match the image, not your preferences. If the reference contradicts your aesthetic instincts, the reference wins. The only technical override allowed is `min-h-[100dvh]` over `h-screen`, because `h-screen` is a browser bug, not a design choice.

## Restraint

This skill's whole job is fidelity, so its restraint reads differently from the rest of blandaid. The stop conditions here are not "the design is fine, leave it alone". They are "reproducing this faithfully would invent facts, break the law, ship something the user cannot use, or copy a defect the user needs to know about".

Fidelity over taste. This is the one skill where the design-humanizer detector must not act as a corrector. Every other blandaid skill treats a purple gradient, a centered glass card, or a generic hero as a tell to fix. Here, if the reference contains one, that is the specification and you reproduce it exactly. Note the tell in a comment for the user, then build it anyway. Example: `/* Note: purple-to-blue gradient and centered glass card are common AI-design tells. Reproduced per the reference. */`. The user asked for a copy, not a critique.

Signals to preserve (things a maximalist would "fix" but must not):

- A deliberately flat design with no shadows. Absence of depth is a choice. Do not add glow or elevation.
- An off-brand or unusual palette, including the AI-tell purple gradient. If it is in the reference, it is the spec.
- A restrained or unusual type scale, including headings at `500` or `600`. Match the measured weight.
- A dense data table or tight layout. Do not loosen spacing the reference packs deliberately.
- A centered glass-card hero or other pattern the humanizer would flag. Reproduce it and comment the tell.
- Pure `#000` or `#FFF` when the reference genuinely uses them. The off-value rule is a default guard, not a mandate to tint what is truly pure.

When the constraint does not apply (stop, and tell the user why in one sentence):

- The reference is a competitor's product and the ask is a wholesale ship-ready clone. Copying a live commercial site is a legal problem. Flag it, reproduce only for internal study or comparison, and let the user decide.
- The reference is low resolution and the ask needs sub-pixel detail. Inferring detail a blurry image does not contain is inventing facts. Extract what is confident, flag the rest, and ask for a higher-res source.
- The reference uses a licensed or paid font the user cannot ship. Reproduce the layout, flag the font, and offer the closest licensable match behind a single `--font-display` swap. Do not silently substitute.
- The reference clearly uses a known component library (shadcn/ui, Radix, Material). Installing and theming the real component is usually better than reimplementing it from a screenshot. Say which library you see and let the user choose.
- The user wants only one section of the screenshot. Extract and build that section. Do not reproduce the whole page because it is in the image.
- The reference has an accessibility failure, such as text that fails WCAG AA contrast. Reproduce it faithfully and flag it. The user decides. Do not silently "fix" the contrast, and do not silently ship the violation without saying so.

On that last point, be precise. The rule is reproduce faithfully but flag. You do not change the reference's contrast on your own initiative, and you do not stay quiet about a failure you can measure. State it, then do what the user asks.

For the shared quality bar, easing set, spatial scale, palette discipline, and universal restraint clause, see skills/blandaid-core/SKILL.md. Do not restate them here.

## Reference index

| File | What is in it | When to load it |
|---|---|---|
| references/extraction-layers.md | The seven Phase 2 extraction layers with every sheet template: grid, typography, color, spacing, components, atmosphere, responsive and interaction inference | After intake passes, before writing any code |
| references/build-steps.md | The eight Phase 3 build steps with every code sample: foundation, skeleton, typography, components, spacing, atmosphere, responsive, interaction | Once extraction passes its gate |
| references/assets-and-edge-cases.md | Handling artistic assets CSS cannot draw, plus edge cases: unidentifiable font, low-res reference, non-reproducible content, multiple images, recognized component library | When the reference has non-CSS art or an edge case applies |
| skills/blandaid-core/SKILL.md | Shared vocabulary: the quality bar, easing set, spatial scale, palette discipline, universal restraint, modes | When you need a shared value or definition rather than a replication-specific one |
| skills/design-humanizer/SKILL.md | The AI-design-tell detector. In this skill it is a labeler, not a corrector: note tells in a comment and reproduce them per the reference | When you want to name a tell for the user, never to override the reference |
