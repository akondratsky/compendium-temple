import { ITaskRunnerService } from '../TaskRunnerService';

export class TaskRunnerService implements ITaskRunnerService {
  public run = jest.fn();
  public pause = jest.fn();
  public toggle = jest.fn();
}
