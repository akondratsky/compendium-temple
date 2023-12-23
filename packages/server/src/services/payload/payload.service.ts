import { TaskGeneric, TaskPayload } from '@compendium-temple/api';
import { InternalServerErrorException } from '@nestjs/common';
import { TaskType } from '@prisma/client';

import { ListReposPayloadProvider } from '../../providers/listReposPayload';
import { GetDepsPayloadProvider } from '../../providers/getDepsPayload';

export interface IPayloadService {
  getPayload<T extends TaskType>(task: TaskGeneric<T>): Promise<TaskPayload<T>>;
}

export class PayloadService implements IPayloadService {
  constructor(
    private readonly listReposPayload: ListReposPayloadProvider,
    private readonly getDepsPayload: GetDepsPayloadProvider,
  ) { }
  
  public async getPayload<T extends TaskType>(task: TaskGeneric<T>): Promise<TaskPayload<T>> {
    switch (task.type) {
      case TaskType.LIST_REPOS:
        return await this.listReposPayload.getByTaskId(task.id) as TaskPayload<T>;
      case TaskType.GET_DEPS:
        return await this.getDepsPayload.getByTaskId(task.id) as TaskPayload<T>;
      default:
        throw new InternalServerErrorException(`Invalid task type: ${task.type}`);
    }
  }


}
