# Slop catalog: React and frameworks

Covers the framework-specific defaults this skill meets in real codebases: Bootstrap classes, default Tailwind palette usage, unstyled Material UI, Chakra, Ant Design, styled-components and Emotion, and vanilla HTML. Load this in Phase 3 when you hit a specific stack and need the override strategy for it. For the general visual tells (default shadows, pure black on white, keyword easings, cramped spacing), see `skills/design-humanizer/SKILL.md`, which owns the general catalog. This file does not repeat those.

The general tells and their cures live in design-humanizer and are pulled into the token, typography, and motion prescriptions already. What follows is only the stack-specific work: which classes betray each framework, and how to override that framework without fighting it.

---

## Bootstrap defaults

Bootstrap is the most common source of the crimes this skill removes. Its defaults are individually reasonable and collectively a fingerprint. The class names below are the tells to search for.

| Bootstrap tell | The crime | The cure |
|---|---|---|
| `btn btn-primary` with `#0d6efd` | The signature Bootstrap blue | Override `.btn-primary` background to the brand accent; keep the class name (JS and tests may read it) |
| `.card` at 4px radius, default shadow | The default card look | Override `.card` per the component prescription: warm border, `--radius-md`, hover lift |
| `.table-striped` zebra rows | 2010 Bootstrap energy | Set `.table-striped > tbody > tr:nth-of-type(odd)` background to transparent, add a subtle hover row highlight |
| `.badge` at `font-size: 0.75em`, blue | Tiny cramped pills | `padding: 0.25rem 0.75rem; font-size: 0.75rem; border-radius: 9999px`, brand color |
| `.navbar` default styling | Busy, cramped chrome | Frosted glass override from the nav prescription |
| `.form-control` gray border, no focus glow | Undesigned inputs | Override with the input prescription: warm border, accent focus ring |

Do not delete Bootstrap or remove its import to force your styles through. Load `gold.css` after Bootstrap and let the cascade win. The old CSS stays as the rollback path.

---

## Tailwind CSS

Tailwind is not the problem; the default palette and default scale are. `text-gray-900`, `bg-blue-500`, `shadow-md`, `rounded` used straight from the box produce the same generic result as Bootstrap. The safest fix is at the config level, not in every component file, because it changes the design system once instead of touching hundreds of className strings.

1. Override Tailwind's `theme` in `tailwind.config.js` with the gold tokens: colors, fonts, radii, shadows.
2. Use `@layer utilities` for the atmosphere and motion additions.
3. Replace default color classes systematically: `text-gray-900` to `text-[#1a1a1a]`, or better, define custom colors in the config so the class name stays stable.
4. Replace `shadow-sm` and `shadow-md` with custom shadow values in the config.
5. Replace `rounded` and `rounded-md` with the custom radii in the config.

Editing the config is safest because a test or script that reads a className keeps working: you changed what the class resolves to, not the class itself.

```js
// tailwind.config.js, the design system changed at the source
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: '#FAFAF9',
        surface: '#FFFFFF',
        ink: '#1A1A1A',
        accent: '#____', // brand accent, not blue-500
      },
      fontFamily: {
        display: ['Outfit', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: { sm: '8px', md: '12px', lg: '16px' },
      boxShadow: { card: '0 1px 3px rgba(0,0,0,0.04)' },
    },
  },
};
```

---

## Material UI, Chakra, Ant Design

These libraries are built to be themed. Fighting their component structure is the wrong move; changing their theme object is the right one. An unstyled or default-themed MUI app is a tell precisely because so few teams change the defaults.

1. Override the theme provider configuration. These libraries expect it.
2. Focus on the theme object: colors, typography, spacing, radii, shadows.
3. Add component-level `sx` overrides or `styled()` wrappers for the atmosphere and motion touches the theme cannot express.
4. Never fight the component library's structure. Work inside its theming system.

```tsx
// Material UI: change the theme, not the components
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: { default: '#FAFAF9', paper: '#FFFFFF' },
    text: { primary: '#1A1A1A', secondary: '#6B7280' },
    primary: { main: '#____' }, // brand accent
  },
  typography: { fontFamily: 'Inter, system-ui, sans-serif' },
  shape: { borderRadius: 12 },
});
```

The same shape applies to Chakra (`extendTheme`) and Ant Design (`ConfigProvider` theme tokens). Set the tokens once at the provider; every component inherits.

---

## CSS-in-JS: styled-components and Emotion

The definitions live in JS, so the rule about not touching JS logic needs care here. You are allowed to add a global style layer and override wrappers. You are not allowed to rewrite the existing styled-component definitions inline, because those definitions can be co-located with component logic and refactoring them risks the logic beside them.

1. Apply the token prescriptions as a CSS custom property layer (`:root` variables), which every styled-component can then read via `var()`.
2. Override styled-component styles through a global `createGlobalStyle` that references the tokens.
3. For component-level overrides, add a `gold-overrides.ts` file with new styled-component wrappers.
4. Never modify the existing styled-component definitions inline. Create override wrappers instead.

```tsx
// createGlobalStyle applies tokens without touching component definitions
import { createGlobalStyle } from 'styled-components';

export const GoldGlobal = createGlobalStyle`
  :root {
    --color-bg: #FAFAF9;
    --color-text: #1A1A1A;
    --color-accent: #____;
    --radius-md: 12px;
  }
  body { background: var(--color-bg); color: var(--color-text); }
`;
```

---

## Vanilla HTML and CSS (no framework)

With no framework there is no theme object to override, so specificity and load order are the tools.

1. Add `gold.css` as the last stylesheet in the `<head>`, after every existing stylesheet.
2. Use CSS specificity to override existing styles without editing them.
3. If existing styles use `!important`, your overrides may need `!important` too. It is not elegant, but it keeps the old CSS intact as the rollback path.
4. Add the ScrollReveal script as a `<script>` before `</body>`.

The vanilla case is where the "new file, loaded last" strategy is at its purest: one stylesheet added, one script added, both removable in two lines, nothing existing edited.
