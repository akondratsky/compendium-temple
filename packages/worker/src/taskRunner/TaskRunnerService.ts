import { inject, injectable } from 'tsyringe';
import { CompendiumService, ICompendiumService } from '../compendium';
import { TaskType } from '@prisma/client';
import { RateLimit, TaskWithPayload } from '@compendium-temple/api';
import { GithubService, IGithubService } from '../github';
import { ConfigService, IConfigService } from '../config';
import { ITimeService, TimeService } from '../time';

@injectable()
export class TaskRunnerService {
  constructor(
    @inject(CompendiumService) private readonly compendium: ICompendiumService,
    @inject(GithubService) private readonly github: IGithubService,
    @inject(ConfigService) private readonly config: IConfigService,
    @inject(TimeService) private readonly time: ITimeService,
  ) { }

  private isRunning = true;
  private requestsMade = 0;

  public async run() {
    while (this.isRunning) {
      const rateLimit = await this.runSession();
      await this.sleepUntilReset(rateLimit);
    }
  }

  private async sleepUntilReset({ reset }: RateLimit): Promise<void> {
    const waitTime = this.time.getTimeDifferenceInMilliseconds(reset);
    return new Promise((resolve) => setTimeout(resolve, waitTime));
  }

  /**
   * Perform tasks until rate limit reached, returns the latest request rate limit
   */
  private async runSession(): Promise<RateLimit> {
    let rateLimit = await this.github.getRateLimit();

    while (this.isRunning && rateLimit.remaining > this.config.remainingLimit) {
      await this.performTask();

      this.requestsMade++;

      // we want to throttle rate limit requests a bit to make less number of requests
      if (this.requestsMade > 9) {
        rateLimit = await this.github.getRateLimit();
      }
    }

    return rateLimit;
  }

  private async performTask<T extends TaskType>() {
    const task = await this.compendium.getTask<T>();
    switch (task.type) {
      case TaskType.LIST_REPOS: {
        const { since } = task as TaskWithPayload<typeof TaskType.LIST_REPOS>;
        const repos = await this.github.listRepos(since);
        await this.compendium.sendResult({
          taskId: task.id,
          taskType: task.type,
          data: repos,
        });
        break;
      }
      case TaskType.GET_DEPS: {
        // TODO: perform get deps task
        throw new Error('Not implemented');
      }
      default:
        throw new Error(`Unknown task type: ${task.type}`);
    }
  }
}
