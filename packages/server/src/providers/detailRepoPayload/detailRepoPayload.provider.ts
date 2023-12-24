import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { DetailRepoPayload } from '@prisma/client';
import { DbClient } from '../../dataAccess/db';

export interface IDetailRepoPayloadProvider {
  getByTaskId(taskId: number): Promise<DetailRepoPayload>;
}

@Injectable()
export class DetailRepoPayloadProvider implements IDetailRepoPayloadProvider {
  constructor(
    private readonly db: DbClient,
  ) { }

  private readonly logger = new Logger(DetailRepoPayloadProvider.name);

  public async getByTaskId(taskId: number): Promise<DetailRepoPayload> {
    let payload: DetailRepoPayload | null;
    try {
      payload = await this.db.detailRepoPayload.findFirst({ where: { taskId } });
    } catch (e) {
      this.logger.error((e as Error).message);
      throw new InternalServerErrorException();
    }
    
    if (payload) return payload;

    this.logger.error(`No DetailRepoPayload found for taskId: ${taskId}`);
    throw new InternalServerErrorException();
  }
}
