import { TaskGeneric, TaskPayload } from '@compendium-temple/api';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { TaskType } from '@prisma/client';

import { ListReposPayloadProvider } from '../../providers/listReposPayload';
import { GetDepsPayloadProvider } from '../../providers/getDepsPayload';
import { DetailRepoPayloadProvider } from '../../providers/detailRepoPayload';

export interface IPayloadService {
  getPayload<T extends TaskType>(task: TaskGeneric<T>): Promise<TaskPayload<T>>;
}

@Injectable()
export class PayloadService implements IPayloadService {
  constructor(
    private readonly listReposPayload: ListReposPayloadProvider,
    private readonly getDepsPayload: GetDepsPayloadProvider,
    private readonly detailRepoPayload: DetailRepoPayloadProvider,
  ) { }

  private readonly logger = new Logger(PayloadService.name);
  
  public async getPayload<T extends TaskType>(task: TaskGeneric<T>): Promise<TaskPayload<T>> {
    switch (task.type) {
      case TaskType.LIST_REPOS:
        return await this.listReposPayload.getByTaskId(task.id) as TaskPayload<T>;
      case TaskType.GET_DEPS:
        return await this.getDepsPayload.getByTaskId(task.id) as TaskPayload<T>;
      case TaskType.DETAIL_REPO:
        return await this.detailRepoPayload.getByTaskId(task.id) as TaskPayload<T>;
      default:
        this.logger.error(`Invalid task type: ${task.type}`);
        throw new InternalServerErrorException();
    }
  }
}
