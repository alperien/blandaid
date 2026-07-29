# Tells 25 to 32: motion and content

Load this when auditing animation, transitions, or the copy that shipped with a
layout.

Tell 28 is an accessibility failure rather than a taste question. Treat it as a
bug.

---

## Motion

### 25. Keyword easing

**Reject:** `ease`, `ease-in`, `ease-out`, `ease-in-out`, or `linear` in a
transition or animation.
**Why:** These are the browser defaults and the model defaults at the same time.
CSS `ease` is `cubic-bezier(0.25, 0.1, 0.25, 1)`, which starts slowly. Motion
that starts slowly reads as lag, so the interface feels heavier than it is. Named
curves in `skills/blandaid-core/SKILL.md` under "Shared easing vocabulary".

Bad:
```css
.card { transition: all 0.3s ease; }
```

Good:
```css
.card {
  transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 240ms cubic-bezier(0.22, 1, 0.36, 1);
}
```

Note the second fix in that pair: `transition: all` is its own defect. It
animates properties you did not intend, including layout properties, and defeats
compositor optimization.

`linear` is correct for a constant-rate loop such as a marquee or a spinner.

Severity: MEDIUM. HIGH when combined with `all`.

---

### 26. Fade-up on everything at the same speed

**Reject:** Every section, card and heading given the identical
`opacity: 0; translateY(20px)` reveal with the same duration and no stagger.
**Why:** Uniform motion is the same failure as uniform spacing. When everything
animates identically the motion carries no information, and the page becomes slow
to read because the viewer waits for each block. Choreography means different
elements move differently for a reason.

Bad:
```js
gsap.utils.toArray("[data-reveal]").forEach((el) => {
  gsap.from(el, { opacity: 0, y: 20, duration: 0.6,
                  scrollTrigger: { trigger: el, start: "top 85%" } });
});
```

Good:
```js
gsap.utils.toArray("[data-reveal-group]").forEach((group) => {
  gsap.from(group.querySelectorAll("[data-reveal]"), {
    opacity: 0,
    y: 24,
    duration: 0.7,
    ease: "expo.out",
    stagger: { each: 0.06, from: "start" },
    scrollTrigger: { trigger: group, start: "top 78%", once: true },
  });
});
```

Distance should vary with element size. A headline can travel 40px. A caption
should travel 12px. Both at 20px is the tell.

Severity: MEDIUM.

---

### 27. Animating layout properties

**Reject:** Transitions on `height`, `width`, `top`, `left`, `margin`, or
`padding`.
**Why:** These trigger layout and paint on every frame, so they miss the 16.7ms
budget and drop frames on mid-range hardware. `transform` and `opacity` run on
the compositor and do not. This is a correctness problem, not a preference.

Bad:
```css
.panel { transition: height 300ms ease, top 300ms ease; }
.panel.open { height: 400px; top: 0; }
```

Good:
```css
.panel {
  transition: transform 400ms cubic-bezier(0.16, 1, 0.3, 1);
  transform: translateY(-100%);
  will-change: transform;
}
.panel.open { transform: translateY(0); }
```

For genuine height animation on unknown content, use a grid row trick, which the
compositor handles better:
```css
.wrap { display: grid; grid-template-rows: 0fr;
        transition: grid-template-rows 400ms cubic-bezier(0.16, 1, 0.3, 1); }
.wrap.open { grid-template-rows: 1fr; }
.wrap > * { overflow: hidden; }
```

Severity: HIGH.

---

### 28. Missing reduced-motion

**Reject:** Any animated interface with no `prefers-reduced-motion` handling.
**Why:** Vestibular disorders affect a meaningful share of users, and parallax
and large-travel motion can cause nausea and migraine. The media query is a
one-line accessibility requirement, and it is the single most common omission in
generated motion work.

Bad:
```css
.reveal { animation: slideUp 700ms cubic-bezier(0.16, 1, 0.3, 1); }
```

