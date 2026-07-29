# Tells 13 to 24: color and components

Load this when auditing palette, surfaces, cards, badges, or iconography.

Read "What not to flag" in `SKILL.md` first. A supplied brand system outranks
every entry below.

---

## Color

### 13. The unearned gradient

**Reject:** A violet to pink or blue to purple linear gradient used as a hero
background, button fill, or heading treatment, with no source in the brand.
**Why:** This specific ramp is the most reproduced color decision in generated
interfaces. It appears because it is the mean of a large training set, not
because it fits the product. The tell is the lack of provenance, not the gradient
form.

Bad:
```css
.hero { background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%); }
.cta  { background: linear-gradient(to right, #8B5CF6, #EC4899); }
```

Good:
```css
/* One flat surface, one accent, both traceable to the brand */
.hero { background: #0E0E10; }
.cta  { background: #E8FF4D; color: #0E0E10; }
```

If a gradient is right for the work, earn it: two stops of the same hue at
different lightness, or a subtle mesh derived from a photograph in the design.

Severity: HIGH.

---

### 14. Pure black on pure white

**Reject:** `#000000` text on `#FFFFFF`, or `#FFFFFF` on `#000000`.
**Why:** Pure values are the framework default and appear almost nowhere in
considered design. Maximum contrast causes halation on light backgrounds and
makes dark backgrounds feel like a void. Off-values with a consistent temperature
bias read as intentional.

Bad:
```css
:root { --bg: #FFFFFF; --fg: #000000; }
```

Good:
```css
/* Warm bias */
:root { --bg: #FAF8F5; --fg: #14110E; }

/* Cool bias */
:root { --bg: #F7F8FA; --fg: #0D1117; }
```

Pure black is correct for OLED power saving and for print-oriented work. Those
are reasons. Defaulting is not.

Severity: MEDIUM.

---

### 15. Framework default palette

**Reject:** Tailwind's `gray-100`, `gray-900`, `blue-500`, `indigo-600` or
Bootstrap's `$primary` used untouched across the interface.
**Why:** These values are recognizable on sight to anyone who has seen the
framework. Using them unmodified signals that the palette step was skipped.

Bad:
```html
<div class="bg-gray-100 text-gray-900">
  <button class="bg-blue-500 hover:bg-blue-600">Submit</button>
</div>
```

Good:
```js
// tailwind.config.js
theme: { extend: { colors: {
  surface: "#F4F1EC",
  ink:     "#191614",
  accent:  "#2F5D4F",
}}}
```
```html
<div class="bg-surface text-ink">
  <button class="bg-accent hover:bg-accent/90">Submit</button>
</div>
```

Check the config before flagging. A team may have mapped their brand onto the
default scale names, which is fine.

Severity: MEDIUM.

---

### 16. Accent applied to everything

**Reject:** The accent color on every button, link, icon, badge, border and
active state.
**Why:** An accent works by being scarce. Applied everywhere it becomes the
body color and the interface loses its emphasis mechanism. Target is under 10
percent of visible surface.

Bad:
```css
a, .btn, .badge, .icon, .tab-active, .border-highlight { color: var(--accent); }
```

Good:
```css
.btn-primary { background: var(--accent); }   /* one per view */
a            { color: inherit; text-decoration: underline;
               text-underline-offset: 0.2em; }
.icon        { color: var(--fg); opacity: 0.6; }
.badge       { background: var(--fg); color: var(--bg); }
```

Severity: MEDIUM.

---

### 17. Dark mode as inverted light mode

**Reject:** A dark theme produced by swapping the background and foreground
tokens, leaving shadows, borders and image treatments unchanged.
**Why:** Dark interfaces need different rules. Shadows do not read on dark
surfaces, so elevation must come from lighter fills. Saturated colors vibrate
against dark backgrounds and need desaturating. Pure inversion produces glowing
borders and invisible depth.

Bad:
```css
.dark { --bg: #000000; --fg: #FFFFFF; }
.card { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }  /* invisible on dark */
```

Good:
```css
.dark {
  --bg: #0E1013;
  --fg: #E8E6E3;
  --surface-1: #16191E;   /* elevation via lighter fill */
  --surface-2: #1E232A;
  --accent: #7FD1AE;      /* desaturated from the light-mode accent */
}
.dark .card { background: var(--surface-1); box-shadow: none;
              border: 1px solid rgb(255 255 255 / 0.06); }
```

Severity: MEDIUM, HIGH when contrast breaks.

---

## Components

### 18. The glassmorphic centered card

**Reject:** `backdrop-filter: blur()` on a translucent white card with a 1px
semi-transparent border, centered over a gradient.
**Why:** This combination is a period marker and it usually arrives together with
tell 13. It also costs real performance, since `backdrop-filter` forces a new
compositing layer, and the low-contrast border commonly fails accessibility
checks.

Bad:
```css
.card {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 16px;
}
```

Good:
```css
.card {
  background: var(--surface-1);
  border: 1px solid var(--fg);      /* full-strength hairline */
  border-radius: 2px;
}
```

Glass is legitimate over real photography where the blur does visible work.
Over a flat gradient it is decoration.

Severity: HIGH.

---

### 19. Shadow on everything

