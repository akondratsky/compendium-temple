import { types } from 'mobx-state-tree';
import { PAGE_SIZES } from '../constants';

const PaginationModel = types
  .model({
    total: types.number,
    pageSize: types.enumeration(PAGE_SIZES),
    currentPage: types.number,
  })
  .actions((self) => ({
    setPageSize: (pageSize: typeof PAGE_SIZES[number]) => {
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
  pageSize: '10',
  currentPage: 1,
  total: 0,
});