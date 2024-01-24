import { Layout } from 'antd';

import { SideMenu } from '../components/SideMenu';
import { SearchResults } from '../components/SearchResults';


export const HomePage = () => {
  return (
    <Layout>
      <Layout.Sider
        width={400}
        style={{
          padding: 8,
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
        }}
      >
        <SideMenu />
      </Layout.Sider>

      <Layout style={{ marginLeft: 400 }}>
        <Layout.Content>
          <SearchResults />
        </Layout.Content>
      </Layout>
    </Layout>
  );
};


