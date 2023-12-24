import axios, { AxiosError, AxiosResponse } from 'axios';
import { TaskWithPayload } from '@compendium-temple/api';
import { resetDatabase } from '../support/database';
import { TaskType } from '@prisma/client';

describe('POST /task returns available task', () => {
  let response: AxiosResponse<TaskWithPayload<typeof TaskType.LIST_REPOS>>;
  let error: AxiosError | undefined;

  describe('list repos task', () => {
    beforeAll(async () => {
      await resetDatabase();
      // TODO: init database for this test
    });

    it('returns list repos task', async () => {
      // TODO implement test
    });
  });
});
