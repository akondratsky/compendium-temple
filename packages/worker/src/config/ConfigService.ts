import { injectable } from 'tsyringe';
import yargs from 'yargs';
import registryUrl from 'registry-url';
import { resolve } from 'path';
import { userInfo } from 'os';
import { existsSync, readFileSync } from 'fs';


export interface IConfigService {
  init(): void;

  registryUrl: string;
  apiUrl: string;
  remainingLimit: number;
}

type CompendiumConfiguration = {
  rateLimit: number;
};

@injectable()
export class ConfigService implements IConfigService {
  public registryUrl = registryUrl('@compendium');
  public apiUrl = '';
  public remainingLimit = 500;

  private readonly configFilePath = resolve(userInfo().homedir, '.compendium.config.json');

  public init() {
    const { config, dev } = yargs(process.argv.slice(2))
      .options({
        config: { type: 'boolean', default: false, description: 'Setup configuration' },
        dev: { type: 'boolean', default: false, description: 'Run in development mode' },
      })
      .strict(true)
      .hide('version')
      .hide('dev')
      .help()
      .parseSync();

    if (dev) {
      this.apiUrl = 'http://localhost:3000/api';
      this.registryUrl = 'http://localhost:4873';
    }

    if (config) {
      // TODO: implement config setup
    } else {
      this.readConfigFile();
    }
  }

  private readConfigFile(): CompendiumConfiguration {
    try {
      return existsSync(this.configFilePath)
        ? JSON.parse(readFileSync(this.configFilePath, 'utf-8'))
        : {} as CompendiumConfiguration;
    } catch (e) {
      throw new Error('Error reading configuration file')
    }
  }
}