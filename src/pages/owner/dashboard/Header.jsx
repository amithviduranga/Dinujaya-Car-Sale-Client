import React from "react";
import { Flex, Avatar, Typography, Dropdown, Menu } from "antd";
import { MessageOutlined, NotificationOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // Use for navigation after logout
import './Dashboard.css';

const CustomHeader = () => {
  const userName = localStorage.getItem("AdminUsername");
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("AdminUsername");
    localStorage.removeItem("token") // Clear username from localStorage
    navigate("/admin/login"); // Redirect to the login page
  };

  // Menu for dropdown
  const menu = (
    <Menu>
      <Menu.Item key="logout" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Flex align="center" justify="space-between">
        <Typography.Title level={3} type="secondary">
          Welcome back, {userName}
        </Typography.Title>
        <Flex align="center" gap="3rem">
          <Flex align="center" gap="10px">
            <MessageOutlined className="header-icon" />
            <NotificationOutlined className="header-icon" />
            <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
              <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
            </Dropdown>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default CustomHeader;
