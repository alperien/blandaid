# Extraction layers

Covers the seven extraction layers of Phase 2: grid, typography, color, spacing, components, atmosphere, and responsive plus interaction inference. Load this after intake passes, before you write any code. Fill every extraction sheet here before moving to the build.

Skipping a layer causes drift. Small errors here compound into "it looks off" in the final build. Run all seven on the reference image, one dimension at a time.

---

## Layer 1: layout grid

Extract the spatial skeleton.

Extraction sheet:

| Property | Measured value |
|---|---|
| Container max-width | e.g. `1280px`, `1440px`, measure by proportion against viewport edges |
| Column system | e.g. `grid-cols-[1.15fr_1fr]`, `grid-cols-3`, `single column centered` |
| Horizontal padding | e.g. `px-6 md:px-12 lg:px-20`, measure the gap between content edge and viewport edge |
| Section heights | `min-h-[100dvh]` for full-viewport, `auto` for content-driven |
| Section spacing | Vertical gap between sections, e.g. `py-24 lg:py-32` |
| Alignment | Per-section: left / center / right / mixed |
| Z-axis layering | Any overlaps? Elements stacked on top of others? |

How to measure proportions from images:
- If the hero heading occupies about 60% of viewport width, on a 1440px target that is roughly `max-w-[54rem]`
- If one column is visually 1.5x wider than the adjacent column, use `grid-cols-[1.5fr_1fr]`
- If empty space above a heading is roughly 2x the heading font size, the padding is approximately `2em` relative to the heading

Drift warning: the most common layout error is getting the container max-width wrong. A design with `max-w-[1200px]` looks noticeably different from one with `max-w-[1440px]`. The whitespace proportions change completely. Measure carefully.

---

## Layer 2: typography

This is the most critical extraction. Wrong typography is the number one reason a replication looks off.

Extraction sheet (fill for every visible text element):

| Element | Font family | Weight | Size | Line-height | Letter-spacing | Transform | Color |
|---|---|---|---|---|---|---|---|
| Nav links | | | | | | | |
| Eyebrow/label | | | | | | | |
| H1 (hero) | | | | | | | |
| H2 (section) | | | | | | | |
| H3 (card title) | | | | | | | |
| Body text | | | | | | | |
| Caption/meta | | | | | | | |
| CTA text | | | | | | | |
| Footer links | | | | | | | |

Font identification, what to look for. Fonts reveal themselves through specific characters. Study these before guessing:

| Check this character | What it tells you |
|---|---|
| Lowercase `a` | Single-story (Geist, Helvetica) vs double-story (Outfit, Satoshi, DM Sans) |
| Lowercase `g` | Open-tail (most sans-serifs) vs closed-tail (Futura, some geometric) |
| Lowercase `t` | Curved crossbar (humanist: Manrope, Jakarta) vs straight (geometric: Outfit, Satoshi) |
| Capital `R` | Straight leg (Geist, Helvetica) vs curved leg (Outfit, Satoshi) |
| Capital `Q` | Tail style varies dramatically between fonts, a strong identifier |
| Lowercase `e` | High crossbar (geometric) vs centered (humanist) |
| Numbers `1, 4, 6, 9` | Highly distinctive shapes across fonts |

Common web font quick-reference:

| Visual character | Strong candidates |
|---|---|
| Geometric, double-story `a`, round counters | Outfit, Satoshi, DM Sans, Plus Jakarta Sans |
| Grotesque, single-story `a`, flat terminals | Geist, Suisse Intl, Helvetica Neue |
| Humanist, open counters, calligraphic stress | Manrope, Plus Jakarta Sans, Nunito Sans |
| Condensed, tall x-height | Barlow Condensed, Oswald, Archivo Narrow |
| Modern serif, high contrast, sharp serifs | Playfair Display, Bodoni Moda |
| Transitional serif, moderate contrast | Lora, Merriweather, Source Serif Pro |
| Display sans, wide, heavy | Cabinet Grotesk, Clash Display, Monument Extended |
| Monospace | JetBrains Mono, Fira Code, IBM Plex Mono, Geist Mono, Space Mono |

If you cannot confidently identify the font, state your top 2 to 3 candidates with the distinguishing character that makes you lean one way. Example: "The double-story 'a' and round 'o' suggest Outfit, but the slightly squared terminals could indicate Satoshi. Defaulting to Outfit, swap by changing `--font-display` if incorrect."

Drift warning: never assume a heading is `font-weight: 700` because headings are bold. Many premium designs use `500` or `600` for headings with a heavier font face. Look at stem thickness relative to the counter space.

---

## Layer 3: color palette

Extract every distinct color. Not "it uses blue". Extract the hex.

Extraction sheet:

| Role | Hex value | Notes |
|---|---|---|
| Background (primary) | | e.g. `#F5F0EB` warm cream, not plain `#FFFFFF` |
| Background (secondary) | | Alternate section BG, card BG |
| Background (dark section) | | If any sections flip to dark |
| Text (primary) | | Heading and body text on primary BG |
| Text (secondary) | | Muted descriptions, metadata |
| Text (tertiary) | | Placeholders, disabled states |
| Accent | | CTAs, active indicators, links |
| Accent (hover) | | Darker or lighter variant on interaction |
| Border | | Card borders, dividers, input borders |
| Shadow | | If tinted, note the hue |

