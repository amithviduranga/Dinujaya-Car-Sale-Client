import React, { useEffect, useState } from 'react';
import { Carousel, List, Card, Spin, Layout, Breadcrumb, Input } from 'antd';
import axios from 'axios';
import '../Carousal.css';
import banner1 from '../../../asserts/web-banner-bike.png';
import banner2 from '../../../asserts/car2.jpg';
import banner3 from '../../../asserts/car4.jpg';
import { CarOutlined, DashboardOutlined } from '@ant-design/icons';
import NavigationBar from '../components/NavigationBar';

const apiUrl = process.env.REACT_APP_API_URL;
const { Header, Content, Footer, Sider } = Layout;
const { Search } = Input;

const ThreeWheelers = () => {
  const [allVehicles, setAllVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchVehicles(); // Fetch vehicles data when component mounts
  }, []);

  useEffect(() => {
    // Filter vehicles based on search query
    const filtered = allVehicles.filter(vehicle =>
      vehicle.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.brandName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredVehicles(filtered);
  }, [searchQuery, allVehicles]);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get(`${apiUrl}vehicle/category?type=threeWheel`);
      setAllVehicles(response.data);
      setFilteredVehicles(response.data);
      setLoading(false); // Update vehicles state with data from API response
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setLoading(false);
    }
  };

  console.log(allVehicles);

  const carouselData = [
    { image: banner1, text: 'Welcome to DHINUJAYA CAR SALE', subText: 'Explore our wide range of vehicles' },
  ];

  return (
    <div>
      <div style={{ width: "100%" }}>
        <Carousel style={{ width: "100%" }} >
          {carouselData.map((item, index) => (
            <div key={index}>
              <div className="carousel-image" style={{ backgroundImage: `url(${item.image})`, width: "100%" }}>
                <div className="overlay">
                  <div className="banner-text-container">
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
      <Layout>
        <Content style={{ padding: '0 100px' }}>
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>EXPLORE YOUR DREAM BIKE</h2>
            <p style={{ fontSize: '24px', color: '#888' }}>Check out the latest vehicles added to our collection....</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: "20px" }}>
            <Search
              placeholder="Search In Vans...."
              enterButton="Search"
              size="large"
              style={{
                width: '50%',
                borderWidth: '12px',
                borderColor: '#1890ff',
                marginTop: 40,
                border: '1px solid #1890ff', // Adding border with primary color
                borderRadius: '10px', // Adding border radius for smoother edges
                boxShadow: '0 3px 8px rgba(0, 0, 0, 0.5)', // Adding shadow for better highlight
                overflow: 'hidden'
              }}
              onSearch={value => setSearchQuery(value)}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={{ padding: '20px 0', marginTop: 80 }}>
            {loading ? (
              <Spin size="large" />
            ) : (
              <List
                grid={{ gutter: 17, column: 5 }}
                dataSource={filteredVehicles}
                renderItem={item => {
                  const mainImage = item.images.find(img => img.mainImage);

                  return (
                    <List.Item>
                      <Card
                        style={{
                          height: '400px', // Fixed height for the card
                          border: '1px solid #1890ff', // Adding border with primary color
                          borderRadius: '10px', // Adding border radius for smoother edges
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.6)', // Adding shadow for better highlight
                          overflow: 'hidden',
                          marginBottom: '80px'  // Ensuring content does not overflow
                        }}// Fixed height for the card
                        cover={
                          <div style={{ height: '180px', overflow: 'hidden' }}>
                            <img
                              alt={item.modelName}
                              src={`data:image/jpeg;base64,${mainImage.data}`}
                              style={{ width: '100%', height: '90%', objectFit: 'cover' }}
                            />
                          </div>
                        }
                      >
                        <a style={{ fontWeight: 500, fontSize: 17 }}>{item.modelName} {item.brandName} {item.manufactureYear} </a>
                        <div>
                          <p><DashboardOutlined style={{ marginRight: 8 }} /> Mileage: <span style={{ fontWeight: 'bold' }}> {item.mileage} km </span></p>
                          <p><CarOutlined style={{ marginRight: 8 }} />Condition :<span style={{ fontWeight: 'bold' }}> {item.vehicleCondition}</span></p>
                        </div>
                        <p style={{ fontWeight: 600, fontSize: 20, color: "green", textAlign: "left" }}> RS : {item.price}</p>
                      </Card>
                    </List.Item>
                  );
                }}
              />
            )}
          </div>
        </Content>
      </Layout>
    </div>
  );
};

export default ThreeWheelers;
