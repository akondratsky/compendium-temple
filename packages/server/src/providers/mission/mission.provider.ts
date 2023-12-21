import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MissionState, TaskType } from '@prisma/client';
import { DbClient } from '../../dataAccess/db';

export interface IMissionProvider {
  getState(): Promise<MissionState>;
  updateLastTaskId(taskType: TaskType, taskId: number): Promise<void>;
}

@Injectable()
export class MissionProvider implements IMissionProvider {
  constructor(
    private readonly db: DbClient,
  ) {}

  private typeToDbFieldMap: Record<TaskType, keyof MissionState> = {
    [TaskType.LIST_REPOS]: 'nextListTaskRepoId',
    [TaskType.GET_DEPS]: 'nextDepsTaskRepoId',
  };

  public async getState() {
    const state = await this.db.missionState.findFirst();
    if (!state) {
      throw new InternalServerErrorException('MissionState was not initialized');
    }
    return state;
  }

  public async updateLastTaskId(taskType: TaskType, taskId: number) {
    await this.db.missionState.update({
      where: { id: 1 },
      data: {
        [this.typeToDbFieldMap[taskType]]: taskId,
      } as Partial<MissionState>
    })
  }
}
