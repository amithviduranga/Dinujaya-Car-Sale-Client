import React, { useState ,useEffect} from 'react';
import { Layout, Menu, Form, Input, InputNumber, Button, Upload, Row, Col, Card, Modal, Image, Select, Table, message } from 'antd';
import { CarOutlined, ToolOutlined, UnorderedListOutlined, UploadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import dayjs from 'dayjs';

const {  Content } = Layout;
const { Option } = Select;
const { Dragger } = Upload;
const apiUrl = process.env.REACT_APP_API_URL;


const NavigationBar = ({ onMenuClick }) => (
  <div style={{border: '0px solid ',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.6)',
              overflow: 'hidden'}}>
  <Menu theme="light" mode="horizontal" defaultSelectedKeys={['list-new-vehicle']} style={{ lineHeight: '64px', borderRadius: '8px' }}>
    <Menu.Item key="list-new-vehicle" icon={<CarOutlined style={{fontSize:20}}/>} style={{ borderRadius: '8px 0 0 8px',fontSize:18 ,fontWeight:700}} onClick={() => onMenuClick('list-new-vehicle')}>
      Create Advertiesments
    </Menu.Item>
    <Menu.Item key="show-listed-vehicles" icon={<UnorderedListOutlined style={{fontSize:20}} />}  style={{fontSize:18 ,fontWeight:700}} onClick={() => onMenuClick('show-listed-vehicles')}>
     Advertiesment Status 
    </Menu.Item>
  </Menu>
  </div>
);


