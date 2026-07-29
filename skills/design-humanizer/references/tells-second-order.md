# Tells 33 to 40: second-order, dated

Written July 2026, describing machine output observed through 2025 and 2026.
Load this when a page has few or no first-order findings but still reads as
generated, and before calling any audit clean.

## Why this file exists

The first 32 tells describe the default that models converged on through 2023:
the purple gradient, the glass card, the centered stack. A model that avoids
all of them does not become an author. It relocates to the nearest permitted
average, and that average has a look. As of this writing it is the editorial
register: a display serif with one italic emphasis word, warm paper, grain, mono
kickers, hairlines in place of shadows, a muted heritage accent.

Two consequences.

First, these entries expire. Each one describes where the mean is, not where it
will stay. When common output moves, revise this file and retire entries that no
longer match, or they become rules that enforce nostalgia. The date at the top
is part of the data.

Second, the fix for a second-order tell is never a different style. Swapping the
editorial register for some third register repeats the failure at one remove.
The fix is provenance: derive the decision from the subject. See "Provenance"
and "Pick a register" in `skills/blandaid-core/SKILL.md`. Every Good example
below is good because of where it came from, not because of what it looks like.

## Evidence rules

A second-order tell is weaker evidence than a first-order tell. Every entry
below is also a legitimate register that real designers use with intent. A
literary journal, a studio, or an apothecary brand can own every marker at once.

So flag on clusters and on provenance failure, never on sight:

- One or two markers: note them, do not flag.
- Four or more markers together: the register was almost certainly defaulted.
  Ask for the provenance of the three most visible decisions. If the answers
  cite rules or trends, flag tell 33 as HIGH.
- Any marker with a subject-derived reason: preserve it and say why.

---

### 33. The editorial register as a default

**Reject:** Display serif headline (Instrument Serif, Fraunces, Newsreader,
Playfair) with one italic emphasis word, neutral sans body, on a subject with no
editorial provenance.
**Why:** This is the highest-frequency register in current machine output. The
tell is not the serif. The tell is transferability: when the type and palette
would fit a fragrance brand and a database tool equally well, they were derived
from neither. A register must fail for most other subjects to be evidence that
someone chose it for this one.

Bad:
```css
/* Subject: a Postgres branching CLI.
   Reason given: "a serif display against a neutral sans reads considered." */
h1 { font-family: "Instrument Serif", Georgia, serif; }
h1 em { font-style: italic; color: var(--sage); }
```

Good:
```css
/* Subject: the same CLI. Its native surface is a terminal, so the display
   face is the product's own material, not a magazine's. */
h1 { font-family: "JetBrains Mono", ui-monospace, monospace;
     font-weight: 500; letter-spacing: -0.04em; }
```

The Good is good because of the derivation, not the typeface. A different
subject earns a different face, and a real publication earns the serif.

Severity: HIGH when combined with three or more of tells 34 to 39 and no
provenance. MEDIUM alone.

---

### 34. Paper and grain

**Reject:** A warm off-white canvas in the `#F4F1EC` family with an SVG
`feTurbulence` or PNG noise overlay at 0.02 to 0.05 opacity.
**Why:** The grain overlay is the new box-shadow: a one-line purchase of
perceived craft. It costs nothing, refers to nothing, and now ships on
everything. Texture is justified when the subject has a material. A print shop
has paper. A terminal does not.

Bad:
```css
body {
  background: #F4F1EC;
  background-image: url("data:image/svg+xml,...feTurbulence at 0.035...");
}
```

Good:
```css
/* Subject surface: a terminal. Its material is phosphor on near-black,
   so the canvas comes from the product, and there is no paper to imitate. */
body { background: #101413; color: #D8E4DC; }
```

Severity: MEDIUM. LOW when the subject plausibly owns a paper material.

---

### 35. Mono kickers as section grammar

**Reject:** A small tracked uppercase monospace label above every section
heading.
**Why:** One kicker can be voice. Repeated above every heading it is
scaffolding: a template slot being filled, not information being placed. The
reader learns to skip them by the second section, which means they carry
nothing.

Bad:
```html
<p class="kicker">HOW IT WORKS</p>
<h2>Three commands</h2>
...
<p class="kicker">PRICING</p>
<h2>Billed per branch-hour</h2>
```

Good:
```html
<h2>Three commands</h2>
...
<!-- One label, kept where it carries real metadata. -->
<p class="meta">v2.1, self-hosted option shipped March 2026</p>
<h2>Billed per branch-hour</h2>
```

Severity: LOW alone. MEDIUM when every section has one.

