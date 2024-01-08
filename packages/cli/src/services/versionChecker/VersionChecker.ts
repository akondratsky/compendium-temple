import { injectable } from 'tsyringe';
import { readFile } from 'node:fs/promises';
import getLatestVersion from '@badisi/latest-version';
import { compare } from 'compare-versions';


@injectable()
export class VersionChecker {
  /**
   * Checks if latest version of the package is installed in the CLI
   */
  public async getIsLatestInstalled(packageName: string, registryUrl: string): Promise<boolean> {
    const packageJsonPath = require.resolve(`${packageName}/package.json`);

    const [latest, jsonFile] = await Promise.all([
      this.getLatestVersion(packageName, registryUrl),
      readFile(packageJsonPath, 'utf-8'),
    ]);

    const currentVersion = JSON.parse(jsonFile)['version'];

    return compare(latest, currentVersion, '=');
  }


  /**
   * Gets the package version from artifactory tagged as the latest
   */
  private async getLatestVersion(packageName: string, registryUrl: string): Promise<string> {
    const { latest } = await getLatestVersion(
      packageName,
      { registryUrl }
    );
  
    if (latest) return latest;

    throw new Error(`Package ${packageName} not found in the registry`);
  }
}
