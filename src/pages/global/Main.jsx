// App.js
import React from 'react';
import { Layout } from 'antd';
import NavigationBar from './components/Navigationbar';
import MainPage from './MainPage';
const { Header, Content, Footer } = Layout;

const Main = () => (
    <Layout>
   
      <NavigationBar />
   
    <Content style={{ padding: '0 50px', marginTop: 0 }}>
      <div style={{ padding: 24, minHeight: 380 }}>
       <MainPage />
      </div>
    </Content>
    <Footer style={{ textAlign: 'center' }}>Ant Design ©2024 Created by Ant UED</Footer>
  </Layout>
);

export default Main;
