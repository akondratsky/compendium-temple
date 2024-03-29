import { TaskType } from '@prisma/client';
import { MinimalRepository } from './github';

export type ResultDataTypeMap = {
  [TaskType.LIST_REPOS]: MinimalRepository[];
  [TaskType.DETAIL_REPO]: MinimalRepository;
  [TaskType.GET_DEPS]: string[];
};

export type Result<T extends TaskType> = {
  taskId: number;
  taskType: T;
  data: ResultDataTypeMap[T];
};