Good:
```css
.reveal { animation: slideUp 700ms cubic-bezier(0.16, 1, 0.3, 1); }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

For JS-driven motion, gate it:
```js
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduced) initScrollAnimations();
```

Reduce does not mean remove. Opacity fades are usually still acceptable. Motion
across distance is what causes harm.

Severity: HIGH, always. This is a bug.

---

### 29. Opacity-only hover

**Reject:** `hover:opacity-80` as the only interactive feedback on buttons, links
and cards.
**Why:** It is the cheapest possible hover state and reads as unfinished. It also
communicates nothing about what the control does, and on low-contrast surfaces
the change can be imperceptible.

Bad:
```html
<button class="bg-accent hover:opacity-80 transition">Book a demo</button>
```

Good:
```css
.btn {
  transition: transform 180ms cubic-bezier(0.22, 1, 0.36, 1),
              background-color 180ms cubic-bezier(0.22, 1, 0.36, 1);
}
.btn:hover  { transform: translateY(-2px); background-color: var(--accent-hi); }
.btn:active { transform: translateY(0); }
.btn:focus-visible { outline: 2px solid var(--fg); outline-offset: 3px; }
```

If a hover state exists, a `:focus-visible` state must exist too. Keyboard users
need the same affordance, and generated output omits it far more often than it
omits hover.

Severity: LOW for the hover, HIGH when `:focus-visible` is missing.

---

## Content

### 30. Placeholder copy shipped as final

**Reject:** Lorem ipsum, "Your Company Here", "Feature One", "Lorem headline",
`example.com` links, or a generic stock avatar in delivered output.
**Why:** It is a bug, not a style issue. It also tends to survive because it
looks plausible in a screenshot. Placeholder copy in a deliverable means the
content step was skipped.

Bad:
```html
<h2>Feature One</h2>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
<a href="https://example.com">Learn more</a>
```

Good:
```html
<h2>Incremental sync</h2>
<p>Changes propagate to every connected client in under a second.</p>
<a href="/docs/sync">How sync works</a>
```

If the real copy is genuinely unknown, mark it visibly rather than filling it
with Latin:
```html
<h2 data-todo>[Feature name: confirm with product]</h2>
```

Severity: HIGH.

---

### 31. Invented metrics

**Reject:** Numbers with no source. "10,000+ happy customers", "99.9% uptime",
"Trusted by 500+ teams", "4.9 stars", fabricated testimonials with generated
names and photographs.
**Why:** These are fabrications presented as fact. Beyond the credibility
problem, unsupported performance and reliability claims create real legal
exposure in advertising, and invented testimonials are illegal in several
jurisdictions.

Bad:
```html
<div>10,000+ Happy Customers</div>
<blockquote>"This product changed our business." Sarah Chen, CTO at TechCorp</blockquote>
```

Good:
```html
<!-- Only numbers the user supplied and can support -->
<div>Processing 2.4M requests a day</div>
<!-- Or omit the section entirely until real proof exists -->
```

Never generate a statistic to fill a stat band. If the user has not supplied
numbers, ask, or cut the section and say you cut it.

Severity: HIGH, always.

---

### 32. Generic CTA verbs

**Reject:** "Get Started" appearing three or more times on one page, or the
"Get Started / Learn More" pair as the default button set at every decision
point.
**Why:** The label should say what happens next. "Get Started" describes nothing,
so the viewer has to guess whether it opens a signup form, a demo booking, or
documentation. Repeating it also means the page has no primary action.

Bad:
```html
<button>Get Started</button>  <!-- nav -->
<button>Get Started</button>  <!-- hero -->
<button>Get Started</button>  <!-- pricing -->
<button>Learn More</button>   <!-- everywhere else -->
```

Good:
```html
<button>Start free trial</button>     <!-- hero, the one primary action -->
<a href="/docs">Read the docs</a>     <!-- nav, secondary -->
<button>Compare plans</button>        <!-- pricing, specific -->
```

One primary action per view. Everything else is a link.

Severity: MEDIUM.
