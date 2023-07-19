import { singleton } from 'tsyringe';
import { IConfigurationManager } from '../interfaces';

@singleton()
export class ConfigurationManager implements IConfigurationManager {
  private registryUrl?: string;

  public setRegistryUrl(registryUrl?: string) {
    this.registryUrl = registryUrl;
  }

  public getRegistryUrl() {
    return this.registryUrl;
  }
}
