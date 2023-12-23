import { TaskGeneric, TaskWithPayload } from '@compendium-temple/api';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Task, TaskType } from '@prisma/client';
import dayjs from 'dayjs';
import { DbClient } from '../../dataAccess/db';
import { MissionProvider } from '../mission';

export interface ITaskProvider {
  createListReposTask(compendiumUserId: number): Promise<TaskWithPayload<typeof TaskType.LIST_REPOS>>;
  createGetDepsTask(repoId: number): Promise<TaskWithPayload<typeof TaskType.GET_DEPS>>;
  updateRequestedTime(task: Task): Promise<void>;
  findAvailable(): Promise<Task | null>;
  markAsDone(taskId: number): Promise<void>;
}

@Injectable()
export class TaskProvider implements ITaskProvider {
  constructor(
    private readonly db: DbClient,
    private readonly mission: MissionProvider,
  ) { }

  public async createListReposTask(compendiumUserId: number): Promise<TaskWithPayload<typeof TaskType.LIST_REPOS>> {
    try {
      const mission = await this.mission.getState();

      return await this.db.$transaction(async (tx) => {
        const task = await tx.task.create({
          data: {
            type: TaskType.LIST_REPOS,
            compendiumUserId,
            isDone: false,
            requestTime: compendiumUserId ? new Date() : null,
          },
        }) as TaskGeneric<typeof TaskType.LIST_REPOS>;

        const payload = await tx.listReposPayload.create({
          data: {
            taskId: task.id,
            since: mission.nextListTaskRepoId,
          },
        });

        await tx.missionState.update({
          where: { id: 1 },
          data: {
            nextListTaskRepoId: mission.nextListTaskRepoId + 100,
          },
        })

        return { ...task, ...payload };
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  public async createGetDepsTask(repoId: number): Promise<TaskWithPayload<typeof TaskType.GET_DEPS>> {
    try {
      return await this.db.$transaction(async (tx) => {
        const task = await tx.task.create({
          data: {
            type: TaskType.GET_DEPS,
            compendiumUserId: null,
            isDone: false,
            requestTime: null,
          },
        }) as TaskGeneric<typeof TaskType.GET_DEPS>;
  
        const payload = await tx.getDepsPayload.create({
          data: {
            taskId: task.id,
            repoId,
          },
        });
  
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

  public async markAsDone(taskId: number): Promise<void> {
    try {
      await this.db.task.update({
        where: { id: taskId },
        data: {
          isDone: true,
        }
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}