**Reject:** `box-shadow` applied to every card, button, input and container at
the same depth.
**Why:** Shadow encodes elevation. When everything is elevated, nothing is, and
the page reads as a pile of floating rectangles. Framework defaults such as
`shadow-md` make this the path of least resistance.

Bad:
```html
<div class="shadow-md"><div class="shadow-md">
  <button class="shadow-md">Save</button>
</div></div>
```

Good:
```css
/* Flat by default. Elevation reserved for things that actually float. */
.card  { border: 1px solid var(--hairline); }
.modal { box-shadow: 0 24px 64px -12px rgb(0 0 0 / 0.24); }
.menu  { box-shadow: 0 8px 24px -8px rgb(0 0 0 / 0.16); }
```

Severity: LOW to MEDIUM.

---

### 20. Uniform border radius

**Reject:** The same radius on every element regardless of size, typically
`rounded-lg` or 8px on buttons, cards, images, inputs and modals alike.
**Why:** Radius should scale with the element. An 8px radius on a 40px button and
on a 600px panel are visually different curvatures. Uniform radius is the
signature of a value picked once and never revisited.

Bad:
```css
.btn, .card, .input, .modal, img { border-radius: 8px; }
```

Good:
```css
:root { --r-sm: 4px; --r-md: 10px; --r-lg: 20px; }
.btn   { border-radius: var(--r-sm); }
.input { border-radius: var(--r-sm); }
.card  { border-radius: var(--r-md); }
.modal { border-radius: var(--r-lg); }
img    { border-radius: 0; }   /* photography rarely wants a radius */
```

Zero radius everywhere is also a valid system. Uniform 8px is the tell.

Severity: LOW.

---

### 21. The pill badge above the headline

**Reject:** A small rounded capsule above the h1 reading "Now in beta", "New",
"Introducing v2", often with a sparkle or a colored dot.
**Why:** This is a template component. It occupies the most valuable position on
the page, directly above the headline, and almost never carries information the
viewer needs before the headline itself.

Bad:
```html
<span class="rounded-full bg-purple-100 text-purple-700 px-3 py-1 text-sm">
  New Feature
</span>
<h1>Meet our new dashboard</h1>
```

Good:
```html
<h1>Meet the new dashboard</h1>
<p class="mt-6 text-sm uppercase tracking-widest opacity-60">
  Shipping March 2026
</p>
```

Keep the badge only when the status is genuinely load-bearing, such as a beta
warning that changes how someone should use the product. Then write the real
status, not "New".

Severity: HIGH, because of its position.

---

### 22. Emoji as iconography

**Reject:** Emoji standing in for an icon set in feature lists, navigation, or
section markers.
**Why:** Emoji render differently on every platform, cannot inherit color or
stroke weight, carry unintended tone, and are announced verbatim by screen
readers. They are a placeholder that shipped.

Bad:
```html
<li>Fast performance</li>
<li>Secure by default</li>
<li>Precise targeting</li>
```
(each preceded by a rocket, a lock, and a dart)

Good:
```html
<li>
  <svg width="20" height="20" aria-hidden="true"><use href="#icon-bolt" /></svg>
  Fast performance
</li>
```

Use a real icon set. Lucide, Phosphor and Radix are all free and inherit
`currentColor`.

Severity: MEDIUM, HIGH in navigation or any interactive control.

---

### 23. The grayscale logo strip

**Reject:** A row of five or six customer logos at reduced opacity under a
heading like "Trusted by teams at".
**Why:** The pattern itself is fine and widely used by real companies. It becomes
a tell when the logos are invented, generic, or unverifiable, which is the
default outcome when a model generates one. It also frequently produces an
implied claim the product cannot support.

Bad:
```html
<p>Trusted by teams at</p>
<div class="flex gap-12 opacity-50 grayscale">
  <img src="/logos/acme.svg" /><img src="/logos/globex.svg" />
</div>
```

Good:
```html
<!-- Only real, permitted logos. If there are two, show two. -->
<p>Used by <a href="/case-studies/northwind">Northwind</a> and 40 other teams.</p>
```

Severity: HIGH when the logos are fabricated. This overlaps tell 31.

---

### 24. Icon, heading, two lines, times three

**Reject:** Three feature cards, each with a small icon, a two-or-three-word
heading, and exactly two lines of body copy of near-identical length.
**Why:** The uniformity is the tell. Real features do not have equal explanation
budgets. When all three descriptions are the same length, the copy was written to
fill the component rather than the component built to hold the copy.

Bad:
```html
<Card icon={Zap}   title="Fast"   body="Lightning quick performance for teams." />
<Card icon={Lock}  title="Secure" body="Enterprise grade security by default." />
<Card icon={Chart} title="Smart"  body="Powerful analytics at your fingertips." />
```

Good:
```html
<Card title="Sub-100ms queries" size="lg">
  <p>Reads hit an in-memory index. p99 latency across our fleet is 63ms,
     which we publish at status.example.com.</p>
</Card>
<Card title="SOC 2 Type II" size="sm">
  <p>Audited annually. Report on request.</p>
</Card>
```

The fix is mostly editorial. Let the important feature take more room.

Severity: MEDIUM.
