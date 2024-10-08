import React from "react";
import {Flex, Menu} from "antd"
import {FaLeaf} from 'react-icons/fa6'
import './Dashboard.css'
import { UserOutlined ,ProfileOutlined,LoginOutlined,UnorderedListOutlined,ToolOutlined,CommentOutlined } from "@ant-design/icons";
import  Logoimage from '../../../asserts/Dashboard Logo.png'

const Sidebar= ({ onMenuClick })=>{
  
    return(
     <>
       <Flex  align="center" justify="center">
         <div className="logo">
         <img src={Logoimage} alt="Logo" style={{ width: '100px', height: '70px' }} />
         </div>
       </Flex>

       <Menu  mode="inline" defaultSelectedKeys={['1']} className="menu-bar" onClick={({key}) => onMenuClick(key)}
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
 }, {
  key:'5',
  icon:<CommentOutlined />,
  label:'Live Chats'
},
     
       
       ]}/>
     </>

    ) 


}

export default Sidebar