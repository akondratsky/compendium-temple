import { inject, injectable } from 'tsyringe';
import { dirname } from 'node:path';
import { execSync } from 'node:child_process';
import chalk from 'chalk';
import { VersionChecker } from '../versionChecker';

@injectable()
export class AutoUpdater {
  constructor(
    @inject(VersionChecker) private versionChecker: VersionChecker,
  ) {}

  private readonly packageName = '@compendium-temple/worker';

  public async ensureLatestVersions(isDev: boolean) {
    const registryUrl = isDev ? 'http://localhost:4873/' : 'https://registry.npmjs.org/';

    const dir = dirname(require.resolve('@compendium-temple/cli'));
    process.chdir(dir);

    console.log('Checking for updates ...');

    const isLatestInstalled = await this.versionChecker.getIsLatestInstalled(this.packageName, registryUrl);
    if (!isLatestInstalled) {
      console.log(`Updating ${this.packageName} ...`);
      const updateCommand = `npm i --save-exact ${this.packageName}@latest --registry=${registryUrl}`;
      const output = execSync(updateCommand).toString();
      console.log(chalk.gray(output));
    }
  }
}
