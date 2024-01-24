import { PropsWithChildren } from 'react';
import { Button, Card, Divider, Typography } from 'antd';
import { DescriptionFilter, LanguageFilter, PackageFilter } from './filters';
import { search } from '../services/repos';

const Title = ({ children }: PropsWithChildren) => (
  <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 18 }}>{children}</Typography.Title>
);

export const SideMenu = () => {
  return (
    <>
      <Card>
        <Title>Filters</Title>
        <PackageFilter />
        <Divider />
        <LanguageFilter />
        <Divider />
        <DescriptionFilter />
      </Card>
      <Card style={{ marginTop: 8 }}>
        order by
      </Card>
      <Card style={{ marginTop: 8 }}>
        <Button
          type='primary'
          style={{
            marginRight: 'auto',
            width: '100%',
          }}
          onClick={search.new}
        >
          Search
        </Button>
      </Card>
    </>

  );
};
