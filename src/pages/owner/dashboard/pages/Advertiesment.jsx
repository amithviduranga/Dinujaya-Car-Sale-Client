import React, { useState ,useEffect,useContext} from 'react';
import { Layout, Menu, Form, Input, InputNumber, Button, Upload, Row, Col, Card, Modal, Image, Select, Table, message,Spin } from 'antd';
import { CloseOutlined, EyeOutlined, CheckOutlined, CheckCircleOutlined, CloseCircleOutlined ,CarOutlined,UnorderedListOutlined} from '@ant-design/icons';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import dayjs from 'dayjs';
import { CiTextAlignCenter } from 'react-icons/ci';


const {  Content } = Layout;
const { Option } = Select;
const { Dragger } = Upload;
const apiUrl = process.env.REACT_APP_API_URL;


const NavigationBar = ({ onMenuClick }) => (
  <div style={{border: '0px solid ',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
              overflow: 'hidden'}}>
  <Menu theme="light" mode="horizontal" defaultSelectedKeys={['new-advertiesment-requests']} style={{ lineHeight: '64px', borderRadius: '8px' }}>
    <Menu.Item key="new-advertiesment-requests" icon={<CarOutlined style={{fontSize:20}}/>} style={{ borderRadius: '8px 0 0 8px',fontSize:18 ,fontWeight:700}} onClick={() => onMenuClick('new-advertiesment-requests')}>
      New Requests
    </Menu.Item>
    <Menu.Item key="accepted-requests" icon={<UnorderedListOutlined style={{fontSize:20}} />}  style={{fontSize:18 ,fontWeight:700}} onClick={() => onMenuClick('accepted-requests')}>
     Accepted Requests 
    </Menu.Item>

    <Menu.Item key="rejected-requests" icon={<UnorderedListOutlined style={{fontSize:20}} />}  style={{fontSize:18 ,fontWeight:700}} onClick={() => onMenuClick('rejected-requests')}>
     Rejected Requests 
    </Menu.Item>
  </Menu>
  </div>
);


