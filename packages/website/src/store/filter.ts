import { Instance, cast, types } from 'mobx-state-tree';
import { Package } from '@compendium-temple/api';
import { FlagFiltersModel } from './FlagFiltersModel';

const PkgOptionModel = types.model({
  label: types.string,
  value: types.string,
});

const PackageOptionsModel = types
  .model({
    options: types.array(PkgOptionModel),
  })
  .actions((self) => ({
    set: (options: Package[]) => {
      self.options = cast(options.map((option) => ({
        label: option.name,
        value: String(option.id),
      })));
    },
    add: (option: PkgOption) => {
      if (!self.options.find((o) => o.label === option.label)) {
        self.options.push(option);
      }
    },
    remove: (label: string) => {
      self.options = cast(self.options.filter((option) => option.label !== label));
    },
    reset: () => {
      self.options = cast([]);
    },
  }));

const FilterModel = types
  .model({
    pkgSuggestions: PackageOptionsModel,
    searchPackages: PackageOptionsModel,
    ignorePackages: PackageOptionsModel,
    language: types.maybeNull(types.enumeration(['TypeScript', 'JavaScript'])),
    description: types.string,
    flags: FlagFiltersModel,
  })
  .actions((self) => ({
    setLanguage: (language: string | null) => {
      self.language = language;
    },
    setDescription: (description: string) => {
      self.description = description;
    },
  }));

export type PkgOption = Instance<typeof PkgOptionModel>;
export type Packages = Instance<typeof FilterModel>['searchPackages']

export const filter = FilterModel.create({
  pkgSuggestions: PackageOptionsModel.create({ options: [] }),
  searchPackages: PackageOptionsModel.create({ options: [] }),
  ignorePackages: PackageOptionsModel.create({ options: [] }),
  language: null,
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
