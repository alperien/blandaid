# Section-specific guidance and sequencing

Covers what each section type must do in the conversion flow and the order to generate sections in. Load this in Phase 3 when writing per-section prompts, and in Phase 4 when deciding the generation sequence.

Different sections have different jobs. Use these section blueprints so each section serves its purpose. Every section maps to a conversion stage, and the page reads as a persuasion sequence rather than a set of pretty frames.

---

## Section: hero

```
PURPOSE: Hook. The first thing the user sees. Must create an instant
         emotional response and communicate the brand's energy in under 3 seconds.

MUST HAVE:
  - ONE dominant focal point (massive heading OR cinematic image, not both competing)
  - Brand name or product name visible
  - Single CTA (never two)
  - Breathing room. The hero must NOT feel packed.

MUST NOT HAVE:
  - Trust logos or "used by" badges (save for trust bar)
  - Feature lists or bullet points
  - Multiple competing CTAs
  - Scroll indicators or bouncing chevrons
  - Version labels (v2.0, BETA) unless the brief is literally a product launch

PROMPT ADDITION:
  "This is a website hero section, the first viewport a user sees.
   It must feel premium, confident, and immediately communicate the brand.
   One focal point dominates. Generous whitespace. No clutter."
```

## Section: trust bar

```
PURPOSE: Proof. Immediately after the hero, establish credibility.

MUST HAVE:
  - Logo strip OR metric strip OR testimonial quote
  - Muted, understated styling (this section supports, does not compete with hero)
  - Visually lighter than surrounding sections

PROMPT ADDITION:
  "This is a trust and social-proof bar. It should be visually quiet and
   supportive, a thin horizontal strip of logos or a single powerful
   metric. Not a full section, more like a divider with authority."
```

## Section: features and benefits

```
PURPOSE: Interest. Show what the product does and why it matters.

MUST HAVE:
  - Clear visual hierarchy (section heading, then feature items)
  - Distinct feature blocks (cards, columns, or bento cells)
  - Icons or micro-illustrations per feature, beyond text alone

MUST NOT HAVE:
  - More than 6 feature items visible (3 to 4 is stronger)
  - Identical card layouts without visual variation
  - "FEATURE 01", "FEATURE 02" meta-labels

PROMPT ADDITION:
  "This is a features and benefits section. Each feature should be
   visually distinct with an icon or illustration. Cards should
   NOT all look identical. Hierarchy: section heading first, then
   feature grid below."
```

## Section: social proof and testimonials

```
PURPOSE: Desire. Make the user want what others already have.

MUST HAVE:
  - Real-looking names and avatar-style photos
  - Quote text that feels authentic (not marketing copy)
  - Company and role attribution

PROMPT ADDITION:
  "This is a testimonial section. Show 1 to 3 quotes with avatar photos,
   names, and company roles. The quotes should feel human and authentic.
   Layout should feel editorial, not like a review aggregator."
```

## Section: CTA and conversion

```
PURPOSE: Action. The final push. High contrast, unmistakable action.

MUST HAVE:
  - High-contrast background (inverted from the page's dominant mode)
  - Single, dominant CTA button
  - Short, punchy heading (3 to 7 words)
  - Minimal supporting text

PROMPT ADDITION:
  "This is the final conversion section. It should feel like a
   decisive endpoint: high contrast, bold heading, unmistakable
   CTA button. If the page is light, this section goes dark (or
   uses the accent color as background). Maximum confidence."
```

## Section: footer

```
PURPOSE: Navigation plus trust. The page's foundation.

MUST HAVE:
  - Logo
  - Link columns (Product, Company, Resources, Legal)
  - Muted, structured, visually quiet
  - Copyright line

PROMPT ADDITION:
  "This is a website footer. Clean, organized link columns with
   a logo. Visually understated, it anchors the page without
   competing for attention. Dark or muted background."
```

---

## Section sequencing

For a default landing page (6 sections), generate in this order:

```
Section 1: Hero          [Hook]
Section 2: Trust Bar     [Proof]
Section 3: Features      [Interest]
Section 4: How It Works  [Education]
Section 5: Testimonials  [Desire]
Section 6: CTA + Footer  [Action]
```

For a full website template (8 sections):

```
Section 1: Hero          [Hook]
Section 2: Trust Bar     [Proof]
Section 3: Features      [Interest]
Section 4: How It Works  [Education]
Section 5: Demo           [Demonstration]
Section 6: Testimonials  [Desire]
Section 7: Pricing       [Decision]
Section 8: CTA + Footer  [Action]
```

Each section maps to a conversion stage. The sequence follows AIDA (attention, interest, desire, action) with proof and education layers inserted for credibility.
