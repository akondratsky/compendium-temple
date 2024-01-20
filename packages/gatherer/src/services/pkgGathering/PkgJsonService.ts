import { Repository } from '@prisma/client';
import { inject, injectable } from 'tsyringe';
import axios, { AxiosError } from 'axios';
import { LoggerService } from '../LoggerService';
import { ProblematicReposService } from './ProblematicReposService';
import { PackageJson } from '@badisi/latest-version';

export class PackageJsonError extends Error {}

@injectable()
export class PkgJsonService {
  constructor(
    @inject(LoggerService) private readonly logger: LoggerService,
    @inject(ProblematicReposService) private readonly problematicRepo: ProblematicReposService,
  ) {}

  public async getDependencies(repo: Repository) {
    try {
      const url = `https://raw.githubusercontent.com/${repo.fullName}/${repo.defaultBranch}/package.json`;
      this.logger.log(`${url}`);
      const { data: pkgJson } = await axios.get<PackageJson>(url);

      if (typeof pkgJson !== 'object') {
        this.problematicRepo.mark(repo, 'invalid package.json');
        throw new PackageJsonError();
      }

      const deps = Object.keys(pkgJson.dependencies || {});
      const devDeps = Object.keys(pkgJson.devDependencies || {});

      return deps.concat(devDeps);
    } catch (e) {
      if ((e as AxiosError).response?.status === 404) {
        this.problematicRepo.mark(repo, 'no package.json');
        throw new PackageJsonError();
      }
      throw e;
    }
  }
}