import { resolve } from 'path';
import { userInfo } from 'os';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { inject, singleton } from 'tsyringe';
import { LoggerService } from './LoggerService';

type Progress = {
  // repos gathering
  date: string;
  period: number;

  // deps gathering
  lastOffset: number;
}

const defaultProgress: Progress = {
  date: '2012-01-01T00:00:00.000Z',
  period: 8,
  lastOffset: 0,
}

@singleton()
export class MissionService {
  constructor(
    @inject(LoggerService) private readonly logger: LoggerService,
  ) {}

  public token = '';
  
  // search for repos
  public language: 'typescript' | 'javascript' = 'typescript';
  public attemptsToIncrease = 6;
  public maxPeriod = 8;

  private readonly configFilePath = resolve(userInfo().homedir, '.compendium-gatherer.json');

  public loadProgress(): Progress {
    try {
      return existsSync(this.configFilePath)
        ? JSON.parse(readFileSync(this.configFilePath, 'utf-8'))
        : defaultProgress;
    } catch (e) {
      throw new Error('Error reading progress file');
    }
  }

  public reset() {
    this.logger.warn('ATTENTION! RESETTING PROGRESS!');
    this.saveProgress(defaultProgress);
  }

  public saveProgress(progress: Partial<Progress>) {
    try {
      writeFileSync(
        this.configFilePath,
        JSON.stringify({
          ...this.loadProgress(),
          ...progress,
        }, null, 2)
      );
    } catch (e) {
      throw new Error('Error writing progress file');
    }
  }
}