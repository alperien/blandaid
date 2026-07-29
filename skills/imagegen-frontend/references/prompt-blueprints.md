# Prompt blueprints and baseline configuration

Covers the per-section prompt blueprint, the banned-default anti-patterns, and the active baseline dials that calibrate output. Load this in Phase 3 when you are turning Phase 2 picks into generation-ready prompts, and whenever you need the default variance and density settings.

Each section gets its own structured prompt built from the Phase 2 picks. This is where art direction becomes generation-ready instructions.

---

## The prompt blueprint

Every section prompt follows this structure. Fill in every field. Skipping fields produces generic output.

```
PROMPT BLUEPRINT. Section [N] of [Total]: [Section Name]
--------------------------------------------------------

FRAME:
  Format: horizontal website section, 16:9 aspect ratio
  Viewport: 1440x900 desktop browser frame
  Render style: [photorealistic UI mockup / flat design comp / editorial layout]

COMPOSITION:
  Anchor: [from Phase 2, e.g. "centered statement" or "bottom-left over background"]
  Visual weight: [where the eye lands first, e.g. "center-left, massive heading"]
  Reading flow: [how the eye moves, e.g. "heading, then subtext, then CTA, then background visual"]

TYPOGRAPHY:
  Heading: [exact description, e.g. "massive compressed sans-serif, all-caps,
            approximately 80pt equivalent, tight letter-spacing, 2 lines max"]
  Subtext: [e.g. "16pt equivalent, regular weight, muted color, max 20 words,
            1.5 line-height"]
  Eyebrow: [e.g. "11pt monospace, uppercase, wide letter-spacing, muted opacity"]
  CTA text: [e.g. "14pt, medium weight, uppercase, inside pill button"]

PALETTE:
  Background: [exact description, e.g. "#0a0a0a deep charcoal with subtle
               radial glow from center"]
  Text primary: [e.g. "#f5f5f5 warm off-white"]
  Text secondary: [e.g. "rgba(255,255,255,0.5) muted"]
  Accent: [e.g. "#E8A04A warm amber, used on CTA only"]

BACKGROUND MODE:
  [from Phase 2, e.g. "full-bleed cinematic photograph of server rack room,
   cool blue-teal color grade, 40% dark overlay for text readability"]

CTA:
  Style: [from Phase 2, e.g. "solid pill, amber background, dark text"]
  Placement: [e.g. "centered below subtext, 32px gap"]
  Count: [1, never more in a hero]

ATMOSPHERE:
  [e.g. "subtle film grain overlay at 3% opacity, soft radial ambient glow
   from top-center, no hard shadows"]

CONTENT (placeholder text):
  Eyebrow: [e.g. "INFRASTRUCTURE"]
  Heading: [e.g. "Build without limits."]
  Subtext: [e.g. "The platform for teams who ship fast."]
  CTA: [e.g. "Get started"]

WHAT THIS IS NOT:
  [Explicit anti-patterns, e.g. "NOT a generic dark hero with purple AI glow.
   NOT a dashboard screenshot. NOT centered text over a gradient blob."]

MOTION IMPLIED:
  [from Phase 2, e.g. "staggered float-up energy: the heading, subtext, and
   CTA sit at slightly different vertical offsets as if mid-cascade"]
```

## Prompt anti-patterns (the banned defaults)

These are the patterns AI image generation collapses into. Every prompt must state what the image is NOT, to counteract model defaults. The design-humanizer skill owns the full slop catalog; the table below is the prompt-side subset you apply while writing generation instructions. See skills/design-humanizer/SKILL.md for the complete list.

| Banned pattern | Why it is banned | What to say instead |
|---|---|---|
| Purple or blue AI gradient hero | Every AI-generated "tech" image defaults to this. It reads as generated on sight. | Specify the exact palette from Phase 2. Add "no purple, no blue gradient backgrounds." |
| Floating translucent blobs | The model's version of atmosphere: meaningless glass orbs floating in space. | Specify concrete atmosphere: grain, radial glow, tonal gradient, or photographic background. |
| Generic dashboard card grid | The model reaches for 6 to 8 identical cards with line charts. | Specify the exact component from Phase 2's signature set. Describe its geometry. |
| Centered text over gradient | Safe, generic, says nothing about the brand. | Specify the exact composition anchor from Phase 2. Force an asymmetric or editorial layout. |
| Beige serif on cream read as luxury | The model's entire luxury vocabulary reduces to this. | Specify the real luxury signals: restrained spacing, tactile texture, considered type weight. |
| Messy and unreadable read as creative | Chaos is not creativity. | Specify structured asymmetry: deliberate off-grid placement with a clear reading order. |
| Tiny illegible text | The model generates decorative text no one can read. | Specify minimum type scale: heading legible and dominant, minimum 60pt equivalent. |
| Identical section layouts | Every section lands on the same split and proportion. | Apply the composition anchor assignments from Phase 2. Each section gets a different anchor. |
| Stock photo energy | Generic business people shaking hands, laptop on a desk. | Specify the photographic direction: subject, color grade, mood, crop style. |

Drift warning: the single most useful thing you can add to any prompt is the WHAT THIS IS NOT section. Models respond to negative constraints as strongly as positive ones. Naming "NOT a purple gradient hero, NOT floating blobs, NOT a generic dashboard" removes most default output.

---

## Active baseline configuration

These are the global default dials. They calibrate the engine's output toward premium, conversion-aware, implementation-friendly design references.

```
DESIGN_VARIANCE:        8   (1=rigid/symmetrical, 10=artsy/asymmetric)
VISUAL_DENSITY:         4   (1=airy/gallery-like, 10=packed/intense)
ART_DIRECTION:          8   (1=safe commercial, 10=bold creative statement)
IMPLEMENTATION_CLARITY: 9   (1=loose moodboard, 10=very codeable UI reference)
IMAGE_USAGE_PRIORITY:   9   (1=mostly typographic, 10=strongly image-led)
SPACING_GENEROSITY:     8   (1=compact/tight, 10=very spacious/breathable)
LAYOUT_VARIATION:       8   (1=same anchor repeats, 10=bold composition variety)
CONVERSION_DISCIPLINE:  8   (1=pure art moodboard, 10=clear funnel plus design balance)
```

These are defaults. Adapt from the brief:
- "Clean" reduces density, increases spacing generosity.
- "Crazy creative" increases variance and art direction.
- "Premium SaaS" keeps clarity high, art direction controlled.
- "Editorial" allows stronger type and more asymmetry.
- The user's brief always overrides defaults.
