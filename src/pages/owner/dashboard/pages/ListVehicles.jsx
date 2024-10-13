import React, { useState ,useEffect} from 'react';
import { Layout, Menu, Form, Input, InputNumber, Button, Upload, Row, Col, Card, Modal, Image, Select, Table, message } from 'antd';
import { CarOutlined, ToolOutlined, UnorderedListOutlined, UploadOutlined, EditOutlined, DeleteOutlined,ExclamationCircleOutlined} from '@ant-design/icons';
import axios from 'axios';
import QRCode from 'qrcode';
import dayjs from 'dayjs';
import CustomYardMap from '../utility/CustomeYardMap';

const { Option } = Select;
const { Dragger } = Upload;
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
  const [selectedYard, setSelectedYard] = useState(null);; 
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState(Array(6).fill(null));
  const [qrCodeData, setQrCodeData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);


  console.log("Selected yard : " ,selectedYard)

  const onFinish = async (values) => {
    const vehicleValues = {
      ...values,
      selectedYard: selectedYard ? selectedYard : 'No yard selected',
    };
    console.log('Form values:', vehicleValues);

    const formData = new FormData();
    formData.append('vehicle', new Blob([JSON.stringify(vehicleValues)], { type: 'application/json' }));
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
      console.log('Response:', response.data);
      const vehicleId = response.data.id;  // Assuming the response contains the vehicle ID
      
      // Generate QR code
      const qrCodeUrl = `${apiUrl}vehicle/details/${vehicleId}`;
      const qrCode = await QRCode.toDataURL(qrCodeUrl);

      setQrCodeData(qrCode);
      form.resetFields();
      setMainImage(null);
      setAdditionalImages(Array(6).fill(null));
      setIsModalVisible(true);

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
              <Form.Item name="listingType" label="Listing Type" style={{ display: 'none' }} initialValue={1}>
  <Input type="hidden" />
</Form.Item>
            </Col>
          </Row>
        </Card>
        {/* Map Section to select the yard for the vehicle */}
      <Card type="inner" title="Select Yard Location">
        <CustomYardMap setSelectedYard={setSelectedYard} />
        {selectedYard && (
          <div style={{ marginTop: '10px' }}>
            <b>Selected Yard:</b> {selectedYard}
          </div>
        )}
      </Card>
    
        <Card type="inner" title="Upload Vehicle Images" style={{ border: '0px solid ', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0.1, 0.1)', fontSize: 20, marginTop: 24 }}>
            <div style={{ marginBottom: 24 }}>
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

            <Row gutter={12} style={{ marginTop: '34px', marginRight: 10 }}>
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
                    style={{ padding: 0 }}
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
  const { confirm } = Modal;
  const [vehicles, setVehicles] = useState([]);
  const [editingVehicle, setEditingVehicle] = useState(null); // To store the vehicle being edited
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [fileList, setFileList] = useState([]); // Store uploaded images
  const [form] = Form.useForm();

  useEffect(() => {
    fetchVehicles(); // Fetch vehicles data when component mounts
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

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle); // Set the selected vehicle for editing
    form.setFieldsValue({
      ...vehicle, // Populate the form with the current vehicle data
    });
    setFileList(
      vehicle.images.map((image, index) => ({
        uid: index, // Provide a unique ID for each image
        name: `Image ${index + 1}`,
        status: 'done',
        url: image.url, // Assuming the image object has a URL property
      }))
    );
    setIsModalVisible(true); // Show the modal
  };

  const handleDelete = (id) => {
    confirm({
      title: 'Are you sure you want to delete this vehicle?',
      icon: <ExclamationCircleOutlined />,
      content: 'Once deleted, this vehicle and its associated images cannot be recovered.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await axios.delete(`${apiUrl}vehicle/${id}`);
          message.success('Vehicle deleted successfully.');
          fetchVehicles(); // Refetch vehicles to update the list
        } catch (error) {
          message.error('Failed to delete vehicle.');
          console.error('Error deleting vehicle:', error);
        }
      },
      onCancel() {
        console.log('Delete cancelled');
      },
    });
  };

  const handleUpdateVehicle = async (values) => {
    const formData = new FormData();
    formData.append('data', JSON.stringify(values));

    fileList.forEach(file => {
      if (file.originFileObj) {
        formData.append('images', file.originFileObj); // Append only the newly uploaded images
      }
    });

    try {
      await axios.put(`${apiUrl}vehicle/${editingVehicle.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }); // Send updated data to the backend
      message.success('Vehicle updated successfully.');
      setIsModalVisible(false); // Close the modal
      fetchVehicles(); // Refresh vehicle list
    } catch (error) {
      message.error('Failed to update vehicle.');
      console.error('Error updating vehicle:', error);
    }
  };

  const handleImageUpload = ({ fileList }) => {
    setFileList(fileList); // Update file list when images are added/removed
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
    { title: 'Listed By', dataIndex: 'createdBy', key: 'createdBy' },
    { title: 'Modified By', dataIndex: 'modifiedBy', key: 'createdBy' },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (text, record) => (
        <span>
          {/* <Button
            style={{ marginRight: 10 }}
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}f
          ></Button> */}
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}></Button>
        </span>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#fff', borderRadius: '8px', marginTop: '24px' }}>
      <h1>Show Listed Vehicles</h1>
      <Table columns={columns} dataSource={vehicles} rowKey="id" />

      <Modal
        title="Edit Vehicle"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)} // Close modal on cancel
        okText="Save"
        onOk={() => form.submit()} // Trigger form submission
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateVehicle}>
          <Form.Item label="Registration Number" name="registrationNumber" rules={[{ required: true, message: 'Please enter the registration number' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Province Code" name="provinceCode" rules={[{ required: true, message: 'Please enter the province code' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Model Name" name="modelName" rules={[{ required: true, message: 'Please enter the model name' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Brand Name" name="brandName" rules={[{ required: true, message: 'Please enter the brand name' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Color" name="color">
            <Input />
          </Form.Item>
          <Form.Item label="Vehicle Condition" name="vehicleCondition">
            <Input />
          </Form.Item>
          <Form.Item label="Fuel Type" name="fuelType">
            <Input />
          </Form.Item>
          <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Please enter the price' }]}>
            <Input />
          </Form.Item>
          {/* Image Upload Section */}
          <Form.Item label="Vehicle Images">
            <Upload
              listType="picture"
              fileList={fileList}
              onChange={handleImageUpload}
              multiple={true}
              beforeUpload={() => false} // Prevent automatic upload
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
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
      const unsoldVehicles = response.data.filter(vehicle => vehicle.sold === false);
      setVehicles(unsoldVehicles);
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
