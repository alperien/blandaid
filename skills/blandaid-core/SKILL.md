---
name: blandaid-core
description: |
  Shared design vocabulary for the blandaid skill set. Defines the quality bar,
  the provenance rule for every non-trivial decision, register selection before
  styling, the authorship requirements, the canonical easing curves, the spatial
  and type scale system, palette discipline, the universal restraint clause, and
  the three invocation modes. Every other blandaid skill points here instead of
  restating these definitions. Load this when any blandaid skill is active, or
  when you need the shared vocabulary without a specific pipeline. This skill
  defines terms. It does not run a build pipeline of its own.
license: MIT
metadata:
  version: "2.1.0"
---

# blandaid core

The shared spine. Five generator skills and one detector skill reference this
file so the vocabulary is defined once and cannot drift.

If you are writing a general design principle that is not specific to one
pipeline, it belongs here. If you are reading a blandaid skill and it points at a
section name below, this is the definition it means.

## When this fires

Load alongside any blandaid skill. Load on its own when you need the shared
vocabulary, the restraint rules, or the mode definitions without running a
pipeline.

## When this does not fire

This skill does not build anything. It has no phases and no output artifact. If
the task is to produce a hero, a motion layer, reference images, a replication,
or a restyle, load the matching generator skill and let it pull this one in.

---

## The quality bar

"Premium" is not a mood. It is four measurable properties. A design that has all
four reads as considered. A design missing any one reads as generated.

**1. Hierarchy is unambiguous.** A viewer's eye lands in one place first, and
that place is the same for every viewer. Measured by squinting: blur the layout
until text is unreadable. Exactly one element should still dominate. If three
things compete, there is no hierarchy.

**2. The type scale has real contrast.** The ratio between the largest and
smallest type on screen is at least 6 to 1. Machine defaults cluster at 2 to 1,
which is why generated pages read flat. A 16px body with a 96px headline is a
6:1. A 16px body with a 32px headline is a 2:1 and looks like a template.

**3. Space is uneven on purpose.** Consistent spacing is a starting point, not a
finish. Real layouts have one or two places where the space is much larger than
the rhythm, and those gaps do structural work. Uniform padding everywhere is the
signature of a component library used without judgment.

**4. Every value traces to a decision.** Any number in the output should have an
answer to "why that one." A duration is 240ms because it is a small element
moving a short distance. A color is that hex because it came from the reference
or the brand. Values that cannot be justified were guessed, and guessed values
cluster around the statistical mean. "Provenance", below, defines which answers
count.

---

## Provenance

Every non-trivial visual decision names a source, and the source sits outside
this skill set.

Sources that count:

- The subject. What the product is, what it touches, where it lives. A Postgres
  tool lives in terminals, CI logs, and branch diagrams. A bakery lives in
  flour, ovens, and handwritten labels.
- The brand: tokens, voice, and material the user already owns.
- The content: what the words and images on this page actually say and need.
- The medium: print-length reading, a dense operator screen, a phone outdoors.
- A measured constraint: a contrast floor, a performance budget, an input
  method.
- The user's stated taste, recorded in their own words.

Sources that do not count:

- A rule in this skill set. Rules veto options; they never nominate them. "Core
  bans pure black" explains why not `#000000` and says nothing about which ink
  this subject wants instead.
- What other tools are producing, or "what good sites look like right now."
- "It reads as premium." Premium is a verdict, not a source.

The test: take the five most visible decisions (display face, palette, texture,
layout grammar, motion character) and write one line each naming the source. A
line that cites a rule or a trend means the decision was defaulted, and the
output will match every other page defaulted the same way.

The failure that prompted this section: a Postgres branching tool styled as an
editorial magazine. Serif "because pairing," sage "because restraint," grain
"because atmosphere." Every answer cited a rule. The same stylesheet would have
fit a fragrance brand without edits, which is the proof that it fit neither.

---

## Pick a register

Before any visual work, name three candidate registers derived from the
subject, with one line on why each fits. Pick one and commit. In `direct` mode,
show the candidates and the choice.

A register is the kind of printed or built thing the page resembles: a
terminal, a spec sheet, a field guide, a magazine, a poster wall, a lab
notebook, an appliance manual, a transit map. The list is open. Most subjects
point somewhere specific, and it is rarely where the previous subject pointed.

Editorial (display serif, italic emphasis, paper tones, kickers) is one
register among many, and it is never the default. Pick it only when the subject
is genuinely editorial: a publication, longform writing, a literary brand. As
of mid 2026 it is also the register machine output converges on, so choosing it
without subject provenance is indistinguishable from not choosing at all. The
detector catalogs that cluster as tells 33 to 40.

---

## Authorship

Passing every rule in this set proves the absence of known defects. It does not
put a person in the output. Two requirements do.

**One rubric-breaking decision.** At least one visible choice that this skill
set would flag, kept on purpose, defended in one line in a code comment. A page
in full compliance with a published rubric reads as what it is: rubric output.
The break is where a viewer senses that someone decided.

**Uneven investment.** Name the one moment that gets disproportionate craft,
and spend there. Let at least one region stay plain: a footer that is two
lines, a table that is just a table. Checklists produce even polish. People
spend attention where the argument lives and stop when it stops mattering.

Neither requirement is decoration. Fake roughness applied evenly is polish with
extra steps. The break and the spike need sources like everything else; the
difference is that their source is your judgment about this subject, stated
out loud.

---

## Shared easing vocabulary

Five curves cover almost everything. Use these names. Skills that need
specialized curves extend this set rather than redefining it.

