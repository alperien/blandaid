// doctor: report what is installed in the current project and flag drift.
//
// Scans the known target roots for installed SKILL.md files, reads their
// metadata.version, and compares against the package version of each skill.

import fs from 'node:fs';
import path from 'node:path';
import { listSkills, parseFrontmatter } from '../skills.js';
import * as ui from '../ui.js';

// Where each target puts a skill's SKILL.md, relative to the project root.
// cursor is a flattened single file, handled separately.
const DIR_ROOTS = [
  { target: 'claude', rel: (name) => path.join('.claude', 'skills', name, 'SKILL.md') },
  { target: 'agents', rel: (name) => path.join('.agents', 'skills', name, 'SKILL.md') },
  { target: 'windsurf', rel: (name) => path.join('.windsurf', 'rules', name, 'SKILL.md') },
  { target: 'codex', rel: (name) => path.join('.codex', 'skills', name, 'SKILL.md') },
];

export function runDoctor() {
  const root = process.cwd();
  const skills = listSkills();
  const pkgVersion = new Map(skills.map((s) => [s.dirName, s.version]));

  const rows = [];
  let found = 0;
  let drift = 0;

  for (const skill of skills) {
    for (const rootDef of DIR_ROOTS) {
      const dest = path.join(root, rootDef.rel(skill.dirName));
      if (!fs.existsSync(dest)) continue;
      found++;
      const installed = parseFrontmatter(fs.readFileSync(dest, 'utf8')).version;
      const pkg = pkgVersion.get(skill.dirName) || '';
      let status;
      if (!installed) {
        status = 'no version in installed file';
        drift++;
      } else if (installed === pkg) {
        status = 'up to date (' + pkg + ')';
      } else {
        status = 'differs (installed ' + installed + ', package ' + pkg + ')';
        drift++;
      }
      rows.push({
        line: rootDef.target + '  ' + skill.dirName,
        status,
        clean: installed === pkg && installed !== '',
      });
    }

    // Cursor flattened file. We cannot read a reliable version out of the
    // rewritten frontmatter, so report presence only.
    const cursorFile = path.join(root, '.cursor', 'rules', skill.dirName + '.mdc');
    if (fs.existsSync(cursorFile)) {
      found++;
      rows.push({
        line: 'cursor  ' + skill.dirName,
        status: 'installed (flattened, version not tracked)',
        clean: null,
      });
    }
  }

  if (found === 0) {
    ui.info('No blandaid skills installed in this project.');
    ui.note('Run blandaid add --all to install them.');
    return 0;
  }

  const width = Math.max(...rows.map((r) => r.line.length));
  for (const r of rows) {
    const label = r.line.padEnd(width);
    if (r.clean === true) ui.added(label + '  ' + r.status);
    else if (r.clean === false) ui.skipped(label + '  ' + r.status);
    else ui.info('[ ] ' + label + '  ' + r.status);
  }

  ui.info(
    found + ' installed. ' + drift + ' need attention.'
  );
  return 0;
}
