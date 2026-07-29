// Output helpers. Every user-facing string passes through here so the voice
// rules stay in one place: straight quotes, no dashes, no emoji, plain [+] and
// [-] markers, short declarative lines.

import chalk from 'chalk';

export function info(msg) {
  process.stdout.write(msg + '\n');
}

export function added(msg) {
  process.stdout.write(chalk.green('[+] ') + msg + '\n');
}

export function skipped(msg) {
  process.stdout.write(chalk.yellow('[-] ') + msg + '\n');
}

export function note(msg) {
  process.stdout.write(chalk.gray(msg) + '\n');
}

export function warn(msg) {
  process.stderr.write(chalk.yellow('[-] ') + msg + '\n');
}

export function error(msg) {
  process.stderr.write(chalk.red('[-] ') + msg + '\n');
}

export function heading(msg) {
  process.stdout.write(chalk.bold(msg) + '\n');
}

// Only shown in interactive mode on a TTY. Art says BLANDAID; style kept from the original VibeCurb index.js.
export function banner() {
  process.stdout.write(
    chalk.magenta.bold(`
██████╗ ██╗      █████╗ ███╗   ██╗██████╗  █████╗ ██╗██████╗ 
██╔══██╗██║     ██╔══██╗████╗  ██║██╔══██╗██╔══██╗██║██╔══██╗
██████╔╝██║     ███████║██╔██╗ ██║██║  ██║███████║██║██║  ██║
██╔══██╗██║     ██╔══██║██║╚██╗██║██║  ██║██╔══██║██║██║  ██║
██████╔╝███████╗██║  ██║██║ ╚████║██████╔╝██║  ██║██║██████╔╝
╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚═╝  ╚═╝╚═╝╚═════╝ 
`) + '\n'
  );
}