```css
:root {
  /* Default for entrances and most UI motion. Fast start, long settle. */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);

  /* Tighter and more responsive. Hovers, toggles, small state changes. */
  --ease-snap: cubic-bezier(0.22, 1, 0.36, 1);

  /* Slight overshoot. Use where a element should feel physical. */
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Slow in and out. Full-screen transitions and large travel only. */
  --ease-dramatic: cubic-bezier(0.65, 0, 0.35, 1);

  /* Symmetric. Loops, ambient motion, anything that repeats. */
  --ease-in-out: cubic-bezier(0.05, 0.7, 0.1, 1.0);
}
```

The CSS keywords `ease`, `ease-in`, `ease-out`, `ease-in-out` and `linear` are
banned in generated output, with one exception: `linear` is correct for a
constant-rate loop such as a marquee or a spinner.

The keywords are banned because they are the browser default and the model
default at the same time. `ease` is `cubic-bezier(0.25, 0.1, 0.25, 1)`, a curve
that starts slow. Motion that starts slow reads as lag.

Durations, in the same spirit:

```css
:root {
  --dur-instant: 120ms;  /* color and opacity on small elements */
  --dur-fast:    240ms;  /* buttons, toggles, hovers */
  --dur-base:    400ms;  /* cards, panels, most entrances */
  --dur-slow:    700ms;  /* section reveals, large travel */
  --dur-scene:  1200ms;  /* full-viewport transitions only */
}
```

Distance sets duration. A 4px shift at 700ms looks broken. A full-screen wipe at
120ms is invisible.

---

## Shared spatial vocabulary

**Type scale.** Pick a ratio and hold it. 1.25 for dense interfaces, 1.333 for
marketing pages, 1.5 or higher for editorial and hero work. Generate the scale
from the ratio rather than choosing sizes by eye. The largest step should clear
the 6:1 contrast bar in "The quality bar".

Fluid sizing between breakpoints:

```css
h1 { font-size: clamp(2.75rem, 8vw + 1rem, 9rem); }
```

**Spacing scale.** A 4px base with a non-linear progression:
`4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256`. Values off this scale need a
reason.

**Section rhythm.** Vertical padding between major sections should be at least
`clamp(6rem, 12vw, 14rem)`. The most common spatial failure in generated layouts
is sections that are too close together, which makes a page read as one
undifferentiated column.

**Measure.** Body copy sits between 60 and 75 characters per line. Use `ch`
units, not percentages.

**Grid.** A 12 column grid is the default. Using all 12 columns for every element
is not a grid, it is a stack. At least one element per viewport should break the
expected column span.

---

## Palette discipline

**Count.** Two or three hues total, plus neutrals. A fourth hue needs a
justification. Generated palettes sprawl because every new component brings its
own color.

**Neutrals are never pure.** `#000000` and `#FFFFFF` are the two most common
tells in generated work. Real designs use off-black and off-white with a
temperature bias that matches the accent.

```css
/* Bad */
--bg: #FFFFFF;
--fg: #000000;

/* Good, warm bias */
--bg: #FAF8F5;
--fg: #14110E;
```

**Accent ratio.** The accent color covers under 10 percent of the visible
surface. An accent applied to every button, link, badge and icon stops being an
accent.

**Contrast is a floor, not a target.** Meet WCAG AA at minimum. Meeting it
exactly on body text is a sign the palette was checked rather than designed.

**A supplied brand palette outranks every rule in this section.** See "Universal
restraint".

---

## Universal restraint

Every blandaid skill is deliberately aggressive. Aggression without a stop
condition destroys good work. These rules outrank the aesthetic rules in every
skill.

**Signals to preserve.** When you see these in the input, they are decisions, not
defects:

- A brand palette, brand font, or design system named by the user or present in
  the codebase. You do not have standing to override a brand.
- A deliberately quiet type scale where the content is dense and the reading task
  is long. Documentation and reference material are supposed to be calm.
- High-contrast or large-text choices that look heavy-handed. They are usually
  accessibility requirements.
- Dense tables and data grids. Density is the feature. Adding whitespace to a
  trading screen or an admin table makes it worse.
- Existing motion tokens in a codebase. Matching them beats importing ours.
- Content that is genuinely short. A one-sentence page does not need six
  sections. Do not generate filler to fill a layout.

**Contexts where the blandaid aesthetic is wrong:**

- Internal tools, admin panels and dashboards, where speed of use beats
  impression.
- Government, healthcare, legal and compliance interfaces, where convention is a
  usability feature and novelty is a risk.
- Documentation sites and API references.
- Any product where the user named an existing design system such as Material,
  Carbon, Polaris or an internal one.

**What to do when restraint wins.** Say so, in one sentence, and explain the
call. Then do the smaller version of the job. Silently skipping a skill and
silently maximalizing are both failures. The user should always know which mode
you chose and why.

---

## Modes

Every blandaid skill supports these three. The names mean the same thing
everywhere.

**direct.** The user invoked the skill as the task. Run the full pipeline and
show the work: the extraction, the gates, the diff table. The process output is
part of the deliverable.

**embedded.** Another skill or a larger job is using this as one step. Run the
same pipeline internally and output only the artifact. No extraction sheets, no
gate tables, no commentary.

**audit.** Point the skill at existing output and report only. Change nothing.
Return the diff table with PASS and FAIL rows, then list the highest-severity
failures.

Default to `direct` unless the calling context makes it obvious you are one step
inside a larger job.

---

## The detector

`skills/design-humanizer/SKILL.md` holds the catalog of AI design tells and the
audit loop. Every generator skill in this set ends with a design-humanizer pass
in audit mode.

One exception: `pixel-perfect` replicates a reference exactly. If the reference
contains a tell, the tell is the specification. There, design-humanizer labels
rather than corrects.

The detector's tells 33 to 40 are dated: they name the register machine output
defaults to as of mid 2026. When a page avoids the first 32 tells by relocating
there, "Provenance" and "Pick a register" above are the counterweight.
