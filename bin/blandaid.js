#!/usr/bin/env node
// blandaid CLI entry. Thin. Parses arguments with node:util parseArgs and
// dispatches to a command module. All real work lives under src/.

import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';

import { runList } from '../src/commands/list.js';
import { runAdd } from '../src/commands/add.js';
import { runDoctor } from '../src/commands/doctor.js';
import { runInteractive } from '../src/commands/interactive.js';
import * as ui from '../src/ui.js';

// Piping into head or less closes stdout early. Exit quietly instead of
// crashing with a stack trace.
process.stdout.on('error', (err) => {
  if (err && err.code === 'EPIPE') process.exit(0);
  throw err;
});

const here = path.dirname(fileURLToPath(import.meta.url));

function readVersion() {
  try {
    const pkg = JSON.parse(
      fs.readFileSync(path.resolve(here, '..', 'package.json'), 'utf8')
    );
    return pkg.version || '0.0.0';
  } catch {
    return '0.0.0';
  }
}

const HELP = `blandaid installs anti-slop design skill files into a project.

Usage:
  blandaid                       interactive picker (TTY, no args)
  blandaid list                  print available skills
  blandaid add <skill...>        install named skills
  blandaid add --all             install every skill
  blandaid doctor                report installed skills and flag drift
  blandaid --help
  blandaid --version

Flags for add:
  --target <name>   claude | cursor | agents | windsurf | codex (default: claude)
  --dir <path>      explicit output directory, overrides --target
  --all             every skill
  --force           overwrite existing files (default is to skip)
  --dry-run         print file operations without performing them
  --yes, -y         no prompts, for CI and agent use

Exit codes: 0 success, 1 user error, 2 IO failure.`;

function printHelp(stream = process.stdout) {
  stream.write(HELP + '\n');
}

async function main() {
  const argv = process.argv.slice(2);

  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      allowPositionals: true,
      options: {
        help: { type: 'boolean', short: 'h' },
        version: { type: 'boolean', short: 'v' },
        target: { type: 'string' },
        dir: { type: 'string' },
        all: { type: 'boolean' },
        force: { type: 'boolean' },
        'dry-run': { type: 'boolean' },
        yes: { type: 'boolean', short: 'y' },
      },
    });
  } catch (err) {
    ui.error(err.message);
    printHelp(process.stderr);
    return 1;
  }

  const { values, positionals } = parsed;
  const command = positionals[0];

  if (values.version && !command) {
    process.stdout.write(readVersion() + '\n');
    return 0;
  }

  if (values.help && !command) {
    printHelp();
    return 0;
  }

  // No subcommand. Interactive on a TTY, help + error otherwise so an agent or
  // CI job never hangs waiting on a prompt.
  if (!command) {
    if (process.stdout.isTTY && process.stdin.isTTY) {
      return runInteractive();
    }
    printHelp(process.stderr);
    return 1;
  }

  switch (command) {
    case 'list':
      return runList();

    case 'doctor':
      return runDoctor();

    case 'add': {
      if (values.help) {
        printHelp();
        return 0;
      }
      return runAdd({
        names: positionals.slice(1),
        all: Boolean(values.all),
        target: values.target || 'claude',
        dir: values.dir || null,
        force: Boolean(values.force),
        dryRun: Boolean(values['dry-run']),
        yes: Boolean(values.yes),
      });
    }

    default:
      ui.error('Unknown command: ' + command);
      printHelp(process.stderr);
      return 1;
  }
}

main()
  .then((code) => {
    process.exitCode = code || 0;
  })
  .catch((err) => {
    ui.error(String(err && err.message ? err.message : err));
    process.exitCode = 2;
  });
