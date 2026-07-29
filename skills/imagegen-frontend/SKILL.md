---
name: imagegen-frontend
description: |
  Image-direction skill for generating premium, conversion-aware website design
  reference images through an image model. Fires when the user asks to generate
  website mockups, landing page concepts, section design references, or UI comp
  images. Enforces one separate horizontal image per section, composition variety,
  background-image freedom, varied CTAs and hero scales, a narrative concept spine,
  and a single consistent palette across all images. Outputs structured prompt
  blueprints that produce implementation-ready references a developer or coding
  model can recreate accurately. Image generation only. It does not write code, and
  it does not fire for logos, icons, illustration sets, or standalone photography.
license: MIT
metadata:
  version: "2.0.0"
---

# Elite frontend image art direction

You are an art director, not an illustrator. Every image is a structured, premium,
implementation-ready website section a developer could look at and code. This skill
produces the visual references that feed the pixel-perfect, hero, and motion skills.
It does not write code.

## The hard output rule, read first

Generate ONE separate horizontal image PER section. Always. No exceptions.

```
 1 section requested       ->  1 image
 4 sections requested      ->  4 images
 8 sections requested      ->  8 images
12 sections requested      -> 12 images
"landing page" (no count)  -> default 6 sections -> 6 images
"full website template"    -> default 8 sections -> 8 images
```

Each image is one section, generated as its own image call. Never combine sections
into one tall frame, and never return a single image containing the whole page. If
you can only render one at a time, output them in sequence and announce each: "Section
1 of 8: Hero", "Section 2 of 8: Trust bar", and so on.

This rule overrides any model default that wants to collapse output into a single
image. It is the most important constraint in the skill.

## When this fires

- The user asks for website mockups, landing page concepts, or section comps.
- The user wants UI reference images a developer or coding model will recreate.
- Another skill needs design reference images as an input step (embedded mode).

## When this does not fire

- The user wants code, not images. Hand off to the pixel-perfect, hero, or motion
  skills.
- The request is for a logo, app icon, favicon, or icon set.
- The request is for standalone illustration, character art, or photography with no
  layout intent.
- The user wants a diagram, chart, flowchart, or infographic.
- The request is to edit an existing photo (retouch, background removal, upscaling).
- The user names a design system to implement (Material, Carbon, a fixed brand kit).
  Depict what the system specifies rather than art-directing around it.

## Modes

Default mode is direct.

direct. The user asked for design reference images and this is the task. Run the
full pipeline and show the Direction Brief, the art-direction picks, the gates, and
the visual diff table. The brief is part of the deliverable.

embedded. Another skill or larger job needs reference images as one step. Run the
same pipeline internally and output only the images and the palette contract (base
tones, accent hue, dark or light mode). No brief sheet, no gate tables, no
commentary.

audit. Point the skill at existing generated images and report only, no
regeneration. Return the visual diff table with PASS and FAIL rows and the
highest-severity failures. Also run design-humanizer in audit mode over the images
and fold its findings in.

## The pipeline

```
BRIEF IN
  -> Phase 1  Read the brief      (extract signals, classify, map to dials)
  -> Phase 2  Art direction       (commit to combinatorial picks)
  -> Phase 3  Prompt engineering  (build the blueprint per section)
  -> Phase 4  Generate            (one image per section, announce each)
  -> Phase 5  Visual diff         (verify against brief, check drift)

Each phase has a quality gate. Failing a gate blocks the next.
```

## The core doctrine, condensed

These override every aesthetic preference. The quality bar lives in
skills/blandaid-core/SKILL.md under "The quality bar". If a generated image would
look generic next to that bar, it is not good enough.

- Break the model defaults (centered dark hero, purple or blue glow, floating blobs,
  weak type) with intentional, structured compositions.
- Every image must communicate layout, hierarchy, spacing, type scale, and palette
  clearly enough to code from.
- Composition variety is mandatory: at least 3 anchors across a page, never the same
  anchor twice in a row.
- One palette, chosen once in Phase 2 and threaded through every section. Palette and
  spatial discipline live in skills/blandaid-core/SKILL.md.
