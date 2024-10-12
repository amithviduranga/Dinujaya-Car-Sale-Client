import React, { useState } from 'react';
import {Button,Layout} from "antd"
import Sidebar from "./Sidebar"
import {MenuUnfoldOutlined,MenuFoldOutlined} from '@ant-design/icons'
import CustomHeader from './Header';
import Advertiesment from './pages/Advertiesment';
import Dashboard from './pages/Dashboard';
import ListVehicles from './pages/ListVehicles';
import SellVehilce from './pages/SellVehicle';
import SparePartManagement from './pages/SparePartManagement';
import './Dashboard.css'
import AdminChatComponent from './chats/AdminChatComponent';


const {Sider,Header,Content} = Layout;

const OwnerDashboard = () =>{

    const [collapsed,setCollapsed] = useState(false)
    const [selectedKey, setSelectedKey] = useState('1');

    const renderContent = () => {
      switch (selectedKey) {
        case '1':
           return <Dashboard />;
        case '2':
           return <SellVehilce />;
        case '3':
           return <ListVehicles />;
        case '4':
           return <SparePartManagement />;
        case '5':
         return <Advertiesment />;
         case '6':
         return <AdminChatComponent />;
        default:
          // return <Dashboard />;
      }
    };
  return (
   <Layout>
     <Sider style={{border: '0px solid ',
             
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden'}} theme='light' triger="null" collapsible = {collapsed} className='sider'>
     <Sidebar  onMenuClick={setSelectedKey} />
     <Button type='text' icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>} onClick={()=>setCollapsed(!collapsed)}
       className='triger-btn' />
     </Sider>
     <Layout>
         <Header style={{border: '0px solid ',
              
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              overflow: 'hidden'}}className='header'>
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