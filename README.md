<h1 align="center">blandaid</h1>

<p align="center">Bland UI? Apply directly to the interface.</p>

<br/>

<div align="center">
  <a href="https://github.com/alperien/blandaid/actions/workflows/validate.yml"><img src="https://github.com/alperien/blandaid/actions/workflows/validate.yml/badge.svg" alt="validate" /></a>
  <a href="https://github.com/Yu-369/VibeCurb"><img src="https://img.shields.io/badge/descended%20from-Yu--369%2FVibeCurb-black?style=flat-square" alt="Descended from Yu-369/VibeCurb" /></a>
  <img src="https://img.shields.io/badge/skills-7-black?style=flat-square" alt="7 skills" />
</div>

<br/>

Models are trained on millions of average websites, so an unconstrained model
builds an average website. blandaid is a set of skill files that constrain it.

Instead of letting an agent generate UI from instinct, these skills make it
extract a design direction, commit to an architecture, build against fixed
rules, and verify the result before it calls the job done.

> [!WARNING]
> These skills override standard generation defaults on purpose. They favor
> complex grids, deep contrast, and large typographic range. If you want safe
> and generic, do not install them.

---

## Install

```bash
# See what is available
npx blandaid list

# Install one skill for Claude Code
npx blandaid add design-humanizer

# Install everything
npx blandaid add --all

# Pick a different agent
npx blandaid add --all --target cursor
```

Targets: `claude` (default), `cursor`, `agents`, `windsurf`, `codex`.

```bash
npx blandaid doctor      # what is installed and whether it is current
npx blandaid add --all --dry-run
npx blandaid             # interactive picker
```

As a Claude Code plugin:

```
/plugin marketplace add alperien/blandaid
/plugin install blandaid
```

Or copy the directory you want out of `skills/` by hand. Each skill is a
`SKILL.md` plus a `references/` folder, and both need to travel together.

---

## The skills

| Skill | Job |
| :--- | :--- |
| `blandaid-core` | Shared vocabulary. The quality bar, the easing curves, the spacing and type system, and the restraint rules every other skill defers to. |
| `design-humanizer` | Finds and fixes 40 AI design tells in output that already exists. Every generator skill runs it as a final gate. |
| `awwwards-hero` | Hero sections. Six architectures, viewport-scale type, one focal point, tight palette. |
| `awwwards-motion` | Motion. Entry sequences, scroll choreography, hover physics, kinetic type, page transitions. |
| `imagegen-frontend` | Design reference images. One image per section, with a combinatorial engine that prevents every section looking the same. |
| `pixel-perfect` | Screenshot to code. Seven extraction layers, then a build that treats the reference as the specification. |
| `visual-redesign` | Restyles existing React without touching its logic. State, effects, handlers and routing are off limits. |

---

## What changed from VibeCurb

