import { inject, injectable } from 'tsyringe';
import type { IAutoUpdater, ICli } from '../../interfaces';
import { Injectable } from '../../injectables';


@injectable()
export class Cli implements ICli {
  constructor(
    @inject(Injectable.AutoUpdater) private updater: IAutoUpdater,
  ) { }

  async start(): Promise<void> {
    await this.updater.autoUpdate();
  }
}
