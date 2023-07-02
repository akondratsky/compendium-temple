import { singleton } from 'tsyringe';
import { IConfigurationManager } from '../../interfaces';

@singleton()
export class ConfigurationManager implements IConfigurationManager {
  private registryUrl?: string = 'http://localhost:4873';
  private isDebug = false;

  public async setRegistryUrl(registryUrl?: string) {
    this.registryUrl = registryUrl;
  }

  public async getRegistryUrl() {
    return this.registryUrl;
  }

  public async setIsDebug(isDebug: boolean) {
    this.isDebug = isDebug;
  }

  public async getIsDebug() {
    return this.isDebug;
  }
}
