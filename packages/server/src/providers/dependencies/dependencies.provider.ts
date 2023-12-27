import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { DbClient } from '../../dataAccess/db';

export interface IDependenciesProvider {
  save(repoId: number, dependencies: string[]): Promise<void>;
}

@Injectable()
export class DependenciesProvider implements IDependenciesProvider {
  constructor(
    private readonly db: DbClient,
  ) {}

  private readonly logger = new Logger(DependenciesProvider.name);

  public async save(taskId: number, dependencies: string[]): Promise<void> {
    try {
      await this.db.$transaction(async (tx) => {
        const { owner, repo } = await tx.getDepsPayload.findFirstOrThrow({ where: { taskId } });
        const { id: repoId } = await tx.repository.findFirstOrThrow({
          where: { 
            owner: { login: owner }, 
            name: repo,
          },
        });
        await tx.dependencies.deleteMany({
          where: {
            repoId,
          },
        });
        await tx.dependencies.createMany({
          data: dependencies.map((dependency) => ({
            repoId,
            name: dependency,
          })),
        });
      });
    } catch (e) {
      this.logger.error((e as Error).message);
      throw new InternalServerErrorException();
    }
    
  }
}