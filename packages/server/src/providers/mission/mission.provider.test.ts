import { MissionState } from '@prisma/client';
import { MissionProvider } from './mission.provider';
import { DbClient } from '../../dataAccess/db';

jest.mock('../../dataAccess/db/dbClient');

describe('MissionProvider', () => {
  let db: DbClient;

  const globalMissionStateStub: MissionState = {
    apiVersion: '1.0.0-test',
    id: 1,
    nextListTaskRepoId: 13,
  };

  let missionService: MissionProvider;

  beforeEach(() => {
    db = new DbClient();
    missionService = new MissionProvider(db);

    jest.mocked(db.missionState.findFirst)
      .mockResolvedValue(globalMissionStateStub)
  });

  afterEach(jest.resetAllMocks);

  it('getState() returns the single row of MissionState table', async () => {
    const state = await missionService.getState();
    expect(state).toBe(globalMissionStateStub);
  });
});
