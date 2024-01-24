import { cast, types } from 'mobx-state-tree';

const SortingModel = types
  .model({
    direction: types.maybeNull(types.enumeration(['ascend', 'descend'])),
    field: types.maybeNull(types.enumeration([
      'stargazersCount',
      'forksCount',
      'openIssuesCount',
      'createdAt',
      'updatedAt',
      'pushedAt',
    ])),
  })
  .actions((self) => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    update: (field: string | null, direction: string | null)  => {
      if (!field || !direction) {
        self.field = null;
        self.direction = null;
      } else {
        self.field = cast(field);
        self.direction = cast(direction);
      }
    }
  }))
  .views((self) => ({
    getSortingParams: () => {
      if (!self.field || !self.direction) {
        return null;
      }

      return {
        field: self.field,
        direction: self.direction,
      };
    }
  }));

export const sorting = SortingModel.create({
  direction: null,
  field: null,
});