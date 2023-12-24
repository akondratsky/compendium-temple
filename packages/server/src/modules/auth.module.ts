import { Module } from '@nestjs/common';
import { AuthService } from '../services/auth';
import { GithubUserProvider } from '../providers/githubUser';
import { CompendiumUserProvider } from '../providers/compendiumUser';
import { OctokitClient } from '../dataAccess/octokit';
import { HashUtil } from '../utils/hash';
import { DbClient } from '../dataAccess/db';
import { MapperUtil } from '../utils/mapper';
import { AuthGuard } from '../auth.guard';

@Module({
  providers: [
    AuthService,
    AuthGuard,
    GithubUserProvider,
    CompendiumUserProvider,
    OctokitClient,
    DbClient,
    HashUtil,
    MapperUtil,
  ],
  exports: [
    AuthService,
  ]
})
export class AuthModule {}