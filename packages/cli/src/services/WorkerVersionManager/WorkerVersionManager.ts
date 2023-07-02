import { injectable } from 'tsyringe';
import getLatestVersion from '@badisi/latest-version';
import { IWorkerVersionManager } from '../../interfaces';

@injectable()
export class WorkerVersionManager implements IWorkerVersionManager {
  async getIsLatestInstalled(): Promise<boolean> {
    const latest = await this.getLatestVersion();

    console.log(`Latest version: ${latest}`);
    console.log(`
      __dirname: ${__dirname}
      cwd: ${process.cwd()}
    `)

    return false;
  }

  async getLatestVersion(): Promise<string> {
    const { latest } = await getLatestVersion('@compendium/cli', {
      registryUrl: 'http://localhost:4873/',
    });

    if (!latest) {
      throw new Error('package not found');
    }

    return latest;
  }
}
