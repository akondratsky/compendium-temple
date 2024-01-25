import { Layout, theme } from 'antd';
import { SideMenu } from '../components/SideMenu';
import { ReposTable } from '../components/ReposTable';

export const HomePage = () => {
  const { token } = theme.useToken();
  return (
    <Layout>
      <Layout.Sider
        width={400}
        style={{
          background: token.colorBgBase,
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
          <ReposTable />
        </Layout.Content>
      </Layout>
    </Layout>
  );
};


