import { Flex, Spin, theme } from 'antd';
import { observer } from 'mobx-react-lite';
import { searchResults } from '../store/searchResults';

export const Loader = observer(() => {
  const { token } = theme.useToken();

  if (!searchResults.isLoading) return null;

  return (
    <Flex
      justify='center'
      align='center'
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: token.colorBgMask,
        zIndex: 100
      }}>
      <Spin />
    </Flex>
  );
});