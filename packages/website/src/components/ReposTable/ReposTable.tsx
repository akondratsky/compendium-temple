import { Table } from 'antd';
import { observer } from 'mobx-react-lite';
import { searchResults } from '../../store/searchResults';
import { pagination } from '../../store/pagination';
import { search } from '../../services/repos';
import { columns } from './columns';
import { useEffect } from 'react';


export const ReposTable = observer(() => {
  useEffect(() => {
    search.new();
  }, []);

  return (
    <Table
      sticky={{ offsetHeader: 0, offsetSummary: 33 }}
      dataSource={[...searchResults.repos]}
      size='large'
      pagination={{
        position: ['bottomCenter', 'bottomCenter'],
        pageSize: pagination.pageSize,
        current: pagination.currentPage,
        total: pagination.total,
        onChange: (page, pageSize) => {
          pagination.setCurrentPage(page);
          pagination.setPageSize(pageSize);
          search.update();
        },
        pageSizeOptions: [10, 25, 50, 100],
      }}
      columns={columns}
      scroll={{
        x: true,
        y: 'calc(100vh - 120px)',
        scrollToFirstRowOnChange: true,
      }}
      style={{ height: '100%', maxHeight: '100vh' }}
    />
  );
});