import { inject, injectable } from 'tsyringe';
import yargs from 'yargs';
import { SearchIteratorService } from './services/reposGathering/SearchIteratorService';
import { MissionService } from './services/MissionService';


@injectable()
export class Cli {
  constructor(
    @inject(MissionService) private readonly mission: MissionService,
    @inject(SearchIteratorService) private readonly searchIterator: SearchIteratorService,
  ) {}

  async start(): Promise<void> {
    const { token, reset } = yargs(process.argv.slice(2))
      .command(
        'repos',
        '- start repos gathering',
        yargs => yargs
          .option('language', { type: 'string', default: true })
          .option('increase', { type: 'number', default: 6 })
          .option('maxperiod', { type: 'number', default: 8 }),
        async ({ increase, language, maxperiod }) => {
          console.log('command')
          this.mission.maxPeriod = maxperiod;
          this.mission.attemptsToIncrease = increase;
          this.mission.language = language as 'typescript' | 'javascript';
          await this.searchIterator.start();
        }
      )
      .command(
        'deps',
        '- start dependencies gathering',
        yargs => yargs,
        () => {
          console.log('command')
        }
      )
      .option('reset', { type: 'boolean', default: false })
      .option('token', { type: 'string', demandOption: true })
      .help(false)
      .strict()
      .version(false)
      .parseSync();

    this.mission.token = token;

    if (reset) {
      this.mission.reset();
    }







  }
}
