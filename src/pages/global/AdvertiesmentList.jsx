import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Input, Select, Slider, Layout, Button } from 'antd';

const { Option } = Select;
const { Content } = Layout;
const apiUrl = process.env.REACT_APP_API_URL;

const AdvertisementList = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [filteredAdvertisements, setFilteredAdvertisements] = useState([]);
  const [filters, setFilters] = useState({
    model: '',
    priceRange: [0, 10000000],
    location: '',
    color: ''
  });

  const [tempFilters, setTempFilters] = useState(filters);

  // Fetch all advertisements on component mount
  useEffect(() => {
    axios.get(`${apiUrl}advertiesments/getAllAdvertiesments`)
      .then(response => {
        const successfulAds = response.data.filter(ad => ad.status === 1);
        setAdvertisements(successfulAds);
        setFilteredAdvertisements(successfulAds); // Initially display all successful ads
      })
      .catch(error => console.error('Error fetching advertisements:', error));
  }, []);
  // Handle applying the filters when the button is clicked
  const applyFilters = () => {
    const filtered = advertisements.filter(ad => 
      (tempFilters.model ? ad.modelName.toLowerCase().includes(tempFilters.model.toLowerCase()) : true) ||
      (tempFilters.location ? ad.location.toLowerCase().includes(tempFilters.location.toLowerCase()) : true) ||
      (tempFilters.color ? ad.color.toLowerCase() === tempFilters.color.toLowerCase() : true) ||
      (ad.price >= tempFilters.priceRange[0] && ad.price <= tempFilters.priceRange[1])
    );
    setFilteredAdvertisements(filtered);
    console.log(filtered)
    setFilters(tempFilters);
  };

  const handleFilterChange = (key, value) => {
    setTempFilters({
      ...tempFilters,
      [key]: value
    });
  };

  return (
    <Layout>
      <Content style={{ marginLeft: 80, marginRight: 80 }}>
        <Row gutter={[18, 16]}>
          <Col xs={24} sm={10} md={8}>
            <div>
              <h3>Filter By</h3>
              <h4>Vehicle Model</h4>
              <Input
                placeholder="Vehicle Model"
                value={tempFilters.model}
                onChange={e => handleFilterChange('model', e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              <h4>Vehicle Location</h4>
              <Input
                placeholder="Location"
                value={tempFilters.location}
                onChange={e => handleFilterChange('location', e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              <h4>Vehicle Color</h4>
               <Input
                placeholder="Color"
                value={tempFilters.color}
                onChange={e => handleFilterChange('color', e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              <h4>Vehicle Price</h4>
              <Slider
                range
                step={10000}
                defaultValue={tempFilters.priceRange}
                min={0}
                max={10000000}
                onChange={value => handleFilterChange('priceRange', value)}
                style={{ marginBottom: '10px' }}
              />
              <Button 
                type="primary" 
                style={{ backgroundColor: 'red', borderColor: 'red' }} 
                onClick={applyFilters}
              >
                Filter
              </Button>
            </div>
          </Col>
          <Col xs={20} sm={16} md={15}>
  <Row gutter={[5, 5]}>
    {filteredAdvertisements.map(ad => {
      const mainImage = ad.images.find(image => image.mainImage) || ad.images[0];
      return (
        <Col key={ad.id} xs={24}>
          <Link to={`/vehicle/${ad.id}`}>
            <Card hoverable style={{ marginTop: "0px", padding: 0 }}>
              <Row style={{ margin: 0 }}>
                <Col xs={5} style={{ padding: 0 }}>
                  <div
                    style={{
                      width: '150px',  
                      height: '150px', 
                      overflow: 'hidden', 
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius:10,
                      justifyContent: 'center'
                    }}
                  >
                    <img
                      alt={ad.modelName}
                      src={`data:${mainImage.fileType};base64,${mainImage.data}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover' // Ensures the image covers the container without distortion
                      }}
                    />
                  </div>
                </Col>
                <Col xs={14} style={{ fontSize: 20 }}>
  <div style={{ marginBottom: '15px' }}>
    <h3 style={{ fontSize: '24px', margin: 0 }}>{ad.modelName} {ad.brandName} {ad.fuelType} {ad.manufactureYear}</h3>
    <p style={{ fontSize: 18 }}>{`Price: ${ad.price}`}</p>
  </div>
  <p style={{ fontSize: 20 }}>Location: {ad.location}</p>
</Col>
              </Row>
            </Card>
          </Link>
        </Col>
      );
    })}
  </Row>
</Col>

        </Row>
      </Content>
    </Layout>
  );
};

export default AdvertisementList;
