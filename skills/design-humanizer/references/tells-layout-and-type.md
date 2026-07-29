# Tells 1 to 12: layout and typography

Load this when auditing composition, hierarchy, grid, or type. Each entry names
the pattern, explains the mechanism, and shows the default next to the fix.

Read "What not to flag" in `SKILL.md` before acting on anything here.

---

## Layout

### 1. The centered stack

**Reject:** Every element on the page centered on a single vertical axis, with no
element breaking left or right.
**Why:** Centering is the safe default when no compositional decision has been
made. It produces a page with no tension and no reading path. One centered
section is a choice. Six in a row is an absence of choices.

Bad:
```html
<section class="flex flex-col items-center text-center">
  <h1>Ship faster</h1>
  <p>The platform for modern teams.</p>
  <button>Get started</button>
</section>
```

Good:
```html
<section class="grid grid-cols-12 items-end gap-6">
  <h1 class="col-span-7">Ship faster</h1>
  <div class="col-start-9 col-span-3 pb-3">
    <p>The platform for modern teams.</p>
    <button>Get started</button>
  </div>
</section>
```

Severity: HIGH when it runs page-wide. LOW for a single hero on a short page.

---

### 2. The uniform three-column grid

**Reject:** Content forced into three equal columns because three is the default
count, when the items are not peers.
**Why:** Models reach for three because it fills a row and reads as complete. The
failure is applying it to content with unequal weight, so a primary feature and a
footnote get the same visual authority.

Bad:
```html
<div class="grid grid-cols-3 gap-8">
  <Feature title="Realtime sync" />
  <Feature title="SSO" />
  <Feature title="Dark mode" />
</div>
```

Good:
```html
<div class="grid grid-cols-6 gap-8">
  <Feature title="Realtime sync" class="col-span-4 row-span-2" size="lg" />
  <Feature title="SSO" class="col-span-2" size="sm" />
  <Feature title="Dark mode" class="col-span-2" size="sm" />
</div>
```

A three-column grid is correct when the items genuinely are peers, such as three
pricing tiers. Weight the grid to match the content's actual hierarchy.

Severity: MEDIUM.

---

### 3. Container as the only spatial idea

**Reject:** `max-w-7xl mx-auto px-4` wrapped around every section, with no
full-bleed element, no asymmetric inset, and no variation in gutter.
**Why:** A single container width applied uniformly makes every section the same
shape. The page becomes one column of boxes. Real layouts alternate contained and
full-bleed content to create rhythm.

Bad:
```html
<section class="max-w-7xl mx-auto px-4">...</section>
<section class="max-w-7xl mx-auto px-4">...</section>
<section class="max-w-7xl mx-auto px-4">...</section>
```

Good:
```html
<section class="max-w-7xl mx-auto px-4">...</section>
<section class="w-full">                       <!-- full bleed image band -->
  <img class="w-full h-[70vh] object-cover" />
</section>
<section class="max-w-3xl ml-[12vw] pr-4">...</section>  <!-- narrow, offset -->
```

Severity: MEDIUM.

---

### 4. Equal-weight sections

**Reject:** Every section given the same vertical padding, the same heading size,
and the same internal structure, so nothing is more important than anything else.
**Why:** A page is an argument with a shape. When every section is weighted
identically, the viewer gets no signal about what matters and scrolls past all of
it at the same speed.

Bad:
```css
section { padding-block: 6rem; }
section h2 { font-size: 2.25rem; }
```

Good:
```css
section { padding-block: clamp(4rem, 8vw, 7rem); }
section[data-weight="major"] { padding-block: clamp(9rem, 18vw, 16rem); }
section h2 { font-size: clamp(1.75rem, 3vw, 2.5rem); }
section[data-weight="major"] h2 { font-size: clamp(3rem, 7vw, 6rem); }
```

Severity: MEDIUM.

---

### 5. The symmetric hero

**Reject:** Centered headline, centered subheading one size down, two buttons
side by side, optional centered image below.
**Why:** This is the single most reproduced layout in the training set. It is not
wrong, it is invisible. A viewer has seen it several thousand times and their eye
slides off it.

Bad:
```html
<div class="text-center max-w-3xl mx-auto py-24">
  <h1 class="text-5xl font-bold">Build better products</h1>
  <p class="text-xl text-gray-600 mt-4">Everything your team needs.</p>
  <div class="flex gap-4 justify-center mt-8">
    <button>Get started</button><button>Learn more</button>
  </div>
</div>
```

Good:
```html
<div class="min-h-[88svh] grid grid-rows-[1fr_auto] py-16">
  <h1 class="text-[clamp(3.5rem,13vw,12rem)] leading-[0.85] tracking-tight self-end">
    Build better<br /><span class="italic font-light">products</span>
  </h1>
  <div class="flex items-end justify-between border-t pt-6">
    <p class="max-w-[38ch]">Everything your team needs.</p>
    <button class="shrink-0">Get started</button>
  </div>
</div>
```

Note the single call to action. Two equally weighted buttons split attention and
usually mean the primary action was never chosen.

Severity: HIGH.

---

### 6. Identical card heights

