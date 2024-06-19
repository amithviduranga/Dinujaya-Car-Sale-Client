import React from "react";
import {Flex, Menu} from "antd"
import {FaLeaf} from 'react-icons/fa6'
import './Dashboard.css'
import { UserOutlined ,ProfileOutlined,LoginOutlined,UnorderedListOutlined,ToolOutlined } from "@ant-design/icons";

const Sidebar= ({ onMenuClick })=>{

    return(
     <>
       <Flex align="center" justify="center">
         <div className="logo">
        <FaLeaf/>
         </div>
       </Flex>

       <Menu mode="inline" defaultSelectedKeys={['1']} className="menu-bar" onClick={({key}) => onMenuClick(key)}
       items={[
        {
          key:'1',
          icon:<UserOutlined />,
          label:'Dashboard'
       },
       {
        key:'2',
        icon:<ProfileOutlined />,
        label:'List Vehicles'
     },
     {
      key:'3',
      icon:<ToolOutlined />,
      label:'Spare Parts'
   },
   {
    key:'4',
    icon:<UnorderedListOutlined />,
    label:'Advertiesments'
 },
     {
    
      icon:<LoginOutlined />,
      label:'LogOut'
   },
       
       ]}/>
     </>

    ) 


}

export default Sidebar