import React, { useState } from 'react';
import { Modal } from 'antd';
import LoginForm from './LoginUser';
import RegistrationForm from './RegisterUser';

const UserAuthModel = ({ visible, onCancel, onLoginSuccess, requestedPath }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSwitch = () => {
    setIsLogin(!isLogin);
  };

  const handleLogin = async (values) => {
    // Simulate login logic here or call actual login API
    console.log('Login values:', values);
    // Call the parent callback on successful login
    await onLoginSuccess(values);
    // Close the modal after successful login
    onCancel();
  };

  const handleRegistration = async (values) => {
    // Simulate registration logic here or call actual registration API
    console.log('Registration values:', values);
    // Call the parent callback on successful registration
    await onLoginSuccess(values);
    // Close the modal after successful registration
    onCancel();

  };


  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
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
        <LoginForm onFinish={handleLogin} onSwitch={handleSwitch} requestedPath={requestedPath} />
      ) : (
        <RegistrationForm onFinish={handleRegistration} onSwitch={handleSwitch} />
      )}
    </Modal>
  );
};

export default UserAuthModel;
