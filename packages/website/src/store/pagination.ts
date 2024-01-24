import { types } from 'mobx-state-tree';

const PaginationModel = types
  .model({
    total: types.number,
    pageSize: types.number,
    currentPage: types.number,
  })
  .actions((self) => ({
    setPageSize: (pageSize: number) => {
      self.pageSize = pageSize;
    },
    setCurrentPage: (currentPage: number) => {
      self.currentPage = currentPage;
    },
    setTotal(total: number) {
      self.total = total;
    },
  }));

export const pagination = PaginationModel.create({
  pageSize: 10,
  currentPage: 1,
  total: 0,
});