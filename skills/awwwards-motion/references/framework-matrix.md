# Framework matrix and motion standards

Covers the framework decision matrix (which motion stack to reach for per framework), the guidance on when to use GSAP versus CSS, and the non-negotiable motion standards that apply regardless of framework. Load this in the audit phase when selecting a framework, and re-read the standards before the final diff.

Curves referenced here are defined in `references/easing-and-timing.md`.

---

## Framework decision matrix

| If the project uses... | Use this motion stack |
|---|---|
| Vanilla HTML/CSS/JS | CSS keyframes + transitions + IntersectionObserver. Add GSAP only for scroll-pinning or complex timelines |
| React (no framework) | Framer Motion (`motion/react`). It handles AnimatePresence, layout animations, and gesture detection |
| Next.js | Framer Motion + View Transitions API for page transitions |
| Vue | `<Transition>` / `<TransitionGroup>` components + GSAP for scroll |
| Astro | View Transitions API (built-in) + CSS animations + GSAP for scroll |
| Svelte | Built-in `transition:` and `animate:` directives + GSAP for scroll |

When to reach for GSAP:

- Scroll-pinned (sticky) sequences where content changes as you scroll
- Horizontal scroll sections
- Complex timelines with overlapping animations
- Text splitting with SplitText plugin (best-in-class for the job)

When CSS is enough:

- Entry animations (keyframes + animation-delay)
- Hover states (transitions)
- Simple scroll reveals (IntersectionObserver + CSS transitions)
- Floating/ambient motion (keyframes + infinite)
- Accordion/tab state changes (transitions)

---

## Motion standards

These standards apply regardless of framework. They set the floor for what passes.

Spring physics for primary motion. Use CSS `linear()` spring curves or Framer Motion springs for every primary animation (entries, reveals, modals, transitions). Cubic-bezier is acceptable only for secondary motion (hovers, color shifts, ambient). If the page reads as computed rather than physical, the easing is wrong.

Material 3 Expressive is the baseline. Google's M3 Expressive easing, `cubic-bezier(0.05, 0.7, 0.1, 1.0)`, is the minimum quality for any transition. If your easing is less intentional than this, replace it.

Every curve is a chosen curve. The same 400ms animation with `ease`, with `cubic-bezier(0.16, 1, 0.3, 1)`, and with a spring `linear()` produces three different results: generic, professional, and alive. You must be able to say why you chose each curve.

Stagger follows hierarchy. Elements appearing simultaneously is a data dump. Elements appearing in sequence carries order. The stagger order is your visual hierarchy, at 80 to 120ms precision.

Fewer animations, each more considered. The most awarded sites have fewer animations, and each one is more developed. A single spring-physics text reveal with word masking is worth more than 20 generic fade-ins.

Performance is a gate, not a preference. A 45fps animation is worse than no animation. Animate only `transform`, `opacity`, and `filter`. Test on a throttled CPU. If it is not 60fps, simplify until it is. Apply `will-change` only to elements actively animating, and remove it after one-shot animations complete.

Reduced motion is required. Every animation gates behind `prefers-reduced-motion`. The reduced version uses opacity-only fades at shorter durations: no transforms, no parallax, no spring overshoot, no scroll-linked sequences.

The comparison test. Put a screenshot of your page next to apple.com, linear.app, vercel.com, or stripe.com. If the motion character does not sit alongside them, revise. The reference set is the target, not a slogan.
