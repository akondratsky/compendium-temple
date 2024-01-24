import { Instance, cast, types } from 'mobx-state-tree';
import { Package } from '@compendium-temple/api';

const PkgOptionModel = types.model({
  label: types.string,
  value: types.string,
});

const FilterModel = types
  .model({
    pkgSuggestions: types.array(PkgOptionModel),
    packages: types.array(PkgOptionModel),
    language: types.maybeNull(types.enumeration(['TypeScript', 'JavaScript'])),
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
  }));

export type PkgOption = Instance<typeof PkgOptionModel>;

export const filter = FilterModel.create({
  pkgSuggestions: [],
  language: null,
  packages: [],
});
