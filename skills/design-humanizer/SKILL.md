---
name: design-humanizer
description: |
  Detect and remove signs of AI-generated design from user interfaces. Use when
  reviewing, auditing, or fixing a page, component, or screenshot that looks
  machine-made. Catalogs 40 visual tells across layout, typography, color,
  components, motion, and content, each with a concrete before and after. Tells
  33 to 40 are dated second-order entries naming the register machine output
  currently defaults to. Audits provenance as well as appearance: a page with no
  tells still fails when its decisions trace to rules and trends instead of the
  subject. Includes false-positive guidance so that deliberate minimalism, brand
  systems, and convention-following designs are not destroyed by the fix. This
  is the detector that every blandaid generator skill runs as its final gate. It
  audits and repairs existing output. It does not design from scratch.
license: MIT
metadata:
  version: "2.1.0"
---

# Design humanizer

Remove the signs that a machine made this.

Language models trained on millions of average websites produce the statistical
center of that training set. The result is recognizable: a centered stack, a
purple gradient, three identical feature cards, and `transition: all 0.3s ease`.
This skill names those patterns and replaces them with decisions.

This is the visual counterpart to prose humanizing. The method is the same. Name
the tell, show the default, show the fix, and say when the tell is actually fine.

## Your task

1. **Find the tells.** Scan the input against the catalog. Record every hit with
   its location and severity.
2. **Check for false positives first.** Read "What not to flag" before you change
   anything. A quiet design is not a broken one.
3. **Fix the cause, not the symptom.** Swapping one purple gradient for one green
   gradient changes nothing. The tell is the unearned gradient, not the hue.
4. **Change nothing that carries meaning.** Brand colors, design system tokens,
   accessibility choices and load-bearing class names are out of scope. See
   "Universal restraint" in `skills/blandaid-core/SKILL.md`.
5. **Report what you changed and why.** Each fix gets a one-line rationale.

## When this fires

- A user says their site or component looks generic, templated, or AI-made.
- A blandaid generator skill finishes and needs its final audit gate.
- A user asks for a design review of existing output.
- A screenshot or URL is submitted with "what is wrong with this."

## When this does not fire

- There is nothing to audit yet. Designing from a blank page is a generator
  skill's job, not this one's.
- The task is replicating a reference exactly. `pixel-perfect` owns that, and
  there the reference is the specification even when it contains tells. Label
  them, reproduce them, and let the user decide.
- The user asked for a specific unrelated change, such as fixing a bug or adding
  a section. Do not audit uninvited.
- The interface is an admin tool, dashboard, or compliance product where the
  conventions this skill flags are correct. Check core's restraint section.

## Modes

**direct.** The user asked for an audit or a cleanup. Report every finding with
severity, apply the fixes, and show a before and after summary.

**embedded.** A generator skill is calling this as its final gate. Return only
the FAIL rows and the corrected output. No catalog commentary, no severity
essay.

**audit.** Report only. Change nothing. Return the findings table sorted by
severity, then the three highest-impact fixes in priority order.

Default is `direct`.

## Calibration

If the user supplies a brand guideline, a design system, or a reference they want
to match, that input outranks this entire catalog. Match the system.

A brand that uses a purple gradient is not committing tell number 13. It is
using its brand. The tell is an *unearned* gradient chosen because the model had
no better idea. Provenance is the difference, and you can usually establish it by
asking one question.

When no system is supplied, the catalog applies in full.

## Character and intent

Removing tells is half the job. A design stripped of every flagged pattern and
given nothing in return is sterile, and sterile reads as machine-made too. The
absence of bad decisions is not the presence of good ones.

Every fix should leave something specific behind: a type pairing with a reason, a
palette with a source, a spatial rhythm that does structural work. If you remove
a gradient and replace it with flat gray, you have not humanized anything. You
have made it quieter.

This applies to expressive work: marketing pages, portfolios, editorial, brand
sites, product launches. For dense functional interfaces, plain and conventional
*is* the correct human answer, and adding character there is the error.

One more failure mode, learned the hard way: removing every tell relocates the
page to the current mean unless each replacement traces to the subject. A
blocklist can only move output to the nearest permitted average, and that
average is catalogued in tells 33 to 40. The mechanism that prevents the
relocation is in core: "Provenance" and "Pick a register" in
`skills/blandaid-core/SKILL.md`.

## The catalog

40 tells in seven groups. Load the reference file for the group you are
checking. Tells 1 to 32 are stable. Tells 33 to 40 are dated and expire.

| Reference | Tells | Load when |
| :--- | :--- | :--- |
| `references/tells-layout-and-type.md` | 1 to 12 | Auditing composition, hierarchy, grid, or typography |
| `references/tells-color-and-component.md` | 13 to 24 | Auditing palette, surfaces, cards, badges, or iconography |
| `references/tells-motion-and-content.md` | 25 to 32 | Auditing animation, transitions, or placeholder content |
| `references/tells-second-order.md` | 33 to 40 | The page looks polished and current, first-order findings are near zero, or before calling any audit clean |

Quick index by name:

1. The centered stack. 2. The uniform three-column grid. 3. Container as the only
spatial idea. 4. Equal-weight sections. 5. The symmetric hero. 6. Identical card
heights. 7. The safe type scale. 8. Default font stack with no reason. 9.
Gradient text. 10. Uniform font weight. 11. Title Case everywhere. 12. Unbounded
measure. 13. The unearned gradient. 14. Pure black on pure white. 15. Framework
default palette. 16. Accent applied to everything. 17. Dark mode as inverted
light mode. 18. The glassmorphic centered card. 19. Shadow on everything. 20.
Uniform border radius. 21. The pill badge above the headline. 22. Emoji as
iconography. 23. The grayscale logo strip. 24. Icon, heading, two lines, times
three. 25. Keyword easing. 26. Fade-up on everything at the same speed. 27.
Animating layout properties. 28. Missing reduced-motion. 29. Opacity-only hover.
30. Placeholder copy shipped as final. 31. Invented metrics. 32. Generic CTA
verbs. 33. The editorial register as a default. 34. Paper and grain. 35. Mono
kickers as section grammar. 36. The numbered scaffold. 37. The shadowless
hairline system. 38. The dark interlude band. 39. The heritage accent. 40.
Uniform sophistication.

