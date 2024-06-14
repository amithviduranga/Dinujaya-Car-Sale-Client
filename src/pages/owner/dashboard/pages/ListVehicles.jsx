import React, { useState } from 'react';
import { Layout, Menu, Form, Input, InputNumber, Button, Upload, Row, Col, Table, Select, Card } from 'antd';
import { CarOutlined, ToolOutlined, UnorderedListOutlined, UploadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Option } = Select;

const NavigationBar = ({ onMenuClick }) => (
  <Menu theme="light" mode="horizontal" defaultSelectedKeys={['list-new-vehicle']} style={{ lineHeight: '64px', borderRadius: '8px' }}>
    <Menu.Item key="list-new-vehicle" icon={<CarOutlined />} style={{ borderRadius: '8px 0 0 8px' }} onClick={() => onMenuClick('list-new-vehicle')}>
      List New Vehicle
    </Menu.Item>
    <Menu.Item key="show-listed-vehicles" icon={<UnorderedListOutlined />} onClick={() => onMenuClick('show-listed-vehicles')}>
      Show Listed Vehicles
    </Menu.Item>
    <Menu.Item key="spare-parts" icon={<ToolOutlined />}>
      Spare Parts
    </Menu.Item>
  </Menu>
);

const ListNewVehicleForm = () => {
  const onFinish = values => {
    console.log('Form values:', values);
    // Logic to handle form submission
  };

  // Dummy function for handling file uploads
  const handleUpload = info => {
    console.log(info.fileList);
  };

  return (
    <div style={{ padding: '24px', background: '#fff', borderRadius: '8px' }}>
      <h1>List New Vehicle</h1>
      <Form layout="vertical" onFinish={onFinish}>
        <Card type="inner" title="Basic Vehicle Details">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="modelName" label="Model Name" rules={[{ required: true, message: 'Please enter the model name' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="brandName" label="Brand Name" rules={[{ required: true, message: 'Please enter the brand name' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="manufactureYear" label="Manufacture Year" rules={[{ required: true, message: 'Please enter the manufacture year' }]}>
                <InputNumber min={1886} max={new Date().getFullYear()} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="price" label="Price in LKR" rules={[
                { pattern: /^[0-9]+$/, message: 'Price should contain numbers only' },
                { required: true, message: 'Please enter the price' }
              ]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="mileage" label="Mileage in Km" rules={[
                { pattern: /^[0-9]+$/, message: 'Mileage should contain numbers only' },
                { required: true, message: 'Please enter the mileage' }
              ]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="color" label="Color" rules={[{ required: true, message: 'Please enter the color' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="fuelType" label="Fuel Type" rules={[{ required: true, message: 'Please select the fuel type' }]}>
                <Select placeholder="Select fuel type">
                  <Option value="Petrol">Petrol</Option>
                  <Option value="Diesel">Diesel</Option>
                  <Option value="Electric">Electric</Option>
                </Select>
              </Form.Item>
              <Form.Item name="condition" label="Condition">
                <Select placeholder="Select condition status">
                  <Option value="Mint">Mint</Option>
                  <Option value="Old">Old</Option>
                  <Option value="Middle Level">Middle Level</Option>
                </Select>
              </Form.Item>
              <Form.Item name="description" label="Description">
                <Input.TextArea rows={6} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card type="inner" title="Upload Photos" style={{ borderRadius: '8px', marginTop: '24px' }}>
          <div style={{  borderRadius: '8px', marginBottom: '24px' }}>
            <h4>Main Image</h4>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={() => false} // Prevent actual upload for demonstration
              onChange={handleUpload}
              style={{ width: '220px'}}
            >
              <div style={{ width: '220px',  height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button icon={<UploadOutlined />} style={{  background: '#f0f2f5'  }}/>
                
              
              </div>
            </Upload>
            <Row gutter={16} style={{ marginTop: '24px' }}>
              {[1, 2, 3, 4, 5].map(index => (
                <Col key={index} span={4}>
                  <h4>Additional Image {index}</h4>
                  <Upload
                    name={`additionalImage${index}`}
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={() => false} // Prevent actual upload for demonstration
                    onChange={handleUpload}
                  >
                    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Button icon={<UploadOutlined />} style={{ background: '#f0f2f5',width: '100%', height: '100%' }}>
                        
                      </Button>
                    </div>
                  </Upload>
                </Col>
              ))}
            </Row>
          </div>
        </Card>

        <Form.Item>
          <Button type="primary" htmlType="submit">Submit</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const ShowListedVehicles = () => {
  const vehicles = [
    // Sample data
    { id: 1, make: 'Toyota', model: 'Corolla', year: 2020, price: 15000, mileage: 20000 },
    { id: 2, make: 'Honda', model: 'Civic', year: 2019, price: 14000, mileage: 25000 },
  ];

  const handleEdit = id => {
    console.log('Edit vehicle', id);
  };

  const handleDelete = id => {
    console.log('Delete vehicle', id);
  };

  const columns = [
    { title: 'Make', dataIndex: 'make', key: 'make' },
    { title: 'Model', dataIndex: 'model', key: 'model' },
    { title: 'Year', dataIndex: 'year', key: 'year' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Mileage', dataIndex: 'mileage', key: 'mileage' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <span>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record.id)}>Edit</Button>
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>Delete</Button>
        </span>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#fff', borderRadius: '8px', marginTop: '24px' }}>
      <h1>Show Listed Vehicles</h1>
      <Table columns={columns} dataSource={vehicles} rowKey="id" />
    </div>
  );
};

const ListNewVehicle = () => {
  const [selectedMenu, setSelectedMenu] = useState('list-new-vehicle');

  const renderContent = () => {
    switch (selectedMenu) {
      case 'list-new-vehicle':
        return <ListNewVehicleForm />;
      case 'show-listed-vehicles':
        return <ShowListedVehicles />;
      default:
        return <ListNewVehicleForm />;
    }
  };

  return (
    <>
      <NavigationBar onMenuClick={setSelectedMenu} />
      <div style={{ paddingTop: 64, minHeight: 'calc(100vh - 64px)', paddingTop: '14px' }}>
        {renderContent()}
      </div>
    </>
  );
};

export default ListNewVehicle;
