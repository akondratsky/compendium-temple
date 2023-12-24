import { PrismaClient } from '@prisma/client';

export const db = new PrismaClient();

export const resetDatabase = async () => {
  await Promise.all([
    db.compendiumUser.deleteMany(),
    db.missionState.deleteMany(),
    db.listReposPayload.deleteMany(),
    db.getDepsPayload.deleteMany(),
    db.detailRepoPayload.deleteMany(),
    db.license.deleteMany(),
    db.codeOfConduct.deleteMany(),
    db.repository.deleteMany(),
  ]);
  await db.gitHubUser.deleteMany();
  await db.task.deleteMany();
  await db.missionState.create({
    data: {
      id: 1,
      apiVersion: '1.0.0',
      nextListTaskRepoId: 0,
    },
  });
};
