import React from 'react';
import { Layout, Row, Col } from 'antd';

const { Footer } = Layout;

const AppFooter = () => {
  return (
    <Footer style={{ backgroundColor: '#001529', color: '#ffffff', textAlign: 'center', padding: '20px 50px' ,marginTop:'20px'}}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <h3 style={{ color: '#ffffff' }}>About Us</h3>
          <p>
            Dinujaya Car Sale offers a wide range of vehicles to suit every need and budget. We are committed to providing quality service and a smooth buying experience.
          </p>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <h3 style={{ color: '#ffffff' }}>Quick Links</h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li><a href="/about" style={{ color: '#ffffff' }}>About Us</a></li>
            <li><a href="/contact" style={{ color: '#ffffff' }}>Contact Us</a></li>
            <li><a href="/services" style={{ color: '#ffffff' }}>Our Services</a></li>
          </ul>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <h3 style={{ color: '#ffffff' }}>Contact Us</h3>
          <p>Email: support@dinujayacarsale.com</p>
          <p>Phone: +94 77 123 4567</p>
          <p>Address: 123 Car Street, Colombo, Sri Lanka</p>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <h3 style={{ color: '#ffffff' }}>Follow Us</h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li><a href="https://www.facebook.com" style={{ color: '#ffffff' }}>Facebook</a></li>
            <li><a href="https://www.instagram.com" style={{ color: '#ffffff' }}>Instagram</a></li>
            <li><a href="https://www.twitter.com" style={{ color: '#ffffff' }}>Twitter</a></li>
          </ul>
        </Col>
      </Row>
      <div style={{ marginTop: '20px' }}>
        &copy; 2024 Dinujaya Car Sale. All Rights Reserved.
      </div>
    </Footer>
  );
};

export default AppFooter;
