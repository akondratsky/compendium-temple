import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GetDepsPayload } from '@prisma/client';
import { DbClient } from '../../dataAccess/db';

export interface IGetDepsPayloadProvider {
  create(taskId: number, repoId: number): Promise<GetDepsPayload>;
  getByTaskId(taskId: number): Promise<GetDepsPayload>;
}

@Injectable()
export class GetDepsPayloadProvider implements IGetDepsPayloadProvider {
  constructor(
    private readonly db: DbClient,
  ) { }

  public async create(taskId: number, repoId: number): Promise<GetDepsPayload> {
    try {
      return await this.db.getDepsPayload.create({
        data: { taskId, repoId }
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  public async getByTaskId(taskId: number): Promise<GetDepsPayload> {
    let payload: GetDepsPayload | null;
    try {
      payload = await this.db.getDepsPayload.findFirst({ where: { taskId } });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
    
    if (payload) return payload;

    throw new InternalServerErrorException(`No GetDepsPayload found for taskId: ${taskId}`);
  }
}
