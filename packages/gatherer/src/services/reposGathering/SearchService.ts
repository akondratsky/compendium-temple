import { Octokit } from '@octokit/rest';
import { inject, injectable } from 'tsyringe';
import { Dayjs } from 'dayjs';

import { LoggerService } from '../LoggerService';
import { MissionService } from '../MissionService';

@injectable()
export class SearchService {
  constructor(
    @inject(MissionService) private readonly mission: MissionService,
    @inject(LoggerService) private readonly logger: LoggerService,
  ) { }

  private client(): Octokit {
    return new Octokit({
      auth: this.mission.token,
    });
  }

  public async search(from: Dayjs, to: Dayjs, page: number) {
    const fromDate = `${from.format('YYYY')}-${from.format('MM')}-${from.format('DD')}`;
    const toDate = `${to.format('YYYY')}-${to.format('MM')}-${to.format('DD')}`;

    const { data, headers } = await this.client().search.repos({
      q: `template:true+language:${this.mission.language}+created:${fromDate}..${toDate}`,
      per_page: 100,
      page,
    });

    const remaining = Number(headers['x-ratelimit-remaining']);

    this.logger.info(`FROM: ${fromDate}   TO: ${toDate}    PAGE: ${page}`);

    if (remaining === 0) {
      console.error('Limit reached, is there an issue?');
      process.exit(1);
    }

    return data;
  }
}