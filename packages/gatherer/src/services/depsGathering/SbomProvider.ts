import { Octokit } from '@octokit/rest';
import { inject, injectable } from 'tsyringe';

import { LoggerService } from '../LoggerService';
import { MissionService } from '../MissionService';

@injectable()
export class SbomService {
  constructor(
    @inject(MissionService) private readonly mission: MissionService,
    @inject(LoggerService) private readonly logger: LoggerService,
  ) { }

  private client(): Octokit {
    return new Octokit({
      auth: this.mission.token,
    });
  }

  public async getSbom(owner: string, repo: string) {
    const { data, headers } = await this.client().dependencyGraph.exportSbom({
      owner,
      repo,
    });

    const remaining = Number(headers['x-ratelimit-remaining']);
    const reset = Number(headers['x-ratelimit-reset']);

    return { sbom: data, remaining, reset };
  }
}