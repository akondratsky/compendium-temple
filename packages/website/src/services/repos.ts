import { api } from '../api';
import { RepoSearchResult } from '@compendium-temple/api';
import { filter } from '../store/filter';
import { pagination } from '../store/pagination';
import { searchResults } from '../store/searchResults';
import { sorting } from '../store/sorting';


const searchRepos = async (): Promise<void> => {
  searchResults.setIsLoading(true);
  try {
    const { data } = await api.post<RepoSearchResult>('/repos/search', {
      pageSize: +pagination.pageSize,
      page: pagination.currentPage,
      language: filter.language,
      searchPackages: filter.searchPackages.options.map(p => +p.value), // package ID
      ignorePackages: filter.ignorePackages.options.map(p => +p.value), // package ID
      description: filter.description,
      sort: sorting.getSortingParams(),
      flags: {
        onlyWithIssuesEnabled: filter.flags.onlyWithIssuesEnabled,
        onlyWithProjectsEnabled: filter.flags.onlyWithProjectsEnabled,
        onlyWithWikiEnabled: filter.flags.onlyWithWikiEnabled,
        onlyWithPagesEnabled: filter.flags.onlyWithPagesEnabled,
        onlyWithDownloads: filter.flags.onlyWithDownloads,
        onlyWithDiscussionsEnabled: filter.flags.onlyWithDiscussionsEnabled,
        skipDisabled: filter.flags.skipDisabled,
        skipArchived: filter.flags.skipArchived,
        forkingOnlyAllowed: filter.flags.forkingOnlyAllowed,
      }
    });
  
    pagination.setTotal(data.total);
    searchResults.set(data.repos);
  } catch (e) {
    console.error(e);
  } finally {
    searchResults.setIsLoading(false);
  }

};

export const search = {
  new: () => {
    pagination.setCurrentPage(1);
    searchRepos();
  },
  update: searchRepos,
};
