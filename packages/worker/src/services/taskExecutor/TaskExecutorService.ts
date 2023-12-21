import { inject, singleton, delay } from 'tsyringe';
import { AxiosResponse } from 'axios';
import { TaskType } from '@prisma/client';
import { TaskWithPayload } from '@compendium-temple/api';

import { HttpService, IHttpService } from '../http';
import { ILoggerService, LoggerService } from '../logger';


export interface ITaskExecutorService {
  perform(): Promise<void>;
}


/**
 * Service responsible for getting tasks and their execution
 */
@singleton()
export class TaskExecutorService implements ITaskExecutorService {
  constructor(
    @inject(delay(() => HttpService)) private http: IHttpService,
    @inject(LoggerService) private logger: ILoggerService,
  ){ }

  public async perform() {
    const task = await this.getTask();
    console.log(task)
  }

  private async getTask() {
    try {
      const { data }: AxiosResponse<TaskWithPayload<TaskType>> = await this.http.post('/tasks');
      this.logger.log(JSON.stringify(data));
    } catch (e) {
      this.logger.error(JSON.stringify(e));
      process.exit();
    }
  }
}