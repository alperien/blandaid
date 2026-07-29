#!/usr/bin/env node
// Project validator. blandaid tells agents not to write machine-default prose,
// so the repo holds itself to the same rules. This runs in CI on every push.
//
// Checks:
//   1. Voice. No em or en dashes, no curly quotes, no emoji, no banned words.
//   2. Frontmatter. Every SKILL.md declares name, description, license, version.
//   3. Budgets. SKILL.md at or under 400 lines, references at or under 900.
//   4. Rule format. Every numbered hard rule has a Bad and a Good example.
//   5. Links. Every skills path referenced in a skill file exists.
//   6. package.json and plugin manifest shape.
//
// Exit 0 clean, 1 on any violation.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');

const SKILL_MAX_LINES = 400;
const REFERENCE_MAX_LINES = 900;

const BANNED_WORDS = [
  'seamless', 'seamlessly', 'robust', 'leverage', 'leverages', 'leveraging',
  'delve', 'crucial', 'pivotal', 'tapestry', 'testament', 'underscore',
  'underscores', 'showcase', 'showcases', 'showcasing', 'vibrant', 'intricate',
  'intricacies', 'foster', 'fostering', 'elevate', 'elevates', 'holistic',
  'paradigm', 'realm', 'comprehensive', 'unlock', 'unlocks', 'harness',
  'harnesses', 'empower', 'empowers', 'empowering',
];

// "not just X, it's Y" and its relatives.
const NEGATIVE_PARALLELISM = /\b(not just|not merely|isn't just|isn't about|it's not about|more than just)\b/i;

const EM_DASH = '—';
const EN_DASH = '–';
const CURLY = ['“', '”', '‘', '’'];
// Pictographic and decorative-glyph ranges. The U+2500 box-drawing block is
// allowed, since the CLI banner and the pipeline diagrams use it.
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2190}-\u{21FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE0F}\u{2705}\u{274C}\u{26A0}\u{2713}\u{2717}]/u;

const errors = [];
const warnings = [];

function fail(file, line, msg) {
  errors.push(`${file}:${line} ${msg}`);
}

function walk(dir, filter) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, filter));
    else if (filter(entry.name)) out.push(full);
  }
  return out;
}

// ---------------------------------------------------------------- voice pass

function checkVoice(file, text) {
  const rel = path.relative(root, file);
  const lines = text.split('\n');
  let inFence = false;

  lines.forEach((line, i) => {
    const n = i + 1;

    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      return;
    }

    if (line.includes(EM_DASH)) fail(rel, n, 'em dash');
    if (line.includes(EN_DASH)) fail(rel, n, 'en dash');
    for (const q of CURLY) {
      if (line.includes(q)) fail(rel, n, 'curly quote');
    }
    if (EMOJI.test(line)) fail(rel, n, 'emoji or decorative glyph');

    // Prose-only checks below. Code samples may legitimately contain these
    // tokens, for example a CSS class named .showcase inside a Bad example.
    if (inFence) return;

    // A watched phrase inside quotation marks or a code span is being named,
    // not used. The catalog has to be able to quote the patterns it bans.
    const spoken = line
      .replace(/`[^`]*`/g, ' ')
      .replace(/"[^"]*"/g, ' ');

    const lower = spoken.toLowerCase();
    for (const word of BANNED_WORDS) {
      if (new RegExp(`\\b${word}\\b`).test(lower)) {
        fail(rel, n, `banned word: ${word}`);
      }
    }
    if (NEGATIVE_PARALLELISM.test(spoken)) {
      fail(rel, n, 'negative parallelism');
    }

    // Title Case headings. Ignores acronyms, code spans, and short headings.
    const heading = line.match(/^#{2,4}\s+(.*)$/);
    if (heading) {
      const words = heading[1]
        .replace(/`[^`]*`/g, '')
        .split(/\s+/)
        .filter((w) => /^[A-Za-z][a-z]+$/.test(w));
      const capped = words.filter((w) => /^[A-Z]/.test(w));
      if (words.length >= 4 && capped.length >= words.length - 1) {
        warnings.push(`${rel}:${n} heading may be Title Case: ${heading[1]}`);
      }
    }
  });
}

// ---------------------------------------------------------- frontmatter pass

