
import { TaskGeneric, TaskWithPayload } from '@compendium-temple/api';
import { Injectable } from '@nestjs/common';
import { TaskType } from '@prisma/client';

import { TaskProvider } from '../../providers/task';
import { PayloadService } from '../payload';
import { AuthService } from '../auth';

@Injectable()
export class TaskManagerService {
  constructor(
    private readonly tasks: TaskProvider,
    private readonly payload: PayloadService,
    private readonly auth: AuthService,
  ) {}

  async assignTask(): Promise<TaskWithPayload<TaskType>> {
    const task = await this.tasks.findAvailable() as TaskGeneric<TaskType>;

    if (task !== null) {
      await this.tasks.updateRequestedTime(task);
      const payload = await this.payload.getPayload(task as TaskGeneric<TaskType>);
      return { ...task, ...payload };
    }

    return await this.tasks.create(
      TaskType.LIST_REPOS,
      this.auth.getCurrentUserId(),
    );
  }
}
