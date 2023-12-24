import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import {
  MinimalRepository,
  CodeOfConduct as CodeOfConductResponse,
  License as LicenseResponse,
} from '@compendium-temple/api';
import { uniqBy } from 'lodash';
import { MapperUtil } from '../../utils/mapper';
import { DbClient } from '../../dataAccess/db';

export interface IListReposResultService {
  save(repos: MinimalRepository[]): Promise<void>;
}

@Injectable()
export class ListReposResultService implements IListReposResultService {
  constructor(
    private readonly db: DbClient,
    private readonly mapper: MapperUtil,
  ) { }

  /**
   * Saves owners, code of conducts, licenses and repositories from GitHub API response
   */
  public async save(repos: MinimalRepository[]): Promise<void> {
    try {
      const owners = uniqBy(
        repos.map(({ owner }) => this.mapper.ownerToGithubUser(owner)),
        'id'
      );
      const codeOfConducts = uniqBy(
        repos.filter(repo => !!repo.code_of_conduct)
          .map((repo) => this.mapper.codeOfConduct(repo.code_of_conduct as CodeOfConductResponse)),
        'key'
      );
      const licenses = uniqBy(
        repos.filter(repo => !!repo.license)
          .map((repo) => this.mapper.license(repo.license as LicenseResponse)),
        'key'
      );

      Logger.debug(
        'Saving list repos result...'
        + ` Repo:${repos.length} Own:${owners.length} CoC:${codeOfConducts.length} Lic:${licenses.length}`
      );

      await Promise.all([
        ...owners.map((owner) => this.db.gitHubUser.upsert({
          where: { id: owner.id },
          create: owner,
          update: owner,
        })),
        ...codeOfConducts.map((codeOfConduct) => this.db.codeOfConduct.upsert({
          where: { key: codeOfConduct.key },
          create: codeOfConduct,
          update: codeOfConduct,
        })),
        ...licenses.map((license) => this.db.license.upsert({
          where: { key: license.key },
          create: license,
          update: license,
        })),
      ]);

      await Promise.all(repos
        .map((repo) => this.mapper.repository(repo))
        .map((repo) => this.db.repository.upsert({
          where: { id: repo.id },
          create: repo,
          update: repo,
        })),
      );
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}