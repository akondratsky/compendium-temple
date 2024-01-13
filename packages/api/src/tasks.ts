import type { Task, TaskType, ListReposPayload, GetDepsPayload, DetailRepoPayload } from '@prisma/client';

export type TaskPayloadTypeMap = {
  [TaskType.LIST_REPOS]: ListReposPayload;
  [TaskType.GET_DEPS]: GetDepsPayload;
  [TaskType.DETAIL_REPO]: DetailRepoPayload;
};

export type TaskGeneric<T extends TaskType> = Omit<Task, 'type'> & { type: T };

export type TaskPayload<T extends TaskType> = T extends keyof TaskPayloadTypeMap ? TaskPayloadTypeMap[T] : never;

export type TaskWithPayload<T extends TaskType> = TaskGeneric<T> & TaskPayload<T>;
