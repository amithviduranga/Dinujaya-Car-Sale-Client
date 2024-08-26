// App.js
import React from 'react';
import { Layout } from 'antd';
import NavigationBar from './components/NavigationBar';
import MainPage from './MainPage';
const { Header, Content, Footer } = Layout;

const Main = () => (
    <Layout>
      <MainPage />
    
  </Layout>
);

export default Main;
