import { Result, TaskWithPayload } from '@compendium-temple/api';
import { TaskType } from '@prisma/client';
import { inject } from 'tsyringe';
import { HttpService, IHttpService } from '../http';

export interface ICompendiumService {
  getTask<T extends TaskType>(): Promise<TaskWithPayload<T>>;
  sendResult<T extends TaskType>(result: Result<T>): Promise<void>;
};

export class CompendiumService implements CompendiumService {
  constructor(
    @inject(HttpService) private readonly http: IHttpService,
  ) { }

  public async getTask<T extends TaskType>(): Promise<TaskWithPayload<T>> {
    const { data } = await this.http.post<TaskWithPayload<T>>('/task');
    return data;
  }

  public async sendResult<T extends TaskType>(result: Result<T>) {
    await this.http.post('/result', result);
  }
}