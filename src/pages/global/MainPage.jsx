// MainPage.js
import React, { useEffect, useState } from 'react';
import { Carousel, List, Card, Spin,Layout,Breadcrumb ,Input} from 'antd';
import axios from 'axios';
import './Carousal.css'
import { useNavigate } from 'react-router-dom';
import banner1 from '../../asserts/car1.jpg';
import banner2 from '../../asserts/car2.jpg';
import banner3 from '../../asserts/car4.jpg';
import { CarOutlined, DashboardOutlined } from '@ant-design/icons';

const apiUrl = process.env.REACT_APP_API_URL;
const { Header, Content, Footer, Sider } = Layout;
const { Search } = Input;
const MainPage = () => {
  const [allVehicles, setAllVehicles] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles(); // Fetch vehicles data when component mounts
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get(`${apiUrl}vehicle`);
      const allVehicle = response.data;
      const filteredVehicles = filterVehiclesByDate(allVehicle, 2).slice(0,10);
      setNewArrivals(filteredVehicles)
      setAllVehicles(response.data);
      setLoading(false); // Update vehicles state with data from API response
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setLoading(false);
    }
  };

  const filterVehiclesByDate = (vehicles, days) => {
    const currentDate = new Date();
    const thresholdDate = new Date(currentDate.setDate(currentDate.getDate() - days));
    return vehicles.filter(vehicle => new Date(vehicle.createdOn) > thresholdDate);
  };

  console.log("vehicles",allVehicles)
  const carouselData = [
    { image: banner1, text: 'Welcome to DHINUJAYA CAR SALE', subText: 'Explore our wide range of vehicles' },
    { image: banner2, text: 'Best Deals on Used Cars', subText: 'Find great prices on reliable used cars' },
    { image: banner3, text: 'Find Your Perfect Vehicle', subText: 'Discover the car that fits your needs' },
  ];

  const handleCardClick = (id) => {
    navigate(`/vehicle/${id}`);
  };

  return (
    <div>

      <div style={{width:"100%"}}>
       <Carousel style={{width:"100%"}} autoplay>
      {carouselData.map((item, index) => (
        <div key={index}>
        <div className="carousel-image" style={{ backgroundImage: `url(${item.image})` ,width:"100%"}}>
          <div className="overlay">
            <div className="banner-text-container">
              <h2 className="carousel-text">{item.text}</h2>
              <p className="carousel-subtext">{item.subText}</p>
            </div>
          </div>
        </div>
      </div>
      
      ))}
    </Carousel>

    </div>
    <Layout>  
        <Content style={{ padding: '0 100px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>

       


     {/* New Arrivals Section */}
     <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>NEW ARRIVALS</h2>
            <p style={{ fontSize: '24px', color: '#888' }}>Check out the latest vehicles added to our collection....</p>
          </div>

          {/* Vehicle List */}
          <div style={{ padding: '20px 0' }}>
            {loading ? (
              <Spin size="large" />
            ) : (
              <List
                grid={{ gutter: 18, column: 5 }}
                dataSource={newArrivals}
                renderItem={item => {
                  const mainImage = item.images.find(img => img.mainImage);

                  return (
                    <List.Item>
                      <Card
                  onClick={() => handleCardClick(item.id)}
                  style={{ 
                    height: '400px',
                    border: '1px solid #1890ff', 
                    borderRadius: '10px', 
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.6)',
                    overflow: 'hidden',
                    marginBottom:'80px'                    
                  }}
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
                          <p><DashboardOutlined style={{ marginRight: 8  }} /> Mileage: <span style={{ fontWeight: 'bold'  }}> {item.mileage} km </span></p>
                          <p><CarOutlined style={{ marginRight: 8 }} />Condition :<span style={{ fontWeight: 'bold' }}> {item.vehicleCondition}</span></p>
                        </div>
                        <p style={{ fontWeight: 600, fontSize:20, color: "green" ,textAlign:"left"}}> RS : {item.price}</p>
                      </Card>
                    </List.Item>
                  );
                }}
              />
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>EXPLORE YOUR DREAM VEHICLE</h2>
            <p style={{ fontSize: '24px', color: '#888' }}>Check out the latest vehicles added to our collection....</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' ,borderRadius:"20px"}}>
      <Search
        placeholder="Search In Cars...."
        enterButton="Search"
        size="large"
        style={{ width: '50%',borderWidth: '12px', 
        borderColor: '#1890ff',marginTop:40 , border: '1px solid #1890ff', // Adding border with primary color
        borderRadius: '10px', // Adding border radius for smoother edges
        boxShadow: '0 3px 8px rgba(0, 0, 0, 0.5)', // Adding shadow for better highlight
        overflow: 'hidden' }}
      />
    </div>
      <div style={{ padding: '20px 0',marginTop:80 }}>
        {loading ? (
          <Spin size="large" />
        ) : (
          <List
          grid={{ gutter: 17, column: 5 }}
          dataSource={allVehicles}
          renderItem={item => {
            const mainImage = item.images.find(img => img.mainImage);

            return (
              <List.Item >
                <Card
            
            style={{ 
              height: '400px', // Fixed height for the card
              border: '1px solid #1890ff', // Adding border with primary color
              borderRadius: '10px', // Adding border radius for smoother edges
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.6)', // Adding shadow for better highlight
              overflow: 'hidden',
               marginBottom:'80px'  // Ensuring content does not overflow
              
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
                    <p><DashboardOutlined style={{ marginRight: 8  }} /> Mileage: <span style={{ fontWeight: 'bold'  }}> {item.mileage} km </span></p>
                    <p><CarOutlined style={{ marginRight: 8 }} />Condition :<span style={{ fontWeight: 'bold' }}> {item.vehicleCondition}</span></p>
                  </div>
                  <p style={{ fontWeight: 600, fontSize:20, color: "green" ,textAlign:"left"}}> RS : {item.price}</p>
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

const bannerContainerStyle = {
  position: 'relative',
  width: '100%',
  height: '400px',
  overflow: 'hidden',
  borderRadius: '20px',
};

const bannerImageStyle = {
  width: '100%',
  height: '400px',
  objectFit: 'cover',
};

const bannerTextContainerStyle = {
  position: 'absolute',
  bottom: '20px', // Adjust as needed to position the text relative to the bottom
  left: '50%',
  transform: 'translateX(-50%)',
  textAlign: 'center',
  width: '80%', // Adjust width as needed
  color: 'white',
};

const bannerTextStyle = {
  fontSize: '36px',
  fontWeight: 'bold',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Add semi-transparent background
  padding: '10px',                       // Add padding for better readability
  borderRadius: '10px',                  // Add border radius for smoother edges
};

const bannerSubTextStyle = {
  fontSize: '18px',
  fontWeight: 'normal',
  marginTop: '10px',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Add semi-transparent background
  padding: '5px',                       // Add padding for better readability
  borderRadius: '5px',                  // Add border radius for smoother edges
};

export default MainPage;
