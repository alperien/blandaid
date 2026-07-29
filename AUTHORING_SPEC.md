# blandaid skill authoring spec

This is the contract. Every skill file in this repo follows it. CI enforces the
mechanical parts. You are responsible for the rest.

Read this whole document before you touch a skill.

---

## 1. What we are fixing

The base repo shipped five skill files totaling 262KB. They contain good design
knowledge. They are packaged badly.

Five measured defects:

1. **Context bloat.** `awwwards-motion/SKILL.md` is 3402 lines, about 30K tokens,
   loaded in full the moment the skill triggers. Two skills firing at once can eat
   40K tokens before any work starts. Agent skills are supposed to be routers that
   pull detail on demand.
2. **403 em dashes.** The most reliable machine-writing tell, in a project whose
   entire pitch is removing machine defaults. Instruction prose is a style
   demonstration. A model reading 155 em dashes infers house style and mirrors it.
3. **Abstract rules, no demonstrations.** The files say "no CSS keyword easings"
   without showing the bad line next to the good one. Stated prohibitions get
   complied with weakly. Demonstrated contrasts get complied with strongly.
4. **No stop condition.** Nothing tells the agent when the constraints do not
   apply. So it maximalizes a deliberately quiet design, adds motion to a page
   whose point was stillness, and overrides a real brand palette as "generic."
5. **No shared spine.** Five files independently define premium, easing, spacing
   and anti-patterns, and they disagree with each other.

---

## 2. File layout

Every skill is a directory:

```
skills/<skill-name>/
  SKILL.md              the router. Hard budget: 400 lines.
  references/*.md       the depth. Loaded only when SKILL.md points to it.
```

`SKILL.md` answers: when do I fire, what must I never do, what is the sequence,
what must be true before I move on, and where is the detail. It does not contain
the detail.

`references/` holds catalogs, code recipes, easing tables, architecture
inventories. Each file is self-contained and under 900 lines. Name them for what
the agent is looking for when it needs them: `easing-palette.md`,
`scroll-choreography.md`, `component-recipes.md`.

---

## 3. SKILL.md structure

In this order. Do not add top-level sections. Do not reorder.

### Frontmatter

```yaml
---
name: <skill-name>
description: |
  <One paragraph, third person, that a router model reads to decide whether to
  load this skill. State the job, the trigger conditions, and the hard scope
  limit. No marketing.>
license: MIT
metadata:
  version: "2.0.0"
---
```

The description is the single most load-bearing string in the file. It is the
only part a model sees before deciding to load the rest. Write it for a
dispatcher, not for a human browsing GitHub. Say what the skill does, when it
fires, and what it explicitly does not cover.

### Body sections

1. `# <Title in sentence case>`
2. **When this fires** and **When this does not fire.** Two short lists. The
   second is not optional. A skill that never declines is a skill that fires on
   everything.
3. **Modes.** Three, always: `direct`, `embedded`, `audit`. Defined in §5.
4. **The pipeline.** A compact ASCII block. Phases only. No prose retelling of
   what the diagram already shows.
5. **Hard rules.** Numbered. Each rule follows the rule format in §4.
6. **Quality gates.** One per phase. Each gate is a list of conditions that must
   be true to proceed, written so a model can self-check them. A gate that cannot
   fail is not a gate.
7. **Restraint.** The stop condition. See §6. Mandatory.
8. **Reference index.** A table: file, what is in it, when to load it.

---

## 4. The rule format

This is the format that makes the difference. Copy it exactly.

```markdown
### <n>. <Short rule name in sentence case>

**Reject:** <the specific pattern to catch, named concretely>
**Why:** <one or two sentences. The mechanism, not a slogan.>

Bad:
```css
transition: all 0.3s ease;
```

Good:
```css
transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
```
```

Rules about visual composition that have no code form use a prose Bad/Good pair
instead of code blocks. The pair is still mandatory. If you cannot write a
concrete Bad example, the rule is too vague to keep and you should cut it.

The Bad example must be something a competent model actually produces by default.
Do not write strawmen. `transition: all 0.3s ease` is a real default. A magenta
Comic Sans hero is not.

---

## 5. Modes

Every skill declares these three. Text can be adapted per skill but the semantics
are fixed.

**direct.** The user invoked this skill as the task. Run the full pipeline. Show
the extraction, the gates, and the diff table. The ceremony is the deliverable as
much as the code is.

**embedded.** Another skill or a larger job is using this as one step. Run the
same pipeline internally. Output only the artifact. No extraction sheets, no gate
tables, no commentary. The caller wants the code, not the process.

**audit.** Point the skill at existing output and report only. Do not modify
anything. Return the diff table with PASS and FAIL rows and a short list of the
highest-severity failures.

