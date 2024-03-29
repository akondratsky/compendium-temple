import { inject, injectable } from 'tsyringe';
import { AutoUpdater } from '../autoUpdater';
import yargs from 'yargs';


@injectable()
export class Cli {
  constructor(
    @inject(AutoUpdater) private updater: AutoUpdater,
  ) { }

  async start(): Promise<void> {
    const { dev } = yargs(process.argv.slice(2))
      .option('dev', { type: 'boolean', default: false })
      .hide('dev')
      .help(false)
      .version(false)
      .parseSync();

    await this.updater.ensureLatestVersions(dev);
    const { start } = await import('@compendium-temple/worker');
    await start();
  }
}
