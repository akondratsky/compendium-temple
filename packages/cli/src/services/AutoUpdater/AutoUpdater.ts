import { inject, injectable } from 'tsyringe';
import { IAutoUpdater, IWorkerVersionManager } from '../../interfaces';
import { Injectable } from '../../injectables';

@injectable()
export class AutoUpdater implements IAutoUpdater {
  constructor(
    @inject(Injectable.WorkerVersionManager) private versionManager: IWorkerVersionManager,
  ) {}

  public async autoUpdate(): Promise<void> {
    const isLatestInstalled = this.versionManager.getIsLatestInstalled();
    console.log('latest version installed: ', isLatestInstalled);
  }
}
