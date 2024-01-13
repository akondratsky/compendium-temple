import { Controller, InternalServerErrorException, Logger, Post, UseGuards } from '@nestjs/common';
import { TaskManagerService } from '../services/taskManager';
import { AuthGuard } from '../auth.guard';

@Controller('task')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(
    private readonly tasksService: TaskManagerService,
  ) {}

  private readonly logger = new Logger(TasksController.name);

  @Post()
  async createTask() {
    throw new InternalServerErrorException();
    this.logger.log('POST /task')
    return this.tasksService.getAvailableOrCreateTask();
  }
}
