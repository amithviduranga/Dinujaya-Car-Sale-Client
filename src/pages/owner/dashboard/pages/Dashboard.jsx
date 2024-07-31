import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import './Dashboard.css';
import Stack from '@mui/material/Stack';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import AdUnitsOutlinedIcon from '@mui/icons-material/AdUnitsOutlined';
import NoCrashIcon from '@mui/icons-material/NoCrash';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { UserOutlined, InfoCircleOutlined, BarChartOutlined, SettingOutlined } from '@ant-design/icons';

const Dashboard = () => {
  const initialData = [
    { icon: <PersonOutlinedIcon style={{fontSize:20}}/>, value: 75, label: "New Users", color: "#a868eb",  },
    { icon: <AdUnitsOutlinedIcon style={{fontSize:20}} />, value: 50, label: "Addvertiesments", color: "#ffa0aa",  },
    { icon: <FeaturedPlayListIcon style={{fontSize:20}} />, value: 90, label: "Vehicle Listed", color: "#12dc59",  },
    { icon: <NoCrashIcon style={{fontSize:20}} />, value: 65, label: "Vehicle Purchased", color: "#ffba31",  }
  ];

  const data = [
    { day: 'Mon', registeredUsers: 10 },
    { day: 'Tue', registeredUsers: 20 },
    { day: 'Wed', registeredUsers: 15 },
    { day: 'Thur', registeredUsers: 25 },
    { day: 'Fri', registeredUsers: 30 },
    { day: 'Sat', registeredUsers: 5 },
    { day: 'Sun', registeredUsers: 10 }
  ];


  const barChartData  = [
    { day: 'Mon', registeredUsers: 10 },
    { day: 'Tue', registeredUsers: 20 },
    { day: 'Wed', registeredUsers: 15 },
    { day: 'Thur', registeredUsers: 25 },
    { day: 'Fri', registeredUsers: 30 },
    { day: 'Sat', registeredUsers: 5 },
    { day: 'Sun', registeredUsers: 10 }
  ];
  const pieChartData = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 }
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
                        width={130}
                        height={170}
                        value={item.value}
                        sx={{
                          [`& .${gaugeClasses.valueText}`]: {
                            fontSize: 26,
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
      <h2 style={{paddingLeft:20}}>Registered Users-This Week</h2>
      <BarChart
        width={450}
        height={260}
        data={data}
       
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="registeredUsers" fill="#8884d8" />
      </BarChart>
    </div>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: '16px' }}>
        <Col span={12}>
          <div className="outer-box small-box">
            <h2 style={{paddingLeft:20}}>Vehicle Listing - This Week</h2>
            <BarChart
              width={450}
              height={300}
              data={barChartData}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="registeredUsers" fill="#82ca9d" />
            </BarChart>
          </div>
        </Col>
        <Col span={12}>
          <div className="outer-box small-box">
            <h2 style={{paddingLeft:20}}>Pie Chart</h2>
            <PieChart width={450} height={300}>
              <Pie
                data={pieChartData}
                cx={200}
                cy={150}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
