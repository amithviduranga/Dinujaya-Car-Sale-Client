import React from 'react';
import { Row, Col } from 'antd';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Row gutter={16} className="boxes">
        <Col span={6}>
          <div className="box">
            <h2>Box 1</h2>
            <p>Data with animation</p>
          </div>
        </Col>
        <Col span={6}>
          <div className="box">
            <h2>Box 2</h2>
            <p>Data with animation</p>
          </div>
        </Col>
        <Col span={6}>
          <div className="box">
            <h2>Box 3</h2>
            <p>Data with animation</p>
          </div>
        </Col>
        <Col span={6}>
          <div className="box">
            <h2>Box 4</h2>
            <p>Users</p>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
