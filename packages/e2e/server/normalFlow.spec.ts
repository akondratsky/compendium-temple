import axios, { AxiosError, AxiosResponse } from 'axios';
import { TaskWithPayload } from '@compendium-temple/api';
import { db, resetDatabase } from '../support/database';
import { TaskType } from '@prisma/client';
import { env } from '../support/env';
import { githubResponse } from '../support/stubs';

describe('Normal Flow', () => {
  let listReposTaskId: number;
  let detailRepoTask: number;

  beforeAll(async () => {
    await resetDatabase();
  });


  describe('create list repo task', () => {
    let response: AxiosResponse<TaskWithPayload<typeof TaskType.LIST_REPOS>>;
    let error: AxiosError | undefined;

    beforeAll(async () => {
      try {
        response = await axios.post<TaskWithPayload<typeof TaskType.LIST_REPOS>>('/task');
        listReposTaskId = response.data.id;
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

    it('creates new users in db', async () => {
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
      expect(task.isDone).toBe(false);
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
          taskId: listReposTaskId,
          taskType: TaskType.LIST_REPOS,
          data: githubResponse.listRepos,
        });
      } catch (e) {
        error = e as AxiosError;
      }
    });
  
    it('returns response status 201', async () => {
      expect(response).toBeDefined();
      expect(error).toBeUndefined();
      expect(response.status).toBe(201);
    });

    it('creates users from owners in db', async () => {
      const owners = await db.gitHubUser.findMany();
      expect(owners).toHaveLength(4);
      expect(owners.some((owner) => owner.id === 1)).toBe(true);
      expect(owners.some((owner) => owner.id === 37)).toBe(true);
      expect(owners.some((owner) => owner.id === 128)).toBe(true);
    });

    it('creates repos in db', async () => {
      const repos = await db.repository.findMany();
      expect(repos).toHaveLength(3);
      expect(repos.some((repo) => repo.id === 1)).toBe(true);
      expect(repos.some((repo) => repo.id === 73)).toBe(true);
      expect(repos.some((repo) => repo.id === 363)).toBe(true);
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
      const task = await db.task.findUnique({ where: { id: listReposTaskId } });
      expect(task).toBeDefined();
      expect(task?.compendiumUserId).toBe(env.githubUserId);
      expect(task?.isDone).toBe(true);
    });
  });

  describe('get detail repo task', () => {
    let response: AxiosResponse<TaskWithPayload<typeof TaskType.DETAIL_REPO>>;
    let error: AxiosError | undefined;

    beforeAll(async () => {
      try {
        response = await axios.post<TaskWithPayload<typeof TaskType.DETAIL_REPO>>('/task');
        detailRepoTask = response.data.id;
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
      const task = await db.task.findUnique({ where: { id: detailRepoTask } });
      expect(task).toBeDefined();
      expect(task?.compendiumUserId).toBe(env.githubUserId);
      expect(task?.requestTime).not.toBeNull();
    });
  });

  describe('save details repo task result for public template', () => {
    let response: AxiosResponse;
    let error: AxiosError | undefined;

    beforeAll(async () => {
      try {
        response = await axios.post('/result', {
          taskId: detailRepoTask,
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

    it('marks task as done in db', async () => {
      const task = await db.task.findUnique({ where: { id: detailRepoTask } });
      expect(task).toBeDefined();
      expect(task?.isDone).toBe(true);
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

  describe('save details repo task result for regular repo', () => {
    let response: AxiosResponse;
    let error: AxiosError | undefined;

    it('takes new detail repo task', async () => {
      const { data: { taskId, type } } = await axios.post<TaskWithPayload<typeof TaskType.DETAIL_REPO>>('/task');

      expect(type).toBe(TaskType.DETAIL_REPO);

      try {
        response = await axios.post('/result', {
          taskId,
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

    it('marks task as done in db', async () => {
      const task = await db.task.findUnique({ where: { id: detailRepoTask } });
      expect(task).toBeDefined();
      expect(task?.isDone).toBe(true);
    });

    it('does not create new get deps task in db', async () => {
      const tasks = await db.task.findMany({
        where: { type: TaskType.GET_DEPS }
      });
      expect(tasks).toHaveLength(1);
      const payloads = await db.getDepsPayload.findMany();
      expect(payloads).toHaveLength(1);
    });
  });
});
