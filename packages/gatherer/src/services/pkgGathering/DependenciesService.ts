import { inject, injectable } from 'tsyringe';
import { DbClient } from '../../dbClient';

@injectable()
export class DependenciesService {
  constructor(
    @inject(DbClient) private readonly db: DbClient,
  ) {}

  public async saveDependencies(repoId: number, deps: string[]) {
    const packageIds = await Promise.all(deps
      .filter(name => !name.startsWith('@types/'))
      .map(async (name) => {
        const packageData = { name, sourceUserId: 0 };
        const { id } = await this.db.package.upsert({
          create: packageData,
          update: packageData,
          where: { name },
        });
        return id;
      })
    );

    await this.db.dependencies.createMany({
      data: packageIds.map((packageId) => ({
        sourceUserId: 0,
        repoId,
        packageId,
      })),
      skipDuplicates: true,
    });
  }
}