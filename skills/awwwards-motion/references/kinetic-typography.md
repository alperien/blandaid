# Kinetic typography

Covers Layer 4: the text-splitting utility (chars, words, lines) and the reveals it enables, character-by-character stagger, word-by-word masked slide-up, line-by-line reveal, and the animated number counter. Load this in the build phase when animating headings, display type, or stat figures.

Curves referenced here (`--ease-out`) are defined in `references/easing-and-timing.md`.

Text splitting and character-level animation is the signature of studio-quality sites. It is also the most expensive layer per element, so it is capped: see the drift warning at the end.

---

## Text split utility

```javascript
/* BLUEPRINT: Text splitter for character and word animations
   WHY: To animate individual characters or words, each must be
   wrapped in its own element. This utility splits text content
   into <span>-wrapped units while preserving spaces.
   aria-hidden on individual characters plus an sr-only full-text
   ensures screen readers read the complete text, not individual
   letters. */

function splitText(element, type = "chars") {
  const text = element.textContent;

  // Keep original text accessible
  element.setAttribute("aria-label", text);

  if (type === "chars") {
    element.innerHTML = text
      .split("")
      .map((char) =>
        char === " "
          ? '<span class="split-char">&nbsp;</span>'
          : `<span class="split-char" aria-hidden="true">${char}</span>`
      )
      .join("");
  } else if (type === "words") {
    element.innerHTML = text
      .split(" ")
      .map(
        (word) =>
          `<span class="split-word-wrap"><span class="split-word" aria-hidden="true">${word}</span></span>`
      )
      .join('<span class="split-char">&nbsp;</span>');
  } else if (type === "lines") {
    // Wrap each line in a clip container for reveal
    element.innerHTML = text
      .split("\n")
      .map(
        (line) =>
          `<span class="split-line-wrap" style="display:block;overflow:hidden;"><span class="split-line">${line}</span></span>`
      )
      .join("");
  }

  return element.querySelectorAll(
    type === "chars"
      ? ".split-char"
      : type === "words"
      ? ".split-word"
      : ".split-line"
  );
}
```

---

## Character-by-character reveal

```css
/* BLUEPRINT: Character stagger reveal
   WHY: Each character fades and translates individually with
   an incremented delay. The effect reads as text typing
   itself or assembling from nothing. The 20ms increment
   creates a very fast cascade that reads as fluid, not choppy. */

.split-char {
  display: inline-block;
  opacity: 0;
  transform: translateY(100%);
  transition:
    opacity 0.4s var(--ease-out),
    transform 0.4s var(--ease-out);
}

.is-visible .split-char {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger via JS: */
```

```javascript
// Apply stagger after splitting
const chars = splitText(document.querySelector(".hero-heading"), "chars");
chars.forEach((char, i) => {
  char.style.transitionDelay = `${i * 25}ms`;
});
```

---

## Word-by-word slide up (masked reveal)

```css
/* BLUEPRINT: Word reveal from below (masked)
   WHY: Each word is wrapped in an overflow:hidden container.
   The word starts translated 100% below (hidden by the mask)
   and slides up into view. This creates a curtain-rise
   effect per word. The mask hides the translation, so words
   appear to materialize from the baseline. This is the
   premium text reveal used by Apple, Linear, Vercel. */

.split-word-wrap {
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
  padding-bottom: 0.05em; /* prevents descender clipping */
}

.split-word {
  display: inline-block;
  transform: translateY(110%);
  transition: transform 0.6s var(--ease-out);
}

.is-visible .split-word {
  transform: translateY(0);
}
```

```javascript
// Apply stagger on words
const words = splitText(document.querySelector(".section-heading"), "words");
words.forEach((word, i) => {
  word.style.transitionDelay = `${i * 60}ms`;
});
```

---

## Line-by-line reveal

```css
/* BLUEPRINT: Line reveal for paragraphs
   WHY: Each line slides up from behind its mask. This is
   more readable than character-level animation for body
   text. Works best for short paragraphs (3-5 lines).
   Do NOT use on long body copy. It becomes tedious. */

.split-line {
  display: block;
  transform: translateY(100%);
  transition: transform 0.7s var(--ease-out);
}

.is-visible .split-line {
  transform: translateY(0);
}
```

---

## Counter / number animation

```javascript
/* BLUEPRINT: Animated number counter
   WHY: Numbers that count up from 0 to their final value
   draw attention to statistics. The easing makes the count
   decelerate as it approaches the target, which feels like
   the number is settling into place. Duration scales with
   the target value to prevent tiny numbers from animating
   too slowly and large numbers from animating too fast. */

function animateCounter(element, target, duration = 2000) {
  const start = performance.now();
  const format = element.dataset.format || "number"; // "number" | "percent" | "currency"

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);

    if (format === "percent") {
      element.textContent = `${current}%`;
    } else if (format === "currency") {
      element.textContent = `$${current.toLocaleString()}`;
    } else {
      element.textContent = current.toLocaleString();
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// Trigger on scroll reveal:
// When counter element becomes visible, call:
// animateCounter(element, parseInt(element.dataset.target), 2000);
```

Drift warning: text splitting is expensive. Only split headings and short phrases (max ~100 characters). Never character-split a paragraph. Never character-split more than 3 elements on the same page. The DOM bloat from wrapping every character in a `<span>` degrades paint performance.