- Every section has a job (hook, prove, inform, convert) and the page reads as a
  persuasion sequence.

## Phase 1: read the brief

Extract design signals from the request. Do not project your own aesthetic.

### Extract these signals

| Signal | What to look for |
|---|---|
| Brand type | SaaS, agency, e-commerce, portfolio, editorial, fintech, health, AI, crypto, personal brand, nonprofit |
| Mood keywords | Clean, bold, cinematic, minimal, editorial, premium, luxury, playful, dark, light, warm, cold, technical, organic |
| Density preference | Airy, balanced, or packed, inferred from "minimal" vs "feature-rich" vs "content-heavy" |
| Image preference | Photography-led, illustration-led, typography-led, product-focused, abstract |
| Target audience | Developer tools, consumer, enterprise, creative professional, luxury consumer |
| Explicit constraints | Named colors, named fonts, dark or light mode specified, specific section requests |
| Reference links | Any URLs, screenshots, or brand names given as inspiration |
| Section count | Explicit count, or inferred: landing page 6, full site 8, one-pager 5 to 7 |

### Output the direction brief

State in 2 to 3 lines the art direction you are committing to. Example: "Direction
Brief: dark cinematic SaaS landing page for an AI infrastructure product. 7 sections.
Palette: deep charcoal base, warm off-white text, single amber accent. Typography:
compressed display grotesk. Giant statement hero with product screenshot as focal.
Conversion-driven AIDA flow. Reads like Linear with a warmer accent."

### Brief-to-direction mapping

Read the brief, then bias your picks.

| If the user says | Bias toward |
|---|---|
| "minimalist", "clean", "swiss", "ultra simple" | Mini minimalist hero, solid surfaces, stacked center compositions, generous negative space, skip full-bleed images |
| "editorial", "magazine", "art-directed", "fashion" | Mid editorial or giant statement hero, editorial side-image backgrounds, off-grid compositions, strong type contrast, duotone treatments |
| "cinematic", "atmospheric", "premium", "luxury", "bold" | Giant statement hero, full-bleed image backgrounds with tonal overlay, soft radial vignettes, bottom-left or centered-low text |
| "SaaS", "product", "dashboard", "fintech", "infra" | Mid editorial hero, solid plus inline asset backgrounds, clear product framing, trust-driven anchors, higher implementation clarity |
| "agency", "creative studio", "portfolio" | Giant statement or mini minimalist hero (commit to one), bold background variety, off-grid poster compositions |
| "e-commerce", "shop", "store", "product page" | Mid editorial hero with strong product focus, full-bleed product photography, product-led compositions, unmistakable CTAs |
| Brief is silent on style | Use the baseline defaults, pick decisively, do not split the difference |

### If the brief is vague

Ask exactly ONE question: "What is the brand name, the one-line value prop, and the
preferred mood, closer to dark cinematic or light editorial?" If you can infer from
context (the user said "AI startup" or "luxury agency"), skip it and declare the brief.

### Quality gate: brief

- All 8 signals are extracted or inferred, and the Direction Brief is written.
- You know the mood, palette direction, hero scale, and section count.
- You have NOT generated any images yet.

Phase 2 (art direction) and Phase 3 (prompt engineering) detail live in the reference
files indexed at the bottom. Phase 4 generation rules follow; the Phase 5 diff is
under Quality gates.

## Generation rules

| Rule | Why |
|---|---|
| Announce each section before generating | "Section 3 of 7: Features, pristine gapless bento grid with staggered float-up energy" |
| Horizontal format, 16:9 | Website sections are wide, not portrait |
| One section per image | The hard output rule, no exceptions |
| Include the full prompt blueprint in the generation call | Do not summarize. The model needs every field |
| Verify palette consistency before each generation | The accent from section 1 must appear in section 5 |
| Adjust the prompt if a generation drifts | If image 3 returns a purple gradient, regenerate with stronger anti-pattern language |

## Hard rules

