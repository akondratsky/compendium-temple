import { api } from '../api';
import { RepoSearchResult } from '@compendium-temple/api';
import { filter } from '../store/filter';
import { pagination } from '../store/pagination';


export const searchRepos = async (): Promise<void> => {
  const { data } = await api.post<RepoSearchResult>('/repos/search', {
    pageSize: +pagination.pageSize,
    page: pagination.currentPage,
    language: filter.language,
    packages: filter.packages.map(p => +p.value), // package ID
  });

  pagination.total = data.total;
};
