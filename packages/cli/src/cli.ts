import { program } from 'commander';
import type { ICli } from './interfaces';

export class Cli implements ICli {
  start(): void {
    program
      .option('--debug')
      .parse();
  }
}
