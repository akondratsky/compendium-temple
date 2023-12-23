import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MissionState } from '@prisma/client';
import { DbClient } from '../../dataAccess/db';

export interface IMissionProvider {
  getState(): Promise<MissionState>;
}

@Injectable()
export class MissionProvider implements IMissionProvider {
  constructor(
    private readonly db: DbClient,
  ) {}

  public async getState() {
    const state = await this.db.missionState.findFirst();
    if (!state) {
      throw new InternalServerErrorException('MissionState was not initialized');
    }
    return state;
  }
}
