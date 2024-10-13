import React, { useState, useEffect } from 'react';
import { Layout, Menu, Form, Input, InputNumber, Button, Upload, Row, Col, Card, Modal, Image, Select, Table, message} from 'antd';
import { CarOutlined, ToolOutlined, UnorderedListOutlined, UploadOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';

const { Option } = Select;
const apiUrl = process.env.REACT_APP_API_URL;

const SellVehicle = () => {
  const [form] = Form.useForm();
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleRecommendations, setVehicleRecommendations] = useState([]);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get(`${apiUrl}vehicle`); 
      const unsoldVehicles = response.data.filter(vehicle => vehicle.sold === false);
      setVehicles(unsoldVehicles);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const fetchVehicleDetails = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}vehicle/${id}`);
      setSelectedVehicle(response.data);
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
    }
  };

  const fetchVehicleRecommendations = async (vehicleId) => {
    try {
      const response = await axios.get(`${apiUrl}spare-part-recommondation/getReccomondations/${vehicleId}`);
      setVehicleRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching vehicle recommendations:', error);
    }
  };

  const handleVehicleChange = (value) => {
    const vehicleId = value.key;
    fetchVehicleDetails(vehicleId);
    fetchVehicleRecommendations(vehicleId);
  };

  const onFinish = async (values) => {
    
  };
  const invoiceBy = localStorage.getItem('AdminUsername')
  const getImageUrlFromBase64 = (base64String) => `data:image/jpeg;base64,${base64String}`;

  const generateInvoice = async(values) => {

    try {
        
        const payload = {
            vehicleId: values.vehicleRegNo.key,
            discount: values.discount,
            customerFullName: values.customerFullName,
            address: values.address,  
            paymentType: values.paymentType,
            mobileNumber: values.mobileNumber, 
            invoicedBy: invoiceBy,
            email: values.email,  
            paymentMethod: values.paymentMethod,
        };
        await axios.post(`${apiUrl}invoices/generate`, payload);
        message.success("Successfully Saved Customer Details in System");
        fetchVehicleRecommendations(payload.vehicleId);
        form.resetFields();
      } catch (error) {
        console.error('Error saving recommendation:', error);
        alert('Failed to recommend spare part.');
      }


    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text('Invoice', 105, 30, null, null, 'center');
    doc.setFontSize(16);
    doc.text(`Customer Name: ${values.customerFullName}`, 20, 50);
    doc.text(`Vehicle Model: ${selectedVehicle.modelName}`, 20, 60);
    doc.text(`Price: ${selectedVehicle.price}`, 20, 70);
    doc.text(`Date: ${dayjs().format('YYYY-MM-DD')}`, 20, 80);
    doc.save('invoice.pdf');
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 50 },
    { title: 'Vehicle Reg No', dataIndex: 'vehicleRegNo', key: 'vehicleRegNo', width: 100, },
    { title: 'Item Code', dataIndex: 'itemCode', key: 'itemCode' },
    { title: 'Spare part', dataIndex: 'partName', key: 'partName' },
    { title: 'Spare Part Price', dataIndex: 'price', key: 'price', width: 80, },
    { title: 'Reccmonded Months', dataIndex: 'recommondadMonths', key: 'recommondadMonths', width: 70, },
    { title: 'Reason', dataIndex: 'reason', key: 'reason' },
    { title: 'Created On', dataIndex: 'createdOn', key: 'createdOn',  render: (createdOn) => dayjs(createdOn).format('YYYY-MM-DD') },
    { title: 'Created By', dataIndex: 'createdBy', key: 'createdBy' },
    { title: 'Modified On', dataIndex: 'modifiedOn', key: 'modifiedOn',  render: (createdOn) => dayjs(createdOn).format('YYYY-MM-DD') },
    { title: 'Modified By', dataIndex: 'modifiedBy', key: 'modifiedBy' },
    
  ];

  return (
    <div style={{ padding: '24px', background: '#fff', borderRadius: '8px' }}>
      <h1 style={{ marginBottom: 50 }}>Create An Invoice - Sell Vehicle</h1>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Card title="Vehicle Details" bordered>
              <Form.Item name="vehicleRegNo" label="Vehicle Registration Number" rules={[{ required: true, message: 'Please select a vehicle' }]}>
                <Select showSearch placeholder="Select a vehicle" onChange={handleVehicleChange} labelInValue>
                  {vehicles.map((vehicle) => (
                    <Select.Option key={vehicle.id} value={vehicle.id}>
                      {vehicle.registrationNumber}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="discount" label="Discount">
                <Input />
              </Form.Item>
            </Card>
          </Col>
          <Col span={12}>
            {selectedVehicle ? (
              <Card title="Preview Vehicle" bordered>
                <Row gutter={16}>
                  <Col span={12}>
                    {selectedVehicle.images.map(image => image.mainImage && (
                      <Image key={image.id} width={250} src={getImageUrlFromBase64(image.data)} alt={selectedVehicle.modelName} />
                    ))}
                  </Col>
                  <Col span={12}>
                    <p><strong>Model Name:</strong> {selectedVehicle.modelName}</p>
                    <p><strong>Brand Name:</strong> {selectedVehicle.brandName}</p>
                    <p><strong>Manufacture Year:</strong> {selectedVehicle.manufactureYear}</p>
                    <p><strong>Price:</strong> {selectedVehicle.price}</p>
                    <p><strong>Mileage:</strong> {selectedVehicle.mileage}</p>
                  </Col>
                </Row>
              </Card>
            ) : (
              <Card title="Vehicle Details" bordered>
                <p>Select a vehicle to see its details here.</p>
              </Card>
            )}
          </Col>
        </Row>
        <Card title="Customer Details" bordered>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="customerFullName" label="Customer Full Name" rules={[{ required: true, message: 'Please enter customer full name' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="address" label="Address" rules={[{ required: true, message: 'Please enter address' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="mobileNumber" label="Mobile Number" rules={[{ required: true, message: 'Please enter mobile number' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="email" label="E-mail Address" rules={[{ required: true, message: 'Please enter email' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="paymentMethod" label="Payment Method" rules={[{ required: true, message: 'Please select payment method' }]}>
                <Select placeholder="Select Payment Type">
                  <Option value="Cash">Cash</Option>
                  <Option value="Bank Transfer">Bank Transfer</Option>
                  <Option value="Cheque">Cheque</Option>
                </Select>
              </Form.Item>
              <Form.Item name="PaymentType" label="paymentType">
                <Select placeholder="Select payment Type">
                  <Option value="Full Payment">Full Payment</Option>
                  <Option value="Leasing">Leasing</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {selectedVehicle ? (
            <Card title="Spare Part Recomondation Details" bordered={true} style={{  marginTop:20,fontSize: '40px' }}>
        <Table columns={columns} dataSource={vehicleRecommendations} pagination={false} style={{ marginTop: '24px' }} />
        </Card>

        
      
      ) : (
      ""
      )}
        <Button type="primary" onClick={() => generateInvoice(form.getFieldsValue())}>
          Generate Invoice
        </Button>
      </Form>
     
    </div>
  );
};

export default SellVehicle;
