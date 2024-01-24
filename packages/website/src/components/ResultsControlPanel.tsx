import { Affix, Button, Flex, Pagination, theme } from 'antd';
import { observer } from 'mobx-react-lite';
import { pagination } from '../store/pagination';
import { searchRepos } from '../services/repos';

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
        <Button
          type='primary'
          style={{
            marginRight: 'auto',
          }}
          onClick={searchRepos}
        >
          Search
        </Button>
        <Pagination
          onChange={(page, pageSize) => {
            pagination.setCurrentPage(page);
            pagination.setPageSize(pageSize);
            searchRepos();
          }}
          total={pagination.total}
          pageSize={+pagination.pageSize}
          pageSizeOptions={PAGE_SIZES}
        />
      </Flex>
    </Affix>
  );
});