---

### 36. The numbered scaffold

**Reject:** Ordinals (01, 02, 03) prefixed to features or cards as decoration.
**Why:** Numbering implies sequence. Three parallel features have no sequence,
so the ordinals are decoration wearing information's clothes. Steps that must
run in order earn numbers; peers do not.

Bad:
```html
<article><span>01</span><h3>Fast branches</h3></article>
<article><span>02</span><h3>Migration testing</h3></article>
<article><span>03</span><h3>One-command reset</h3></article>
```

Good:
```html
<!-- These are genuinely sequential commands, so the numbers are load-bearing. -->
<li><code>branchpoint create --from main</code></li>
<li><code>npm run migrate &amp;&amp; npm test</code></li>
<li><code>branchpoint destroy $BRANCH</code></li>
```

Severity: LOW.

---

### 37. The shadowless hairline system

**Reject:** Zero shadows anywhere and 1px hairline borders as the only depth
cue, applied as a total system.
**Why:** This is the overcorrection of tell 19. Depth is information. A modal
that floats above the page should look like it floats. Removing every shadow
because shadows were once overused trades one reflex for another.

Bad:
```css
* { box-shadow: none; }
.card, .modal, .menu { border: 1px solid rgba(0,0,0,.14); }
```

Good:
```css
/* Hairlines for peers on the same plane, elevation for things that float. */
.card  { border: 1px solid var(--hairline); }
.modal { box-shadow: 0 24px 64px -16px rgb(0 0 0 / 0.3); }
```

Severity: LOW alone, MEDIUM as part of a 33-to-39 cluster.

---

### 38. The dark interlude band

**Reject:** A full-bleed near-black section inserted mid-page, usually holding
"the problem" or a pull quote, on an otherwise light page.
**Why:** Inversion is the current reflex for "break the rhythm," the successor
to the gradient band. Used once with a reason it works. Used because the page
felt flat, it is a template move, and it now appears in the same position on
thousands of pages.

Bad:
```html
<!-- Light page. This section is dark because "the rhythm needed a break." -->
<section class="band-dark"><h2>Shared staging is a queue.</h2></section>
```

Good:
```html
<!-- Dark here because the content is the product's terminal, shown at real
     size. The surface change is the subject arriving, not a mood switch. -->
<section class="terminal-demo"><pre>$ branchpoint create --from main</pre></section>
```

Severity: LOW alone, MEDIUM in cluster.

---

### 39. The heritage accent

**Reject:** A single desaturated warm accent (sage, terracotta, ochre, olive)
chosen to signal restraint, with no source in the subject or brand.
**Why:** The successor to Tailwind blue. It reads as tasteful precisely because
thousands of current pages use it, which is also why it identifies the page as
generated. The problem is not the hue; sage with a reason is fine. The problem
is sage as the statistically safe exit from blue.

Bad:
```css
--accent: #2F5D4F;  /* sage. Reason given: "restrained, under 10 percent." */
```

Good:
```css
/* The green psql prints when a branch is ready. The accent is the product's
   own signal color, sampled, then darkened to pass AA on this canvas. */
--accent: #1E7A34;
```

Severity: LOW alone, MEDIUM in cluster.

---

### 40. Uniform sophistication

**Reject:** Every section equally polished. A palette in perfect harmony with no
odd member. No plain regions, no optical corrections, no cheap parts, and the
rubric legible through the design.
**Why:** This is the meta-tell that survives all the others. A checklist
produces even output. A person produces uneven output, because attention is
finite and they spend it where the argument lives. A page where the footer got
the same care as the hero is a page where nothing got care; it got compliance.

Bad (prose): every section opens with a label, a display heading, and one
measured paragraph. All values sit exactly on the scale. Nothing is plain,
nothing is odd, and each choice can be defended by citing a rule.

Good (prose): the hero and the pricing table visibly got the most attention.
One heading sits at 67px because 64 looked wrong next to the wordmark, and a
comment says so. The changelog is an unstyled list. The footer is two lines.

Severity: MEDIUM, and treat it as the tiebreaker: a page that hits 33 to 39
but shows uneven investment and defended exceptions is probably authored; a
page that avoids 33 to 39 but is uniformly polished probably is not.

---

## A caution about this repo's own values

Blessed values date too. `cubic-bezier(0.22, 1, 0.36, 1)` appears in most 2026
motion guides, including this skill set's core. A correct value used because a
guide blessed it is the provenance failure at miniature scale. When a value
from core lands in a deliverable, the reason recorded next to it should still
be about this subject, this element, and this distance, not about core.
