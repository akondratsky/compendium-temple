import { Instance, cast, types } from 'mobx-state-tree';
import { RepoSearchResultItem } from '@compendium-temple/api';

const OwnerModel = types.model({
  id: types.number,
  login: types.string,
  avatarUrl: types.string,
  htmlUrl: types.string,
});

const RepoModel = types.model({
  id: types.number,
  fullName: types.string,
  description: types.maybeNull(types.string),
  language: types.maybeNull(types.string),
  htmlUrl: types.string,

  license: types.maybeNull(types.string),
  owner: types.maybeNull(OwnerModel),
});

const SearchResultsModel = types
  .model({
    repos: types.array(RepoModel),
  })
  .actions((self) => ({
    set(repos: RepoSearchResultItem[]) {
      self.repos = cast(
        repos.map(
          ({ dependencies, license, owner, ...repo}) => ({
            ...repo,
            license: license?.name ?? null,
            owner: !owner ? null : {
              id: owner.id,
              login: owner.login,
              avatarUrl: owner.avatarUrl,
              htmlUrl: owner.htmlUrl,
            },
          })
        ),
      );
    }
  }));

export type Repo = Instance<typeof RepoModel>;

export const searchResults = SearchResultsModel.create({
  repos: [],
});