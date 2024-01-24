import { api } from '../api';
import { RepoSearchResult } from '@compendium-temple/api';
import { filter } from '../store/filter';
import { pagination } from '../store/pagination';
import { searchResults } from '../store/searchResults';


export const searchRepos = async (): Promise<void> => {
  const { data } = await api.post<RepoSearchResult>('/repos/search', {
    pageSize: +pagination.pageSize,
    page: pagination.currentPage,
    language: filter.language,
    packages: filter.packages.map(p => +p.value), // package ID
  });

  pagination.setTotal(data.total);
  searchResults.set(data.repos);
};
