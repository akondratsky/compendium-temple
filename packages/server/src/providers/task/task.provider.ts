import { MinimalRepository, TaskGeneric, TaskWithPayload } from '@compendium-temple/api';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Task, TaskType } from '@prisma/client';
import dayjs from 'dayjs';
import { DbClient } from '../../dataAccess/db';
import { MissionProvider } from '../mission';

export interface ITaskProvider {
  createListReposTask(compendiumUserId: number): Promise<TaskWithPayload<typeof TaskType.LIST_REPOS>>;
  createDetailRepoTask(repo: MinimalRepository): Promise<TaskWithPayload<typeof TaskType.DETAIL_REPO>>;
  createGetDepsTask(repo: MinimalRepository): Promise<TaskWithPayload<typeof TaskType.GET_DEPS>>;
  assignTask(task: Task, compendiumUserId: number): Promise<void>;
  findAvailable(): Promise<Task | null>;
  delete(taskId: number): Promise<void>;
}

@Injectable()
export class TaskProvider implements ITaskProvider {
  constructor(
    private readonly db: DbClient,
    private readonly mission: MissionProvider,
  ) { }

  private readonly logger = new Logger(TaskProvider.name);

  public async createListReposTask(compendiumUserId: number): Promise<TaskWithPayload<typeof TaskType.LIST_REPOS>> {
    try {
      const mission = await this.mission.getState();

      return await this.db.$transaction(async (tx) => {
        const task = await tx.task.create({
          data: {
            type: TaskType.LIST_REPOS,
            compendiumUserId,
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
      this.logger.error((e as Error).message);
      throw new InternalServerErrorException();
    }
  }

  public async createDetailRepoTask(repo: MinimalRepository): Promise<TaskWithPayload<typeof TaskType.DETAIL_REPO>> {
    try {
      return await this.db.$transaction(async (tx) => {
        const task = await tx.task.create({
          data: {
            type: TaskType.DETAIL_REPO,
            compendiumUserId: null,
            requestTime: null,
          },
        }) as TaskGeneric<typeof TaskType.DETAIL_REPO>;
  
        const payload = await tx.detailRepoPayload.create({
          data: {
            taskId: task.id,
            owner: repo.owner.login,
            repo: repo.name,
          },
        });
  
        return { ...task, ...payload };
      });
    } catch (e) {
      this.logger.error((e as Error).message);
      throw new InternalServerErrorException();
    }
  }

  public async createGetDepsTask(repo: MinimalRepository): Promise<TaskWithPayload<typeof TaskType.GET_DEPS>> {
    try {
      return await this.db.$transaction(async (tx) => {
        const task = await tx.task.create({
          data: {
            type: TaskType.GET_DEPS,
            compendiumUserId: null,
            requestTime: null,
          },
        }) as TaskGeneric<typeof TaskType.GET_DEPS>;
  
        const payload = await tx.getDepsPayload.create({
          data: {
            taskId: task.id,
            owner: repo.owner.login,
            repo: repo.name,
          },
        });
  
        return { ...task, ...payload };
      });
    } catch (e) {
      this.logger.error((e as Error).message);
      throw new InternalServerErrorException();
    }
  }

  public async assignTask(task: Task, compendiumUserId: number): Promise<void> {
    try {
      await this.db.task.update({
        where: task,
        data: {
          requestTime: new Date(),
          compendiumUserId,
        }
      });
    } catch (e) {
      this.logger.error((e as Error).message);
      throw new InternalServerErrorException();
    }
  }

  public async findAvailable(): Promise<Task | null> {
    try {
      const task = await this.db.task.findFirst({
        where: {
          OR: [{
            requestTime: {
              lte: dayjs().utc().subtract(1, 'hour').toDate()
            },
          }, {
            requestTime: null,
          }],
          
        },
        orderBy: {
          requestTime: 'asc'
        },
      });
      return task ?? null;
    } catch (e) {
      this.logger.error((e as Error).message);
      throw new InternalServerErrorException();
    }
  }

  public async delete(taskId: number): Promise<void> {
    try {
      await this.db.task.delete({
        where: { id: taskId },
      });
    } catch (e) {
      this.logger.error((e as Error).message);
      throw new InternalServerErrorException();
    }
  }
}