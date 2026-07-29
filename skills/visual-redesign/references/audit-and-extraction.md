# Audit and extraction

Covers Phase 1 (read and classify every file) and Phase 2 (extract the current design across seven layers into the Slop Sheet). Load this at the start of a redesign, before you write any CSS. Both phases are read-only: you produce tables and a summary, you change nothing.

---

## Phase 1: audit

Before changing a single character, read the entire codebase. Understand what exists. Classify everything as Sacred or Slop (the classification list lives in SKILL.md under The Sacred Rule).

### Read every file and fill the audit table

| File | Type | Sacred elements | Slop elements | Risk level |
|---|---|---|---|---|
| `App.tsx` | Root component | Router setup, providers, global state | Root className, global wrapper styles | Low |
| `Header.tsx` | UI component | Nav state (mobile menu toggle), auth state | All className strings, inline styles, layout | Medium |
| `Hero.tsx` | UI component | CTA click handlers, any analytics calls | Typography, colors, spacing, images, layout | Low |
| `Features.tsx` | UI component | Data arrays, map iterations | Card styles, grid layout, icons | Low |
| `Dashboard.tsx` | Complex component | All state, effects, API calls, data transforms | Table styles, card styles, chart wrapper styles | High |
| `Form.tsx` | Complex component | Validation, submission, error handling, refs | Input styles, button styles, layout | High |
| `index.css` | Stylesheet | None (but may hold critical resets) | Everything | Low |

Risk levels:

- Low: mostly presentational. Safe to restyle aggressively.
- Medium: a mix of logic and presentation. Restyle carefully, test after.
- High: heavy logic intertwined with presentation. Touch only CSS classes and styles. Test every change.

When you assign risk, read the whole file, not the imports. A component named `Card.tsx` can hold a data fetch. A file named `utils.css` can hold the one reset that keeps the layout from collapsing.

### Identify the aesthetic crimes

Walk through the UI and catalog every visual problem. Be specific. "Looks bad" is not a diagnosis.

| Crime | Where | Severity | Example |
|---|---|---|---|
| Generic font stack | Global/body | Critical | `font-family: Arial, sans-serif` or browser default |
| Default shadows | Cards, buttons | Major | `box-shadow: 0 2px 4px rgba(0,0,0,0.1)`, the Bootstrap default |
| Pure black text on pure white | Everywhere | Major | `color: #000; background: #fff`, zero warmth, harsh contrast |
| Inconsistent spacing | Between sections | Major | `margin-top: 20px` on one section, `margin-top: 50px` on the next |
| Bootstrap blue accent | Buttons, links | Critical | `#0d6efd`, the most recognizable "I didn't design this" signal |
| Generic border-radius | Cards, buttons | Moderate | `border-radius: 4px` everywhere, no radius language |
| No entry animations | Page load | Moderate | Elements just appear: static, lifeless mount |
| No hover states | Buttons, cards, links | Major | Interactive elements give zero feedback |
| Cramped padding | Cards, sections | Major | `padding: 16px` on a card that needs `32px` to breathe |
| No atmosphere | Backgrounds | Moderate | Flat `background: white` or `background: #f5f5f5`, no depth |
| Mixed radius languages | Across components | Moderate | Buttons are `rounded-full` but cards are `rounded-sm` with no logic |
| Body font as heading font | H1 to H3 | Critical | Inter/Roboto/Arial at `font-size: 24px` pretending to be a display heading |
| No visual hierarchy | Content sections | Major | Everything the same size, weight, and color |
| No whitespace system | Layout | Major | Random `mt-4`, `mt-6`, `mt-3` with no pattern |

### Output the audit summary

State in three to five lines what you found:

> "Audit summary: React SPA with 8 components. Router, auth state, and 3 API calls are sacred, all in Dashboard.tsx and Header.tsx. The visual layer is Bootstrap 5 defaults across the board: #0d6efd blue accent, default shadows, Arial font stack, 4px radius on everything, no hover states, no entry animations, cramped 16px padding on cards, pure black-on-white text. No design system: spacing and colors are ad-hoc per component. Estimated crimes: 14 critical, 23 major. Risk: Medium overall, High on Dashboard.tsx (complex state plus table rendering)."

### Quality gate: audit

Before moving to Phase 2, confirm each of these. Any one that fails blocks extraction.

- Every file has been read and classified in the audit table.
- Sacred elements are identified in every file.
- Risk levels are assigned per file.
- Aesthetic crimes are cataloged with specific examples, not the word "ugly."
- The audit summary is written.
- You know which files are High risk (heavy JS logic).
- You have not modified any code yet.

---

## Phase 2: extraction

Extract the current design decisions across seven layers. This is the "before" snapshot: the Slop Sheet. Values must be exact (real hex codes, real rem or px values), because the gap between these numbers and the target is what Phase 3 prescribes against.

