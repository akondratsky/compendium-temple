import { inject, singleton } from 'tsyringe';
import { EventEmitterService, WorkerEvent } from '../eventEmitter';
import { LoggerService } from '../logger';
import { ITaskExecutorService, TaskExecutorService } from '../taskExecutor';

export interface ITaskRunnerService {
  run(): Promise<void>;
  pause(): Promise<void>;
  toggle(): Promise<void>;
}

/**
 * Service which automatically gets new tasks and sends results to the server.
 * It can be controlled from UI and configured with ConfigurationService.
 */
@singleton()
export class TaskRunnerService implements ITaskRunnerService {
  constructor(
    @inject(EventEmitterService) private readonly eventEmitter: EventEmitterService,
    @inject(LoggerService) private readonly logger: LoggerService,
    @inject(TaskExecutorService) private readonly taskExecutor: ITaskExecutorService,
  ) {
    this.eventEmitter.addListener(WorkerEvent.RunTaskRunner, () => this.run());
    this.eventEmitter.addListener(WorkerEvent.PauseTaskRunner, () => this.pause());
    this.eventEmitter.addListener(WorkerEvent.ToggleTaskRunner, () => this.toggle());
  }

  /** is currently task runner working */
  private isRun = true;
  private taskPromise?: Promise<void>;


  /** start / resume tasks cycle flow */
  public async run() {
    this.isRun = true;
    this.logger.info('Task runner started');
    // do {
    //   this.taskPromise = this.taskExecutor.perform();
    //   await this.taskPromise;
    // } while (this.isRun);
  }

  /** pause tasks cycle flow */
  public async pause() {
    this.isRun = false;
    await this.taskPromise
    this.logger.info('Task runner paused');
  }

  /** pause / resume */
  public async toggle() {
    return this.isRun ? this.pause() : this.run();
  }

  private async getAndRunTask() {
    this.logger.log('Getting new task...');
    // TODO: implement getAndRunTask
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  }
}