Each rule shows a weak prompt (Bad) and its correction (Good). The Bad examples are
prompts a competent model actually writes by default.

### 1. One image per section

Reject: a prompt that asks for the whole page, or several sections, in one frame.
Why: a tall combined frame cannot show per-section layout or be gridded, and it blurs the palette and hierarchy checks.

Bad:
```
Generate a full landing page for an AI infra startup with hero, features,
testimonials, pricing, and footer, all in one tall image.
```

Good:
```
Section 3 of 7: Features. Horizontal 16:9 website section, 1440x900 desktop frame.
One image, this section only. [full blueprint fields follow]
```

### 2. Break the default AI look

Reject: purple or blue gradient heroes, floating glass blobs, dashboard card spam.
Why: these are the model's fallback for "tech" and "atmosphere," and they read as generated while saying nothing about the brand.

Bad:
```
Modern tech SaaS hero, dark background with a purple-to-blue gradient, glowing
translucent orbs floating around the text, sleek and futuristic.
```

Good:
```
Dark cinematic SaaS hero. Base #0a0a0a charcoal, warm off-white text, single amber accent on the CTA, 3% film grain.
No purple, no blue gradient, no floating blobs.
```

### 3. Vary composition, never default to the split

Reject: left-text, right-image on every section, or the same anchor twice in a row.
Why: that split is the most overused generated layout, and repetition reads as a template.

Bad:
```
Features section: heading and paragraph on the left, product screenshot on the
right. (Same split the hero already used.)
```

Good:
```
Features section: off-grid editorial offset anchor. Heading top-left, three feature cells staggered on a reading-order diagonal to bottom-right.
This anchor was not used in the two prior sections.
```

### 4. One palette across every section

Reject: a palette that shifts hue between sections, or a second saturated accent.
Why: hues drifting from warm cream to cool blue-gray is a broken design system, and more than one accent destroys cohesion.

Bad:
```
Hero on warm cream with a coral accent. Features section on cool slate-blue with a
teal accent. Pricing on soft lavender.
```

Good:
```
Every section: warm cream #F6F1E7 base, near-black #141210 text, single terracotta #C4633B accent on primary CTAs and active states only.
Backgrounds may change mode, hues stay fixed.
```

### 5. Whitespace is a design material

Reject: a prompt that packs the frame edge to edge with content. Why: the default is to
fill every pixel, but negative space separates premium from busy and cramped sections cannot show measurable spacing.

Bad:
```
Feature-rich section packed with eight cards, icons, labels, badges, and a sidebar,
filling the whole frame so it looks full and valuable.
```

Good:
```
Features section, three cards in the middle 60% of the frame, wide side margins,
generous padding around the heading. The background carries the composition.
```

### 6. Every section has a job

Reject: a section generated for decoration with no conversion role. Why: a page is a
persuasion sequence, so a section earns its place only by hooking, proving, informing,
or converting.

Bad:
```
Add a nice atmospheric section in the middle with an abstract visual to break
things up and make the page feel designed.
```

Good:
```
Section 4 of 6: How it works. Job is education. Three-step ordered sequence, each
step a short label plus a supporting visual, leading the eye toward pricing.
```

### 7. Viewport-scale typography

Reject: prompts that ask for "big text" or leave heading scale unstated. Why: headings
are architectural elements, and unspecified scale returns timid template-grade type.
See "The quality bar" in skills/blandaid-core/SKILL.md.

Bad:
```
Hero with a big bold headline and a subheading underneath, centered.
```

Good:
```
Hero heading: massive compressed grotesk, all caps, roughly 110pt equivalent, tight tracking, 2 lines max, dominant in the first viewport.
Subtext secondary: 16pt, muted, 40ch column.
```

### 8. Every prompt states what it is not

Reject: a prompt with no negative constraints. Why: models respond to negative
constraints as strongly as positive ones. Naming the banned defaults removes most
generic output.

Bad:
```
Premium fintech hero, clean and modern, trustworthy, professional.
```

Good:
```
Premium fintech hero [positive blueprint fields]. WHAT THIS IS NOT: not a purple or
blue gradient, not floating blobs, not a generic dashboard grid, not centered text
over a gradient, not stock business photography.
```

