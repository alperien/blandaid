// interactive: the default picker when run on a TTY with no subcommand.
// Kept close to the original index.js behavior, minus the fake spinner delay
// and the wrong messaging. Installs happen for real and report per file.

import inquirer from 'inquirer';
import { listSkills } from '../skills.js';
import { TARGETS } from '../targets.js';
import { runAdd } from './add.js';
import * as ui from '../ui.js';

export async function runInteractive() {
  ui.banner();

  const skills = listSkills();
  if (skills.length === 0) {
    ui.warn('No skills found.');
    return 1;
  }

  const answers = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'skills',
      message: 'Select skills to install (space to toggle):',
      choices: skills.map((s) => ({
        name: s.dirName + '  ' + shortDesc(s.description),
        value: s.dirName,
      })),
    },
    {
      type: 'list',
      name: 'target',
      message: 'Install target:',
      choices: TARGETS,
      default: 'claude',
    },
  ]);

  if (answers.skills.length === 0) {
    ui.warn('No skills selected. Nothing to do.');
    return 1;
  }

  return runAdd({
    names: answers.skills,
    target: answers.target,
  });
}

function shortDesc(desc) {
  if (!desc) return '';
  const dot = desc.indexOf('. ');
  const first = dot === -1 ? desc : desc.slice(0, dot);
  return first.trim();
}
