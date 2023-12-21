import { Result } from '@compendium-temple/api';
import { TaskType } from '@prisma/client';

export class ResultDto<T extends TaskType> {
  public taskId?: number;
  public taskType?: T;
  public data?: Result<T>['data'];
}
