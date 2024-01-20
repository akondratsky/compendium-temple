import { inject, injectable } from 'tsyringe';
import yargs from 'yargs';
import { SearchIteratorService } from './services/reposGathering/SearchIteratorService';
import { MissionService } from './services/MissionService';
import { DepsIteratorService } from './services/depsGathering/DepsIteratorService';


@injectable()
export class Cli {
  constructor(
    @inject(MissionService) private readonly mission: MissionService,
    @inject(SearchIteratorService) private readonly searchIterator: SearchIteratorService,
    @inject(DepsIteratorService) private readonly depsIterator: DepsIteratorService,
  ) {}

  async start(): Promise<void> {
    await yargs(process.argv.slice(2))
      .command(
        'repos',
        '- start repos gathering',
        yargs => yargs
          .option('language', { type: 'string', default: true })
          .option('increase', { type: 'number', default: 6 })
          .option('maxperiod', { type: 'number', default: 8 })
          .option('reset', { type: 'boolean', default: false })
          .option('token', { type: 'string', demandOption: true }),
        async ({ increase, language, maxperiod, token, reset }) => {
          if (reset) {
            this.mission.reset();
          }
          this.mission.token = token;
          this.mission.maxPeriod = maxperiod;
          this.mission.attemptsToIncrease = increase;
          this.mission.language = language as 'typescript' | 'javascript';
          await this.searchIterator.start();
        }
      )
      .command(
        'deps',
        '- start dependencies gathering',
        yargs => yargs
          .option('reset', { type: 'boolean', default: false })
          .option('token', { type: 'string', demandOption: true }),
        async ({ token, reset }) => {
          if (reset) {
            this.mission.reset();
          }
          this.mission.token = token;
          await this.depsIterator.start();
        }
      )
      .help(false)
      .strict()
      .version(false)
      .parse();











  }
}
