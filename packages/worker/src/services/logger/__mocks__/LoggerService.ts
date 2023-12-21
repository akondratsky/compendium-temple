import { ILoggerService } from '../LoggerService';

export class LoggerService implements ILoggerService {
  public log = jest.fn();
  public warn = jest.fn();
  public error = jest.fn();
  public info = jest.fn();
}
