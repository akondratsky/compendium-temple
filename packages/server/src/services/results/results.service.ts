import {
  MinimalRepository,
  Result,
} from '@compendium-temple/api';
import { Injectable, Logger } from '@nestjs/common';
import { TaskType } from '@prisma/client';
import { TaskManagerService } from '../taskManager';
import { DetailRepoResultService } from '../detailsRepoResult';
import { DependenciesProvider } from '../../providers/dependencies';
import { AuthService } from '../auth';

export interface IResultsService {
  saveResult<T extends TaskType>(result: Result<T>): Promise<void>;
}

@Injectable()
export class ResultsService implements IResultsService {
  constructor(
    private readonly detailRepoResult: DetailRepoResultService,
    private readonly taskManager: TaskManagerService,
    private readonly dependencies: DependenciesProvider,
    private readonly auth: AuthService,
  ) {}

  private readonly logger = new Logger(ResultsService.name);

  public async saveResult<T extends TaskType>({ taskId, taskType, data }: Result<T>): Promise<void> {
    switch (taskType) {
      case TaskType.LIST_REPOS: {
        const repos = data as MinimalRepository[];
        await this.taskManager.createDetailRepoTasks(repos);
        break;
      }
      case TaskType.DETAIL_REPO: {
        const repo = data as MinimalRepository;
        if (this.shouldBeInvestigated(repo)) {
          await this.detailRepoResult.save(repo);
          await this.taskManager.createGetDepsTask(repo);
        }
        break;
      }
      case TaskType.GET_DEPS: {
        const sourceUserId = this.auth.getCurrentUserId();
        this.dependencies.save(taskId, data as string[], sourceUserId)
        break;
      }
      default:
        throw new Error(`Unknown task type: ${taskType}`);
    }
    await this.taskManager.accomplish(taskId);
  }

  private shouldBeInvestigated(repo: MinimalRepository): boolean {
    const shouldBeInvestigated = !!repo.is_template
      && repo.visibility === 'public'
      && !repo.disabled
      && (repo.language === 'TypeScript' || repo.language === 'JavaScript');

    this.logger.log(shouldBeInvestigated
      ? `Public template found: ${repo.full_name}`
      : `Repo ${repo.full_name} does not satisfy the requirements.`
    );

    return shouldBeInvestigated;
  }
}