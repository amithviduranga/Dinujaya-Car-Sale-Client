import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import './Dashboard.css';
import Stack from '@mui/material/Stack';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import AdUnitsOutlinedIcon from '@mui/icons-material/AdUnitsOutlined';
import NoCrashIcon from '@mui/icons-material/NoCrash';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { BarChart } from '@mui/x-charts/BarChart';
import { UserOutlined, InfoCircleOutlined, BarChartOutlined, SettingOutlined } from '@ant-design/icons';

const Dashboard = () => {
  const initialData = [
    { icon: <PersonOutlinedIcon />, value: 75, label: "New Users", color: "#a868eb", description: "Users" },
    { icon: <AdUnitsOutlinedIcon />, value: 50, label: "Addvertiesments", color: "#ffa0aa", description: "Data with animation" },
    { icon: <FeaturedPlayListIcon />, value: 90, label: "Vehicle Listed", color: "#12dc59", description: "Data with animation" },
    { icon: <NoCrashIcon />, value: 65, label: "Vehicle Purchased", color: "#ffba31", description: "Users" }
  ];

  return (
    <div className="dashboard">
      <Row gutter={16}>
        <Col span={15}>
          <div className="outer-box">
            <h2>Today's Summary</h2>
            <Row gutter={16} className="boxes">
              {initialData.map((item, index) => (
                <Col key={index} span={6}>
                  <div className={`box box-${index + 1}`}>
                    <div className={`icon-circle-${index + 1}`}>
                      {item.icon}
                    </div>
                    <div className={`meter-${index + 1}`}>
                      <Gauge
                        width={200}
                        height={100}
                        value={item.value}
                        sx={{
                          [`& .${gaugeClasses.valueText}`]: {
                            fontSize: 32,
                            transform: 'translate(1px, 0px)',
                          },
                          [`& .${gaugeClasses.progress}`]: {
                            stroke: item.color,
                          },
                          [`& .${gaugeClasses.valueArc}`]: {
                            fill: item.color,
                          },
                        }}
                        startAngle={-110}
                        endAngle={110}
                      />
                    </div>
                    <h2>{item.label}</h2>
                    <p>{item.description}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </Col>
        <Col span={9}>
          <div className="outer-box small-box">
            <h2>Engaged users</h2>
            <BarChart
  xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
  series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
  width={500}
  height={300}
/>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