blandaid is descended from [Yu-369/VibeCurb](https://github.com/Yu-369/VibeCurb). The
design knowledge in the original is good. The packaging was working against it.

**Skills are routers now.** `awwwards-motion` was a single 3402 line file. Every
time it triggered, all 114KB entered the context window, whether the task needed
the preloader recipes or not. It is now a 19KB router that pulls from nine
reference files on demand. Across the set, total material grew by a third while
the cost of triggering a skill dropped sharply.

| Skill | Was | Router now | Detail moved to references |
| :--- | ---: | ---: | ---: |
| `awwwards-motion` | 3402 lines | 347 | 3157 |
| `visual-redesign` | 1102 lines | 305 | 1122 |
| `pixel-perfect` | 900 lines | 361 | 748 |
| `imagegen-frontend` | 714 lines | 399 | 457 |
| `awwwards-hero` | 587 lines | 362 | 424 |

**Every rule shows its work.** The original stated constraints in the abstract.
A rule like "no CSS keyword easings" now carries the default it is replacing:

````markdown
Bad:
```css
transition: all 0.3s ease;
```

Good:
```css
transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
```
````

A demonstrated contrast gets followed. A stated prohibition gets forgotten around
turn thirty.

**Every skill can now decline.** The original had no stop condition, so a skill
told to maximize would maximize a deliberately quiet design, add motion to a page
whose point was stillness, or override a real brand palette as generic. Each
skill now lists signals to preserve and contexts where its aesthetic is wrong,
and `blandaid-core` holds the rules that outrank all of it.

**The prose was fixed.** The five skill files contained 403 em dashes, plus
"seamless" six times. Instruction text is a style demonstration whether you mean
it to be or not. An anti-slop tool that reads like slop teaches the model that
slop is the house style. CI now fails the build on any of it.

**Decisions need sources now.** Core defines provenance: every visible choice
names a source in the subject, the brand, the content, or a measured
constraint, and a rule in the skill set does not count as a source. Skills
pick a register derived from the subject before styling anything, with
editorial allowed only when the subject earns it, and every page carries one
defended rule-break plus at least one plain region. This exists because the
first demo audit produced a page that avoided all 32 tells and landed cleanly
on the 2026 default instead.

**The CLI does what the docs said it did.** The old README documented
`npx blandaid list` and `add <skill>`. Neither existed. The CLI was
interactive only, wrapped in a 1500ms `setTimeout` that faked a spinner, printed
`.cursorrules` while writing to `.agents/skills/`, and reported success after a
failed install. It now has real subcommands, five targets, a `--dry-run`, a
`--yes` flag so agents and CI can call it, and non-zero exit codes.

---

## design-humanizer

The new skill, and the one to try first. It is the visual counterpart to
[blader/humanizer](https://github.com/blader/humanizer), which removes AI tells
from prose. This one removes them from interfaces.

Point it at something that looks machine-made:

```
Run design-humanizer in audit mode on src/components/Hero.tsx
```

It reports findings by severity, then fixes them in order. The catalog covers 40
tells across layout, typography, color, components, motion, and content. A few:

- The centered stack, where nothing breaks the vertical axis.
- The unearned violet-to-pink gradient.
- `transition: all 0.3s ease`.
- The pill badge above the headline reading "Now in beta".
- Three feature cards whose descriptions are all the same length.
- Invented metrics. "10,000+ happy customers" with no source.
- Missing `prefers-reduced-motion`, which is an accessibility bug rather than a
  matter of taste.

Tells 33 to 40 are different in kind and carry a date. They name the register
machine output moved to after it learned to avoid the first 32: the display
serif with one italic emphasis word, paper and grain, mono kickers, hairlines
in place of shadows, the sage accent. A blocklist can only relocate a page to
the nearest permitted average, so the fix prescribed there is provenance, not
another style: every visible decision names a source in the subject, and "the
rule said so" does not count as one.

The half that matters more is knowing when to leave things alone. The skill
carries a false-positive list and a set of signals that indicate a person made
the decision on purpose: a value nudged off the scale for optical reasons, an odd
member in the palette, asymmetry that resolves, evidence that something was cut.
Minimalism is not slop, a centered login screen is correct, and a dense admin
table is supposed to be dense. Without that half, an aggressive skill damages
good work.

---

## Writing a prompt

Structure the request so the constraints land before the layout does.

```
Based on <skill>, build the <deliverable> for <subject>.

Context: <who it is for, what it has to do>.
Feel: <three or four concrete adjectives, plus a reference if you have one>.
Layout: <composition direction>.
Palette: <colors, or the brand tokens>.
Type: <display and body pairing, or a constraint>.
Mode: <light or dark>.
```

> [!TIP]
> A reference image removes more guesswork than any adjective. If you ask for
> "a sleek landing page" you will get a purple gradient and a centered glass
> card, because that is the center of the training set.

---

## When it drifts

Agents slide back toward the mean over long conversations.

| What you see | What to send |
| :--- | :--- |
| Output looks like a stock dashboard template. | "You dropped the skill file. Re-read it and apply the restraint constraints." |
| Typography feels flat. | "Your type scale is at 2:1. Core requires 6:1 or better on expressive pages. Rebuild the scale." |
| It went straight to code. | "Stop. Run the extraction phase and pass the gate before writing anything." |
| It over-applied and broke something deliberate. | "Read the restraint section. The palette is the brand's and is not yours to change." |

---

## Development

```bash
npm install
npm run validate    # voice rules, frontmatter, line budgets, cross-references
npm test
```

`scripts/validate.mjs` holds the project to its own rules. It fails on em dashes,
banned vocabulary, curly quotes, emoji, missing frontmatter, a `SKILL.md` over
400 lines, a reference over 900, a numbered rule missing its Bad and Good
examples, and any broken link between skills. The full contract is in
[AUTHORING_SPEC.md](AUTHORING_SPEC.md).

Adding a skill means adding a directory under `skills/`. The CLI discovers them
at runtime by reading frontmatter, so there is no list to update.

---

## Credit

Original project and the design knowledge in it:
[Yu-369/VibeCurb](https://github.com/Yu-369/VibeCurb).

`design-humanizer` adapts its method from
[blader/humanizer](https://github.com/blader/humanizer), which is built on
Wikipedia's [Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)
guide. Naming the tell, showing the default beside the fix, and guarding against
over-correction all come from there.

MIT. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
