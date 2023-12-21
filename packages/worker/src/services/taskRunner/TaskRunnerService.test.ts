import { EventEmitterService, WorkerEvent } from '../eventEmitter';
import { LoggerService } from '../logger';
import { TaskExecutorService } from '../taskExecutor';
import { TaskRunnerService } from './TaskRunnerService';

jest.mock('../logger/LoggerService');
jest.mock('../taskExecutor/TaskExecutorService');

describe('TaskRunnerService', () => {
  const di = createTestDI(EventEmitterService, LoggerService, TaskExecutorService);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('runs and stops pause executor', async () => {
    const taskRunnerService = di.resolve(TaskRunnerService);
    const taskExecutorServiceMock = jest.mocked<TaskExecutorService>(di.resolve(TaskExecutorService));
    taskExecutorServiceMock.perform.mockResolvedValue(Promise.resolve());
    taskRunnerService.run();
    await taskRunnerService.pause();
    expect(taskExecutorServiceMock.perform).toHaveBeenCalledTimes(1);
  });

  it('toggle method resumes and pauses executor', async () => {
    const taskRunnerService = di.resolve(TaskRunnerService);
    const taskExecutorServiceMock = jest.mocked<TaskExecutorService>(di.resolve(TaskExecutorService));
    taskExecutorServiceMock.perform.mockResolvedValue(Promise.resolve());
    taskRunnerService.toggle();
    await taskRunnerService.toggle();
    expect(taskExecutorServiceMock.perform).toHaveBeenCalledTimes(1);
  });

  describe('listens for WorkerEvents', () => {
    const testCases = [
      { event: WorkerEvent.RunTaskRunner, method: 'run' },
    ] as const;

    testCases.forEach(({ event, method }) => {
      it(`event ${event} calls ${method} method`, async () => {
        const taskRunnerService = di.resolve(TaskRunnerService);
        const eventEmitterService = di.resolve(EventEmitterService);
        const methodSpy = jest.spyOn(taskRunnerService, method).mockImplementation(jest.fn());
        eventEmitterService.emit(event);
        expect(methodSpy).toHaveBeenCalledTimes(1);
        methodSpy.mockReset();
      });
    })
  });
});