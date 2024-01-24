import { Affix, Button, Flex, Pagination, theme } from 'antd';
import { observer } from 'mobx-react-lite';
import { PAGE_SIZES } from '../constants';
import { pagination } from '../store/pagination';
import { searchRepos } from '../services/repos';

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
          total={pagination.total}
          pageSize={+pagination.pageSize}
          pageSizeOptions={PAGE_SIZES}
        />
      </Flex>
    </Affix>
  );
});
