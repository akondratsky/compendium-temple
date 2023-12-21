import { inject, injectable } from 'tsyringe';
import { EventEmitterService, WorkerEvent } from '../eventEmitter';

export interface ILoggerService {
  info(message: string): Promise<void>;
  warn(message: string): Promise<void>;
  error(message: string): Promise<void>;
  log(message: string): Promise<void>;
}

/**
 * Responsible for the logging process, logs to the UI and file
 */
@injectable()
export class LoggerService implements ILoggerService {
  constructor(
    @inject(EventEmitterService) private readonly eventEmitter: EventEmitterService,
  ){ }

  public async info(message: string) {
    this.eventEmitter.emit(WorkerEvent.GuiLog, { level: 'info', message });
  }

  public async warn(message: string) {
    this.eventEmitter.emit(WorkerEvent.GuiLog, { level: 'warn', message });
  }

  public async error(message: string) {
    this.eventEmitter.emit(WorkerEvent.GuiLog, { level: 'error', message });
  }

  public async log(message: string) {
    this.eventEmitter.emit(WorkerEvent.GuiLog, { level: 'log', message });
  }
}