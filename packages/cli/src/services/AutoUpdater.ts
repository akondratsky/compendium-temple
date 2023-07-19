import { inject, injectable } from 'tsyringe';
import { dirname } from 'node:path';
import { execSync } from 'node:child_process';
import { IAutoUpdater, IConfigurationManager, IWorkerVersionManager } from '../interfaces';
import { Injectable } from '../injectables';

@injectable()
export class AutoUpdater implements IAutoUpdater {
  constructor(
    @inject(Injectable.WorkerVersionManager) private versionManager: IWorkerVersionManager,
    @inject(Injectable.ConfigurationManager) private config: IConfigurationManager,
  ) {}

  private async update(): Promise<void> {
    const dir = dirname(require.resolve('@compendium/cli'));
    process.chdir(dir);

    let updateCommand = 'npm i --save-exact @compendium/worker@latest';

    const registryUrl = await this.config.getRegistryUrl();

    if (registryUrl) {
      updateCommand += ` --registry=${registryUrl}`;
    }

    const res = execSync(updateCommand).toString();

    console.log(res);

    // await this.versionManager.getIsLatestInstalled();
  }

  public async autoUpdate(): Promise<void> {
    const isLatestInstalled = await this.versionManager.getIsLatestInstalled();

    if (!isLatestInstalled) {
      console.log('updating...');
      await this.update();
    }
  }
}
