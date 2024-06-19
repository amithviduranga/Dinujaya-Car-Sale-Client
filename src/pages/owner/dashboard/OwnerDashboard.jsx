import React, { useState } from 'react';
import {Button,Layout} from "antd"
import Sidebar from "./Sidebar"
import {MenuUnfoldOutlined,MenuFoldOutlined} from '@ant-design/icons'
import CustomHeader from './Header';
import Advertiesment from './pages/Advertiesment';
import Dashboard from './pages/Dashboard';
import ListVehicles from './pages/ListVehicles';
import SparePartManagement from './pages/SparePartManagement';
import './Dashboard.css'

const {Sider,Header,Content} = Layout;

const OwnerDashboard = () =>{

    const [collapsed,setCollapsed] = useState(false)
    const [selectedKey, setSelectedKey] = useState('1');

    const renderContent = () => {
      switch (selectedKey) {
        case '1':
           return <Dashboard />;
        case '2':
           return <ListVehicles />;
        case '3':
           return <SparePartManagement />;
        case '4':
         return <Advertiesment />;
        default:
          // return <Dashboard />;
      }
    };
  return (
   <Layout>
     <Sider theme='light' triger="null" collapsible = {collapsed} className='sider'>
     <Sidebar onMenuClick={setSelectedKey} />
     <Button type='text' icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>} onClick={()=>setCollapsed(!collapsed)}
       className='triger-btn' />
     </Sider>
     <Layout>
         <Header className='header'>
          <CustomHeader/>
         </Header>
         <Content className='content'>
         {renderContent()}
         </Content>
     </Layout>

   </Layout>
  );
}

export default OwnerDashboard;