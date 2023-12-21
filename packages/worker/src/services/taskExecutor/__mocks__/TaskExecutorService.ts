import { ITaskExecutorService } from '../TaskExecutorService';

export class TaskExecutorService implements ITaskExecutorService {
  public perform = jest.fn();
}
