import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Card, Spin, Image, Row, Col, Button } from 'antd';
import axios from 'axios';
import { CarOutlined, DashboardOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { BsFuelPumpDiesel } from "react-icons/bs";
import './VehicleDetails.css';
import YardMap from '../owner/dashboard/utility/yardMap';

const apiUrl = process.env.REACT_APP_API_URL;
const { Content } = Layout;

const VehicleDetail = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedYard, setSelectedYard] = useState(null)

  useEffect(() => {
    fetchVehicle();
    checkIfWishlisted();
  }, [id]);

  const fetchVehicle = async () => {
    try {
      const response = await axios.get(`${apiUrl}vehicle/${id}`);
      setVehicle(response.data);
      setSelectedYard(response.data.selectedYard);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      setLoading(false);
    }
  };
  const userId = localStorage.getItem('userId');
  const checkIfWishlisted = async () => {
    try {
      const response = await axios.get(`${apiUrl}wishlist/${id}/${userId}`);
      setIsWishlisted(response.data.isWishlisted);
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const toggleWishlist = async () => {
     // Assuming userId is stored in local storage
    try {
      if (isWishlisted) {
        // Remove from wishlist
        await axios.delete(`${apiUrl}wishlist/${id}/${userId}`);
      } else {
        // Add to wishlist
        await axios.post(`${apiUrl}wishlist/${id}/${userId}`);
      }
      setIsWishlisted(!isWishlisted); // Toggle wishlist state
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (!vehicle) {
    return <p>Vehicle not found</p>;
  }

  const mainImage = vehicle.images.find(img => img.mainImage);
  const otherImages = vehicle.images.filter(img => !img.mainImage);

  return (
    <Layout>
      <Content style={{ padding: '0 50px', marginTop: 50 }}>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Card
            style={{
              width: '80%',
              border: '1px solid ',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.6)',
              overflow: 'hidden',
            }}
          >
            <Row gutter={19}>
              <Col span={12}>
                <Image
                  alt={vehicle.modelName}
                  src={`data:image/jpeg;base64,${mainImage.data}`}
                  style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '10px' }}
                />
                <Row gutter={8} style={{ marginTop: '10px' }}>
                  {otherImages.map((image, index) => (
                    <Col key={index} span={6}>
                      <Image
                        alt={vehicle.modelName}
                        src={`data:image/jpeg;base64,${image.data}`}
                        style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '10px' }}
                      />
                    </Col>
                  ))}
                </Row>
              </Col>
              <Col style={{ marginLeft: 40 }} span={10}>
                <h2 style={{ marginBottom: 1,fontSize:28}}>{vehicle.modelName} {vehicle.brandName} {vehicle.manufactureYear} {vehicle.fuelType}</h2>
                <p style={{ fontSize: 18, marginTop: 1, fontWeight: 600, color: "gray" }}>{vehicle.description}</p>
                <p style={{ fontSize: 21, marginTop:28 }}>
                  <DashboardOutlined style={{ marginRight: 8, fontSize: 30 }} /> Mileage:
                  <span style={{ fontWeight: 'bold' }}> {vehicle.mileage} km </span>
                </p>
                <p style={{ fontSize: 21 }}>
                  <CarOutlined style={{ marginRight: 8, fontSize: 30 }} />Condition:
                  <span style={{ fontWeight: 'bold' }}> {vehicle.vehicleCondition}</span>
                </p>
                <p style={{ fontSize: 21 }}>
                  <BsFuelPumpDiesel style={{ marginRight: 8, fontSize: 30 }} />Fuel Type:
                  <span style={{ fontWeight: 'bold' }}> {vehicle.fuelType}</span>
                </p>
                <p style={{ fontWeight: 600, fontSize: 30, color: "green" ,marginTop:25}}> RS : {vehicle.price}</p>
                <Button
                  type="primary"
                  icon={isWishlisted ? <HeartFilled /> : <HeartOutlined />}
                  style={{ backgroundColor: isWishlisted ? 'red' : undefined }} 
                  onClick={toggleWishlist}
                >
                  {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </Button>
              </Col>
            </Row>
          </Card>
         
     
        </div>
        <div style={{ textAlign: 'center', marginTop: '50px', justifyContent: 'center', width: '100%' }}>
  <h2>LOCATE YOUR VEHICLE</h2>
  <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
    <Card style={{
      width: '80%',
      border: '1px solid',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.6)',
    }}>
      <YardMap selectedYard={selectedYard} setSelectedYard={setSelectedYard} />
      {selectedYard && (
        <div style={{ marginTop: '10px' }}>
          <b>This Vehicle is located at yard : </b> {selectedYard}
        </div>
      )}
    </Card>
  </div>
</div>
        
        {vehicle.modelURL && (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>ROTATE YOUR VEHICLE FOR BETTER EXPERIENCE</h2>
            <p style={{ fontSize: '24px', color: '#888' }}>Check out the latest vehicles added to our collection....</p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <iframe
                title={vehicle.modelName}
                frameBorder="0"
                allowFullScreen
                mozallowfullscreen="true"
                webkitallowfullscreen="true"
                allow="autoplay; fullscreen; xr-spatial-tracking"
                src={vehicle.modelURL}
                style={{ width: '80%', height: '600px', borderRadius: '10px' }}
              >
              </iframe>
            </div>
           
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default VehicleDetail;
