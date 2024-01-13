import { Result, TaskWithPayload } from '@compendium-temple/api';
import { TaskType } from '@prisma/client';
import { inject, injectable } from 'tsyringe';
import { version } from '../../package.json';
import { HttpService, IHttpService } from '../http';
import { ILoggerService, LoggerService } from '../logger';
import { AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios';
import { ConfigService, IConfigService } from '../config';

export interface ICompendiumService {
  getTask<T extends TaskType>(): Promise<TaskWithPayload<T>>;
  sendResult<T extends TaskType>(result: Result<T>): Promise<void>;
};

@injectable()
export class CompendiumService implements CompendiumService {
  constructor(
    @inject(ConfigService) private readonly config: IConfigService,
    @inject(HttpService) private readonly http: IHttpService,
    @inject(LoggerService) private readonly logger: ILoggerService,
  ) { }



  public async getTask<T extends TaskType>(): Promise<TaskWithPayload<T>> {
    const { data, headers } = await this.http.post<TaskWithPayload<T>>('/task');
    this.checkApiVersionFromHeaders(headers);
    return data;
  }

  public async sendResult<T extends TaskType>(result: Result<T>) {
    const { headers } = await this.http.post('/result', result);
    this.checkApiVersionFromHeaders(headers);
  }

  private checkApiVersionFromHeaders(headers: AxiosResponseHeaders | RawAxiosResponseHeaders) {
    if (this.config.isDev) {
      return;
    }
    const apiWorkerVersion = headers['x-compendium-worker-version'];
    if (version !== apiWorkerVersion) {
      this.logger.error(`Server expects worker version ${version} but current version is ${apiWorkerVersion}`);
      this.logger.info('Please restart: with the "compendium" command');
      process.exit(0);
    }
  }
}