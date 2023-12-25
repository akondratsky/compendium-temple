import {
  MinimalRepository,
  Result,
} from '@compendium-temple/api';
import { Injectable, NotImplementedException } from '@nestjs/common';
import { TaskType } from '@prisma/client';
import { ListReposResultService } from '../listReposResult';
import { TaskManagerService } from '../taskManager';

export interface IResultsService {
  saveResult<T extends TaskType>(result: Result<T>): Promise<void>;
}

@Injectable()
export class ResultsService implements IResultsService {
  constructor(
    private readonly listReposResult: ListReposResultService,
    private readonly taskManager: TaskManagerService,
  ) {}

  public async saveResult<T extends TaskType>({ taskId, taskType, data }: Result<T>): Promise<void> {
    switch (taskType) {
      case TaskType.LIST_REPOS: {
        const repos = data as MinimalRepository[];
        await this.listReposResult.save(repos);
        await this.taskManager.createDetailRepoTasks(repos);
        await this.taskManager.markAsDone(taskId)
        break;
      }
      case TaskType.DETAIL_REPO: {
        break;
      }
      case TaskType.GET_DEPS: {
        throw new NotImplementedException();
        break;
      }
      default:
        throw new Error(`Unknown task type: ${taskType}`);
    }
  }
}