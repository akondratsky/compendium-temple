import { Affix, Flex, Pagination, theme } from 'antd';
import { observer } from 'mobx-react-lite';
import { PAGE_SIZES } from '../constants';
import { pagination } from '../store/pagination';

export const PaginationPanel = observer(() => {
  const { token } = theme.useToken();

  return (
    <Affix>
      <Flex justify='end' style={{ background: token.colorPrimaryBg }}>
        <Pagination
          total={pagination.total}
          pageSize={+pagination.pageSize}
          pageSizeOptions={PAGE_SIZES}
        />
      </Flex>
    </Affix>
  );
});
