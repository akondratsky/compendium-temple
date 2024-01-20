import { inject, injectable } from 'tsyringe';
import { MissionService } from '../MissionService';
import dayjs from 'dayjs';
import dayjsUtc from 'dayjs/plugin/utc';
import { SearchService } from './SearchService';
import { RepoService } from './RepoService';
import { LoggerService } from '../LoggerService';

dayjs.extend(dayjsUtc);

@injectable()
export class SearchIteratorService {
  constructor(
    @inject(MissionService) private readonly progressService: MissionService,
    @inject(SearchService) private readonly searchService: SearchService,
    @inject(RepoService) private readonly repoService: RepoService,
    @inject(LoggerService) private readonly logger: LoggerService,
    @inject(MissionService) private readonly mission: MissionService,
  ) {}

  private showMustGoOn = true;
  private attemptsAfterHalving = 0;
  private page = 1;
  private paginated = false;

  public async start() {
    const progress = this.progressService.loadProgress();

    this.logger.log(`!!! Starting from ${progress.date} with period ${progress.period} days`);

    while (this.showMustGoOn) {
      const from = dayjs.utc(progress.date);
      const to = from.add(progress.period, 'day');

      if (from.isAfter(dayjs.utc())) {
        this.showMustGoOn = false;
        break;
      }

      // we will try gradually increasing the period if we get complete results:
      if (
        this.attemptsAfterHalving > this.mission.attemptsToIncrease
        && progress.period < this.mission.maxPeriod
        && this.page === 1
      ) {
        this.attemptsAfterHalving = 0;
        progress.period = Math.floor(progress.period * 2);
        this.logger.warn(`!!! Increasing to ${progress.period} days`);
        this.progressService.saveProgress(progress);
      }
  
      const { incomplete_results, items, total_count } = await this.searchService.search(from, to, this.page);

      if (incomplete_results && progress.period > 1) {
        this.attemptsAfterHalving = 0;
        this.page = 1;
        progress.period = Math.floor(progress.period / 2);
        this.logger.warn(`!!! Incomplete results, decreasing to ${progress.period} days`);
        this.progressService.saveProgress(progress);
        continue;
      }

      this.attemptsAfterHalving++;

      await Promise.all([
        // wait 3 seconds
        new Promise(resolve => setTimeout(resolve, 2500)),
        // save results and progress
        (async () => {
          await this.repoService.saveSearchResult(items);

          if (total_count > 100 && this.page * 100 < total_count) {
            this.page++;
          } else {
            this.page = 1;
            progress.date = to.add(1, 'day').utc().format();
            this.progressService.saveProgress(progress);
          }
        })(),
      ]);
    }
  }
}