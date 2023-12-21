import { TaskGeneric, TaskPayload, TaskWithPayload } from '@compendium-temple/api';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Task, TaskType } from '@prisma/client';
import dayjs from 'dayjs';
import { DbClient } from '../../dataAccess/db';
import { MissionProvider } from '../mission';

export interface ITaskProvider {
  create<T extends TaskType>(type: T, compendiumUserId: number): Promise<TaskWithPayload<T>>;
  updateRequestedTime(task: Task): Promise<void>;
  findAvailable(): Promise<Task | null>;
}

@Injectable()
export class TaskProvider implements ITaskProvider {
  constructor(
    private readonly db: DbClient,
    private readonly mission: MissionProvider,
  ) { }

  public async create<T extends TaskType>(type: T, compendiumUserId: number): Promise<TaskWithPayload<T>> {
    try {
      const mission = await this.mission.getState();
      return await this.db.$transaction(async (tx) => {
        const task = await tx.task.create({
          data: {
            type,
            compendiumUserId,
            isDone: false,
            requestTime: new Date(),
          },
        }) as TaskGeneric<T>;

        let payload: TaskPayload<T>;

        if (type === TaskType.LIST_REPOS) {
          payload = await tx.listReposPayload.create({
            data: {
              taskId: task.id,
              since: mission.nextListTaskRepoId,
            },
          }) as TaskPayload<T>;
        } else if (type === TaskType.GET_DEPS) {
          payload = await tx.getDepsPayload.create({
            data: {
              taskId: task.id,
              repoId: mission.nextDepsTaskRepoId,
            },
          }) as TaskPayload<T>;
        } else {
          throw new InternalServerErrorException(`Invalid task type: ${type}`);
        }

        return { ...task, ...payload };
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  public async updateRequestedTime(task: Task): Promise<void> {
    try {
      await this.db.task.update({
        where: task,
        data: {
          requestTime: new Date(),
        }
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  public async findAvailable(): Promise<Task | null> {
    const task = await this.db.task.findFirst({
      where: {
        isDone: false,
        requestTime: {
          lte: dayjs().utc().subtract(1, 'hour').toDate()
        },
      },
      orderBy: {
        requestTime: 'asc'
      },
    });

    return task ?? null;
  }
}