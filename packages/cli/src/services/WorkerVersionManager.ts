import { inject, injectable } from 'tsyringe';
import getLatestVersion from '@badisi/latest-version';
import { readFile } from 'node:fs/promises';
import { compare } from 'compare-versions';

import { IConfigurationManager, IWorkerVersionManager } from '../interfaces';
import { Injectable } from '../injectables';


@injectable()
export class WorkerVersionManager implements IWorkerVersionManager {
  constructor(
    @inject(Injectable.ConfigurationManager) private config: IConfigurationManager
  ) { }

  public async getIsLatestInstalled(): Promise<boolean> {
    const packageJsonPath = require.resolve('@compendium/worker/package.json');
    const [latest, jsonFile] = await Promise.all([
      this.getLatestVersion(),
      readFile(packageJsonPath, 'utf-8'),
    ]);
    const currentVersion = JSON.parse(jsonFile)['version'];
    console.log(`Latest version: ${latest}, installed: ${currentVersion}`);
    return compare(latest, currentVersion, '=');
  }

  private async getLatestVersion(): Promise<string> {
    const registryUrl = await this.config.getRegistryUrl();
    console.log('registryUrl getLatestVersion()', registryUrl);
    const { latest } = await getLatestVersion('@compendium/worker', { registryUrl });

    if (latest) return latest;

    throw new Error('package not found');
  }
}
