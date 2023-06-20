import { program } from 'commander';
import { inject, injectable } from 'inversify';
import type { ICli, IWorkerVersionManager } from '../interfaces';
import { Injectable } from '../injectables';

@injectable()
export class Cli implements ICli {
  constructor(
    @inject(Injectable.WorkerVersionManager) private workerVersionManager: IWorkerVersionManager,
  ) { }

  async start(): Promise<void> {
    const version = await this.workerVersionManager.getLatestVersion();
    console.log(`Latest worker version: ${version}`);

    program
      .option('--debug')
      .parse();
  }
}
