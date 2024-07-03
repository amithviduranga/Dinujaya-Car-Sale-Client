import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, EnvironmentOutlined, PhoneOutlined } from '@ant-design/icons';
import axios from 'axios';

const RegisterUser = ({ onSwitch }) => {
  const apiUrl = process.env.REACT_APP_API_URL; // Ensure your .env file contains the REACT_APP_API_URL

  const onFinish = async (values) => {
    try {
      const response = await axios.post(`${apiUrl}auth/register/2`, values);
      if (response.status === 200) {
        message.success('Registration successful! Please log in.');
        onSwitch(); // Switch to the login form
      }
    } catch (error) {
      message.error('Registration failed. Please try again.');
      console.error('Registration error:', error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="register-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      style={{ padding: 30 }}
    >
      <Form.Item
        name="firstName"
        rules={[{ required: true, message: 'Please input your First name!' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="First Name" />
      </Form.Item>
      <Form.Item
        name="lastName"
        rules={[{ required: true, message: 'Please input your Last name!' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Last Name" />
      </Form.Item>
      <Form.Item
        name="address"
        rules={[{ required: true, message: 'Please input your Address!' }]}
      >
        <Input prefix={<EnvironmentOutlined />} placeholder="Address" />
      </Form.Item>
      <Form.Item
        name="mobile"
        rules={[{ required: true, message: 'Please input your mobile Number!' }]}
      >
        <Input prefix={<PhoneOutlined />} placeholder="Mobile Number" />
      </Form.Item>
      <Form.Item
        name="email"
        rules={[{ required: true, message: 'Please input your Email!' }]}
      >
        <Input prefix={<MailOutlined />} placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Please input your User Name!' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="User Name" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item
        name="confirmPassword"
        rules={[{ required: true, message: 'Please confirm your Password!' }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          type="password"
          placeholder="Confirm Password"
        />
      </Form.Item>
      <Form.Item>
        <Button block type="primary" htmlType="submit">
          Register
        </Button>
        Do you have an Account? <a onClick={onSwitch}>Login now!</a>
      </Form.Item>
    </Form>
  );
};

export default RegisterUser;
