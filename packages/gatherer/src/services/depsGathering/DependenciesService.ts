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
          depsObj[name.slice(4)] = true;
        }
        return depsObj;
      }, {} as Record<string, true>)
    );

    this.db.$transaction(async (tx) => {
      await tx.dependencies.deleteMany({
        where: {
          repoId,
        },
      });
      const packageIds = [];
      for (const name of deps) {
        const { id: packageId } = await tx.package.create({
          data: { name, sourceUserId: 0 },
        });
        packageIds.push(packageId);
      }
      await tx.dependencies.createMany({
        data: packageIds.map((packageId) => ({
          sourceUserId: 0,
          repoId,
          packageId,
        })),
      });
    });
  }
}