Extracting colors from compressed screenshots. Screenshots compress colors. To get accurate values:
- Sample from the largest flat area of the color, not from edges or JPEG artifacts
- Cross-reference with common web values. If you measure `#0b0b0b`, it is almost certainly `#0a0a0a` (standard off-black). If you measure `#f4f3f1`, it is likely `#f5f4f2` (common warm cream)
- After extracting, verify WCAG AA contrast between text and background colors to confirm the values are reasonable

Drift warning: the difference between `#FFFFFF` (pure white) and `#F5F0EB` (warm cream) completely changes the feel of a page. Do not default to `#FFFFFF` or `#000000` unless the reference genuinely shows pure values. Most premium designs use off-white and off-black.

Contrast note: this layer verifies contrast to confirm the extracted hex is plausible. That is not the same as fixing a contrast failure. If the reference genuinely fails WCAG AA, reproduce it faithfully and flag it. See the accessibility signal in SKILL.md restraint.

---

## Layer 4: spacing system

Spacing is what separates "looks close" from "looks identical".

Extraction sheet:

| Measurement | Value | How to verify |
|---|---|---|
| Base unit | `4px` or `8px` | Measure the smallest repeated gap |
| Button padding (H) | e.g. `24px` / `px-6` | Horizontal space between text edge and button edge |
| Button padding (V) | e.g. `12px` / `py-3` | Vertical space |
| Card internal padding | e.g. `32px` / `p-8` | Space from card edge to card content |
| Grid gap | e.g. `24px` / `gap-6` | Space between cards or columns |
| Heading to subtext | e.g. `16px` / `mt-4` | Gap between heading baseline and subtext top |
| Subtext to CTA | e.g. `32px` / `mt-8` | Gap between subtext and button |
| Section padding (top) | e.g. `96px` / `pt-24` | Space from section top to first element |
| Section padding (bottom) | e.g. `128px` / `pb-32` | Space from last element to section bottom |
| Nav height | e.g. `64px` / `h-16` | Total nav bar height |
| Nav link gap | e.g. `32px` / `gap-8` | Space between nav links |

Drift warning: top and bottom section padding are often not equal. Many designs use more bottom padding than top (or the reverse) for optical balance. Do not assume `py-24` when the reference shows `pt-20 pb-28`. Measure each side independently.

---

## Layer 5: component inventory

Catalog every distinct UI component visible in the image.

For each component, fill in:

| Component | Shape (radius) | Border | Shadow | Background | States visible | Icon style |
|---|---|---|---|---|---|---|
| Primary button | | | | | | |
| Secondary button | | | | | | |
| Card | | | | | | |
| Input field | | | | | | |
| Badge/pill | | | | | | |
| Avatar | | | | | | |
| Navigation | | | | | | |
| Divider | | | | | | |

Border-radius consistency check. Most designs commit to one radius language. Check whether the design uses:
- Sharp, `0px` everywhere (brutalist, editorial)
- Subtle, `4-8px` everywhere (SaaS, product)
- Rounded, `12-16px` everywhere (modern, friendly)
- Pill, `9999px` on buttons and rounded on cards (premium, polished)
- Mixed, different radii for different components (verify each one)

Drift warning: if buttons are pill-shaped (`rounded-full`) in the reference, they cannot be `rounded-lg` in the code. Radius mismatches are immediately visible. The eye detects them faster than color or spacing errors.

If a component matches a known library (shadcn/ui, Radix, Material), note it here and route to the library decision in assets-and-edge-cases.md rather than reimplementing it blind.

---

## Layer 6: atmosphere and texture

Extract the subtle details that make a design feel alive rather than flat.

Extraction sheet:

| Property | Present? | Details |
|---|---|---|
| Noise/grain overlay | yes/no | Opacity level (typically `0.03-0.06`) |
| Radial ambient glow | yes/no | Position, color, spread |
| Frosted glass (backdrop-blur) | yes/no | On what elements, blur amount |
| Gradient backgrounds | yes/no | Direction, stops, colors |
| Tinted shadows | yes/no | Shadow hue if colored, not plain black |
| Image overlays/scrims | yes/no | Gradient direction, opacity |
| Background images/patterns | yes/no | Subtle texture, dots, lines |
| Depth/layering feel | flat / subtle / heavy | Overall shadow usage |

Record what the reference shows, nothing more. An atmosphere effect you cannot see in the reference does not go in the sheet, and it does not go in the build.

---

## Layer 7: responsive cues and interaction inference

Even from a static image, extract clues about behavior.

Extraction sheet:

| Signal | Inference |
|---|---|
| Multi-column layout | Will collapse to single column below 768px |
| Horizontal nav bar | Will need mobile menu below 768px |
| Sticky-looking nav | `position: fixed; top: 0` with backdrop-blur likely |
| Elements positioned as if just landed | Entry animation implied (fade-up with stagger) |
| Buttons with visual depth | Lift on hover (`translateY(-1px)`, shadow increase) |
| Cards with borders | Border color change or subtle background shift on hover |
| Dot indicators near images | Carousel/slider component |
| Active/selected tab styling | Tab component with state management |
| Form inputs visible | Focus ring, validation states needed |

Inference is not invention. A signal you can point to in the image (a dot row, a fixed-looking bar) earns an inference. A behavior with no visual trace does not. When a single desktop screenshot is all you have, mobile behavior is inferred from layout structure, and you say so in the delivery.