const NewAdvertiesmentRequests = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [vehicleToUpdate, setVehicleToUpdate] = useState(null);
  useEffect(() => {
    fetchVehicles(); // Fetch vehicles data when component mounts
  }, []);


  console.log("vehicles",vehicles)
  const fetchVehicles = async () => {
    try {
      const response = await axios.get(`${apiUrl}advertiesments/getAllAdvertiesments`); 
      const allAdvertisements = response.data; 
      const successfulAdvertisements = allAdvertisements.filter(ad => ad.status === 0);
      setVehicles(successfulAdvertisements); // Update vehicles state with data from API response

    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const handleUpdate = async () => {
    if (!vehicleToUpdate) return;
    const addId = vehicleToUpdate.id

    console.log("advertiesment",addId)
    try {
      // Replace this with your actual update endpoint and request payload
      const response = await axios.post(`${apiUrl}advertiesments/updateStatus/${addId}?order=accept`);
      
      message.success("Successfully accepted Advertiesment")
      // Refresh the vehicle list after update
      fetchVehicles();
    } catch (error) {
      console.error('Error updating vehicle:', error);
    } finally {
      setIsUpdateModalVisible(false);
    }
  };

  const showModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedVehicle(null);
  };

  const columns = [
    { title: 'Reference No', dataIndex: 'registrationNumber', key: 'registrationNumber' },
    { title: 'Model Name', dataIndex: 'modelName', key: 'modelName' },
    { title: 'Brand Name', dataIndex: 'brandName', key: 'brandName' },
    { title: 'Payment', dataIndex: 'payment', key: 'payment',
      render: (payment) => (
        <span style={{
          backgroundColor: payment === 'success' ? '#79D66F' : payment === 'failed' ? '#8B0000' : 'transparent',
          color: payment === 'success' || payment === 'failed' ? 'white' : 'black',
          padding: '3px 5px',
          borderRadius: '5px',
          border: '1px solid #3E8137',
          display: 'flex',
          
          alignItems: 'center'
        }}>
          {payment === 'success' && <CheckCircleOutlined style={{ marginRight: 5 }} />}
          {payment === 'failed' && <CloseCircleOutlined style={{ marginRight: 5 }} />}
          {payment}
        </span>
      )
    },
    { title: 'Milage (Km)', dataIndex: 'mileage', key: 'mileage' },
    { title: 'Listed Price(LKR)', dataIndex: 'price', key: 'price' },
    { title: 'Created On', dataIndex: 'createdOn', key: 'createdOn',
      render: (createdOn) => dayjs(createdOn).format('YYYY-MM-DD'),
     },
    {title: 'Created By', dataIndex: 'createdBy', key: 'createdBy' },
   
    {
      title: 'Actions',
      key: 'action',
      align:'center',
      render: (text, record) => (
        <span style={{display:'flex',marginRight:10}}>
          <Button
        style={{ backgroundColor: 'red', color: 'white',marginRight:10}}
        shape="round"
        icon={<CloseOutlined   />}
      >
        Reject
      </Button>
      <Button
        style={{  color: 'white',marginRight:10}}
        shape="round"
        type='primary'
        icon={<EyeOutlined    />}
        onClick={() => showModal(record)}
      >
        View Details
      </Button>
          <Button
        style={{ backgroundColor: '#52c41a', color: 'white' }}
        shape="round"
        icon={<CheckOutlined  />}
        onClick={() => {
          setVehicleToUpdate(record);
          setIsUpdateModalVisible(true);
        }}
      >
        Accept
      </Button>
        </span>
      ),
    },
  ];


  return (
    <div style={{ padding: '24px', background: '#fff', borderRadius: '8px', marginTop: '24px' ,border: '0px solid ',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.6)',
      overflow: 'hidden'}}>
      <h1>New Advertiesment Requests</h1>
      <Table  columns={columns} dataSource={vehicles} rowKey="id" />
      
      <Modal  visible={isModalVisible} onCancel={handleCancel} footer={null} width={800}>
        {selectedVehicle && (
          <>
            <Row gutter={16}>
      <Col span={12}>
        {selectedVehicle.images && selectedVehicle.images.length > 0 && (
          <>
            <Image
              alt={selectedVehicle.modelName}
              src={`data:image/jpeg;base64,${selectedVehicle.images.find(img => img.mainImage).data}`}
              style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '10px' ,marginTop:10,border: '1px solid ',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0.7, 0, 0.6)',
                overflow: 'hidden'}}
            />
            <Row gutter={8} style={{ marginTop: '10px' }}>
              {selectedVehicle.images.filter(img => !img.mainImage).map((image, index) => (
                <Col key={index} span={6}>
                  <Image
                    alt={selectedVehicle.modelName}
                    src={`data:image/jpeg;base64,${image.data}`}
                    style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '10px',border: '1px solid ',
                      borderRadius: '10px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.6)',
                      overflow: 'hidden' }}
                  />
                </Col>
              ))}
            </Row>
          </>
        )}
      </Col>
      <Col span={12}>
        <table style={{ width: '100%' , fontSize:15 ,fontFamily: 'Roboto, sans-serif',lineHeight: '2.5',marginLeft:10,marginTop:10,borderRadius: '10px',border: '0px solid ',paddingLeft:15,
                      borderRadius: '10px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.6)',
                      overflow: 'hidden' }}>
          <tbody >
            <tr>
              <td><strong>Model Name:</strong></td>
              <td>{selectedVehicle.modelName}</td>
            </tr>
            <tr>
              <td><strong>Brand Name:</strong></td>
              <td>{selectedVehicle.brandName}</td>
            </tr>
            <tr>
              <td><strong>Payment:</strong></td>
              <td>{selectedVehicle.fuelType}</td>
            </tr>
            <tr>
              <td><strong>Fuel Typle:</strong></td>
              <td>{selectedVehicle.fuelType}</td>
            </tr>
            <tr>
              <td><strong>Color:</strong></td>
              <td>{selectedVehicle.color}</td>
            </tr>
            <tr>
              <td><strong>Contact Number:</strong></td>
              <td>{selectedVehicle.contactNo}</td>
            </tr>
            <tr>
              <td><strong>Manufactured Year:</strong></td>
              <td>{selectedVehicle.manufactureYear}</td>
            </tr>
            <tr>
              <td><strong>Registered Year:</strong></td>
              <td>{selectedVehicle.registeredYear}</td>
            </tr>
            <tr>
              <td><strong>Register Number:</strong></td>
              <td>{selectedVehicle.registrationNumber}</td>
            </tr>
            <tr>
              <td><strong>Mileage (Km):</strong></td>
              <td>{selectedVehicle.mileage}</td>
            </tr>
            <tr>
              <td><strong>Listed Price (LKR):</strong></td>
              <td>{selectedVehicle.price}.00</td>
            </tr>
           
          
            <tr>
              <td><strong>Created On:</strong></td>
              <td>{dayjs(selectedVehicle.createdOn).format('YYYY-MM-DD')}</td>
            </tr>
            <tr>
              <td><strong>Created By:</strong></td>
              <td>{selectedVehicle.createdBy}</td>
            </tr>
          </tbody>
        </table>
      </Col>
    </Row>
          </>
        )}
      </Modal>
      <Modal
  title="Accept Advertiesment"
  visible={isUpdateModalVisible}
  onOk={handleUpdate}
  onCancel={() => setIsUpdateModalVisible(false)}
