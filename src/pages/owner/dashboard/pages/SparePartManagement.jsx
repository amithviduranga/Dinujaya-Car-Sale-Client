import React, { useState, useEffect } from 'react';
import { Button, Modal, Table, Form, Input, message,Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const { Option } = Select;
const apiUrl = process.env.REACT_APP_API_URL;

const SparePartManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [spareParts, setSpareParts] = useState([]);
  const [filteredSpareParts, setFilteredSpareParts] = useState([]); // State to hold the filtered data
  const [searchKeyword, setSearchKeyword] = useState(''); // State to hold the search keyword
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSparePart, setSelectedSparePart] = useState(null); // State to hold the selected spare part for editing
  const [form] = Form.useForm();

  useEffect(() => {
    fetchSpareParts();
  }, []);

  const fetchSpareParts = () => {
    axios.get(`${apiUrl}spare-part/getAllSpareParts`)
      .then(response => {
        setSpareParts(response.data);
        setFilteredSpareParts(response.data); // Initially, filtered data is the same as the fetched data
      })
      .catch(error => {
        console.error('There was an error fetching the spare parts:', error);
      });
  };

  const handleEdit = (id) => {
    const sparePart = spareParts.find(sp => sp.id === id);
    setSelectedSparePart(sparePart);
    setIsEditMode(true);
    setIsModalVisible(true);
    form.setFieldsValue({
      partName: sparePart.partName,
      price: sparePart.price,
      description: sparePart.description,
      vehicleBrand: sparePart.vehicleBrand,
      vehicleModel: sparePart.vehicleModel,
      
    });
  };

  const handleDelete = (id) => {
    console.log('Delete vehicle', id);
  };

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchKeyword(keyword);
  
    const filteredData = spareParts.filter(item => {
      return (
        item.itemCode?.toLowerCase().includes(keyword) ||
        item.partName?.toLowerCase().includes(keyword) ||
        item.vehicleModel?.toLowerCase().includes(keyword) ||
        (item.availableQty?.toString().toLowerCase() ?? '').includes(keyword) ||
        (item.price?.toString().toLowerCase() ?? '').includes(keyword) ||
        item.description?.toLowerCase().includes(keyword) ||
        item.createdBy?.toLowerCase().includes(keyword) ||
        item.modifiedBy?.toLowerCase().includes(keyword)
      );
    });
  
    setFilteredSpareParts(filteredData);
  };

  const columns = [
    {
      title: 'Item Code',
      dataIndex: 'itemCode',
      key: 'itemCode',
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
      width: 80,
    },
    {
      title: 'Unit Price(LKR)',
      dataIndex: 'price',
      key: 'price',
      width: 100,
    },
    {
      title: 'Spare Part Name',
      dataIndex: 'partName',
      key: 'name',
      width: 100,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Listed On',
      dataIndex: 'createdOn',
      key: 'createdOn',
      render: (createdOn) => dayjs(createdOn).format('YYYY-MM-DD'),
    },
    {
      title: 'Listed By',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: 'Modified By',
      dataIndex: 'modifiedBy',
      key: 'modifiedBy',
    },
    {
        title: 'Modified On',
        dataIndex: 'modifiedOn',
        key: 'modifiedOn',
        render: (createdOn) => dayjs(createdOn).format('YYYY-MM-DD'),
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
  ];

  const handleAddSparePart = () => {
    setIsEditMode(false);
    setIsModalVisible(true);
  };

   console.log("Selected Spare part",selectedSparePart)
  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (isEditMode && selectedSparePart) {
        // Update spare part
        const updatedSparePart = {
          ...selectedSparePart,
          partName: values.partName,
          price: values.price,
          description: values.description,
          newQty: values.newQty,
        };
        axios.put(`${apiUrl}spare-part/updateSparePart/${selectedSparePart.id}`, updatedSparePart)
          .then(response => {
            message.success("Successfully updated the spare part");
            fetchSpareParts(); // Update the spare parts list with the updated entry
            setIsModalVisible(false);
            form.resetFields();
            setSelectedSparePart(null);
          })
          .catch(error => {
            console.error('There was an error updating the spare part:', error);
          });
      } else {
        // Add new spare part
        axios.post(`${apiUrl}spare-part/saveSparePart`, values)
          .then(response => {
            message.success("Successfully added new spare part into the system");
            fetchSpareParts(); // Update the spare parts list with the new entry
            setIsModalVisible(false);
            form.resetFields();
          })
          .catch(error => {
            console.error('There was an error adding the spare part:', error);
          });
      }
    }).catch(errorInfo => {
      console.error('Failed to add spare part:', errorInfo);
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setSelectedSparePart(null);
  };

  return (
    <div style={{ padding: '38px', background: '#fff', borderRadius: '8px' }}>
      <div style={{ marginBottom: '1px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ marginBottom: 60 }}>Spare Part Management</h1>
        <Button type="primary" icon={<PlusOutlined />} style={{ marginTop: 70 }} onClick={handleAddSparePart}>
Add Spare Part
</Button>
</div>
<Input
placeholder="Search by any keyword"
value={searchKeyword}
onChange={handleSearch}
style={{ marginBottom: 20 , height:40 , borderColor:"Blue" , }}
/>
      <Table columns={columns} dataSource={filteredSpareParts} rowKey="id" />
      <Modal
        title={isEditMode ? "Edit Spare Part Details" : "Add Spare Part Details"}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical">
          {!isEditMode && (
            <>
              <Form.Item label="Item Code" name="itemCode" rules={[{ required: true, message: 'Please enter spare part Item Code' }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Vehicle Brand" name="vehicleBrand">
                <Input />
              </Form.Item>
              <Form.Item label="Vehicle Model" name="vehicleModel">
                <Input />
              </Form.Item>
            </>
          )}
          <Form.Item label="Spare Part Name" name="partName" rules={[{ required: true, message: 'Please enter spare part name' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Unit Price" name="price" rules={[{ required: true, message: 'Please enter unit price' }]}>
            <Input />
          </Form.Item>

          {isEditMode ? (
            <>
            <Form.Item label="Quantity" name="newQty" rules={[{ required: true, message: 'Please enter quantity' }]}>
            <Input placeholder='Enter your new Qty from this item' />
           </Form.Item>
            </>
          ):(
            <>
            <Form.Item label="Quantity" name="qty" rules={[{ required: true, message: 'Please enter quantity' }]}>
            <Input/>
           </Form.Item>
            </>

          )
          
          
          }

          
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SparePartManagement;
