// Target path mapping and the cursor flattening.
//
// A target turns a discovered skill into a plan: a list of file writes plus an
// optional post-step (the codex AGENTS.md pointer). The add command executes
// the plan or prints it for --dry-run. Nothing here touches the filesystem for
// reads beyond loading the source skill content.

import fs from 'node:fs';
import path from 'node:path';
import { listReferenceFiles } from './skills.js';

export const TARGETS = ['claude', 'agents', 'windsurf', 'cursor', 'codex'];

const CODEX_BEGIN = '<!-- blandaid:begin -->';
const CODEX_END = '<!-- blandaid:end -->';

// Directory-style targets copy SKILL.md and every references/*.md into a
// per-skill folder, preserving the references/ subdirectory.
const DIR_LAYOUT = {
  claude: (skill) => path.join('.claude', 'skills', skill.dirName),
  agents: (skill) => path.join('.agents', 'skills', skill.dirName),
  windsurf: (skill) => path.join('.windsurf', 'rules', skill.dirName),
  codex: (skill) => path.join('.codex', 'skills', skill.dirName),
};

// Build the write plan for one skill under one target.
// Returns { writes: [{ path, contents }], notes: [] }. Paths are relative to
// the destination root; the caller resolves them.
export function planSkill(skill, target) {
  if (target === 'cursor') return planCursor(skill);
  return planDirLayout(skill, target);
}

function planDirLayout(skill, target) {
  const base = DIR_LAYOUT[target](skill);
  const writes = [];

  writes.push({
    path: path.join(base, 'SKILL.md'),
    contents: fs.readFileSync(skill.skillFile, 'utf8'),
  });

  for (const ref of listReferenceFiles(skill)) {
    writes.push({
      path: path.join(base, 'references', path.basename(ref)),
      contents: fs.readFileSync(ref, 'utf8'),
    });
  }

  return { writes, notes: [] };
}

// Cursor rules are single .mdc files. Concatenate SKILL.md and every reference
// into one file, rewrite the frontmatter to Cursor's shape, and mark each
// appended reference with its original path.
function planCursor(skill) {
  const raw = fs.readFileSync(skill.skillFile, 'utf8');
  const body = stripFrontmatter(raw);

  const desc = (skill.description || skill.name).replace(/\s+/g, ' ').trim();
  const frontmatter = [
    '---',
    'description: ' + desc,
    'alwaysApply: false',
    '---',
    '',
  ].join('\n');

  const parts = [frontmatter, body.trimEnd(), ''];

  const refs = listReferenceFiles(skill);
  for (const ref of refs) {
    // Name the original path relative to the skills root so the provenance is
    // clear inside the flattened file.
    const rel = path.join(
      'skills',
      skill.dirName,
      'references',
      path.basename(ref)
    );
    parts.push('');
    parts.push('<!-- ============================================ -->');
    parts.push('<!-- reference: ' + rel + ' -->');
    parts.push('<!-- ============================================ -->');
    parts.push('');
    parts.push(fs.readFileSync(ref, 'utf8').trimEnd());
    parts.push('');
  }

  const writes = [
    {
      path: path.join('.cursor', 'rules', skill.dirName + '.mdc'),
      contents: parts.join('\n'),
    },
  ];

  const notes = [
    'Flattening merges references into one file and loses progressive disclosure. That is a real tradeoff. Prefer the claude target where the agent supports it.',
  ];

  return { writes, notes };
}

function stripFrontmatter(text) {
  if (!text.startsWith('---')) return text;
  const end = text.indexOf('\n---', 3);
  if (end === -1) return text;
  // Skip past the closing fence and its newline.
  const after = text.indexOf('\n', end + 1);
  return after === -1 ? '' : text.slice(after + 1);
}

// Build the codex AGENTS.md pointer block for a set of installed skills.
// Returns the full block text including the HTML comment markers.
export function codexPointerBlock(skillDirNames) {
  const lines = [];
  lines.push(CODEX_BEGIN);
  lines.push('## blandaid skills');
  lines.push('');
  lines.push('Installed design skills. Read the SKILL.md, then load references as needed.');
  lines.push('');
  for (const name of skillDirNames) {
    lines.push('- .codex/skills/' + name + '/SKILL.md');
  }
  lines.push(CODEX_END);
  return lines.join('\n');
}

// Merge a pointer block into existing AGENTS.md content idempotently. If a
// prior block exists, replace it in place. Otherwise append. Never clobber the
// rest of the file.
export function mergeAgentsMd(existing, block) {
  if (existing == null) {
    return block + '\n';
  }
  const start = existing.indexOf(CODEX_BEGIN);
  const end = existing.indexOf(CODEX_END);
  if (start !== -1 && end !== -1 && end > start) {
    const before = existing.slice(0, start);
    const after = existing.slice(end + CODEX_END.length);
    return before + block + after;
  }
  const sep = existing.endsWith('\n') ? '\n' : '\n\n';
  return existing + sep + block + '\n';
}

export const codexMarkers = { begin: CODEX_BEGIN, end: CODEX_END };
