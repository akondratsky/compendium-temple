import { Command } from 'commander';

/**
 * saving persistent configuration for compendium worker
 */
export const configCommand = new Command('config')
  .action(() => {
    throw new Error('not implemented yet');
  });
