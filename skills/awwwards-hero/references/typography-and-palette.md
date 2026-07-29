# Typography and palette

Covers hero heading typography (font choice, the heading CSS blueprint, supporting text hierarchy) and the two-to-three hue palette rules for dark and light heroes. Load this in Phase 3 while building type and color.

The shared palette rules live in `skills/blandaid-core/SKILL.md` under "Palette discipline." This file is the hero-specific application of them.

---

## Typography

Hero headings are architectural elements that structure the entire viewport. They are not big text with a larger font-size.

### Font selection

Pick one candidate from the row that matches the vibe. Do not mix two display faces in one hero.

| Vibe | Strong candidates (pick one) |
|---|---|
| Clean modern / tech / SaaS | `Geist`, `Satoshi`, `Cabinet Grotesk`, `Outfit`, `PP Neue Montreal` |
| Bold statement / agency | `Clash Display`, `Cabinet Grotesk`, `Monument Extended`, `Sohne Breit` |
| Editorial / luxury | `PP Editorial New`, `GT Sectra Display`, `Canela`, `Reckless Neue` (serif only when the reference shows serif) |
| Condensed / industrial | `Bebas Neue`, `Oswald`, `Barlow Condensed`, `Archivo Black` |

Drift warning: `Inter`, `Roboto`, `Open Sans`, `Poppins`, `Arial`, and `Helvetica` are body fonts, not display fonts. Using them as a hero heading font produces generic output regardless of how good the layout is. If the reference uses one of these, verify carefully. At hero scale, Inter and Geist look nearly identical, and Geist is the display-grade choice.

### Heading CSS blueprint

```css
/* BLUEPRINT: Hero heading
   WHY: clamp() makes the heading responsive without breakpoints.
   Negative letter-spacing is critical at large sizes. Positive
   tracking on massive text creates a loose, amateurish feel.
   line-height below 1.0 lets ascenders and descenders overlap
   slightly, which looks intentional at display scale. */
.hero-heading {
  font-size: clamp(2.5rem, 7vw, 8rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 0.95;
  text-wrap: balance;
  max-width: 18ch; /* prevents 4+ line wraps */
}

/* For 1-3 word headings, go larger */
.hero-heading--short {
  font-size: clamp(4rem, 14vw, 18rem);
  letter-spacing: -0.05em;
  line-height: 0.85;
}
```

### Supporting text hierarchy

| Element | Specification |
|---|---|
| Eyebrow (above heading) | `font-size: 0.75rem`, `letter-spacing: 0.12em`, `text-transform: uppercase`, monospace or geometric sans. Muted color (`text-white/50` dark, `text-zinc-500` light) |
| Subtext (below heading) | `font-size: clamp(1rem, 1.25vw, 1.25rem)`, `max-width: 45ch`, `line-height: 1.6`, muted color. Never more than 20 words |
| CTA button | Solid pill (`rounded-full px-8 py-3.5`) or ghost pill (`rounded-full px-8 py-3.5 border border-white/20`). `font-size: 0.875rem`, `letter-spacing: 0.05em`, uppercase. One CTA max. No secondary "Learn more" links |

---

## Palette

Maximum three hues in the hero. This is what separates award-winning heroes from busy ones, not a soft suggestion.

### Dark hero palette

```css
/* BLUEPRINT: Dark hero atmosphere
   WHY: #0a0a0a reads as black but has enough data for
   subtle gradients to register. Pure #000000 is a dead
   flat surface that cannot hold atmospheric effects. */
.hero-dark {
  background: #0a0a0a;
  color: #f5f5f5;
  /* Accent: one muted hue, used on max 1-2 small elements */
}
```

### Light hero palette

```css
.hero-light {
  background: #FAFAF9; /* or #F5F5F0 or #FDFBF7, warm cream, not pure white */
  color: #1a1a1a;      /* or #111111, near-black, not pure black */
  /* Accent: one considered hue */
}
```

Drift warning: more than one saturated accent in the hero guarantees a busy, unfocused feel. Use one accent on CTAs and active states. Everything else is the base palette (background, text, muted text).
