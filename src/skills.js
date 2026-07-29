// Skill discovery and frontmatter parsing.
// Skills live in the sibling skills/ directory. We read that directory at
// runtime instead of hardcoding a list, so adding a skill never requires
// editing the CLI.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
// src/ sits next to skills/ in the built layout, so the package skills root is
// one level up from this file.
export const skillsRoot = path.resolve(here, '..', 'skills');

// Parse the leading YAML frontmatter block. We only need three scalar paths:
// name, description, and metadata.version. description may be a block scalar
// introduced with a pipe, so handle indented continuation lines.
export function parseFrontmatter(text) {
  const result = { name: '', description: '', version: '' };
  if (!text.startsWith('---')) return result;
  const end = text.indexOf('\n---', 3);
  if (end === -1) return result;
  const block = text.slice(3, end);
  const lines = block.split('\n');

  let inMetadata = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '') continue;

    const indent = line.length - line.trimStart().length;

    // A top-level key resets any nested section we were tracking.
    if (indent === 0) inMetadata = false;

    const nameMatch = /^name:\s*(.*)$/.exec(line);
    if (indent === 0 && nameMatch) {
      result.name = stripQuotes(nameMatch[1].trim());
      continue;
    }

    const descMatch = /^description:\s*(.*)$/.exec(line);
    if (indent === 0 && descMatch) {
      const rest = descMatch[1].trim();
      if (rest === '|' || rest === '>' || rest === '|-' || rest === '>-') {
        // Block scalar. Collect indented continuation lines.
        const collected = [];
        let j = i + 1;
        for (; j < lines.length; j++) {
          const cont = lines[j];
          if (cont.trim() === '') {
            collected.push('');
            continue;
          }
          const contIndent = cont.length - cont.trimStart().length;
          if (contIndent === 0) break;
          collected.push(cont.trimStart());
        }
        const joiner = rest.startsWith('>') ? ' ' : ' ';
        result.description = collected.join(joiner).replace(/\s+/g, ' ').trim();
        i = j - 1;
      } else {
        result.description = stripQuotes(rest);
      }
      continue;
    }

    if (indent === 0 && /^metadata:\s*$/.test(line)) {
      inMetadata = true;
      continue;
    }

    if (inMetadata) {
      const verMatch = /^\s*version:\s*(.*)$/.exec(line);
      if (verMatch) result.version = stripQuotes(verMatch[1].trim());
    }
  }

  return result;
}

function stripQuotes(value) {
  if (value.length >= 2) {
    const first = value[0];
    const last = value[value.length - 1];
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return value.slice(1, -1);
    }
  }
  return value;
}

// Return every skill directory that contains a SKILL.md, sorted by name.
export function listSkills() {
  let entries;
  try {
    entries = fs.readdirSync(skillsRoot, { withFileTypes: true });
  } catch (err) {
    const e = new Error('Cannot read skills directory at ' + skillsRoot);
    e.code = 'EIO';
    e.cause = err;
    throw e;
  }

  const skills = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const dir = path.join(skillsRoot, entry.name);
    const skillFile = path.join(dir, 'SKILL.md');
    if (!fs.existsSync(skillFile)) continue;

    const text = fs.readFileSync(skillFile, 'utf8');
    const meta = parseFrontmatter(text);
    skills.push({
      name: meta.name || entry.name,
      dirName: entry.name,
      description: meta.description,
      version: meta.version,
      dir,
      skillFile,
      referencesDir: path.join(dir, 'references'),
    });
  }

  skills.sort((a, b) => a.name.localeCompare(b.name));
  return skills;
}

// Look up a single skill by its directory name (the value used on the CLI).
export function findSkill(name) {
  return listSkills().find((s) => s.dirName === name || s.name === name) || null;
}

// List the reference markdown files for a skill, sorted, as absolute paths.
export function listReferenceFiles(skill) {
  if (!fs.existsSync(skill.referencesDir)) return [];
  return fs
    .readdirSync(skill.referencesDir)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((f) => path.join(skill.referencesDir, f));
}
