import { Instance, cast, types } from 'mobx-state-tree';
import { Package } from '@compendium-temple/api';

const PkgOptionModel = types.model({
  label: types.string,
  value: types.string,
});

const FlagFiltersModel = types
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

const FilterModel = types
  .model({
    pkgSuggestions: types.array(PkgOptionModel),
    packages: types.array(PkgOptionModel),
    language: types.maybeNull(types.enumeration(['TypeScript', 'JavaScript'])),
    description: types.string,
    flags: FlagFiltersModel,
  })
  .actions((self) => ({
    setPkgSuggestions: (pkgs: Package[]) => {
      self.pkgSuggestions = cast(pkgs.map(({ id, name }) => ({
        label: name,
        value: String(id),
      })));
    },
    addPackage: (pkg: PkgOption) => {
      if (!self.packages.find((p) => p.label === pkg.label)) {
        self.packages.push(pkg);
      }
    },
    removePackage: (label: string) => {
      self.packages = cast(self.packages.filter((pkg) => pkg.label !== label));
    },
    resetPackages: () => {
      self.packages = cast([]);
    },
    setLanguage: (language: string | null) => {
      self.language = language;
    },
    setDescription: (description: string) => {
      self.description = description;
    }
  }));

export type PkgOption = Instance<typeof PkgOptionModel>;

export const filter = FilterModel.create({
  pkgSuggestions: [],
  language: null,
  packages: [],
  description: '',
  flags: FlagFiltersModel.create({
    onlyWithIssuesEnabled: false,
    onlyWithProjectsEnabled: false,
    onlyWithWikiEnabled: false,
    onlyWithPagesEnabled: false,
    onlyWithDownloads: false,
    onlyWithDiscussionsEnabled: false,
    skipDisabled: false,
    skipArchived: false,
    forkingOnlyAllowed: false,
  }),
});
