
import { MinimalRepository, TaskGeneric, TaskWithPayload } from '@compendium-temple/api';
import { Injectable } from '@nestjs/common';
import { TaskType } from '@prisma/client';

import { TaskProvider } from '../../providers/task';
import { PayloadService } from '../payload';
import { AuthService } from '../auth';

export interface ITaskManagerService {
  createListReposTask(): Promise<TaskWithPayload<TaskType>>;
  createGetDepsTasks(repos: MinimalRepository[]): Promise<void>;
  markAsDone(taskId: number): Promise<void>;
}

@Injectable()
export class TaskManagerService implements ITaskManagerService {
  constructor(
    private readonly tasks: TaskProvider,
    private readonly payload: PayloadService,
    private readonly auth: AuthService,
  ) {}

  public async createListReposTask(): Promise<TaskWithPayload<TaskType>> {
    const task = await this.tasks.findAvailable() as TaskGeneric<TaskType>;
    if (task !== null) {
      await this.tasks.updateRequestedTime(task);
      const payload = await this.payload.getPayload(task as TaskGeneric<TaskType>);
      return { ...task, ...payload };
    }
    return await this.tasks.createListReposTask(
      this.auth.getCurrentUserId(),
    );
  }

  public async createGetDepsTasks(repos: MinimalRepository[]): Promise<void> {
    const tasks = repos.map((repo) => this.tasks.createGetDepsTask(repo.id));
    await Promise.all(tasks);
  }

  public async markAsDone(taskId: number): Promise<void> {
    await this.tasks.markAsDone(taskId);
  }
}
