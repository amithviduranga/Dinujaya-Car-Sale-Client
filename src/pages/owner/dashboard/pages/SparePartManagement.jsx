import React, { useState } from 'react';
import { Button, Modal, Table, Image, Form, Input, Upload, Select } from 'antd';
import { PlusOutlined,UploadOutlined,EditOutlined ,DeleteOutlined} from '@ant-design/icons';

const { Option } = Select;

const SparePartManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [spareParts, setSpareParts] = useState([]); // Replace with actual spare parts data

  const handleEdit = (id) => {
    console.log('Edit vehicle', id);
  };

  const handleDelete = (id) => {
    console.log('Delete vehicle', id);
  };


  const columns = [
    {
        title: 'Item Code',
        dataIndex: 'itemCode',
        key: 'itemCode',
      },
      {
        title: 'Image',
        dataIndex: 'image',
        key: 'image',
        render: (text, record) => (
          <Image width={50} src={record.image} />
        ),
      },
      {
        title: 'Vehicle Model',
        dataIndex: 'vehicleModel',
        key: 'vehicleModel',
      },
      {
        title: 'Available Quantity',
        dataIndex: 'availableQty',
        key: 'availableQty',
      },
      {
        title: 'Unit Price(LKR)',
        dataIndex: 'price',
        key: 'price',
      },
    
    {
      title: 'Spare Part Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
        title: 'Actions',
        key: 'actions',
        render: (text, record) => (
          <span>
            <Button icon={<EditOutlined />} onClick={() => handleEdit(record.id)}></Button>
            <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}></Button>
          </span>
        ),
      },
    // Add more columns as needed
  ];

  const handleAddSparePart = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    // Handle form submission here
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ padding: '38px', background: '#fff', borderRadius: '8px' }}>
      <div style={{ marginBottom: '1px', display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ marginBottom: 60 }}>Spare Part Management</h1>
        <Button type="primary" icon={<PlusOutlined />} style={{marginTop:70}} onClick={handleAddSparePart}>
          Add Spare Part
        </Button>
      </div>
      <Table columns={columns} dataSource={spareParts} rowKey="id" />
      <Modal
        title="Add Spare Part Details"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form layout="vertical">
          <Form.Item label="Spare Part Name" name="name" rules={[{ required: true, message: 'Please enter spare part name' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Image" name="image">
            <Upload>
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>
          {/* Add more form fields as needed */}
        </Form>
      </Modal>
    </div>
  );
};

export default SparePartManagement;
