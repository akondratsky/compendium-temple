import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { TaskType } from '@prisma/client';
import { ResultsService } from '../services/results';
import { AuthGuard } from '../auth.guard';
import { ResultDto } from './ResultDto';
import { Result } from '@compendium-temple/api';

@Controller('result')
@UseGuards(AuthGuard)
export class ResultsController {
  constructor(
    private readonly resultsService: ResultsService,
  ) { }

  private readonly logger = new Logger(ResultsController.name);

  @Post()
  async returnResult(@Body() repository: ResultDto<TaskType>) {
    this.logger.log('POST /result');
    await this.resultsService.saveResult(repository as Result<TaskType>);
  }
}
