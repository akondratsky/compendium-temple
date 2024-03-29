import { SpdxSbom } from '@compendium-temple/api';
import { inject, injectable } from 'tsyringe';
import { DbClient } from '../../dbClient';

@injectable()
export class DependenciesService {
  constructor(
    @inject(DbClient) private readonly db: DbClient,
  ) {}

  public async saveDependencies(repoId: number, { sbom }: SpdxSbom) {
    const deps = Object.keys(
      sbom.packages.reduce((depsObj, { name }) => {
        if (name?.startsWith('npm:')) {
          const packageName = name.slice(4);
          // this is a service packages with types and I don't want to take them into account
          if (!packageName.startsWith('@types/')) {
            depsObj[packageName] = true;
          }
        }
        return depsObj;
      }, {} as Record<string, true>)
    );

    const packageIds = await Promise.all(
      deps.map(async (name) => {
        const packageData = { name, sourceUserId: 0 };
        const { id } = await this.db.package.upsert({
          create: packageData,
          update: packageData,
          where: { name },
        });
        return id;
      })
    );

    await this.db.dependency.createMany({
      data: packageIds.map((packageId) => ({
        sourceUserId: 0,
        repoId,
        packageId,
      })),
      skipDuplicates: true,
    });
  }
}