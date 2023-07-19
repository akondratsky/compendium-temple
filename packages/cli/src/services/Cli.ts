import { inject, injectable } from 'tsyringe';
import { program } from 'commander';
import type { IAutoUpdater, ICli, IConfigurationManager } from '../interfaces';
import { Injectable } from '../injectables';

type CliOptions = {
  registry?: string;
};

@injectable()
export class Cli implements ICli {
  constructor(
    @inject(Injectable.AutoUpdater) private updater: IAutoUpdater,
    @inject(Injectable.ConfigurationManager) private config: IConfigurationManager,
  ) { }

  async start(): Promise<void> {
    program
      .allowUnknownOption()
      .option('-r, --registry <string>', 'registry URL', undefined)
      .action(async ({ registry }: CliOptions) => {
        await this.config.setRegistryUrl(registry);
        await this.updater.autoUpdate();
        const { start } = await import('@compendium/worker');
        start();
      })
      .parse();
  }
}
