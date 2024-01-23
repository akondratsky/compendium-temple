import { Repository } from '@prisma/client';
import { api } from '../api';

export const searchRepos = async (): Promise<Repository[]> => {
  const { data } = await api.post<Repository[]>('/repos/search', {
    // TODO: add filters
  });
  return data;
};