import React, { useState, useEffect, useContext } from 'react';
import { Menu, Button, Avatar, Dropdown, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { CarOutlined, DollarOutlined, ToolOutlined, PlusOutlined, HomeOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import logo from "../../../asserts/logo.png";
import AuthModal from './UserAuthModel';
import axios from 'axios';
import { GlobalContext } from '../../../GlobalContext';

const apiUrl = process.env.REACT_APP_API_URL;


const { SubMenu } = Menu;

const NavigationBar = () => {

  const { logout, isAuthenticated } = useContext(GlobalContext);

  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [requestedPath, setRequestedPath] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      setIsLoggedIn(true);
      const userName = localStorage.getItem('userName');
      setUsername(userName);
    }
  }, []);

  const showModal = (path) => {
    setRequestedPath(path); // Store the requested path
    setModalVisible(true); // Show the modal
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    logout();
    setUsername("");
    message.success('Logout successful!');
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    navigate(requestedPath || '/'); // Navigate to requested path or home if not specified
    setRequestedPath(""); // Clear the requested path
    setModalVisible(false); // Close the modal
  };

  const checkUserToken = (path) => {
    if (!isAuthenticated) {
      showModal(path); // Show the modal with the requested path
    } else {
      navigate('/post-ad/'); // Navigate to post-ad page if already logged in
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#001529', padding: '0 20px' }}>
      <img src={logo} alt="Logo" style={{ width: '60px' }} />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{ lineHeight: '64px', flex: 1 }}>
        <Menu.Item
          key="logo"
          style={{
            pointerEvents: 'none',
            cursor: 'default',
            marginRight: 60,
            fontSize: 20,
            fontFamily: "'Poppins', sans-serif",
            color: 'white',
            fontWeight: 600,
          }}
        >
          DINUJAYA CAR SALE
        </Menu.Item>
        <Menu.Item
          key="1"
          icon={<HomeOutlined style={{ fontSize: 20 }} />}
          style={{
            fontSize: 15,
            fontFamily: "'Poppins', sans-serif",
            color: 'white',
            fontWeight: 600,
          }}
        >
          <Link to="/">Home</Link>
        </Menu.Item>
        <SubMenu
          key="vehicleCategories"
          title={
            <span style={{ fontSize: 15, fontFamily: "'Poppins', sans-serif", color: 'white', fontWeight: 600 }}>
              <CarOutlined style={{ fontSize: 20, marginRight: 8 }} />
              Vehicle Categories
            </span>
          }
        >
          <Menu.Item key="van" style={{ fontSize: 15, fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
            <Link to="/vehicleCategories/Cars">Cars</Link>
          </Menu.Item>
          <Menu.Item key="car" style={{ fontSize: 15, fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
            <Link to="/vehicleCategories/Vans">Vans</Link>
          </Menu.Item>
          <Menu.Item key="bike" style={{ fontSize: 15, fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
            <Link to="/vehicleCategories/Bikes">Bikes</Link>
          </Menu.Item>
          <Menu.Item key="threeWheel" style={{ fontSize: 15, fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
            <Link to="/vehicleCategories/Three-wheels">Three Wheels</Link>
          </Menu.Item>
          <Menu.Item key="lorry" style={{ fontSize: 15, fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
            <Link to="/vehicleCategories/lorries">Lorries</Link>
          </Menu.Item>
        </SubMenu>
        <Menu.Item
          key="3"
          icon={<DollarOutlined style={{ fontSize: 20 }} />}
          style={{
            fontSize: 15,
            fontFamily: "'Poppins', sans-serif",
            color: 'white',
            fontWeight: 600,
          }}
        >
          Advertisements
        </Menu.Item>
        <Menu.Item
          key="4"
          icon={<ToolOutlined style={{ fontSize: 20 }} />}
          style={{
            fontSize: 15,
            fontFamily: "'Poppins', sans-serif",
            color: 'white',
            fontWeight: 600,
          }}
        >
          Spare Parts
        </Menu.Item>
      </Menu>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ backgroundColor: 'yellow', borderColor: 'yellow', color: 'black', marginRight: 50 }}
        onClick={() => checkUserToken('/post-ad')} // Pass '/post-ad' as the requested path
      >
        Post an Ad
      </Button>
      {isLoggedIn ? (
        <Dropdown overlay={menu} trigger={['click']}>
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: 'white' }}>
            <Avatar size={64} icon={<UserOutlined />} />
            <span style={{ marginLeft: 10, fontSize: 16 }}>Hi {username}</span>
          </div>
        </Dropdown>
      ) : (
        <>
          <Button
            type="primary"
            icon={<UserOutlined />}
            style={{ marginRight: 10 }}
            onClick={() => showModal('')} // Pass empty string as requested path for login/register
          >
            Login/Register
          </Button>
        </>
      )}
      <AuthModal visible={modalVisible} onCancel={handleCancel} onLoginSuccess={handleLoginSuccess} requestedPath={requestedPath} />
    </div>
  );
};

export default NavigationBar;
