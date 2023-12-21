import { Result } from '@compendium-temple/api';
import { Injectable, NotImplementedException } from '@nestjs/common';
import { TaskType } from '@prisma/client';

export interface IResultsService {
  saveResult<T extends TaskType>(result: Result<T>): Promise<void>;
}

@Injectable()
export class ResultsService implements IResultsService {
  async saveResult<T extends TaskType>(result: Result<T>): Promise<void> {
    throw new NotImplementedException();
    console.log(result);
  }
}