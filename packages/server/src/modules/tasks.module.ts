import { Module } from '@nestjs/common';

import { TasksController } from '../controllers/tasks.controller';

import { MissionProvider } from '../providers/mission';
import { AuthService } from '../services/auth';
import { GithubUserProvider } from '../providers/githubUser';
import { TaskManagerService } from '../services/taskManager/taskManager.service';
import { DbClient } from '../dataAccess/db';
import { HashService } from '../services/hash';
import { OctokitClient } from '../dataAccess/octokit';

@Module({
  controllers: [TasksController],
  providers: [
    DbClient,
    OctokitClient,
    TaskManagerService,
    MissionProvider,
    AuthService,
    GithubUserProvider,
    HashService,
  ],
})
export class TasksModule {}
