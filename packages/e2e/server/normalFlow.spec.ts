import axios, { AxiosError, AxiosResponse } from 'axios';
import { TaskWithPayload } from '@compendium-temple/api';
import { db, resetDatabase } from '../support/database';
import { TaskType } from '@prisma/client';
import { env } from '../support/env';
import { githubResponse } from '../support/stubs';

describe('Normal Flow', () => {
  let listReposTask: TaskWithPayload<typeof TaskType.LIST_REPOS>;
  const detailRepoTasks: TaskWithPayload<typeof TaskType.DETAIL_REPO>[] = [];
  const getDepsTasks: TaskWithPayload<typeof TaskType.GET_DEPS>[] = [];

  beforeAll(async () => {
    await resetDatabase();
  });


  describe('get first list repo task', () => {
    let response: AxiosResponse<TaskWithPayload<typeof TaskType.LIST_REPOS>>;
    let error: AxiosError | undefined;

    beforeAll(async () => {
      try {
        response = await axios.post<TaskWithPayload<typeof TaskType.LIST_REPOS>>('/task');
        listReposTask = response.data;
      } catch (e) {
        error = e as AxiosError;
      }
    });

    afterAll(() => {
      error = undefined;
    });
  
    it('should return a task', async () => {
      expect(error).toBeUndefined();
      expect(response.status).toBe(201);
      expect(response.data.type).toBe(TaskType.LIST_REPOS);
      expect(response.data.since).toBe(0);
    });

    it('creates new compendium user and github user in db', async () => {
      const [ compendiumUser ] = await db.compendiumUser.findMany();
      expect(compendiumUser).toBeDefined();
      expect(compendiumUser.hash).toBeDefined();
      expect(compendiumUser.id).toBe(env.githubUserId);
      const [ githubUser ] = await db.gitHubUser.findMany();
      expect(githubUser).toBeDefined();
      expect(githubUser.id).toBe(env.githubUserId);
    });

    it('creates task with payload in database', async () => {
      const [ task ] = await db.task.findMany();
      expect(task).toBeDefined();
      expect(task.type).toBe(TaskType.LIST_REPOS);

      const [ payload ] = await db.listReposPayload.findMany();
      expect(payload).toBeDefined();
      expect(payload.taskId).toBe(task.id);
      expect(payload.since).toBe(0);
    });
  });

  describe('save list repo task result', () => {
    let response: AxiosResponse;
    let error: AxiosError | undefined;

    beforeAll(async () => {
      try {
        response = await axios.post('/result', {
          taskId: listReposTask.id,
          taskType: TaskType.LIST_REPOS,
          data: githubResponse.listRepos,
        });
      } catch (e) {
        error = e as AxiosError;
      }
    });
  
    it('returns response status 201', async () => {
      expect(error).toBeUndefined();
      expect(response).toBeDefined();
      expect(response.status).toBe(201);
    });

    it('does not create owners in db', async () => {
      const owners = await db.gitHubUser.findMany();
      expect(owners).toHaveLength(1);
      expect(owners[0].id).toBe(env.githubUserId);
    });

    it('does not creates repos in db', async () => {
      const repos = await db.repository.findMany();
      expect(repos).toHaveLength(0);
    });

    it('creates get repo details tasks in db', async () => {
      const tasks = await db.task.findMany({
        where: { type: TaskType.DETAIL_REPO }
      });
      expect(tasks).toHaveLength(3);
      const payloads = await db.detailRepoPayload.findMany();
      expect(payloads).toHaveLength(3);
    });

    it('marks task as completed in db', async () => {
      const task = await db.task.findUnique({ where: { id: listReposTask.id } });
      expect(task).toBe(null);
    });
  });


  describe.each([1,2,3])('get detail repo task %s', () => {
    let response: AxiosResponse<TaskWithPayload<typeof TaskType.DETAIL_REPO>>;
    let error: AxiosError | undefined;
    let detailTaskId: number;

    beforeAll(async () => {
      try {
        response = await axios.post<TaskWithPayload<typeof TaskType.DETAIL_REPO>>('/task');
        detailRepoTasks.push(response.data);
        detailTaskId = response.data.id;
      } catch (e) {
        error = e as AxiosError;
      }
    });

    it('server returns task', async () => {
      expect(error).toBeUndefined();
      expect(response.status).toBe(201);
      expect(response.data.type).toBe(TaskType.DETAIL_REPO);
      expect(response.data.owner).toBeOneOf(['mojombo', 'jamesgolick', 'collectiveidea']);
      expect(response.data.repo).toBeOneOf(['audited', 'markaby', 'grit']);
    });

    it('assigns task to current user', async () => {
      const task = await db.task.findUnique({ where: { id: detailTaskId } });
      expect(task).toBeDefined();
      expect(task?.compendiumUserId).toBe(env.githubUserId);
      expect(task?.requestTime).not.toBeNull();
    });
  });

  describe('save details repo task#1 for regular repo', () => {
    let response: AxiosResponse;
    let error: AxiosError | undefined;
    let task: TaskWithPayload<typeof TaskType.DETAIL_REPO>;

    it('takes new detail repo task', async () => {
      task = detailRepoTasks[0];
      try {
        response = await axios.post('/result', {
          taskId: task.id,
          taskType: TaskType.DETAIL_REPO,
          data: githubResponse.getRepo.regular,
        });
      } catch (e) {
        error = e as AxiosError;
      }
    });

    it('returns response status 201', async () => {
      expect(error).toBeUndefined();
      expect(response).toBeDefined();
      expect(response.status).toBe(201);
    });

    it('deletes task from db', async () => {
      const dbTask = await db.task.findUnique({ where: { id: task.id } });
      expect(dbTask).toBe(null);
    });

    it('does not create new get deps task in db', async () => {
      const tasks = await db.task.findMany({
        where: { type: TaskType.GET_DEPS }
      });
      expect(tasks).toHaveLength(0);
      const payloads = await db.getDepsPayload.findMany();
      expect(payloads).toHaveLength(0);
    });
  });
  
  describe('save details repo task result for public template', () => {
    let response: AxiosResponse;
    let error: AxiosError | undefined;
    let task: TaskWithPayload<typeof TaskType.DETAIL_REPO>;

    beforeAll(async () => {
      task = detailRepoTasks[1];
      try {
        response = await axios.post('/result', {
          taskId: task.id,
          taskType: TaskType.DETAIL_REPO,
          data: githubResponse.getRepo.template,
        });
      } catch (e) {
        error = e as AxiosError;
      }
    });

    it('returns response status 201', async () => {
      expect(error).toBeUndefined();
      expect(response).toBeDefined();
      expect(response.status).toBe(201);
    });

    it('deletes task from db', async () => {
      const dbTask = await db.task.findUnique({ where: { id: task.id } });
      expect(dbTask).toBe(null);
    });

    it('creates new get deps task in db', async () => {
      const tasks = await db.task.findMany({
        where: { type: TaskType.GET_DEPS }
      });
      expect(tasks).toHaveLength(1);
      const payloads = await db.getDepsPayload.findMany();
      expect(payloads).toHaveLength(1);
    });


  });

  describe('get repo deps task', () => {
    let response: AxiosResponse<TaskWithPayload<typeof TaskType.GET_DEPS>>;
    let error: AxiosError | undefined;

    beforeAll(async () => {
      try {
        response = await axios.post<TaskWithPayload<typeof TaskType.GET_DEPS>>('/task');
        getDepsTasks.push(response.data);
      } catch (e) {
        error = e as AxiosError;
      }
    });

    it('returns response status 201', async () => {
      expect(error).toBeUndefined();
      expect(response).toBeDefined();
      expect(response.status).toBe(201);
      expect(response.data.type).toBe(TaskType.GET_DEPS);
    });

    it('assigns task to current user', async () => {
      const task = await db.task.findUnique({ where: { id: response.data.id } });
      expect(task).toBeDefined();
      expect(task?.compendiumUserId).toBe(env.githubUserId);
      expect(task?.requestTime).not.toBeNull();
    });
  });

  describe('save get deps task result', () => {
    let response: AxiosResponse<TaskWithPayload<typeof TaskType.GET_DEPS>>;
    let error: AxiosError | undefined;

    beforeAll(async () => {
      try {
        response = await axios.post<TaskWithPayload<typeof TaskType.GET_DEPS>>('/result', {
          taskId: getDepsTasks[0].id,
          taskType: TaskType.GET_DEPS,
          data: ['yargs', 'chalk', 'lodash'],
        });
      } catch (e) {
        error = e as AxiosError;
      }
    });

    it('returns response status 201', async () => {
      expect(error).toBeUndefined();
      expect(response).toBeDefined();
      expect(response.status).toBe(201);
    });

    it('deletes task from db', async () => {
      const dbTask = await db.task.findUnique({ where: { id: getDepsTasks[0].id } });
      expect(dbTask).toBe(null);
    });

    it('creates dependencies in db', async () => {
      const dependencies = await db.dependencies.findMany({});
      expect(dependencies).toHaveLength(3);
    });
  });
});
