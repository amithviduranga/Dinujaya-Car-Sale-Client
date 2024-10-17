import React, { useState, useEffect } from 'react';
import { Button, Modal, Table, Form, Input, message,Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined,ExclamationCircleOutlined  } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const { confirm } = Modal;

const apiUrl = process.env.REACT_APP_API_URL;

const SparePartManagement = () => {
 const [isModalVisible, setIsModalVisible] = useState(false);
  const [spareParts, setSpareParts] = useState([]);
  const [filteredSpareParts, setFilteredSpareParts] = useState([]); // State to hold the filtered data
  const [searchKeyword, setSearchKeyword] = useState(''); // State to hold the search keyword
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSparePart, setSelectedSparePart] = useState(null); // State to hold the selected spare part for editing
  const [form] = Form.useForm();
  const [selectedFile, setSelectedFile] = useState(null);

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
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]); // Set the selected file
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
    confirm({
      title: 'Are you sure you want to delete this spare part?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        axios.delete(`${apiUrl}spare-part/DeleteSaprePart/${id}`)
          .then(() => {
            message.success('Spare part deleted successfully');
            fetchSpareParts(); // Refresh the table after successful delete
          })
          .catch(error => {
            console.error('There was an error deleting the spare part:', error);
            message.error('Failed to delete spare part');
          });
      },
      onCancel() {
        console.log('Delete cancelled');
      },
    });
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
      const formData = new FormData();
      formData.append('partName', values.partName);
      formData.append('price', values.price);
      formData.append('description', values.description);
      formData.append('qty', values.qty || values.newQty);
      formData.append('vehicleBrand', values.vehicleBrand);
      formData.append('vehicleModel', values.vehicleModel);
      formData.append('itemCode', values.itemCode);

      if (selectedFile) {
        formData.append('image', selectedFile); // Append the selected image file
      }

      if (isEditMode && selectedSparePart) {
        // Update spare part
        axios.put(`${apiUrl}spare-part/updateSparePart/${selectedSparePart.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
          .then(response => {
            message.success("Successfully updated the spare part");
            fetchSpareParts(); // Update the spare parts list with the updated entry
            setIsModalVisible(false);
            form.resetFields();
            setSelectedSparePart(null);
            setSelectedFile(null);
          })
          .catch(error => {
            console.error('There was an error updating the spare part:', error);
          });
      } else {
        // Add new spare part
        axios.post(`${apiUrl}spare-part/saveSparePart`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
          .then(response => {
            message.success("Successfully added new spare part into the system");
            fetchSpareParts(); // Update the spare parts list with the new entry
            setIsModalVisible(false);
            form.resetFields();
            setSelectedFile(null);
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
        onChange={(e) => setSearchKeyword(e.target.value)}
        style={{ marginBottom: 20, height: 40, borderColor: "Blue" }}
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
          <Form.Item label="Quantity" name={isEditMode ? 'newQty' : 'qty'} rules={[{ required: true, message: 'Please enter quantity' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Upload Image" name="image">
            <Input type="file" onChange={handleFileChange} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SparePartManagement;
