import { api } from '../api';
import { RepoSearchResult } from '@compendium-temple/api';


export const searchRepos = async (): Promise<RepoSearchResult[]> => {
  const { data } = await api.post<RepoSearchResult[]>('/repos/search', {});
  return data;
};