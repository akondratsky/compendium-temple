import { Space, Table } from 'antd';
import { observer } from 'mobx-react-lite';
import { searchResults } from '../../store/searchResults';
import { pagination } from '../../store/pagination';
import { search } from '../../services/repos';
import { columns } from './columns';


export const ReposTable = observer(() => {
  return (
    <Space style={{ overflow: 'hidden' }}>
      <Table
        sticky={{ offsetHeader: 0, offsetSummary: 33 }}
        dataSource={[...searchResults.repos]}
        size='large'
        pagination={{
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
      />
    </Space>
  );
});