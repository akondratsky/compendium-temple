import { injectable } from 'tsyringe';
import { join, dirname } from 'node:path';
import { createLogger, transports, format } from 'winston';

export interface ILoggerService {
  info(message: string): Promise<void>;
  debug(message: string): Promise<void>;
  error(message: string): Promise<void>;
}

/**
 * Responsible for the logging process, logs to the UI and file
 */
@injectable()
export class LoggerService implements ILoggerService {
  private readonly logger = createLogger({
    level: 'debug',
    transports: [
      new transports.Console({
        level: 'info',
        format: format.printf(({ message }) => message),
      }),
      new transports.File({
        level: 'debug',
        filename: join(
          dirname(require.resolve('@compendium-temple/cli')),
          'worker.log'
        ),
        format: format.combine(
          format.timestamp(),
          format.printf(({ message, level, timestamp }) => `[${timestamp}][${level}] ${message}`),
        ),
        maxsize: 5242880, // 5MB
      }),
    ],
  });

  public async info(message: string) {
    this.logger.info(message);
  }

  public async debug(message: string) {
    this.logger.debug(message);
  }

  public async error(message: string) {
    this.logger.error(message);
  }
}