>
  <p>Are you sure you want to accept this advertisement?</p>
</Modal>


    </div>
  );
};



//===================================

const AcceptedRequests = () => {
  const [vehicles, setVehicles] = useState([]);
  useEffect(() => {
    fetchVehicles(); // Fetch vehicles data when component mounts
  }, []);


  console.log("vehicles",vehicles)
  const fetchVehicles = async () => {
    try {
      const response = await axios.get(`${apiUrl}advertiesments/getAllAdvertiesments`); 
      const allAdvertisements = response.data; 
      const successfulAdvertisements = allAdvertisements.filter(ad => ad.status === 1);
      setVehicles(successfulAdvertisements); // Update vehicles state with data from API response

    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };



  const columns = [
    { title: 'Reference No', dataIndex: 'registrationNumber', key: 'registrationNumber' },
    { title: 'Model Name', dataIndex: 'modelName', key: 'modelName' },
    { title: 'Brand Name', dataIndex: 'brandName', key: 'brandName' },
    { title: 'Payment', dataIndex: 'payment', key: 'payment',
      render: (payment) => (
        <span style={{
          backgroundColor: payment === 'success' ? '#79D66F' : payment === 'failed' ? '#8B0000' : 'transparent',
          color: payment === 'success' || payment === 'failed' ? 'white' : 'black',
          padding: '3px 5px',
          borderRadius: '5px',
          border: '1px solid #3E8137',
          display: 'flex',
          
          alignItems: 'center'
        }}>
          {payment === 'success' && <CheckCircleOutlined style={{ marginRight: 5 }} />}
          {payment === 'failed' && <CloseCircleOutlined style={{ marginRight: 5 }} />}
          {payment}
        </span>
      )
    },
    { title: 'Milage (Km)', dataIndex: 'mileage', key: 'mileage' },
    { title: 'Listed Price(LKR)', dataIndex: 'price', key: 'price' },
    { title: 'Created On', dataIndex: 'createdOn', key: 'createdOn',
      render: (createdOn) => dayjs(createdOn).format('YYYY-MM-DD'),
     },
    {title: 'Created By', dataIndex: 'createdBy', key: 'createdBy' },
    {title: 'Accepted By', dataIndex: 'modifiedBy', key: 'createdBy' },
   
    
  ];


  return (
    <div style={{ padding: '24px', background: '#fff', borderRadius: '8px', marginTop: '24px' ,border: '0px solid ',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.6)',
      overflow: 'hidden'}}>
      <h1>Accepted Requests</h1>
      <Table  columns={columns} dataSource={vehicles} rowKey="id" />
  
    </div>
  );
};



const Advertiesment = () => {
  const [selectedMenu, setSelectedMenu] = useState('new-advertiesment-requests');

  const renderContent = () => {
    switch (selectedMenu) {
    
      case 'new-advertiesment-requests':
        return <NewAdvertiesmentRequests />;
      case 'accepted-requests':
        return <AcceptedRequests />;
      case 'rejected-requests':
        return <NewAdvertiesmentRequests />;
      default:
        return <NewAdvertiesmentRequests />;
    }
  };

  return (
    <>
       <Layout>
        <Content >
      <NavigationBar onMenuClick={setSelectedMenu} />
      <div style={{ paddingTop: 64, minHeight: 'calc(100vh - 64px)', paddingTop: '14px' }}>
        {renderContent()}
      </div>
      </Content>
      </Layout>
    </>
  );
};

export default Advertiesment;
