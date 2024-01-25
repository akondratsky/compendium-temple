import { types } from 'mobx-state-tree';

export const FlagFiltersModel = types
  .model({
    onlyWithIssuesEnabled: types.boolean,
    onlyWithProjectsEnabled: types.boolean,
    onlyWithWikiEnabled: types.boolean,
    onlyWithPagesEnabled: types.boolean,
    onlyWithDownloads: types.boolean,
    onlyWithDiscussionsEnabled: types.boolean,
    skipDisabled: types.boolean,
    skipArchived: types.boolean,
    forkingOnlyAllowed: types.boolean,
  })
  .actions((self) => ({
    setOnlyWithIssuesEnabled: (enabled: boolean) => {
      self.onlyWithIssuesEnabled = enabled;
    },
    setSkipDisabled: (skip: boolean) => {
      self.skipDisabled = skip;
    },
    setOnlyWithProjectsEnabled: (enabled: boolean) => {
      self.onlyWithProjectsEnabled = enabled;
    },
    setOnlyWithWikiEnabled: (enabled: boolean) => {
      self.onlyWithWikiEnabled = enabled;
    },
    setOnlyWithPagesEnabled: (enabled: boolean) => {
      self.onlyWithPagesEnabled = enabled;
    },
    setWithDownloads: (enabled: boolean) => {
      self.onlyWithDownloads = enabled;
    },
    setOnlyWithDiscussionsEnabled: (enabled: boolean) => {
      self.onlyWithDiscussionsEnabled = enabled;
    },
    setSkipArchived: (skip: boolean) => {
      self.skipArchived = skip;
    },
    setForkingOnlyAllowed: (allowed: boolean) => {
      self.forkingOnlyAllowed = allowed;
    },
  }));