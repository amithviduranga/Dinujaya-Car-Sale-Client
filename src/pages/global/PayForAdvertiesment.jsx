import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Result, Button, Spin, Space, message } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
const apiUrl = process.env.REACT_APP_API_URL;


const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
    const query = new URLSearchParams(location.search);
    const paymentStatus = query.get('payment_status');

    if (paymentStatus === 'success') {

    } else {
      message.error('Payment failed.');
    }
  }, [location, navigate]);
   
   
  return (
     
    <Result
    icon={<SmileOutlined style={{ color: '#52c41a', fontSize: 188 }} />}
    title="Thank You for Your Payment"
    subTitle="Your advertisement request has been sent to the admin to approve.Admin will accept this as soon as possible"
    extra={[
      <Button type="primary" key="list" onClick={() => navigate('/')}>
        Home Page
      </Button>,
      <Button key="another" onClick={() => navigate('/post-ad')}>
        Create Another Advertisement
      </Button>,
    ]}
  />
 
  );
};

export default PaymentSuccess;