## Severity

Report findings with these levels. They determine fix order.

**HIGH.** The tell is the first thing a viewer notices, or it breaks something.
Tells 1, 5, 13, 18, 21, 27, 28, 30, 31 are usually high. A missing
`prefers-reduced-motion` is high because it is an accessibility failure, not a
taste question. Shipped lorem ipsum is high because it is a bug.

**MEDIUM.** Noticeable to a designer, invisible to most users, cumulative in
effect. Most typography and spacing tells land here. Six mediums read worse than
one high.

**LOW.** Defensible in isolation. Flag it, fix it if the fix is cheap, and do not
block on it.

Never report a count without the severity split. "14 issues found" is not
actionable. "2 high, 9 medium, 3 low" is.

Tells 33 to 40 carry their own evidence rules: individually weak, decisive in a
cluster of four or more without provenance. The reference file defines the
thresholds.

## What not to flag

A competent human designer will hit several catalog patterns without any machine
involvement. Check this list before you start changing things. None of the
following is evidence on its own:

- **Minimalism.** A sparse layout with strong hierarchy is a decision. Empty
  space is not missing content. Do not add sections to fill a page.
- **A centered layout.** Correct for a login screen, a 404, an error state, a
  single-CTA page, or a short-form article. Tell 1 is about centering everything
  by default, not about centering ever.
- **Sans-serif type.** Inter on a developer tool is a reasonable choice, not a
  failure of imagination. Tell 8 is about a default chosen without a reason, and
  you usually cannot tell the difference by looking. Ask.
- **A card grid.** Correct when the content is genuinely a set of peers, such as
  blog posts or products. Tell 2 is about forcing unrelated content into three
  equal boxes.
- **Blue.** The most common accent in enterprise software because it works. A
  blue button is not a tell.
- **Consistency.** A design system applied uniformly is the goal, not the
  problem. Do not introduce variation to prove effort.
- **Restraint in motion.** A page with two animations is not under-animated. A
  page with no animation may be correct. Do not add motion to satisfy a checklist.
- **High density.** Trading terminals, admin tables and dashboards are supposed
  to be dense. Whitespace makes them worse.
- **Platform conventions.** Following the iOS guidelines or Material spec is a
  usability decision. It is not laziness.
- **Tailwind or Bootstrap in the stack.** The framework is not the tell. Using
  its untouched defaults is (tell 15). Check the config before you judge.

Look for clusters. One centered section means nothing. A centered stack plus a
purple gradient plus three identical cards plus `ease` on every transition is a
confession.

## Signs of human design, preserve these

When you see these, leave them alone. They are evidence of a person deciding, and
editing them out is the most common way this skill does damage.

- **A value that is off the scale on purpose.** A heading at 67px when the scale
  says 64. That is an optical correction, and it means someone looked at it.
- **Asymmetry that resolves.** A layout that is unbalanced but does not feel
  wrong. Machines produce symmetry or noise, rarely tension that settles.
- **An odd member in the palette.** One color that does not follow from the
  others but works. Systems generate harmony. People make exceptions.
- **Components shaped by their content.** A card built for this specific data
  rather than a generic container holding it.
- **Evidence of removal.** A page where something is conspicuously absent, such
  as a hero with no subheading or a nav with four items instead of seven.
  Machines add. People cut.
- **Real photography or custom illustration.** Especially when it is imperfect,
  specific, or clearly not stock.
- **Deliberate roughness.** A hand-drawn underline, a slightly rotated element, a
  texture with real grain. These cost effort and no model reaches for them.
- **Copy with a specific voice.** Product text that sounds like a person wrote
  it, including jokes and self-deprecation.

## Process and output

1. Read the input and record every tell with its location and severity.
2. Run the false-positive pass. Remove any finding that survives "What not to
   flag" or "Signs of human design."
3. Ask two questions. **"What would make someone look at this and say a machine
   made it?"** Answer in one sentence; if your findings do not explain that
   sentence, you found the wrong things. Then: **"Which year's average is
   this?"** A page with no first-order findings is not clean until tells 33 to
   40 and the provenance check both pass.
4. Interrogate provenance. For the five most visible decisions (display face,
   palette, texture, layout grammar, motion character), name the source. "A
   rule said so" and "this is what good sites do now" are failures. The valid
   sources are defined in "Provenance" in `skills/blandaid-core/SKILL.md`.
5. Fix in severity order. Each fix names its source. A fix sourced from a rule
   relocates the output; a fix sourced from the subject decides something.
6. Re-scan the fixed output, including the second-order file. Fixes introduce
   tells. Replacing a gradient with a flat fill can create tell 14, and
   replacing every first-order tell at once usually creates tell 33.

Output for `direct` mode: the findings table, the fixes applied with one-line
rationales, and anything you deliberately left alone with the reason.

## Reference

The method is adapted from [blader/humanizer](https://github.com/blader/humanizer),
which applies the same approach to prose using Wikipedia's "Signs of AI writing"
guide. The structural debt is direct: name the tell, show the default, show the
fix, and guard against over-correction.

The observation that drives both: models guess what comes next, so they land on
the result that applies to the widest variety of cases. In writing that produces
"vibrant tapestry." In design it produces a centered stack with a purple
gradient.
