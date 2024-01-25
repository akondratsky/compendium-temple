import { Button, Divider, Flex, theme } from 'antd';
import { DescriptionFilter, FlagFilters, LanguageFilter, PackageFilter } from './filters';
import { search } from '../services/repos';


export const SideMenu = () => {
  const { token } = theme.useToken();
  return (
    <Flex
      vertical
      style={{
        padding: '24px 24px 0 24px',
        height: '100%',
        background: token.colorBgLayout
      }}
    >
      <PackageFilter />
      <Divider />
      <LanguageFilter />
      <Divider />
      <DescriptionFilter />

      <Divider />
      <FlagFilters />
      <Divider />

      <Button
        type='primary'
        style={{
          marginTop: 48,
          marginRight: 'auto',
          width: '100%',
        }}
        onClick={search.new}
      >
        Search
      </Button>
    </Flex>

  );
};
