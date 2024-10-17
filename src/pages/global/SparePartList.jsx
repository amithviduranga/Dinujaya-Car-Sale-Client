import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Input, Layout, Button, Pagination } from 'antd';

const { Content } = Layout;
const apiUrl = process.env.REACT_APP_API_URL;

const AdvertisementList = () => {
  const [spareParts, setSpareParts] = useState([]);
  const [filteredAdvertisements, setFilteredAdvertisements] = useState([]);
  const [filters, setFilters] = useState({
    partName: '',
    vehicleModel: '',
    vehicleBrand: ''
  });
  const [tempFilters, setTempFilters] = useState(filters);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Number of records per page

  // Fetch all advertisements on component mount
  useEffect(() => {
    axios.get(`${apiUrl}spare-part/getAllSpareParts`)
      .then(response => {
        setSpareParts(response.data);
        setFilteredAdvertisements(response.data); // Set the filtered data to initially show all parts
      })
      .catch(error => console.error('Error fetching spare parts:', error));
  }, []);

  // Handle applying the filters when the button is clicked
  const applyFilters = () => {
    const filtered = spareParts.filter(ad =>
      (tempFilters.partName ? ad.partName.toLowerCase() === tempFilters.partName.toLowerCase() : true) &&
      (tempFilters.vehicleModel ? ad.vehicleModel.toLowerCase().includes(tempFilters.vehicleModel.toLowerCase()) : true) &&
      (tempFilters.vehicleBrand ? ad.vehicleBrand.toLowerCase().includes(tempFilters.vehicleBrand.toLowerCase()) : true)
    );
    setFilteredAdvertisements(filtered); // Update the filteredAdvertisements
    setCurrentPage(1); // Reset to the first page on filter change
  };

  const handleFilterChange = (key, value) => {
    setTempFilters({
      ...tempFilters,
      [key]: value
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Show paginated filtered data
  const pagedSpareParts = filteredAdvertisements.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Layout>
      <Content style={{ marginLeft: 80, marginRight: 80 }}>
        <Row gutter={[18, 16]}>
          <Col xs={24} sm={10} md={8}>
            <Card style={{ marginTop: 15 }}>
              <div>
                <h3>Filter By</h3>
                <h4>Part Name</h4>
                <Input
                  placeholder="Spare Part Name"
                  value={tempFilters.partName}
                  onChange={e => handleFilterChange('partName', e.target.value)} // Correct key here
                  style={{ marginBottom: '10px' }}
                />
                <h4>Vehicle Model</h4>
                <Input
                  placeholder="Vehicle Model"
                  value={tempFilters.vehicleModel}
                  onChange={e => handleFilterChange('vehicleModel', e.target.value)} // Correct key here
                  style={{ marginBottom: '10px' }}
                />
                <h4>Vehicle Brand</h4>
                <Input
                  placeholder="Vehicle Brand"
                  value={tempFilters.vehicleBrand}
                  onChange={e => handleFilterChange('vehicleBrand', e.target.value)} // Correct key here
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
            </Card>
          </Col>
          <Col xs={20} sm={16} md={15}>
            <Row gutter={[5, 5]}>
              {pagedSpareParts.map(ad => {
                const mainImage = ad.data;
                const fileType = ad.fileType;
                const imageUrl = mainImage
                  ? `data:${fileType};base64,${mainImage}`
                  : 'path/to/default/image.jpg'; // Fallback image URL

                const formattedDate = new Date(ad.createdOn).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                });

                return (
                  <Col key={ad.id} xs={24}>
                    <Link to={`/spareParts/details/${ad.id}`}>
                      <Card
                        hoverable
                        style={{
                          marginTop: "0px",
                          padding: 0,
                          border: "1px solid orange",
                          borderRadius: 10
                        }}>
                        <Row style={{ margin: 0 }}>
                          <Col xs={5} style={{ padding: 0 }}>
                            <div
                              style={{
                                width: '150px',
                                height: '150px',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                borderRadius: 10,
                                justifyContent: 'center'
                              }}
                            >
                              <img
                                alt={ad.modelName}
                                src={imageUrl}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                            </div>
                          </Col>
                          <Col xs={14} style={{ fontSize: 20 }}>
                            <div style={{ marginBottom: '15px' }}>
                              <h3 style={{ fontSize: '24px', margin: 0 }}>{ad.partName} {ad.vehicleBrand} {ad.vehicleModel}</h3>
                              <p style={{ fontSize: 20, fontFamily: "sans-serif", fontWeight: 500, color: 'green' }}>{`Price: ${ad.price}`}</p>
                              <p style={{ fontSize: 20 }}>Item Code: {ad.itemCode}</p>
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    </Link>
                  </Col>
                );
              })}
            </Row>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredAdvertisements.length}
              onChange={handlePageChange}
              style={{ marginTop: '20px', textAlign: 'center' }}
            />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default AdvertisementList;
