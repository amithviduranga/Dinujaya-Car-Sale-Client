import React, { useState ,useEffect} from 'react';
import { Layout, Menu, Form, Input, InputNumber, Button, Upload, Row, Col, Card, Modal, Image, Select, Table } from 'antd';
import { CarOutlined, ToolOutlined, UnorderedListOutlined, UploadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import QRCode from 'qrcode';
import dayjs from 'dayjs';

const { Header, Content, Footer } = Layout;
const { Option } = Select;
const apiUrl = process.env.REACT_APP_API_URL;


const NavigationBar = ({ onMenuClick }) => (
  <Menu theme="light" mode="horizontal" defaultSelectedKeys={['list-new-vehicle']} style={{ lineHeight: '64px', borderRadius: '8px' }}>
    <Menu.Item key="list-new-vehicle" icon={<CarOutlined />} style={{ borderRadius: '8px 0 0 8px' }} onClick={() => onMenuClick('list-new-vehicle')}>
      List New Vehicle
    </Menu.Item>
    <Menu.Item key="show-listed-vehicles" icon={<UnorderedListOutlined />} onClick={() => onMenuClick('show-listed-vehicles')}>
      Show Listed Vehicles
    </Menu.Item>
    <Menu.Item key="spare-parts" icon={<ToolOutlined />}>
      Spare Parts Reccomondation
    </Menu.Item>
  </Menu>
);

const ListNewVehicleForm = () => {
  const [form] = Form.useForm();
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [additionalImagesPreview, setAdditionalImagesPreview] = useState([]);

  const onFinish = async (values) => {
    console.log('Form values:', values);

    const formData = new FormData();
    formData.append('vehicle', new Blob([JSON.stringify(values)], { type: 'application/json' }));
    if (mainImage) {
      formData.append('mainImage', mainImage);
    }
    additionalImages.forEach((image, index) => {
      formData.append('images', image);
    });

    try {
      console.log(formData);
      const response = await axios.post(`${apiUrl}vehicle/saveVehicleDetails`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response:', response.data);
      const vehicleId = response.data.id;  // Assuming the response contains the vehicle ID

      // Generate QR code
      const qrCodeUrl = `${apiUrl}vehicle/details/${vehicleId}`;
      const qrCode = await QRCode.toDataURL(qrCodeUrl);

      setQrCodeData(qrCode);
      setIsModalVisible(true);

    } catch (error) {
      console.error('Error uploading vehicle details:', error);
      alert('Failed to list vehicle.');
    }
  };

  const handleMainImageUpload = ({ file }) => {
    setMainImage(file);
    setMainImagePreview(URL.createObjectURL(file));
  };

  const handleAdditionalImagesUpload = ({ fileList }) => {
    setAdditionalImages(fileList.map(file => file.originFileObj));
  
    // Update previews based on fileList
    const previews = fileList.map(file => URL.createObjectURL(file.originFileObj));
  
    setAdditionalImagesPreview(previews);
  };
  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleDownloadQRCode = () => {
    if (qrCodeData) {
      const link = document.createElement('a');
      link.href = qrCodeData;
      link.download = 'vehicle-qr-code.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Close the modal
      setIsModalVisible(false);
      // Reset form fields
      form.resetFields();
      // Clear images state
      setMainImage(null);
      setAdditionalImages([]);
      setQrCodeData(null);
    }
  };

  return (
    <div style={{ padding: '24px', background: '#fff', borderRadius: '8px' }}>
      <h1>List New Vehicle</h1>
      <Form form={form} layout="vertical" onFinish={onFinish}>
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
         
        <div style={{ marginBottom: '24px' }}>
            <h4>Main Image</h4>
            <Upload
              name="mainImage"
              listType="picture-card"
              className="avatar-uploader"
              fileList={mainImage ? [{ uid: '-1', name: 'image.png', status: 'done', url: mainImagePreview }] : []}
              showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
              beforeUpload={() => false}
              onChange={handleMainImageUpload}
              style={{ width: '100%', height: '100%' }}
            >
              {mainImagePreview ? null : (
                <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Button icon={<UploadOutlined />} style={{ background: '#f0f2f5', width: '100%', height: '100%' }} />
                </div>
              )}
            </Upload>
          </div>
          <Row gutter={12} style={{ marginTop: '24px' }}>
            {[1, 2, 3, 4, 5].map(index => (
              <Col key={index} span={4}>
                <h4>Additional Image {index}</h4>
                <Upload
  name={`additionalImage${index}`}
  listType="picture-card"
  className="avatar-uploader"
  fileList={additionalImagesPreview[index] ? [{ uid: `-${index}`, name: 'image.png', status: 'done', url: additionalImagesPreview[index] }] : []}
  showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
  beforeUpload={() => false} // Prevent actual upload for demonstration
  onChange={handleAdditionalImagesUpload}
  style={{ width: '100%', height: '100%' }}
>
  {additionalImagesPreview[index] ? null : (
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Button icon={<UploadOutlined />} style={{ background: '#f0f2f5', width: '100%', height: '100%' }} />
    </div>
  )}
</Upload>
              </Col>
            ))}
          </Row>
      
        </Card>

        <Form.Item>
          <Row justify="end">
            <Col>
              <Button type="primary" htmlType="submit" style={{ marginTop: 30, marginRight: 40 }}>
                List Vehicle
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
      <Modal
  title="Scan This QR to see Full details of Vehicle"
  visible={isModalVisible}
  onCancel={handleModalClose}
  footer={null}  // Remove default footer
>
  {qrCodeData && (
    <div style={{ textAlign: 'center' }}>
      <Image style={{ width: 300 }} src={qrCodeData} alt="QR Code" />
      <div style={{ marginTop: '20px', marginBottom:'20px' }}>
        <Button key="download" style={{background:'#1890FF' , color: '#FFFFFF',fontSize:17 }} onClick={handleDownloadQRCode}>
          Download QR Code
        </Button>
      </div>
    </div>
  )}
</Modal>
    </div>
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
    { title: 'Reg No', dataIndex: '', key: '' },
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
        case 'spare-parts':
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