**Reject:** A grid where every card has a fixed equal height, identical internal
structure, and content padded or truncated to fit.
**Why:** Equal heights are a symptom of content being fitted to a container
instead of a container being built for content. The giveaway is a card with two
words of body copy occupying the same box as one with four lines.

Bad:
```css
.card { height: 320px; display: flex; flex-direction: column; }
.card p { overflow: hidden; text-overflow: ellipsis; }
```

Good:
```css
.grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 1.5rem;
        grid-auto-flow: dense; }
.card { grid-column: span 4; }
.card[data-featured] { grid-column: span 7; grid-row: span 2; }
.card[data-compact] { grid-column: span 5; }
```

A uniform grid is correct for a product listing where items are true peers.
Reject it where the content varies in importance.

Severity: LOW to MEDIUM.

---

## Typography

### 7. The safe type scale

**Reject:** A scale where the largest type is roughly twice the body size.
16px body with a 32px or 36px h1.
**Why:** Models cluster near a 2:1 ratio because it is safe at every viewport.
The result reads flat. Print and award-winning web work routinely run 6:1 or
higher. See "The quality bar" in `skills/blandaid-core/SKILL.md`.

Bad:
```css
h1 { font-size: 2.25rem; }  /* 36px */
p  { font-size: 1rem; }     /* 16px, ratio 2.25:1 */
```

Good:
```css
h1 { font-size: clamp(3rem, 9vw, 8rem); }  /* up to 128px */
p  { font-size: 1rem; }                    /* ratio 8:1 at desktop */
```

Dense interfaces are exempt. A dashboard does not need a 128px heading. Apply
this to expressive pages.

Severity: MEDIUM, HIGH on a marketing or brand page.

---

### 8. Default font stack with no reason

**Reject:** `Inter`, `Roboto`, `system-ui` or the Tailwind default stack used
because it was there, with no second typeface and no stated rationale.
**Why:** A single neutral sans across an entire page is the typographic
equivalent of speaking in a monotone. The tell is not the typeface, it is the
absence of a pairing or a reason.

Bad:
```css
body, h1, h2, h3 { font-family: Inter, system-ui, sans-serif; }
```

Good:
```css
:root {
  --font-display: "Instrument Serif", Georgia, serif;
  --font-body: "Inter", system-ui, sans-serif;
}
h1, h2 { font-family: var(--font-display); font-weight: 400; }
body   { font-family: var(--font-body); }
```

Inter alone is a legitimate choice for a developer tool or a dense interface. Ask
before changing it. This is a common false positive.

Severity: MEDIUM.

---

### 9. Gradient text

**Reject:** `background-clip: text` with a multi-hue gradient on a headline.
**Why:** It was a distinctive treatment in 2021 and is now a period marker. It
also weakens legibility and usually fails contrast checks against the background
at one end of the ramp.

Bad:
```css
h1 {
  background: linear-gradient(to right, #8B5CF6, #EC4899);
  -webkit-background-clip: text;
  color: transparent;
}
```

Good:
```css
h1 { color: var(--fg); }
h1 em { font-style: italic; font-weight: 300; color: var(--accent); }
```

If a brand genuinely uses a gradient wordmark, that is calibration, not a tell.

Severity: MEDIUM, HIGH when it fails contrast.

---

### 10. Uniform font weight

**Reject:** The whole page at 400 and 600, or everything bold, with no use of the
family's actual range.
**Why:** Weight is the cheapest hierarchy tool available and generated pages
leave it unused. Variable fonts ship 100 to 900 and most output touches two
values.

Bad:
```css
h1, h2, h3 { font-weight: 600; }
p, li, span { font-weight: 400; }
```

Good:
```css
h1 { font-weight: 300; letter-spacing: -0.03em; }  /* large size carries it */
h2 { font-weight: 500; }
.eyebrow { font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; }
p { font-weight: 400; }
.caption { font-weight: 350; opacity: 0.7; }
```

Large type usually wants less weight, not more. A 128px heading at 700 is a wall.

Severity: LOW to MEDIUM.

---

### 11. Title Case everywhere

**Reject:** Every Heading Capitalized Like This, including sub-headings, buttons,
and navigation items.
**Why:** Mechanical title casing across all levels is a machine habit. Editorial
practice uses sentence case for most headings and reserves title case for proper
titles.

Bad:
```html
<h2>Powerful Features For Growing Teams</h2>
<button>Start Your Free Trial</button>
```

Good:
```html
<h2>Features for growing teams</h2>
<button>Start free trial</button>
```

Severity: LOW.

---

### 12. Unbounded measure

**Reject:** Body copy that spans the full container width, producing lines of 120
characters or more.
**Why:** Reading comfort drops sharply past about 75 characters because the eye
loses the line on return. This is one of the few typographic rules with actual
research behind it, and generated layouts break it constantly by letting text
inherit the container.

Bad:
```html
<div class="max-w-7xl mx-auto">
  <p>Long paragraph spanning 1280px, roughly 160 characters per line.</p>
</div>
```

Good:
```html
<div class="max-w-7xl mx-auto">
  <p class="max-w-[68ch]">Long paragraph, held to a readable measure.</p>
</div>
```

Use `ch`, not percentages. `ch` tracks the font, so the measure holds when the
typeface changes.

Severity: MEDIUM.
