import { cast, types } from 'mobx-state-tree';
import type { SorterResult } from 'antd/es/table/interface';
const FieldSortingModel = types.model({
  order: types.enumeration(['ascend', 'descend']),
  field: types.enumeration([
    'stargazersCount',
    'forksCount',
    'openIssuesCount',
    'createdAt',
    'updatedAt',
    'pushedAt',
  ]),
});

const SortingModel = types
  .model({
    state: types.array(FieldSortingModel),
  })
  .actions((self) => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    update: (sorterResult: SorterResult<any>[]) => {
      self.state = cast(sorterResult.map((sorter) => ({
        field: sorter.field as string,
        order: sorter.order as string,
      })));
    }
  }));

export const sorting = SortingModel.create({
  state: [],
});