// list: print available skills with a one-line description each.

import { listSkills } from '../skills.js';
import * as ui from '../ui.js';

// Take the first sentence of the description so each skill fits one line.
function oneLine(desc) {
  if (!desc) return '';
  const dot = desc.indexOf('. ');
  const first = dot === -1 ? desc : desc.slice(0, dot + 1);
  return first.trim();
}

export function runList() {
  const skills = listSkills();
  if (skills.length === 0) {
    ui.warn('No skills found.');
    return 1;
  }

  const width = Math.max(...skills.map((s) => s.dirName.length));
  for (const skill of skills) {
    const name = skill.dirName.padEnd(width);
    ui.info(name + '  ' + oneLine(skill.description));
  }
  return 0;
}
