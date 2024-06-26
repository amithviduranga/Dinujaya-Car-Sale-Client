// App.js
import React from 'react';
import { Layout } from 'antd';
import NavigationBar from './components/NavigationBar';
import MainPage from './MainPage';
const { Header, Content, Footer } = Layout;

const Main = () => (
    <Layout>
      <MainPage />
    <Footer style={{ textAlign: 'center' }}>Ant Design ©2024 Created by Ant UED</Footer>
  </Layout>
);

export default Main;
