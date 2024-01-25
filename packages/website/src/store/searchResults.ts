import { Instance, cast, types } from 'mobx-state-tree';
import { RepoSearchResultItem } from '@compendium-temple/api';

const OwnerModel = types.model({
  id: types.number,
  login: types.string,
  avatarUrl: types.string,
  htmlUrl: types.string,
});

const FlagsModel = types.model({
  isFork: types.boolean, // TODO
  isDisabled: types.maybeNull(types.boolean),
  hasIssues: types.maybeNull(types.boolean),
  hasProjects: types.maybeNull(types.boolean),
  hasWiki: types.maybeNull(types.boolean),
  hasPages: types.maybeNull(types.boolean),
  hasDownloads: types.maybeNull(types.boolean),
  hasDiscussions: types.maybeNull(types.boolean),
  isArchived: types.maybeNull(types.boolean),
  isForkingAllowed: types.maybeNull(types.boolean),
});

const RepoModel = types.model({
  id: types.number,
  fullName: types.string,
  description: types.maybeNull(types.string),
  language: types.maybeNull(types.string),
  htmlUrl: types.string,
  stargazersCount: types.maybeNull(types.number),
  forksCount: types.maybeNull(types.number),
  watchersCount: types.maybeNull(types.number),
  openIssuesCount: types.maybeNull(types.number),

  license: types.maybeNull(types.string),
  owner: types.maybeNull(OwnerModel),
  dependencies: types.array(types.string),

  flags: types.maybeNull(FlagsModel),

  createdAt: types.maybeNull(types.Date),
  updatedAt: types.maybeNull(types.Date),
  pushedAt: types.maybeNull(types.Date),
});

const SearchResultsModel = types
  .model({
    repos: types.array(RepoModel),
  })
  .actions((self) => ({
    set(repos: RepoSearchResultItem[]) {
      self.repos = cast(
        repos.map(
          ({ dependencies, license, owner, ...repo }) => ({
            ...repo,
            license: license?.name ?? null,
            owner: !owner ? null : {
              id: owner.id,
              login: owner.login,
              avatarUrl: owner.avatarUrl,
              htmlUrl: owner.htmlUrl,
            },
            dependencies: dependencies.map(d => d.package.name),
            flags: {
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
            },
            createdAt: repo.createdAt ? new Date(repo.createdAt) : null,
            updatedAt: repo.updatedAt ? new Date(repo.updatedAt) : null,
            pushedAt: repo.pushedAt ? new Date(repo.pushedAt) : null,
          })
        ),
      );
    }
  }));

export type Repo = Instance<typeof RepoModel>;
export type Flags = Instance<typeof FlagsModel>;

export const searchResults = SearchResultsModel.create({
  repos: [],
});