// Small line-based YAML reader. Handles the two shapes skill frontmatter uses:
// top-level scalars, and block scalars introduced with a pipe. Nested keys are
// flattened, so metadata.version is readable as version.
function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return null;

  const lines = m[1].split('\n');
  const out = {};
  let blockKey = null;
  let blockIndent = 0;
  const blockLines = [];

  const flushBlock = () => {
    if (blockKey) out[blockKey] = blockLines.join('\n').trim();
    blockKey = null;
    blockLines.length = 0;
  };

  for (const line of lines) {
    if (blockKey) {
      const indent = line.search(/\S/);
      if (line.trim() === '' || indent > blockIndent) {
        blockLines.push(line.trim());
        continue;
      }
      flushBlock();
    }

    const kv = line.match(/^(\s*)([A-Za-z_][\w-]*):[ \t]*(.*)$/);
    if (!kv) continue;

    const [, indentStr, key, rawValue] = kv;
    const value = rawValue.trim();

    if (value === '|' || value === '|-' || value === '|+' || value === '>') {
      blockKey = key;
      blockIndent = indentStr.length;
      continue;
    }
    if (value === '') continue; // a mapping header such as "metadata:"
    out[key] = value.replace(/^["']|["']$/g, '');
  }
  flushBlock();

  return out;
}

// -------------------------------------------------------------- rule format

function checkRuleFormat(file, text) {
  const rel = path.relative(root, file);
  const blocks = text.split(/^### (?=\d+\.\s)/m).slice(1);
  for (const block of blocks) {
    const title = block.split('\n')[0].trim();
    // Accepts "Bad:", "**Bad:**", and a qualified form such as "Bad (prose):".
    const hasBad = /(^|\n)\s*(\*\*)?Bad(\*\*)?\s*(\([^)]*\))?\s*(\*\*)?:/i.test(block);
    const hasGood = /(^|\n)\s*(\*\*)?Good(\*\*)?\s*(\([^)]*\))?\s*(\*\*)?:/i.test(block);
    if (!hasBad || !hasGood) {
      const missing = [!hasBad && 'Bad', !hasGood && 'Good'].filter(Boolean).join(' and ');
      fail(rel, 0, `rule "${title}" is missing a ${missing} example`);
    }
  }
}

// ------------------------------------------------------------- link checking

function checkLinks(file, text) {
  const rel = path.relative(root, file);
  text.split('\n').forEach((line, i) => {
    const matches = line.matchAll(/(?:^|[\s(`"'])((?:skills\/|references\/)[A-Za-z0-9._/-]+\.md)/g);
    for (const m of matches) {
      const ref = m[1];
      // A skills/... path is repo-relative. A references/... path is written
      // relative to the skill root, which is the parent when the citing file
      // already lives inside references/.
      const dir = path.dirname(file);
      const skillRoot = path.basename(dir) === 'references' ? path.dirname(dir) : dir;
      const target = ref.startsWith('skills/')
        ? path.join(root, ref)
        : path.join(skillRoot, ref);
      if (!fs.existsSync(target)) {
        fail(rel, i + 1, `broken reference: ${ref}`);
      }
    }
  });
}

// -------------------------------------------------------------------- run it

const markdown = walk(path.join(root, 'skills'), (n) => n.endsWith('.md'));
const readme = path.join(root, 'README.md');
if (fs.existsSync(readme)) markdown.push(readme);

const code = [
  ...walk(path.join(root, 'bin'), (n) => n.endsWith('.js')),
  ...walk(path.join(root, 'src'), (n) => n.endsWith('.js')),
];

for (const file of [...markdown, ...code]) {
  checkVoice(file, fs.readFileSync(file, 'utf8'));
}

for (const file of markdown) {
  const text = fs.readFileSync(file, 'utf8');
  const rel = path.relative(root, file);
  const lineCount = text.split('\n').length;

  checkLinks(file, text);

  if (path.basename(file) !== 'SKILL.md') {
    if (rel.includes('references') && lineCount > REFERENCE_MAX_LINES) {
      fail(rel, 0, `${lineCount} lines, over the ${REFERENCE_MAX_LINES} line budget`);
    }
    continue;
  }

  checkRuleFormat(file, text);

  if (lineCount > SKILL_MAX_LINES) {
    fail(rel, 0, `${lineCount} lines, over the ${SKILL_MAX_LINES} line budget`);
  }

  const fm = parseFrontmatter(text);
  if (!fm) {
    fail(rel, 1, 'missing or unparseable frontmatter');
    continue;
  }
  for (const key of ['name', 'description', 'license', 'version']) {
    if (!fm[key]) fail(rel, 1, `frontmatter missing ${key}`);
  }
  const dirName = path.basename(path.dirname(file));
  if (fm.name && fm.name !== dirName) {
    fail(rel, 1, `frontmatter name "${fm.name}" does not match directory "${dirName}"`);
  }
  if (fm.description && fm.description.length < 120) {
    fail(rel, 1, 'description is too short to route on, write at least 120 characters');
  }
}

const pkgPath = path.join(root, 'package.json');
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  for (const key of ['name', 'version', 'bin', 'files', 'engines', 'repository', 'license', 'description']) {
    if (!pkg[key]) errors.push(`package.json missing ${key}`);
  }
  if (pkg.bin && !pkg.bin.blandaid) {
    errors.push('package.json bin should define blandaid');
  }

  const pluginPath = path.join(root, '.claude-plugin', 'plugin.json');
  if (fs.existsSync(pluginPath)) {
    const plugin = JSON.parse(fs.readFileSync(pluginPath, 'utf8'));
    if (plugin.version !== pkg.version) {
      errors.push(`plugin.json version ${plugin.version} does not match package.json ${pkg.version}`);
    }
  }
}

for (const w of warnings) process.stdout.write(`warning: ${w}\n`);

if (errors.length > 0) {
  process.stderr.write(`\nvalidate found ${errors.length} problem(s):\n`);
  for (const e of errors) process.stderr.write(`  ${e}\n`);
  process.exit(1);
}

process.stdout.write(
  `validate: ${markdown.length} markdown and ${code.length} source files checked, no problems.\n`
);
