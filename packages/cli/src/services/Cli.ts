// import { program } from 'commander';
import { inject, injectable } from 'inversify';
import worker from '@compendium/worker';
import type { ICli, IWorkerVersionManager } from '../interfaces';
import { Injectable } from '../injectables';

@injectable()
export class Cli implements ICli {
  constructor(
    @inject(Injectable.WorkerVersionManager) private workerVersionManager: IWorkerVersionManager,
  ) { }

  async start(): Promise<void> {
    const version = await this.workerVersionManager.getLatestVersion();
    console.log(version);
    worker();
    // program
    //   .option('--debug')
    //   .parse();
  }
}
