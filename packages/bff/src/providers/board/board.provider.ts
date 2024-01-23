import { Injectable } from '@nestjs/common';
import { DbClient } from '../../dataAccess/db';

export interface IBoardProvider {
  count(userId: number): Promise<void>;
}

@Injectable()
export class BoardProvider implements IBoardProvider {
  constructor(
    private readonly db: DbClient,
  ) {}

  public async count(userId: number): Promise<void> {
    const record = await this.db.board.findUnique({ where: { userId } });
  
    if (record) {
      await this.db.board.update({
        where: { userId },
        data: { count: { increment: 1 } },
      });
    } else {
      await this.db.board.create({
        data: { userId, count: 1 },
      });
    }
  }
}
