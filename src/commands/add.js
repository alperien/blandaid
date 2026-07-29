// add: install named skills into a target layout.
//
// Exit codes: 0 success, 1 user error (unknown skill, bad target), 2 IO failure.

import fs from 'node:fs';
import path from 'node:path';
import { listSkills, findSkill } from '../skills.js';
import {
  TARGETS,
  planSkill,
  codexPointerBlock,
  mergeAgentsMd,
} from '../targets.js';
import * as ui from '../ui.js';

export function runAdd(opts) {
  const {
    names = [],
    all = false,
    target = 'claude',
    dir = null,
    force = false,
    dryRun = false,
  } = opts;

  // Resolve which skills to install.
  const available = listSkills();
  let selected;
  if (all) {
    selected = available;
  } else {
    if (names.length === 0) {
      ui.error('No skills named. Pass skill names or use --all.');
      return 1;
    }
    selected = [];
    for (const name of names) {
      const skill = findSkill(name);
      if (!skill) {
        ui.error('Unknown skill: ' + name);
        ui.note('Run blandaid list to see available skills.');
        return 1;
      }
      selected.push(skill);
    }
  }

  // Resolve the target. --dir overrides --target and lands files at that path
  // using the agents-style directory layout.
  let effectiveTarget = target;
  if (dir) {
    effectiveTarget = 'agents';
  } else if (!TARGETS.includes(target)) {
    ui.error('Unknown target: ' + target);
    ui.note('Targets: ' + TARGETS.join(', ') + '.');
    return 1;
  }

  const root = dir ? path.resolve(process.cwd(), dir) : process.cwd();

  // Build the full plan first so a planning failure never leaves a half-write.
  let plans;
  try {
    plans = selected.map((skill) => ({
      skill,
      plan: planSkill(skill, effectiveTarget),
    }));
  } catch (err) {
    ui.error('Could not read a source skill file.');
    ui.note(String(err && err.message ? err.message : err));
    return 2;
  }

  const collectedNotes = new Set();
  let wrote = 0;
  let skippedCount = 0;

  if (dryRun) ui.info('Dry run. No files written.');

  for (const { skill, plan } of plans) {
    for (const w of plan.writes) {
      const dest = path.join(root, w.path);
      const exists = fs.existsSync(dest);

      if (dryRun) {
        const verb = exists && !force ? 'skip (exists)' : 'write';
        ui.info(verb + ' ' + relForDisplay(dest));
        continue;
      }

      if (exists && !force) {
        ui.skipped('exists, kept: ' + relForDisplay(dest));
        skippedCount++;
        continue;
      }

      try {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, w.contents);
      } catch (err) {
        ui.error('Failed to write ' + relForDisplay(dest));
        ui.note(String(err && err.message ? err.message : err));
        return 2;
      }
      ui.added(relForDisplay(dest));
      wrote++;
    }

    for (const n of plan.notes) collectedNotes.add(n);
  }

  // Codex needs the AGENTS.md pointer block after the skill directories exist.
  if (effectiveTarget === 'codex') {
    const agentsPath = path.join(root, 'AGENTS.md');
    const block = codexPointerBlock(selected.map((s) => s.dirName));

    if (dryRun) {
      const verb = fs.existsSync(agentsPath) ? 'update' : 'write';
      ui.info(verb + ' ' + relForDisplay(agentsPath) + ' (blandaid pointer block)');
    } else {
      try {
        const existing = fs.existsSync(agentsPath)
          ? fs.readFileSync(agentsPath, 'utf8')
          : null;
        const merged = mergeAgentsMd(existing, block);
        fs.writeFileSync(agentsPath, merged);
        ui.added(relForDisplay(agentsPath) + ' (blandaid pointer block)');
      } catch (err) {
        ui.error('Failed to update ' + relForDisplay(agentsPath));
        ui.note(String(err && err.message ? err.message : err));
        return 2;
      }
    }
  }

  for (const n of collectedNotes) ui.note(n);

  if (dryRun) return 0;

  ui.info(wrote + ' file' + (wrote === 1 ? '' : 's') + ' written.');
  if (skippedCount > 0) {
    ui.info(skippedCount + ' skipped. Use --force to overwrite.');
  }
  return 0;
}

function relForDisplay(abs) {
  const rel = path.relative(process.cwd(), abs);
  return rel.startsWith('..') ? abs : rel;
}
