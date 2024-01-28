import { Affix, Flex, Pagination, theme } from 'antd';
import { observer } from 'mobx-react-lite';
import { pagination } from '../store/pagination';
import { search } from '../services/repos';

const PAGE_SIZES = [10, 25, 50, 100];

export const ResultsControlPanel = observer(() => {
  const { token } = theme.useToken();

  return (
    <Affix>
      <Flex
        justify='end'
        align='center'
        style={{
          background: token.colorPrimaryBg,
          padding: 8,
        }}
      >
        <Pagination
          onChange={(page, pageSize) => {
            pagination.setCurrentPage(page);
            pagination.setPageSize(pageSize);
            search.update();
          }}
          total={pagination.total}
          pageSize={+pagination.pageSize}
          pageSizeOptions={PAGE_SIZES}
        />
      </Flex>
    </Affix>
  );
});
