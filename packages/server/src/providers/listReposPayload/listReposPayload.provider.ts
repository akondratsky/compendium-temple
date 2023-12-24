import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ListReposPayload } from '@prisma/client';
import { DbClient } from '../../dataAccess/db';

export interface IListReposPayloadProvider {
  getByTaskId(taskId: number): Promise<ListReposPayload>;
}

@Injectable()
export class ListReposPayloadProvider implements IListReposPayloadProvider {
  constructor(
    private readonly db: DbClient,
  ) { }

  private readonly logger = new Logger(ListReposPayloadProvider.name);

  public async getByTaskId(taskId: number): Promise<ListReposPayload> {
    let payload: ListReposPayload | null;
    try {
      payload = await this.db.listReposPayload.findFirst({ where: { taskId } });
    } catch (e) {
      this.logger.error((e as Error).message);
      throw new InternalServerErrorException();
    }
    
    if (payload) return payload;

    this.logger.error(`No ListReposPayload found for taskId: ${taskId}`)
    throw new InternalServerErrorException();
  }
}