### Layer 1: tokens

| Token | Current value (slop) | Source |
|---|---|---|
| Primary background | `#ffffff` or `white` | index.css / inline |
| Secondary background | `#f5f5f5` or `#f8f9fa` | Bootstrap gray-100 |
| Primary text | `#000000` or `#212529` | Bootstrap default |
| Secondary text | `#6c757d` | Bootstrap gray-600 |
| Accent/primary action | `#0d6efd` | Bootstrap primary |
| Accent hover | `#0b5ed7` | Bootstrap primary hover |
| Danger/error | `#dc3545` | Bootstrap danger |
| Success | `#198754` | Bootstrap success |
| Border color | `#dee2e6` | Bootstrap gray-300 |
| Font display | `system-ui` or `Arial` | Browser default |
| Font body | Same as display | No differentiation |
| Font mono | None | Missing |
| Spacing base | No system (ad-hoc) | Random px values |
| Radius default | `4px` or `0.375rem` | Bootstrap default |

### Layer 2: typography

| Element | Current spec (slop) |
|---|---|
| H1 | `font-size: 2rem; font-weight: bold; font-family: inherit` |
| H2 | `font-size: 1.5rem; font-weight: bold` |
| H3 | `font-size: 1.25rem; font-weight: bold` |
| Body | `font-size: 1rem; line-height: 1.5` |
| Small/caption | `font-size: 0.875rem` |
| Button text | `font-size: 1rem; font-weight: 400` |
| Letter-spacing | None set (browser default: normal) |
| Line-height on headings | 1.2 (Bootstrap default, too loose for display) |
| Text wrapping | No `text-wrap: balance` on headings |
| Max-width on body text | None (text runs edge to edge) |

### Layer 3: spacing

| Measurement | Current value (slop) |
|---|---|
| Section padding | Inconsistent: `py-3`, `py-4`, `py-5`, random px values |
| Card padding | `p-3` (12px) or `p-4` (16px), cramped |
| Grid gap | `gap-3` (12px) or `gap-4` (16px), tight |
| Heading to body gap | `mb-2` or `mb-3`, too tight |
| Body to CTA gap | `mt-3`, too tight |
| Nav height | `py-2` (short and cramped) or default Bootstrap nav height |
| Component spacing | No consistent system, every component different |

### Layer 4: color usage

| Usage | Current value (slop) | Problem |
|---|---|---|
| Background | Pure `#fff` or `#f8f9fa` | Flat, cold, no warmth |
| Text | Pure `#000` or `#212529` | Harsh, no refinement |
| Accent | Bootstrap `#0d6efd` | Reads as undesigned |
| Borders | `#dee2e6` | Generic gray |
| Shadows | `rgba(0,0,0,0.1)` | Default, undifferentiated |
| Hover states | Slightly darker shade | No personality |
| Active states | Even darker shade | Mechanical, not physical |
| Error | Bootstrap `#dc3545` | Generic red |

### Layer 5: components

| Component | Current state (slop) |
|---|---|
| Buttons | Bootstrap `.btn.btn-primary`: `#0d6efd`, `4px` radius, generic padding, no hover physics |
| Cards | `.card`: `1px solid #dee2e6`, `4px` radius, default shadow or no shadow, cramped padding |
| Inputs | Bootstrap form controls: `#dee2e6` border, no focus glow, no float labels |
| Navigation | Bootstrap navbar: busy, cramped, default styling |
| Tables | Bootstrap `.table`: zebra stripes, cramped rows, no refinement |
| Modals | Bootstrap modal: generic overlay, no entry animation |
| Badges/pills | Bootstrap `.badge`: small, cramped, primary blue |
| Dropdowns | Bootstrap dropdown: generic shadow, no animation |

### Layer 6: atmosphere

| Property | Current state (slop) |
|---|---|
| Background texture | None, flat solid color |
| Ambient glow/gradient | None, completely flat |
| Grain/noise | None |
| Frosted glass | None |
| Depth system | Default Bootstrap shadow or none |
| Visual warmth | Zero, cold and clinical |

### Layer 7: motion

| Property | Current state (slop) |
|---|---|
| Page entry | None, static mount, everything appears instantly |
| Scroll reveals | None, everything visible immediately |
| Hover transitions | `transition: all 0.15s ease-in-out` (Bootstrap default) or none |
| Page transitions | None, instant swap |
| Micro-interactions | None |
| Loading states | Spinner or "Loading..." text |
| Easing curves | `ease-in-out` CSS keyword or none |

### Quality gate: extraction

Before moving to Phase 3, confirm each of these. Any one that fails blocks prescription.

- All seven extraction layers are filled with actual values from the codebase.
- Values are specific (exact hex codes, exact rem or px values), not vague.
- You can see the gap between the current state and the target quality.
- You have not modified any code yet.
