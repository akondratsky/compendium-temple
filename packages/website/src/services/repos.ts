import { Repository } from '@prisma/client';
import { api } from '../api';

type RepoViewModel = {
  id: number;
  fullName: string;
  description: string;
  language: string;
  size: number | null;
  homepage: string | null;
  htmlUrl: string;
  count: {
    forks: number | null;
    stargazers: number | null;
    watchers: number | null;
    openIssues: number | null;
    subscribers: number | null;
  };
  isDisabled: boolean | null;
  isFork: boolean | null;

  hasIssues: boolean | null,
  hasProjects: boolean | null,
  hasWiki: boolean | null,
  hasPages: boolean | null,
  hasDownloads: boolean | null,
  hasDiscussions: boolean | null,

  isArchived: boolean | null,
  isForkingAllowed: boolean | null,
};

export const searchRepos = async (): Promise<RepoViewModel[]> => {
  const { data } = await api.post<Repository[]>('/repos/search', {});
  return data.map((repo) => ({
    id: repo.id,
    fullName: repo.fullName,
    description: repo.description ?? '',
    language: repo.language ?? '',
    size: repo.size,
    homepage: repo.homepage ?? '',
    htmlUrl: repo.htmlUrl,
    
    count: {
      forks: repo.forksCount,
      stargazers: repo.stargazersCount,
      watchers: repo.watchersCount,
      openIssues: repo.openIssuesCount,
      subscribers: repo.subscribersCount,
    },
    
    isDisabled: repo.isDisabled,
    isFork: repo.isFork,

    hasIssues: repo.hasIssues,
    hasProjects: repo.hasProjects,
    hasWiki: repo.hasWiki,
    hasPages: repo.hasPages,
    hasDownloads: repo.hasDownloads,
    hasDiscussions: repo.hasDiscussions,

    isArchived: repo.isArchived,
    isForkingAllowed: repo.isForkingAllowed,
  }));
};