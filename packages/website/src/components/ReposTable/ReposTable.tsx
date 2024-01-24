import { Flex, Table } from 'antd';
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
      rowKey={(repo) => repo.fullName}
      sticky={{ offsetHeader: 0, offsetSummary: 33 }}
      dataSource={[...searchResults.repos]}
      size='large'
      pagination={{
        position: ['bottomCenter', 'bottomCenter'],
        pageSize: pagination.pageSize,
        current: pagination.currentPage,
        total: pagination.total,
        showTotal: (total, range) => (
          <Flex style={{ width: 140 }}>
            {range[0]}-{range[1]} of {total} items
          </Flex>
        ),
        onChange: (page, pageSize) => {
          pagination.setCurrentPage(page);
          pagination.setPageSize(pageSize);
        },
        pageSizeOptions: [10, 25, 50, 100],
      }}
      columns={columns}
      scroll={{
        x: true,
        y: 'calc(100vh - 120px)',
        scrollToFirstRowOnChange: true,
      }}
      onChange={(pagination, filters, sorter) => {
        // TODO: sorting
        search.update();
      }}
      style={{ height: '100%', maxHeight: '100vh' }}
    />
  );
});