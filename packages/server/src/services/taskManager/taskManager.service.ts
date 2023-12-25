
import { MinimalRepository, TaskGeneric, TaskWithPayload } from '@compendium-temple/api';
import { Injectable, Logger } from '@nestjs/common';
import { TaskType } from '@prisma/client';

import { TaskProvider } from '../../providers/task';
import { PayloadService } from '../payload';
import { AuthService } from '../auth';


export interface ITaskManagerService {
  getAvailableOrCreateTask(): Promise<TaskWithPayload<TaskType>>;
  createDetailRepoTasks(repos: MinimalRepository[]): Promise<void>;
  createGetDepsTask(repo: MinimalRepository): Promise<void>;
  markAsDone(taskId: number): Promise<void>;
}

@Injectable()
export class TaskManagerService implements ITaskManagerService {
  constructor(
    private readonly tasks: TaskProvider,
    private readonly payload: PayloadService,
    private readonly auth: AuthService,
  ) {}

  private readonly logger = new Logger(TaskManagerService.name);

  public async getAvailableOrCreateTask(): Promise<TaskWithPayload<TaskType>> {
    const task = await this.tasks.findAvailable() as TaskGeneric<TaskType>;
    this.logger.debug(`Found task: ${task?.id ?? null}`);

    if (task) {
      await this.tasks.assignTask(task, this.auth.getCurrentUserId());
      const payload = await this.payload.getPayload(task as TaskGeneric<TaskType>);
      return { ...task, ...payload };
    }
    return await this.tasks.createListReposTask(
      this.auth.getCurrentUserId(),
    );
  }

  public async createDetailRepoTasks(repos: MinimalRepository[]): Promise<void> {
    this.logger.debug(`Creating detail repo tasks, repoIds: [${repos.map((repo) => repo.id).join(',')}]`);
    const tasks = repos.map((repo) => this.tasks.createDetailRepoTask(repo));
    await Promise.all(tasks);
  }

  public async createGetDepsTask(repo: MinimalRepository): Promise<void> {
    this.logger.log(`Creating get dependencies task for repo: ${repo.full_name}`);
    await this.tasks.createGetDepsTask(repo.id);
  }

  public async markAsDone(taskId: number): Promise<void> {
    await this.tasks.markAsDone(taskId);
  }
}
