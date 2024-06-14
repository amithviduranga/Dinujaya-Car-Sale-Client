// App.js
import React from 'react';
import { Layout } from 'antd';
import NavigationBar from './components/Navigationbar';

const { Header, Content, Footer } = Layout;

const Main = () => (
    <Layout>
    <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
      <NavigationBar />
    </Header>
    <Content style={{ padding: '0 50px', marginTop: 64 }}>
      <div style={{ padding: 24, minHeight: 380 }}>
        {/* Main content will go here */}
      </div>
    </Content>
    <Footer style={{ textAlign: 'center' }}>Ant Design ©2024 Created by Ant UED</Footer>
  </Layout>
);

export default Main;
