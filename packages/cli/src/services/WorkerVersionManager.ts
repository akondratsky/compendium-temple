import { injectable } from 'inversify';
import getLatestVersion from '@badisi/latest-version';
import { IWorkerVersionManager } from '../interfaces';

@injectable()
export class WorkerVersionManager implements IWorkerVersionManager {
  async getIsLatestInstalled(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async getLatestVersion(): Promise<string> {
    const { latest } = await getLatestVersion('@compendium/cli', {
      registryUrl: 'http://localhost:4873/'
    });

    if (!latest) {
      throw new Error('package not found');
    }

    return latest;
  }
}
