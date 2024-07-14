import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../../GlobalContext'; // Update the path as per your project structure

const LoginUser = ({ onFinish, onSwitch, requestedPath }) => {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const { setIsAuthenticated } = React.useContext(GlobalContext); // Access setIsAuthenticated from GlobalContext

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(`${apiUrl}auth/login`, values);

      if (response.status === 200) {
        const token = response.data?.accessToken;
        localStorage.setItem('userToken', token);
        const userResponse = await axios.get(`${apiUrl}auth/userDetails/${values.username}`);
        localStorage.setItem('userId', userResponse.data.id);
        localStorage.setItem('userName', userResponse.data.username);
        message.success('Login successful!');
        setIsAuthenticated(true); // Update isAuthenticated state after successful login
        navigate(requestedPath || '/'); // Navigate to requestedPath or default to '/'
        onFinish(values); // Call the onFinish function passed from parent (UserAuthModel)
      }
    } catch (error) {
      message.error('Login failed. Please try again.');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="login-form"
      initialValues={{ remember: true }}
      onFinish={handleSubmit} // Ensure onFinish is handling the form submission
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

export default LoginUser;
