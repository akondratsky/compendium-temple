import { PropsWithChildren } from 'react';
import { Card, Divider, Typography } from 'antd';
import { LanguageFilter, PackageFilter } from './filters';

const Title = ({ children }: PropsWithChildren) => (
  <Typography.Title level={5} style={{ marginTop: 0 }}>{children}</Typography.Title>
);

export const SideMenu = () => {
  return (
    <>
      <Card>
        <Title>Filters</Title>
        <PackageFilter />
        <Divider />
        <LanguageFilter />
      </Card>
      <Card style={{ marginTop: 8 }}>

        {/* <Flex align='center'>
          <Typography.Text style={{ minWidth: 70 }}>Per page:</Typography.Text>
          <PageSize />
        </Flex> */}
      </Card>
    </>

  );
};