const ListNewVehicleForm = () => {

const navigate = useNavigate();
  const [form] = Form.useForm();
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState(Array(6).fill(null));

 
  const onFinish = async (values) => {
    console.log('Form values:', values);

    const formData = new FormData();
    formData.append('vehicle', new Blob([JSON.stringify(values)], { type: 'application/json' }));
    if (mainImage) {
      formData.append('mainImage', mainImage.originFileObj);
    }
    additionalImages.forEach((image, index) => {
      if (image) {
        formData.append('images', image.originFileObj);
      }
    });

    try {
      console.log(formData);
      const response = await axios.post(`${apiUrl}vehicle/saveVehicleDetails`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const paymentResponse = await axios.post(`${apiUrl}payment/create-checkout-session`)
      const checkoutUrl = paymentResponse.data; // Assuming your backend returns the URL as `url`
    
      // Redirect to Stripe Checkout session
      window.location.href = checkoutUrl;
      


    } catch (error) {
      console.error('Error uploading vehicle details:', error);
      alert('Failed to list vehicle.');
    }
  };

  const handleMainImageChange = (info) => {
    if (info.file.status === 'done') {
      // Get this URL from response in real world scenario
      setMainImage(info.file);
    }
  };

  const handleAdditionalImageChange = (index) => (info) => {
    if (info.file.status === 'done') {
      // Get this URL from response in real world scenario
      const newImages = [...additionalImages];
      newImages[index] = info.file;
      setAdditionalImages(newImages);
    }
  };

  return (
    <Layout>
    <div style={{border: '0px solid ',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0.6, 0.6)',
              overflow: 'hidden',
              padding:30}}>
      <h1 style={{textAlign:"center"}} >Post Your Vehicle Advetiesment</h1>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Card type="inner" title="Enter Your Basic Vehicle Details" style={{border: '0px solid ',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0.1, 0.1)',
              fontSize:20}}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="modelName" label="Model Name" rules={[{ required: true, message: 'Please enter the model name' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="brandName" label="Brand Name" rules={[{ required: true, message: 'Please enter the brand name' }]}>
                <Input />

              </Form.Item>
              <Form.Item name="category" label="Vehicle Category" rules={[{ required: true, message: 'PleaseSelect Vehicle Category' }]}>
              <Select placeholder="Select Province code of vehicle">
                  <Option value="car">Car</Option>
                  <Option value="van">Van</Option>
                  <Option value="bike">Bike</Option>
                  <Option value="threeWheel">Three Wheel</Option>
                  <Option value="lorry">Lorry</Option>
                
                </Select>
              </Form.Item>

              <Form.Item name="provinceCode" label="Province Code" rules={[{ required: true, message: 'Please enter the province code' }]}>
              <Select placeholder="Select Province code of vehicle">
                  <Option value="CP">CP</Option>
                  <Option value="EP">EP</Option>
                  <Option value="NC">NC</Option>
                  <Option value="NW">NW</Option>
                  <Option value="NP">NP</Option>
                  <Option value="SG">SG</Option>
                  <Option value="SP">SP</Option>
                  <Option value="UP">UP</Option>
                  <Option value="WP">WP</Option>
                
                </Select>
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
                  <Option value="Electric">Full Electric</Option>
                  <Option value="Electric">Hybrid</Option>
                </Select>
              </Form.Item>
              <Form.Item name="registrationNumber" label="Registration Number" rules={[{ required: true, message: 'Please enter the Registration number' }]}>
                <Input placeholder="Eg : AAA-5678" />
              </Form.Item>
              <Form.Item name="condition" label="Condition">
                <Select placeholder="Select condition status">
                  <Option value="Mint">Mint</Option>
                  <Option value="Old">Old</Option>
                  <Option value="Middle Level">Middle Level</Option>
                </Select>
              </Form.Item>
              <Form.Item name="registeredYear" label="Registration Year" rules={[{ required: true, message: 'Please enter the manufacture year' }]}>
                <InputNumber min={1886} max={new Date().getFullYear()} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="description" label="Description">
                <Input.TextArea rows={6} />
              </Form.Item>
              <Form.Item name="listingType" label="Listing Type" style={{ display: 'none' }} initialValue={0}>
  <Input type="hidden" />
</Form.Item>
            </Col>
          </Row>
        </Card>

        <Card type="inner" title="Upload Vehicle Images" style={{ border: '0px solid ', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0.1, 0.1)', fontSize: 20, marginTop: 24 }}>
        <p style={{ marginBottom: 24 ,fontSize:17,fontWeight:500,display:"flex",justifyContent: 'center', alignItems: 'center'}}>Upload your vehicle Main Image</p>
            <div style={{ marginBottom: 24 ,display:"flex",justifyContent: 'center', alignItems: 'center'}}>
                
              <Dragger
                name="mainImage"
                showUploadList={false}
                customRequest={({ file, onSuccess }) => {
                  setTimeout(() => {
                    onSuccess("ok");
                  }, 0);
                }}
                onChange={handleMainImageChange}
                style={{ width: 400, height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                {mainImage ? (
                  <img src={URL.createObjectURL(mainImage.originFileObj)} alt="Main" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <p className="ant-upload-drag-icon" style={{ fontSize: 24 }}>
                      <UploadOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag main image to this area</p>
                  </div>
                )}
              </Dragger>
            </div>
            <p style={{ marginBottom: 24 ,marginTop:104,fontSize:17,fontWeight:500,display:"flex",justifyContent: 'center', alignItems: 'center'}}>Upload Other Images into below Spaces</p>
            <Row gutter={12} style={{ marginTop: '34px', marginRight: 10 ,  marginBottom: 30  }}>
           
              {additionalImages.map((image, index) => (
                <Col span={4} key={index}>
                  <Dragger
                    name={`additionalImage-${index}`}
                    showUploadList={false}
                    customRequest={({ file, onSuccess }) => {
                      setTimeout(() => {
                        onSuccess("ok");
                      }, 0);
                    }}
                    onChange={handleAdditionalImageChange(index)}
                    style={{ marginBottom: 10 }}
                  >
                    {image ? (
                      <img src={URL.createObjectURL(image.originFileObj)} alt={`Additional ${index + 1}`} style={{ width: '100%' }} />
                    ) : (
                      <div>
                        <p className="ant-upload-drag-icon">
                          <UploadOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag additional image {index + 1} to this area</p>
                      </div>
                    )}
                  </Dragger>
                </Col>
              ))}
            </Row>

          </Card>

        <Form.Item>
          <Row justify="end">
            <Col>
              <Button type="primary" htmlType="submit" style={{ marginTop: 30, }}>
                Create Advertiesment
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
      
    </div>
    </Layout>
  );
};

const ShowListedVehicles = () => {

  const [vehicles, setVehicles] = useState([]);
  useEffect(() => {
    fetchVehicles(); // Fetch vehicles data when component mounts
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get(`${apiUrl}vehicle`); // Replace 'your_endpoint_url' with your actual endpoint
      setVehicles(response.data); // Update vehicles state with data from API response
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const handleEdit = (id) => {
    console.log('Edit vehicle', id);
  };

  const handleDelete = (id) => {
    console.log('Delete vehicle', id);
  };

  const columns = [
    { title: 'Reg No', dataIndex: 'registrationNumber', key: 'registrationNumber' },
    { title: 'Province Code', dataIndex: 'provinceCode', key: 'provinceCode' },
    { title: 'Model Name', dataIndex: 'modelName', key: 'modelName' },
    { title: 'Brand Name', dataIndex: 'brandName', key: 'brandName' },
    { title: 'Color', dataIndex: 'color', key: 'color' },
    { title: 'Condition', dataIndex: 'vehicleCondition', key: 'vehicleCondition' },
    { title: 'Fuel Type', dataIndex: 'fuelType', key: 'fuelType' },
    { title: 'Manufacture Year', dataIndex: 'manufactureYear', key: 'manufactureYear' },
    { title: 'Milage (Km)', dataIndex: 'mileage', key: 'mileage' },
    { title: 'Price(LKR)', dataIndex: 'price', key: 'price' },
    { title: 'Listed On', dataIndex: 'createdOn', key: 'createdOn',
      render: (createdOn) => dayjs(createdOn).format('YYYY-MM-DD'),
     },
    {title: 'Listed By', dataIndex: 'createdBy', key: 'createdBy' },
   
    {title: 'Modified By', dataIndex: 'modifiedBy', key: 'createdBy' },
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
       <Layout>
        <Content style={{ padding: '50px 50px', marginTop: 0 }}>
      <NavigationBar style={{width:"50%"}}onMenuClick={setSelectedMenu} />
      <div style={{ paddingTop: 64, minHeight: 'calc(100vh - 64px)', paddingTop: '14px' }}>
        {renderContent()}
      </div>
      </Content>
      </Layout>
    </>
  );
};

export default ListNewVehicle;