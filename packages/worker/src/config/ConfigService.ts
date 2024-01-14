import { singleton } from 'tsyringe';
import yargs from 'yargs';
import registryUrl from 'registry-url';
import { prompt } from 'enquirer';
import { resolve } from 'path';
import { userInfo } from 'os';
import { existsSync, readFileSync, writeFileSync } from 'fs';

export interface IConfigService {
  init(): Promise<void>;

  isDev: boolean;
  registryUrl: string;
  apiUrl: string;
  remainingLimit: number;
}

type CompendiumConfiguration = {
  remainingLimit: number;
};

@singleton()
export class ConfigService implements IConfigService {
  public registryUrl = registryUrl('@compendium');
  public apiUrl = '';
  public isDev = false;
  public remainingLimit = 500;

  private readonly configFilePath = resolve(userInfo().homedir, '.compendium.config.json');

  public async init(): Promise<void> {
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
      this.isDev = true;
      this.apiUrl = 'http://localhost:3000/api';
      this.registryUrl = 'http://localhost:4873';
    }

    const fileConfiguration = this.readConfigFile();

    if (config) {
      const promptResult = await this.promptConfiguration(fileConfiguration);
      this.writeConfigFile(promptResult);
      this.remainingLimit = promptResult.remainingLimit;
    } else {
      this.remainingLimit = fileConfiguration.remainingLimit;
    }
  }

  private readConfigFile(): CompendiumConfiguration {
    try {
      return existsSync(this.configFilePath)
        ? JSON.parse(readFileSync(this.configFilePath, 'utf-8'))
        : { remainingLimit: 500 } as CompendiumConfiguration;
    } catch (e) {
      throw new Error('Error reading configuration file');
    }
  }

  private writeConfigFile(config: CompendiumConfiguration) {
    try {
      writeFileSync(this.configFilePath, JSON.stringify(config, null, 2));
    } catch (e) {
      throw new Error('Error writing configuration file');
    }
  }

  private async promptConfiguration(defaults: CompendiumConfiguration): Promise<CompendiumConfiguration> {
    const limitChoices = [100, 500, 1000, 2000, 3000, 4000];
    const answer = await prompt<{ remainingLimit: string }>({
      type: 'select',
      name: 'remainingLimit',
      initial: limitChoices.indexOf(defaults.remainingLimit),
      message: 'Limit of requests per hour the worker should leave before pause',
      choices: limitChoices.map(String),
    });

    return {
      remainingLimit: Number(answer.remainingLimit),
    };
  }
}