import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Card, Spin, Image, Row, Col, Button } from 'antd';
import axios from 'axios';
import { CarOutlined, DashboardOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { BsFuelPumpDiesel } from "react-icons/bs";
import './VehicleDetails.css';

const apiUrl = process.env.REACT_APP_API_URL;
const { Content } = Layout;

const VehicleDetail = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    fetchVehicle();
    checkIfWishlisted();
  }, [id]);

  const fetchVehicle = async () => {
    try {
      const response = await axios.get(`${apiUrl}vehicle/${id}`);
      setVehicle(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      setLoading(false);
    }
  };

  const checkIfWishlisted = async () => {
    try {
      const response = await axios.get(`${apiUrl}wishlist/${id}`);
      setIsWishlisted(response.data.isWishlisted);
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const toggleWishlist = async () => {
    try {
      if (isWishlisted) {
        await axios.delete(`${apiUrl}wishlist/${id}`);
      } else {
        await axios.post(`${apiUrl}wishlist`, { vehicleId: id });
      }
      setIsWishlisted(!isWishlisted);
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
                <h2 style={{ marginBottom: 1 }}>{vehicle.modelName} {vehicle.brandName} {vehicle.manufactureYear} {vehicle.fuelType}</h2>
                <p style={{ fontSize: 18, marginTop: 1, fontWeight: 600, color: "gray" }}>{vehicle.description}</p>
                <p style={{ fontSize: 23 }}>
                  <DashboardOutlined style={{ marginRight: 8, fontSize: 30 }} /> Mileage:
                  <span style={{ fontWeight: 'bold' }}> {vehicle.mileage} km </span>
                </p>
                <p style={{ fontSize: 23 }}>
                  <CarOutlined style={{ marginRight: 8, fontSize: 30 }} />Condition:
                  <span style={{ fontWeight: 'bold' }}> {vehicle.vehicleCondition}</span>
                </p>
                <p style={{ fontSize: 23 }}>
                  <BsFuelPumpDiesel style={{ marginRight: 8, fontSize: 30 }} />Fuel Type:
                  <span style={{ fontWeight: 'bold' }}> {vehicle.fuelType}</span>
                </p>
                <p style={{ fontWeight: 600, fontSize: 30, color: "green" }}> RS : {vehicle.price}</p>
                <Button
                  type="primary"
                  icon={isWishlisted ? <HeartFilled /> : <HeartOutlined />}
                  onClick={toggleWishlist}
                >
                  {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </Button>
              </Col>
            </Row>
          </Card>
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
