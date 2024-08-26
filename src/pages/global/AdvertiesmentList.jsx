import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Input, Select, Slider } from 'antd';

const { Option } = Select;

const AdvertisementList = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [filteredAdvertisements, setFilteredAdvertisements] = useState([]);
  const [filters, setFilters] = useState({
    model: '',
    priceRange: [0, 1000000],
    location: '',
    color: ''
  });

  useEffect(() => {
    // Fetch all advertisements
    axios.get('/api/advertisements')
      .then(response => {
        setAdvertisements(response.data);
        setFilteredAdvertisements(response.data);
      })
      .catch(error => console.error('Error fetching advertisements:', error));
  }, []);

  useEffect(() => {
    // Apply filters to advertisements
    const filtered = advertisements.filter(ad => 
      (filters.model ? ad.model.toLowerCase().includes(filters.model.toLowerCase()) : true) &&
      (filters.location ? ad.location.toLowerCase().includes(filters.location.toLowerCase()) : true) &&
      (filters.color ? ad.color.toLowerCase() === filters.color.toLowerCase() : true) &&
      (ad.price >= filters.priceRange[0] && ad.price <= filters.priceRange[1])
    );
    setFilteredAdvertisements(filtered);
  }, [filters, advertisements]);

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={8} md={6}>
        <div>
          <h3>Filter by:</h3>
          <Input
            placeholder="Vehicle Model"
            value={filters.model}
            onChange={e => handleFilterChange('model', e.target.value)}
            style={{ marginBottom: '10px' }}
          />
          <Input
            placeholder="Location"
            value={filters.location}
            onChange={e => handleFilterChange('location', e.target.value)}
            style={{ marginBottom: '10px' }}
          />
          <Select
            placeholder="Color"
            value={filters.color}
            onChange={value => handleFilterChange('color', value)}
            style={{ width: '100%', marginBottom: '10px' }}
          >
            <Option value="red">Red</Option>
            <Option value="blue">Blue</Option>
            <Option value="black">Black</Option>
            <Option value="white">White</Option>
            {/* Add more colors as needed */}
          </Select>
          <Slider
            range
            step={10000}
            defaultValue={filters.priceRange}
            min={0}
            max={1000000}
            onChange={value => handleFilterChange('priceRange', value)}
            style={{ marginBottom: '10px' }}
          />
        </div>
      </Col>
      <Col xs={24} sm={16} md={18}>
        <Row gutter={[16, 16]}>
          {filteredAdvertisements.map(ad => (
            <Col key={ad.id} xs={24} sm={12} md={8}>
              <Link to={`/vehicle/${ad.id}`}>
                <Card
                  hoverable
                  cover={<img alt={ad.model} src={ad.imageUrl} />}
                >
                  <Card.Meta title={ad.model} description={`$${ad.price}`} />
                  <p>{ad.location}</p>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
};

export default AdvertisementList;
