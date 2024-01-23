import { Controller, Logger, Body, Post } from '@nestjs/common';
import { SearchReposParams } from '../dto/SearchReposParams';
import { ReposService } from '../services/repos';


@Controller('repos')
export class ReposController {
  constructor(
    private readonly repos: ReposService,
  ) {}

  private readonly logger = new Logger(ReposController.name);

  @Post('search')
  async search(@Body() params: SearchReposParams) {
    this.logger.debug(`POST /repos/search`);
    return this.repos.search(params);
  }
}
