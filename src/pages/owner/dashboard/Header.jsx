import React from "react";
import {Flex,Avatar, Typography} from "antd"
import {FaLeaf} from 'react-icons/fa6'
import './Dashboard.css'
import { MessageOutlined ,NotificationOutlined,UserOutlined } from "@ant-design/icons";
import { GoTypography } from "react-icons/go";

const CustomHeader= ()=>{

    return(
        <>
     <Flex  align="center" justify="space-between">
        <Typography.Title level={3} type="secondary">
            Welcome back , Amith
        </Typography.Title>
        <Flex align="center" gap="3rem">
        <Flex align="center" gap='10px'>
            <MessageOutlined className="header-icon"/>
            <NotificationOutlined className="header-icon"/>
            <Avatar icon={<UserOutlined />} />
            </Flex>
            </Flex>
        </Flex>
        </>
    ) 


}

export default CustomHeader