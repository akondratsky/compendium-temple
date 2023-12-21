import { inject, injectable } from 'tsyringe';
import { readFile } from 'node:fs/promises';
import { ConfigService } from '@compendium-temple/config';
import getLatestVersion from '@badisi/latest-version';
import { compare } from 'compare-versions';


@injectable()
export class VersionChecker {
  constructor(
    @inject(ConfigService) private config: ConfigService
  ) { }

  /**
   * Checks if latest version of the package is installed in the CLI
   */
  public async getIsLatestInstalled(packageName: string): Promise<boolean> {
    const packageJsonPath = require.resolve(`${packageName}/package.json`);

    const [latest, jsonFile] = await Promise.all([
      this.getLatestVersion(packageName),
      readFile(packageJsonPath, 'utf-8'),
    ]);

    const currentVersion = JSON.parse(jsonFile)['version'];

    return compare(latest, currentVersion, '=');
  }


  /**
   * Gets the package version from artifactory tagged as the latest
   */
  private async getLatestVersion(packageName: string): Promise<string> {
    const { latest } = await getLatestVersion(
      packageName,
      { registryUrl: this.config.get().registryUrl }
    );
  
    if (latest) return latest;

    throw new Error(`Package ${packageName} not found in the registry`);
  }
}