## Quality gates

### Gate: generation (after Phase 4)

- Total image count matches the section count. No missing sections.
- Each image is a separate horizontal image. No combined frames.
- No purple or blue AI gradient backgrounds unless the palette calls for it.

Composition, palette, and typography consistency are checked in the visual diff below.

### Gate: visual diff (Phase 5)

Compare every image against the Direction Brief and the Phase 2 picks. Any FAIL means
regenerating that section with a corrected prompt.

- Composition: 3 or more anchors appear, no two adjacent sections share one, the hero
  uses its assigned architecture, whitespace reads as intentional, hierarchy is clear.
- Palette: all sections share the base palette and one accent hue, no rogue colors,
  dark uses off-black not pure black, light uses warm off-white not pure white.
- Typography: heading family and weight are consistent, scale is viewport-dominant,
  no heading past 3 lines, subtext is visibly secondary, nothing illegible.
- Section purpose: each section does its job from references/section-guidance.md and
  the page flows as a persuasion sequence.

### AI default drift diff, delegated

Do not maintain a parallel slop list here. Run design-humanizer in audit mode over the
generated concepts and treat its report as this gate. The full slop catalog lives in
skills/design-humanizer/SKILL.md. This is the final quality gate: the work is not done
until design-humanizer returns no FAIL rows.

### Implementation readiness

- Layout structure is clear enough to grid, and spacing is visible and measurable.
- Component boundaries are clear: cards have edges, sections have gaps.
- CTA buttons are clearly delineated, and image areas are distinct from background.
- The image could go to the pixel-perfect skill and be coded accurately.

## Restraint

The stop condition. A maximalist reading of this skill will override things the user
put there on purpose. When restraint wins, say so in one sentence and explain the
call rather than silently skipping the skill. The shared clause is in
skills/blandaid-core/SKILL.md under "Universal restraint"; the signals below are
specific to image direction.

### Signals to preserve

- A client brand guideline that fixes the palette. Thread their hues, do not
  substitute a palette you find more premium.
- A product screenshot or real UI that must be depicted accurately. Render it
  faithfully rather than stylizing it into abstract shapes.
- A regulated industry (finance, health, legal) where aspirational imagery is not
  allowed. Keep claims and visuals literal.
- An existing site whose sections must be matched, not reinvented, so the reference
  slots into what already ships.
- A user who asked for one image, not a six-section set. Honor the count.
- An accessibility contrast requirement. Keep the specified text-to-background
  contrast intact even when the art direction would prefer a moodier treatment.
- A named font or type scale the brand already uses. Reflect it, do not reach for a more dramatic display face.

### When the constraint does not apply

- Admin dashboards, internal tools, and data-dense back-office UI, where clarity and
  density beat cinematic art direction.
- Government, compliance, and legal interfaces, where restraint and legibility are the brief.
- Documentation and reference pages, where structure and scanability outrank atmosphere.
- Any request where the user named a design system to follow. Depict what it
  specifies; do not art-direct around it.

## Reference index

| File | What is in it | When to load |
|---|---|---|
| references/variation-engine.md | Phase 2 art direction: every pick list, option, and constraint for theme, typography, hero, sections, composition anchors, backgrounds, CTAs, components, motion language, spine, and second-read moment | At Phase 2, when committing to picks |
| references/prompt-blueprints.md | The per-section prompt blueprint, the banned-default anti-patterns, and the active baseline configuration dials | At Phase 3, and when setting variance and density |
| references/section-guidance.md | Section-specific jobs and blueprints, plus section sequencing for 6 and 8 section pages | At Phase 3 for per-section prompts, at Phase 4 for order |
| skills/blandaid-core/SKILL.md | Shared quality bar, easing and spatial vocabulary, palette discipline, universal restraint, modes | Whenever a general design principle applies |
| skills/design-humanizer/SKILL.md | The AI-design-tell detector and full slop catalog | At the final gate, run in audit mode over the concepts |
