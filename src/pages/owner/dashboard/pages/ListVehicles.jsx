import React, { useState ,useEffect} from 'react';
import { Layout, Menu, Form, Input, InputNumber, Button, Upload, Row, Col, Card, Modal, Image, Select, Table, message } from 'antd';
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
    <Menu.Item key="spare-parts" icon={<ToolOutlined />} onClick={() => onMenuClick('spare-parts')}>
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
              <Form.Item name="modelURL" label="3D Model URL" rules={[{ required: true, message: 'Please enter the brand name' }]}>
                <Input placeholder='Past your 3D model URL here' />

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

//-------------------------Spare part reccomondation section -----------------------

const SparePartsRecommendation = () => {
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

      const vehicleId = values.vehicleRegNo.value;
      const partId = values.partId;
      const payload = {
        reccomondationMonths: values.reccomondationMonths,
        recommendationReason: values.recommendationReason,
      };
      const response = await axios.post(`${apiUrl}spare-part-recommondation/recommondSparePart/${vehicleId}/${partId}`, payload); // Save recommendation to API
      message.success("Successfully saved your reccomondation to this vehicle")
      fetchVehicleRecommendations(values.vehicleRegNo.key);
      form.resetFields() 
      setSelectedVehicle(null)// Refresh recommendations list
    } catch (error) {
      console.error('Error saving recommendation:', error);
      alert('Failed to recommend spare part.');
    }

    console.log("rec Ca",values)
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

  console.log("spare parts ",spareParts)

  return (
    <div style={{ padding: '24px', background: '#fff', borderRadius: '8px', marginTop: '24px' }}>
      <h1 style={{ marginBottom:50 }}>Spare Parts Recommendation</h1>
      <Row gutter={16}>
        <Col span={12}>
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
              label="Recommanded Months"
              rules={[{ required: true, message: 'Please enter the required spare part' }]}
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
              <Button type="primary" htmlType="submit" >
                Add Recommondation 
              </Button>
            </Col>
          </Row>
            </Form.Item>
          </Form>
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
      {selectedVehicle ? (
      <Table columns={columns} dataSource={vehicleRecommendations} pagination={false} style={{ marginTop: '24px' }} />

    ) : (
    ""
    )}
    </div>
  );
};

//---------------sparepart reccomondation section end------------------------------

const ListNewVehicle = () => {
  const [selectedMenu, setSelectedMenu] = useState('list-new-vehicle');

  const renderContent = () => {
    switch (selectedMenu) {
      case 'list-new-vehicle':
        return <ListNewVehicleForm />;
      case 'show-listed-vehicles':
        return <ShowListedVehicles />;
        case 'spare-parts':
          return <SparePartsRecommendation  />;  
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
