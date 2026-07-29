# Assets and edge cases

Covers artistic assets (photos, illustrations, textures) that CSS cannot reproduce, plus the edge cases: unidentifiable fonts, low-resolution references, non-reproducible content, multiple images, and recognized component libraries. Load this when the reference contains anything CSS cannot draw, or when an edge case in the list below applies.

---

## Handling artistic assets

CSS reproduces layout, typography, colors, and geometric shapes. It cannot reproduce photographs, hand-drawn illustrations, organic brush strokes, marble textures, or painterly effects. This is the number one source of drift between reference and output.

### Classify every visual element in the reference

Walk through the reference and tag each visual element:

| Element type | Can CSS reproduce it? | What to do instead |
|---|---|---|
| Solid color blocks | Yes | Use exact hex from extraction |
| Linear/radial gradients | Yes | Match direction, stops, and colors |
| Geometric shapes (circles, rectangles, lines) | Yes | Use CSS shapes or simple SVG |
| Icons (outlined/filled) | Yes | Use an icon library or inline SVG |
| Photographs | No | Generate a mood-matched image or use `picsum.photos/seed/{keyword}/{w}/{h}` |
| Hand-drawn illustrations | No | Generate a matching illustration with the image-generation tool |
| Organic brush strokes / paint textures | No | Generate as an image asset. Do not approximate with CSS gradients |
| Marble / fluid / organic textures | No | Generate as an image asset or use a high-quality stock match |
| 3D renders | No | Generate a matching render or use a placeholder with similar lighting and angle |
| Abstract art / mixed media | No | Generate, describing the exact style, colors, and composition |

### When the reference contains photographs

1. First choice: generate a photograph that matches the mood, color palette, subject, and composition of the reference.
2. Second choice: use `picsum.photos/seed/{descriptive-keyword}/{w}/{h}` with a keyword that matches the content, e.g. `picsum.photos/seed/ocean-waves/800/600` for ocean imagery.
3. Never: use a CSS gradient, striped pattern, or solid color block as a stand-in for a photograph. This is the most visible form of drift.

### When the reference contains illustrations or brush strokes

1. First choice: generate the asset with a detailed prompt describing the illustration style, colors, stroke quality, and composition. Include the mood, e.g. "organic hand-painted pink brush stroke with visible texture, diagonal across white background, coral and hot-pink color, expressive abstract art".
2. Second choice: if generation is not available, find a stock illustration with matching style and color.
3. Never: approximate organic, hand-drawn artwork with CSS gradients or geometric shapes. A diagonal CSS gradient is not a brush stroke. A CSS `border-radius` blob is not an organic shape. The eye detects the difference instantly.

### When the reference contains textured surfaces

Marble, wood grain, concrete, fabric, water, clouds. These need real image assets.

1. Generate the texture, describing the specific surface.
2. Apply as a `background-image` with appropriate `background-size`, `object-fit`, and positioning.
3. Match the scale. A zoomed-in marble texture looks different from a zoomed-out one.

### Asset sizing and positioning

When placing generated image assets into the layout:

```css
/* BLUEPRINT: Image asset inside a card or container
   WHY: object-fit:cover ensures the image fills the space
   without distortion. object-position lets you align the
   focal point of the image to match the reference. */
.asset-container {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-card); /* match card radius */
}
.asset-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center; /* adjust to match reference focal point */
}
```

Drift warning: this is the most common replication failure. When the model cannot reproduce an artistic element, it substitutes a CSS pattern (stripes, gradients, solid blocks). This always looks wrong because geometric CSS patterns have a fundamentally different visual quality than photographs or hand-drawn art. Generate an image asset instead. Even an imperfect generated image is closer to the reference than a CSS approximation.

---

## Edge cases

### When you cannot identify the font

1. State your top 2 to 3 candidates with the distinguishing character that makes you lean one way.
2. Suggest the user inspect the live site via DevTools, Computed Styles, `font-family`.
3. Default to the closest Google Font match.
4. Structure your CSS so the font can be swapped by changing a single `--font-display` variable.

If the reference uses a licensed or paid font the user cannot ship, that is a preserve-and-flag case, not a silent substitution. See the licensed-font signal in SKILL.md restraint.

### When the reference is low resolution

1. Extract what you can confidently determine (layout, palette, general typography).
2. Flag uncertain measurements explicitly.
3. Ask for a higher-res image or a URL to the live site.
4. Do not invent sub-pixel details from a blurry screenshot. Inferring detail the image does not contain is inventing facts. See the low-resolution signal in SKILL.md restraint.

### When the reference shows content you cannot reproduce

Some references show dynamic content (live chat, real user avatars, real-time data):

1. Reproduce the visual appearance with static placeholder data.
2. Use realistic content: real-sounding names, organic numbers, not "John Doe" or "99.99%".
3. Note which elements are placeholder in your delivery.

For artistic content (photographs, illustrations, textures), see "Handling artistic assets" above. Never approximate with CSS. Generate or source a real image.

### When multiple reference images are provided

1. Run the full extraction on each image independently.
2. Confirm the design system is consistent across images (same fonts, colors, components).
3. If inconsistencies exist, ask the user which image is authoritative.
4. Desktop and mobile pairs: use desktop for the design system, mobile for responsive breakpoints.

### When the reference uses a recognizable component library

If you spot shadcn/ui, Radix, Material, or another library:

1. State which library you believe is in use.
2. Ask if the user wants the library or manual reproduction.
3. If using the library: install it properly and theme it to match.
4. If reproducing manually: match the visual output without the dependency.

Installing the real component is usually better than reimplementing it from a screenshot: you inherit the library's accessibility behavior, focus management, and edge-case handling that a static image never shows. This is the library signal in SKILL.md restraint.
