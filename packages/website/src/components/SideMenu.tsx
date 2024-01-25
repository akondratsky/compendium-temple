import { Button, Divider, Flex, theme } from 'antd';
import { DescriptionFilter, FlagFilters, LanguageFilter, PackagesSearchFilter, PackagesIgnoreFilter } from './filters';
import { search } from '../services/repos';


export const SideMenu = () => {
  const { token } = theme.useToken();
  return (
    <Flex
      vertical
      style={{
        padding: '24px 24px 0 24px',
        height: '100%',
        gap: 24,
        background: token.colorBgLayout
      }}
    >
      <PackagesSearchFilter />
      <PackagesIgnoreFilter />
      <LanguageFilter />
      <DescriptionFilter />

      <Divider style={{ marginTop: 0, marginBottom: 0 }} />
      <FlagFilters />
      <Divider style={{ marginTop: 0, marginBottom: 48 }} />

      <Button
        type='primary'
        size='large'
        style={{
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
