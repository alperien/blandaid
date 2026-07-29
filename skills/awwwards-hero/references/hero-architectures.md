# Hero architectures

Covers the six hero compositions (A through F) with layout blueprints, the CSS recipes each one needs, and the drift warnings for the two that fail most often. Load this in Phase 2 when picking an architecture, and keep it open through Phase 3 for the composition it dictates.

Pick exactly one. Do not blend two. Commit fully to the one that matches the Hero Extraction from Phase 1.

Each architecture lists what it is best for, the DOM shape it produces, and the constraint that keeps it from collapsing into generic output.

---

## Architecture A: the cinematic center

Best for: dark cinematic agency sites, immersive product launches, atmospheric brand pages.

The heading sits centered in the viewport. A cinematic visual (3D render, product shot, atmospheric photography) fills the background or floats behind and around the text. The CTA is a single centered pill or ghost button below the heading.

```
[viewport container: relative, min-h-[100dvh], overflow-hidden]
  [background visual: absolute inset-0, object-cover or positioned 3D element]
  [content overlay: relative z-10, flex flex-col items-center justify-center text-center]
    [optional eyebrow: small mono label]
    [H1: massive centered, max 2-3 lines]
    [optional subtext: max 20 words, muted color]
    [CTA: single pill button]
```

The background visual uses `position: absolute; inset: 0` with `object-fit: cover` (for images) or centered absolute positioning (for 3D and illustrations). Text sits on top via `position: relative; z-index: 10`. If text readability suffers, add a scrim gradient overlay between the image and text layers (`bg-gradient-to-t from-black/60 via-black/20 to-transparent`).

---

## Architecture B: the asymmetric split

Best for: bold agency homepages, AI and tech product launches, statement brand pages.

Massive heading on one side (usually left, occupying 55 to 65% width). Supporting content (subtext, CTA, or a visual asset) on the other side, vertically offset. The two halves do not align to the same baseline. That is deliberate vertical tension.

```
[viewport container: min-h-[100dvh], grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] items-end lg:items-center gap-8 lg:gap-0]
  [left: H1, massive, left-aligned, takes up most of the width]
  [right: subtext + CTA OR visual asset, vertically offset from the H1 baseline]
```

Use `items-end` on the left column and `items-start` on the right (or the reverse) to create vertical tension. The heading should feel like it anchors the page to one side. On mobile (`< 768px`), collapse to single column, full width.

---

## Architecture C: the full-bleed subject

Best for: athlete and personal brand sites, product photography heroes, editorial fashion or lifestyle.

A full-viewport photograph or 3D render is the hero. Typography is overlaid directly on the image, either at the top-left, bottom-left, or bleeding across the bottom edge. There is no separate text area. The image and text coexist in the same spatial plane.

```
[viewport container: relative, min-h-[100dvh], overflow-hidden]
  [full-bleed image: absolute inset-0, object-cover]
  [gradient scrim: absolute inset-0, bg-gradient-to-t from-black/70 via-transparent to-black/20]
  [content: absolute bottom-0 left-0 p-12 lg:p-20, z-10]
    [H1: massive, white, mix-blend-mode: difference OR on top of scrim]
    [optional CTA]
```

The text must be readable against the photo. Use either a gradient scrim layer or `mix-blend-mode: difference` on the text (which inverts text color against the background). Scrim is safer, blend mode is bolder. On mobile, increase scrim opacity.

---

## Architecture D: the typographic poster

Best for: creative studio portfolios, personal brand statements, typography-led editorial.

Typography is the visual. There is no hero image. The heading itself, at viewport-bleeding scale, is the graphic element. Words may be split across the viewport edges. Different weights, sizes, or italics within the same heading create visual texture.

```
[viewport container: min-h-[100dvh], flex flex-col justify-between p-8 lg:p-16]
  [top: nav or micro-label]
  [center: H1 at viewport-scale (10vw-15vw), possibly split into multiple positioned lines]
  [bottom: CTA or micro-metadata strip]
```

Use `font-size: clamp(4rem, 12vw, 16rem)`. Words can be positioned with `text-align: left` on line 1, `text-align: right` on line 2, creating diagonal visual flow. Mix `font-weight: 900` with `font-weight: 300` or `font-style: italic` within the same heading using `<span>` wrappers.

---

## Architecture E: the inline-image typography

Best for: creative agency hero sections, brand pages with personality, editorial homepages.

Massive typography with small, rounded images embedded between words in the headline. The images sit inline at type-height, acting as visual punctuation. The heading reads as a sentence with tiny photo interruptions.

```
[viewport container: min-h-[100dvh], flex items-center justify-center]
  [H1: massive, contains <span> wrappers for inline images]
    "Build " [inline-image: w-16 h-10 rounded-full object-cover align-middle mx-1] " a quieter, " [inline-image] " smarter AI agency presence."
```

```css
/* BLUEPRINT: Inline hero images
   WHY: The images must match the x-height of the surrounding text.
   They are punctuation, not focal elements. Making them too large
   turns the heading into a gallery instead of a sentence. */
.inline-hero-img {
  display: inline-block;
  width: clamp(3rem, 5vw, 5rem);
  height: clamp(2rem, 3.5vw, 3.5rem);
  border-radius: 9999px;       /* pill shape */
  object-fit: cover;
  vertical-align: middle;
  margin-inline: 0.25em;
}
```

On mobile, the inline images can either scale down with the text or stack below the heading (`hidden md:inline-block`).

---

## Architecture F: the layered depth (z-axis composition)

Best for: portfolio displays, SaaS product demos, multi-project agency sites.

Multiple visual elements (cards, images, UI mockups) are arranged at different depths using CSS `perspective` and `transform: rotateY() rotateX()`. A single element is closest (largest, front-center). Others recede into the background (smaller, rotated, lower opacity). Typography anchors the composition above or below.

```
[viewport container: min-h-[100dvh], relative, perspective: 1200px on parent]
  [card layer: absolute, multiple cards with varying transform: rotateY(Xdeg) translateZ(Ypx)]
    [front card: scale(1), translateZ(0), centered]
    [left card: rotateY(25deg), translateZ(-200px), scale(0.85), opacity-70]
    [right card: rotateY(-25deg), translateZ(-200px), scale(0.85), opacity-70]
  [text layer: relative z-10, positioned below or overlapping the card cluster]
    [H1]
    [CTA]
```

```css
/* BLUEPRINT: Perspective card shelf
   WHY: perspective-origin centers the vanishing point.
   preserve-3d lets child transforms create real depth.
   backface-visibility prevents render flicker on rotation. */
.perspective-container {
  perspective: 1200px;
  perspective-origin: center center;
}
.depth-card {
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  backface-visibility: hidden;
}
```

Drift warning: the top AI failure mode for this architecture is scattering 8 to 10 cards randomly across the screen at random rotations. The layout must have a clear focal card (front-center, full opacity, largest) with 2 to 4 supporting cards receding symmetrically into depth. Think Apple TV app shelf, not a card explosion.