State the default mode. For every generative skill the default is `direct`.

---

## 6. Restraint

Mandatory section. The hardest thing to get right and the most valuable.

Every skill must say, concretely:

- **Signals to preserve.** Things in the user's input that look like defects to a
  maximalist but are actually intentional. A real brand palette. A deliberately
  restrained type scale. An accessibility-driven contrast choice. A dense data
  table that should stay dense.
- **When the constraint does not apply.** Contexts where the skill's aesthetic is
  wrong: admin dashboards, data-dense internal tools, government and compliance
  interfaces, documentation, anything where the user named a design system.
- **What to do instead.** When restraint wins, say so out loud and explain the
  call in one sentence. Do not silently skip the skill.

Model this on Humanizer's "What NOT to flag" and "Signs of human writing." That
section is why Humanizer does not destroy good prose. Ours is why blandaid will
not destroy good design.

Write at least six preserve-signals and at least four does-not-apply contexts per
skill, specific to that skill's domain. Generic filler here is worse than nothing.

---

## 7. Voice

These are enforced. CI fails the build on the mechanical ones.

**Hard, machine-checked:**

- Zero em dashes (`—`) and zero en dashes (`–`). Use a period, a comma, a colon,
  or parentheses. Restructure if none of those work.
- Straight quotes only. No `“ ” ‘ ’`.
- No emoji anywhere, including in headings and status markers. Write `PASS` and
  `FAIL`, not check marks and crosses.
- Headings in sentence case. `## Quality gate: extraction`, not
  `## Quality Gate: Extraction`.
- SKILL.md at or under 400 lines. Reference files at or under 900.
- Frontmatter must parse and must contain name, description, license, and
  metadata.version.

**Hard, human-checked:**

- No AI vocabulary: seamless, robust, leverage, delve, crucial, pivotal, tapestry,
  testament, underscore, showcase, vibrant, intricate, foster, elevate, holistic,
  paradigm, realm, comprehensive, unlock, harness, empower, landscape as an
  abstract noun.
- No "not just X, it's Y." No "isn't about X. It's about Y." No tailing negation
  fragments like "no guesswork" or "zero compromise" bolted onto a sentence end.
- No rule-of-three padding. If two items say it, ship two items.
- No bold-term inline lists. Write `The audit covers tokens, typography, and
  spacing.` Not a stack of `- **Tokens:** ...` bullets. This applies to prose.
  Genuine reference tables and parameter lists are fine.
- No signposting. Do not write "Let's look at" or "Here's what you need to know."
  Just say the thing.
- No manufactured drama. Do not stack short fragments to build tension. One short
  sentence for emphasis is fine. Four in a row is a tell.
- No aphorism formulas. Not "motion is the language of quality." Say what is
  actually true: "Users read slow interfaces as broken."
- Vary sentence length. Machine prose runs at an even mid-length cadence.

**On tone.** These files are instructions to a model that is about to do skilled
work. Write like a senior engineer briefing a capable colleague. Direct, specific,
occasionally blunt. Not a pitch deck. Not a hype document. The base repo's
"charging $200k per project" line is the register to avoid.

---

## 8. What to keep

The base repo's design knowledge is good. This is a restructure, not a rewrite
from scratch.

Keep: the phase pipelines, the architecture catalogs, the easing values, the code
recipes, the diff tables, the anti-pattern lists, the extraction sheets. These are
the product.

Change: where they live, how they are worded, and what surrounds them.

Do not drop technical content to hit the line budget. Move it to `references/`.
If a reference file would exceed 900 lines, split it by topic. Losing a real
cubic-bezier value or a working GSAP recipe to save space is a failure of the
task.

---

## 9. The core skill

`skills/blandaid-core/SKILL.md` holds the doctrine every skill shares: the design
slop catalog, the shared easing and spacing vocabulary, the universal restraint
clause, and the definition of the quality bar.

Every other skill links to it rather than restating it. When you find yourself
writing a general design principle that is not specific to your skill, it belongs
in core. Reference it as `skills/blandaid-core/SKILL.md`.

Do not restate core's content. A pointer is correct. A copy will drift.

---

## 10. Self-check before you return

Run these against your own output:

1. `grep -c '—\|–'` returns 0.
2. Every numbered rule has a Bad and a Good.
3. The restraint section names at least six preserve-signals and four
   does-not-apply contexts, all specific to this skill.
4. Every gate has a condition that could actually fail.
5. SKILL.md is at or under 400 lines.
6. No section duplicates content that belongs in core.
7. Read the file top to bottom. Does it sound like a person who has shipped this
   kind of work, or like a model imitating one?
