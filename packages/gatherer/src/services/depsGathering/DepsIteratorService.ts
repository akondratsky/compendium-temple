import { inject, injectable } from 'tsyringe';
import { MissionService } from '../MissionService';
import { RepoService } from '../reposGathering/RepoService';
import { SbomError, SbomService } from './SbomProvider';
import { LoggerService } from '../LoggerService';
import { TimeService } from './TimeService';
import { DependenciesService } from './DependenciesService';
import dayjs from 'dayjs';
import { SpdxSbom } from '@compendium-temple/api';
import { RemovedReposService } from './RemovedReposService';

@injectable()
export class DepsIteratorService {
  constructor(
    @inject(MissionService) private readonly mission: MissionService,
    @inject(RepoService) private readonly repos: RepoService,
    @inject(SbomService) private readonly sbom: SbomService,
    @inject(LoggerService) private readonly logger: LoggerService,
    @inject(TimeService) private readonly time: TimeService,
    @inject(DependenciesService) private readonly deps: DependenciesService,
    @inject(RemovedReposService) private readonly removed: RemovedReposService,
  ) {}

  public async start() {
    const progress = this.mission.loadProgress();
    const count = await this.repos.getReposCount();

    this.logger.info(`!!! Starting from offset ${progress.lastOffset}`);

    let sbom: SpdxSbom = {} as SpdxSbom;
    let remaining = 0;
    let reset = 0;


    while (progress.lastOffset < count) {
      const repo = await this.repos.getRepoByOffset(progress.lastOffset);

      if (!repo?.owner?.login || !repo.name) {
        console.dir(repo, { depth: 5 });
        throw new Error('Issue with repo record');
      }

      let isSbomError = false;

      try {
        const result = await this.sbom.getSbom(repo?.owner?.login, repo.name);
        sbom = result.sbom;
        remaining = result.remaining;
        reset = result.reset;
      } catch (e) {
        if (e instanceof SbomError) {
          isSbomError = true;
          await this.removed.removeRepo(repo);
        }
      }
      
      if (!isSbomError) {
        await this.deps.saveDependencies(repo.id, sbom);
      }

      progress.lastOffset++;
      this.mission.saveProgress(progress);
      this.logger.log(`done: ${repo.fullName}, limit: ${remaining}`);

      if (!isSbomError && remaining < 100) {
        const timestamp = dayjs(reset * 1000).format('YYYY-MM-DD HH:mm:ss');
        this.logger.warn(`Limit is around to be reached (${remaining}), waiting until ${timestamp}`);
        await this.time.waitUntil(reset * 1000);
      }
    }
  }
}