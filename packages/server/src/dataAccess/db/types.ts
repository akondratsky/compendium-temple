import { DbClient } from './dbClient';

export type DbTransaction = Parameters<Parameters<DbClient['$transaction']>[0]>[0];
