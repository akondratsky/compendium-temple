import { Injectable, InternalServerErrorException } from '@nestjs/common';
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

  public async getByTaskId(taskId: number): Promise<ListReposPayload> {
    let payload: ListReposPayload | null;
    try {
      payload = await this.db.listReposPayload.findFirst({ where: { taskId } });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
    
    if (payload) return payload;

    throw new InternalServerErrorException(`No ListReposPayload found for taskId: ${taskId}`);
  }
}
