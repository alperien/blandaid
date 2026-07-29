// Unit tests for the parts most likely to break: frontmatter parsing, cursor
// flattening frontmatter shape, and the idempotent AGENTS.md merge.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { parseFrontmatter } from '../src/skills.js';
import { mergeAgentsMd, codexPointerBlock, codexMarkers } from '../src/targets.js';

test('parses a block scalar description', () => {
  const src = [
    '---',
    'name: sample-skill',
    'description: |',
    '  First line of the description.',
    '  Second line continues.',
    'license: MIT',
    'metadata:',
    '  version: "2.0.0"',
    '---',
    '',
    '# body',
  ].join('\n');

  const meta = parseFrontmatter(src);
  assert.equal(meta.name, 'sample-skill');
  assert.equal(meta.version, '2.0.0');
  assert.match(meta.description, /First line of the description\. Second line continues\./);
});

test('parses a single-line quoted description', () => {
  const src = [
    '---',
    'name: solo',
    'description: "Just one line."',
    'metadata:',
    '  version: 1.2.3',
    '---',
  ].join('\n');

  const meta = parseFrontmatter(src);
  assert.equal(meta.name, 'solo');
  assert.equal(meta.description, 'Just one line.');
  assert.equal(meta.version, '1.2.3');
});

test('codex block is stable and merge is idempotent', () => {
  const block = codexPointerBlock(['alpha', 'beta']);
  assert.ok(block.includes(codexMarkers.begin));
  assert.ok(block.includes(codexMarkers.end));
  assert.ok(block.includes('.codex/skills/alpha/SKILL.md'));

  const existing = '# My agents file\n\nSome instructions.\n';
  const once = mergeAgentsMd(existing, block);
  const twice = mergeAgentsMd(once, codexPointerBlock(['alpha', 'beta']));

  assert.equal(once, twice, 'repeat merge must not duplicate the block');
  assert.ok(once.startsWith('# My agents file'), 'original content preserved');

  const count = (twice.match(new RegExp(codexMarkers.begin, 'g')) || []).length;
  assert.equal(count, 1, 'exactly one block after two merges');
});

test('merge into empty file just writes the block', () => {
  const block = codexPointerBlock(['solo']);
  const out = mergeAgentsMd(null, block);
  assert.ok(out.includes(codexMarkers.begin));
});
