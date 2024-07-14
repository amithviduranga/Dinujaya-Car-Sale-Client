import React, { useState } from 'react';
import { Modal, Spin } from 'antd';
import LoginForm from './LoginUser';
import RegistrationForm from './RegisterUser';

const UserAuthModel = ({ visible, onCancel, onLoginSuccess, requestedPath, loading }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSwitch = () => {
    setIsLogin(!isLogin);
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
      {loading ? (
        <div style={{ textAlign: 'center' }}>
          <Spin size="large" />
        </div>
      ) : (
        isLogin ? (
          <LoginForm onFinish={onLoginSuccess} onSwitch={handleSwitch} requestedPath={requestedPath} />
        ) : (
          <RegistrationForm onFinish={onLoginSuccess} onSwitch={handleSwitch} />
        )
      )}
    </Modal>
  );
};

export default UserAuthModel;
