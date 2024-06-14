// NavigationBar.js
import React from 'react';
import { Menu } from 'antd';
import { CarOutlined, DollarOutlined, ToolOutlined } from '@ant-design/icons';

const NavigationBar = () => (
  <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{ lineHeight: '64px' }}>
    <Menu.Item key="1" icon={<CarOutlined />}>
      Vehicles
    </Menu.Item>
    <Menu.Item key="2" icon={<DollarOutlined />}>
      Advertisements
    </Menu.Item>
    <Menu.Item key="3" icon={<ToolOutlined />}>
      Spare Parts
    </Menu.Item>
  </Menu>
);

export default NavigationBar;
