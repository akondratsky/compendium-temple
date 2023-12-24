import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
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

  private readonly logger = new Logger(GetDepsPayloadProvider.name);

  public async create(taskId: number, repoId: number): Promise<GetDepsPayload> {
    try {
      return await this.db.getDepsPayload.create({
        data: { taskId, repoId }
      });
    } catch (e) {
      this.logger.error((e as Error).message);
      throw new InternalServerErrorException();
    }
  }

  public async getByTaskId(taskId: number): Promise<GetDepsPayload> {
    let payload: GetDepsPayload | null;
    try {
      payload = await this.db.getDepsPayload.findFirst({ where: { taskId } });
    } catch (e) {
      this.logger.error((e as Error).message);
      throw new InternalServerErrorException();
    }
    
    if (payload) return payload;

    this.logger.error(`No GetDepsPayload found for taskId: ${taskId}`);
    throw new InternalServerErrorException();
  }
}
