import { Controller, Post, UseGuards } from '@nestjs/common';
import { TaskManagerService } from '../services/taskManager';
import { AuthGuard } from '../auth.guard';

@Controller('task')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(
    private readonly tasksService: TaskManagerService,
  ) {}

  @Post()
  async createTask() {
    return this.tasksService.createListReposTask();
  }
}
