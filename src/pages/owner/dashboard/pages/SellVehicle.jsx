import React, { useState, useEffect } from 'react';
import { Layout, Menu, Form, Input, InputNumber, Button, Upload, Row, Col, Card, Modal, Image, Select, Table, message } from 'antd';
import { CarOutlined, ToolOutlined, UnorderedListOutlined, UploadOutlined, EditOutlined, DeleteOutlined,ExclamationCircleOutlined} from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const { confirm } = Modal;

const apiUrl = process.env.REACT_APP_API_URL;

const SellVehicle = () => {
    const [form] = Form.useForm();
    const [vehicles, setVehicles] = useState([]);
    const [spareParts, setSpareParts] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [vehicleRecommendations, setVehicleRecommendations] = useState([]);
  
    useEffect(() => {
      fetchVehicles();
      fetchSpareParts();
    }, []);
  
    const fetchVehicles = async () => {
      try {
        const response = await axios.get(`${apiUrl}vehicle`); // Fetch vehicles from API
        setVehicles(response.data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };
  
    const fetchSpareParts = async () => {
      try {
        const response = await axios.get(`${apiUrl}spare-part/getAllSpareParts`); // Fetch spare parts from API
        setSpareParts(response.data);
      } catch (error) {
        console.error('Error fetching spare parts:', error);
      }
    };
  
    const fetchVehicleDetails = async (id) => {
      try {
        const response = await axios.get(`${apiUrl}vehicle/${id}`); // Fetch vehicle details from API
        setSelectedVehicle(response.data);
      } catch (error) {
        console.error('Error fetching vehicle details:', error);
      }
    };
  
    const fetchVehicleRecommendations = async (vehicleId) => {
      try {
        const response = await axios.get(`${apiUrl}spare-part-recommondation/getReccomondations/${vehicleId}`); // Fetch recommendations for the selected vehicle
        console.log("reccomondations",response)
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
  
    const handleEdit = (id) => {
      console.log('Delete vehicle', id);
    };
  
    const handleDelete = (id) => {
      console.log('Delete vehicle', id);
    };
  
    const onFinish = async (values) => {
      try {
        const vehicleId = values.vehicleRegNo.key; // Get the selected vehicle ID
        const partId = values.partId; // Get the selected part ID
        const payload = {
          reccomondationMonths: values.reccomondationMonths,
          recommendationReason: values.recommendationReason,
        };
        
        // Post the recommendation to the API
        const response = await axios.post(`${apiUrl}spare-part-recommondation/recommondSparePart/${vehicleId}/${partId}`, payload);
        message.success("Successfully saved your recommendation to this vehicle");
        
        // Fetch the recommendations for the selected vehicle
        fetchVehicleRecommendations(vehicleId);
        
        form.resetFields(); // Reset the form fields
      } catch (error) {
        console.error('Error saving recommendation:', error);
        alert('Failed to recommend spare part.');
      }
    
      console.log("rec Ca", values);
    };
  
    const getImageUrlFromBase64 = (base64String) => {
      return `data:image/jpeg;base64,${base64String}`; // Assuming the image is JPEG, adjust if different
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
  
    console.log("spare parts ",spareParts)
  
    return (
      <div style={{ padding: '24px', background: '#fff', borderRadius: '8px', marginTop: '24px' }}>
        <h1 style={{ marginBottom:50 }}>Create An Invoice-Sell Vehicle</h1>

        <Row gutter={16}>
          <Col span={12}>
          <Card title="Vehicle Details" bordered={true} style={{  fontSize: '40px' }}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item
                name="vehicleRegNo"
                label="Vehicle Registration Number"
                rules={[{ required: true, message: 'Please select a vehicle' }]}
              >
                <Select
                  showSearch
                  placeholder="Select a vehicle"
                  onChange={handleVehicleChange}
                  labelInValue
                >
                  {vehicles.map((vehicle) => (
                    <Select.Option key={vehicle.id} value={vehicle.id} label={vehicle.registrationNumber}>
                      {vehicle.registrationNumber}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
  
              <Form.Item
          name="partId"
          label="Recommend a Spare Part from Stock"
          rules={[{ required: true, message: 'Please select a spare part' }]}
        >
          <Select
            showSearch
            placeholder="Select a spare part"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
              option.itemCode.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {spareParts.map((part) => (
              <Select.Option key={part.id} value={part.id} itemCode={part.itemCode}>
                {`${part.itemCode} - ${part.partName} - ${part.vehicleBrand} - ${part.vehicleModel} `} 
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
              <Form.Item
                name="reccomondationMonths"
                label="Discount"
                rules={[{ required: true, message: 'Please enter the Discount if available' }]}
              >
                <Input />
              </Form.Item>
  
              <Form.Item
                name="recommendationReason"
                label="Reason for reccomand "
              >
                <Input />
              </Form.Item>
             
              <Form.Item>
              <Row justify="end">
              <Col>
                
              </Col>
            </Row>
              </Form.Item>
            </Form>
            </Card>
          </Col>
          <Col span={12}>
            {selectedVehicle ? (
              <Card title="Preview Vehicle" bordered={true} style={{ textAlign: 'center', fontSize: '20px' }}>
                <Row gutter={16}>
                  <Col span={12} style={{ textAlign: 'center' }}>
                    {/* Display the main image */}
                    {selectedVehicle.images.map(image => {
                      if (image.mainImage) {
                        const imageUrl = getImageUrlFromBase64(image.data); // Convert base64 to image URL
                        return (
                          <div key={image.id} style={{ marginTop:15 , position: 'relative' }}>
                          <Image
                            width={250}
                            src={imageUrl}
                            alt={selectedVehicle.modelName}
                            style={{ border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
                          />
                          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'none' }}></div>
                        </div>
                        );
                      }
                      return null; // Handle case where no main image is found
                    })}
                  </Col>
                  <Col span={12} style={{ fontSize: 20, textAlign: 'left' }}>
                    {/* Display vehicle details */}
                    <p><strong>Model Name:</strong> {selectedVehicle.modelName}</p>
                    <p><strong>Brand Name:</strong> {selectedVehicle.brandName}</p>
                    <p><strong>Manufacture Year:</strong> {selectedVehicle.manufactureYear}</p>
                    <p><strong>Price:</strong> {selectedVehicle.price}</p>
                    <p><strong>Mileage:</strong> {selectedVehicle.mileage}</p>
                  </Col>
                </Row>
              </Card>
            ) : (
              <Card title="Vehicle Details" bordered={true} style={{ textAlign: 'center', fontSize: '20px' }}>
                <p>Select a vehicle to see its details here.</p>
              </Card>
            )}
            
          </Col>
          
        </Row>
        <Card title="Customer Details" bordered={true} style={{  fontSize: '40px' }}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item
                name="vehicleRegNo"
                label="Vehicle Registration Number"
                rules={[{ required: true, message: 'Please select a vehicle' }]}
              >
                <Select
                  showSearch
                  placeholder="Select a vehicle"
                  onChange={handleVehicleChange}
                  labelInValue
                >
                  {vehicles.map((vehicle) => (
                    <Select.Option key={vehicle.id} value={vehicle.id} label={vehicle.registrationNumber}>
                      {vehicle.registrationNumber}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
  
              <Form.Item
          name="partId"
          label="Recommend a Spare Part from Stock"
          rules={[{ required: true, message: 'Please select a spare part' }]}
        >
          <Select
            showSearch
            placeholder="Select a spare part"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
              option.itemCode.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {spareParts.map((part) => (
              <Select.Option key={part.id} value={part.id} itemCode={part.itemCode}>
                {`${part.itemCode} - ${part.partName} - ${part.vehicleBrand} - ${part.vehicleModel} `} 
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
              <Form.Item
                name="reccomondationMonths"
                label="Discount"
                rules={[{ required: true, message: 'Please enter the Discount if available' }]}
              >
                <Input />
              </Form.Item>
  
              <Form.Item
                name="recommendationReason"
                label="Reason for reccomand "
              >
                <Input />
              </Form.Item>
             
              <Form.Item>
              <Row justify="end">
              <Col>
                
              </Col>
            </Row>
              </Form.Item>
            </Form>
            </Card>
        {selectedVehicle ? (
            <Card title="Spare Part Recomondation Details" bordered={true} style={{  fontSize: '40px' }}>
        <Table columns={columns} dataSource={vehicleRecommendations} pagination={false} style={{ marginTop: '24px' }} />
        </Card>
  
      ) : (
      ""
      )}
      </div>
    );
  };

export default SellVehicle;
