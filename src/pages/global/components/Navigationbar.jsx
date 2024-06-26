import React, { useState } from 'react';
import { Menu, Button, Modal, Form, Input, message } from 'antd';
import { Link } from 'react-router-dom';
import { CarOutlined, DollarOutlined, ToolOutlined, PlusOutlined, UserOutlined, LockOutlined, MailOutlined, HomeOutlined } from '@ant-design/icons';
import logo from "../../../asserts/logo.png";

const { SubMenu } = Menu;

const NavigationBar = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // State to manage login/registration view

  const showModal = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleSwitch = () => {
    setIsLogin(!isLogin);
  };

  const handleLogin = (values) => {
    // Simulate login logic here
    console.log('Login values:', values);
    // Close the modal after successful login
    setModalVisible(false);
    message.success('Login successful!');
  };

  const handleRegistration = (values) => {
    // Simulate registration logic here
    console.log('Registration values:', values);
    // Close the modal after successful registration
    setModalVisible(false);
    message.success('Registration successful! You can now login.');
  };

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
          <Link to = "/">Home</Link>
        </Menu.Item>
        <SubMenu
          key="vehicleCategories"
          title={
            <span style={{ fontSize: 15, fontFamily: "'Poppins', sans-serif", color: 'white', fontWeight: 600 }}>
              <CarOutlined style={{ fontSize: 20,marginRight:8 }} />
              Vehicle Categories
            </span>
          }
        >
          <Menu.Item key="van" style={{ fontSize: 15, fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
            Cars
          </Menu.Item>
          <Menu.Item key="car" style={{ fontSize: 15, fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
            Vans
          </Menu.Item>
          <Menu.Item key="threeWheel" style={{ fontSize: 15, fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
            <Link to = "/vehicleCategories/Bikes">Bikes</Link>
          </Menu.Item>
          <Menu.Item key="bike" style={{ fontSize: 15, fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
            Three Wheelers
          </Menu.Item>
          <Menu.Item key="bike" style={{ fontSize: 15, fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
            Lorries
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
        style={{ backgroundColor: 'yellow', borderColor: 'yellow', color: 'black' }}
        onClick={showModal}
      >
        Post an Ad
      </Button>
      <Modal
        visible={modalVisible}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <div style={{ textAlign: 'center', padding: "0px 30px" }}>
          <h1 style={{ fontSize: '34px', marginBottom: '12px' }}>{isLogin ? 'Login' : 'Register'}</h1>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '24px' }}>
            {isLogin ? 'Before posting your vehicle advertisement, you have to log in. If you have already registered, please enter your login credentials here!' : 'Register to post an ad'}
          </p>
        </div>
        {isLogin ? (
          <LoginForm onFinish={handleLogin} onSwitch={handleSwitch} />
        ) : (
          <RegistrationForm onFinish={handleRegistration} onSwitch={handleSwitch} />
        )}
      </Modal>
    </div>
  );
};

const LoginForm = ({ onFinish, onSwitch }) => {
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      style={{ padding: 40 }}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
          Log in
        </Button>
        Or <a onClick={onSwitch}>register now!</a>
      </Form.Item>
    </Form>
  );
};

const RegistrationForm = ({ onFinish, onSwitch }) => {
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="registration-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      style={{ padding: 30 }}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
      </Form.Item>

      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Please input your email!' },
          { type: 'email', message: 'The input is not valid E-mail!' },
        ]}
      >
        <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
          Register
        </Button>
        Or <a onClick={onSwitch}>login now!</a>
      </Form.Item>
    </Form>
  );
};

export default NavigationBar;
