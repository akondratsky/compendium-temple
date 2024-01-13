import { delay, inject, injectable } from 'tsyringe';
import ora from 'ora';
import { CompendiumService, ICompendiumService } from '../compendium';
import type { TaskType } from '@prisma/client';
import { RateLimit, ResultDataTypeMap, SpdxSbom, TaskWithPayload } from '@compendium-temple/api';
import { GithubService, IGithubService } from '../github';
import { ConfigService, IConfigService } from '../config';
import { ITimeService, TimeService } from '../time';

export interface ITaskRunnerService {
  run(): Promise<void>;
}

@injectable()
export class TaskRunnerService implements ITaskRunnerService {
  constructor(
    @inject(ConfigService) private readonly config: IConfigService,
    @inject(TimeService) private readonly time: ITimeService,
    @inject(delay(() => CompendiumService)) private readonly compendium: ICompendiumService,
    @inject(delay(() => GithubService)) private readonly github: IGithubService,
  ) { }

  private isRunning = true;
  private spinner = ora('Running tasks');;

  public async run() {
    this.spinner.start();
    while (this.isRunning) {
      const rateLimit = await this.runSession();
      this.spinner.text = 'Waiting for rate limit reset...';
      await this.time.waitUntil(rateLimit.reset);
    }
  }

  /**
   * Perform tasks until rate limit reached, returns the latest request rate limit
   */
  private async runSession(): Promise<RateLimit> {
    let rateLimit = await this.github.getRateLimit();
    while (this.isRunning && rateLimit.remaining > this.config.remainingLimit) {
      rateLimit = await this.performTask();
    }
    return rateLimit;
  }

  private async performTask<T extends TaskType>(): Promise<RateLimit> {
    const task = await this.compendium.getTask<T>();
    this.spinner.text = `Performing task #${task.id}...`;
    switch (task.type) {
      case 'LIST_REPOS': {
        const { since } = task as TaskWithPayload<typeof TaskType.LIST_REPOS>;
        const { data, rateLimit } = await this.github.listRepos(since);
        await this.compendium.sendResult<typeof TaskType.LIST_REPOS>({
          taskId: task.id,
          taskType: task.type,
          data,
        });
        return rateLimit;
      }
      case 'DETAIL_REPO': {
        const { owner, repo } = task as TaskWithPayload<typeof TaskType.DETAIL_REPO>;
        const { data, rateLimit } = await this.github.getRepo(owner, repo);
        await this.compendium.sendResult<typeof TaskType.DETAIL_REPO>({
          taskId: task.id,
          taskType: task.type,
          data,
        });
        return rateLimit;
      }
      case 'GET_DEPS': {
        const { owner, repo } = task as TaskWithPayload<typeof TaskType.GET_DEPS>;
        const { data, rateLimit } = await this.github.getSpdxSbom(owner, repo);
        await this.compendium.sendResult<typeof TaskType.GET_DEPS>({
          taskId: task.id,
          taskType: task.type,
          data: this.mapSpdxSbom(data),
        });
        return rateLimit;
      }
      default:
        throw new Error(`Unknown task type: ${task.type}`);
    }
  }

  private mapSpdxSbom({ sbom }: SpdxSbom): ResultDataTypeMap[typeof TaskType.GET_DEPS] {
    return Object.keys(sbom.packages.reduce((deps, { name }) => {
      if (name?.startsWith('npm:')) {
        deps[name.slice(4)] = true;
      }
      return deps;
    }, {} as Record<string, true>));
  }
}
