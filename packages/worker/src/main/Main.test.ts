import { Main } from './Main';
import { ConfigService } from '@compendium-temple/config';
import { GuiService } from '../services/gui';
import { AuthService } from '../services/auth';
import { TaskRunnerService } from '../services/taskRunner';


jest.mock('@compendium-temple/config');
jest.mock('../auth/AuthService');
jest.mock('../gui/GuiService');
jest.mock('../taskRunner/TaskRunnerService');


describe('WorkerInitializer', () => {
  const di = createTestDI(ConfigService, GuiService, AuthService, TaskRunnerService);

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('initializes config', async () => {
    await di.resolve(Main).start();
    const configServiceMock = jest.mocked(di.resolve(ConfigService));
    expect(configServiceMock.init).toHaveBeenCalledTimes(1);
  });

  it('renders GUI after config is initialized', async () => {
    await di.resolve(Main).start();
    const configServiceMock = jest.mocked(di.resolve(ConfigService));
    const guiServiceMock = jest.mocked(di.resolve(GuiService));
    expect(guiServiceMock.render).toHaveBeenCalledAfter(configServiceMock.init);
  });

  it('runs authorization after GUI is rendered', async () => {
    await di.resolve(Main).start();
    const guiServiceMock = jest.mocked(di.resolve(GuiService));
    const authServiceMock = jest.mocked(di.resolve(AuthService));
    expect(authServiceMock.authorize).toHaveBeenCalledAfter(guiServiceMock.render);
  });

  it('starts task runner after authorization', async () => {
    await di.resolve(Main).start();
    const authServiceMock = jest.mocked(di.resolve(AuthService));
    const taskRunnerServiceMock = jest.mocked(di.resolve(TaskRunnerService));
    expect(taskRunnerServiceMock.run).toHaveBeenCalledAfter(authServiceMock.authorize);
  });
});
