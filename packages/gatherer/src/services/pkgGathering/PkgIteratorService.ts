import { inject, injectable } from 'tsyringe';
import { MissionService } from '../MissionService';
import { LoggerService } from '../LoggerService';
import { PackageJsonError, PkgJsonService } from './PkgJsonService';
import { DependenciesService } from './DependenciesService';
import { DbClient } from '../../dbClient';

@injectable()
export class PkgIteratorService {
  constructor(
    @inject(MissionService) private readonly mission: MissionService,
    @inject(LoggerService) private readonly logger: LoggerService,
    @inject(PkgJsonService) private readonly pkgJsonService: PkgJsonService,
    @inject(DependenciesService) private readonly depsService: DependenciesService,
    @inject(DbClient) private readonly db: DbClient,
  ) {}

  public async start() {
    const progress = this.mission.loadProgress();
    const count = await this.db.repository.count();

    this.logger.info(`!!! Starting from offset ${progress.lastOffset}`);

    while (progress.lastOffset < count) {
      this.logger.info(`${progress.lastOffset + 1}/${count}`);

      const repo = await this.db.repository.findFirstOrThrow({
        skip: progress.lastOffset,
        orderBy: { createdAt: 'asc' },
      });

      try {
        const dependencies = await this.pkgJsonService.getDependencies(repo);
        await this.depsService.saveDependencies(repo.id, dependencies);
      } catch (e) {
        if (!(e instanceof PackageJsonError)) {
          throw e;
        }
      }

      progress.lastOffset++;
      this.mission.saveProgress(progress);
      this.logger.info(`${repo.fullName}: done\n`);
    }
  }
}