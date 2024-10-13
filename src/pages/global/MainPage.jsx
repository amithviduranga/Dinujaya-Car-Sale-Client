// MainPage.js
import React, { useEffect, useState } from 'react';
import { Carousel, List, Card, Spin,Layout,Breadcrumb ,Input} from 'antd';
import axios from 'axios';
import './Carousal.css'
import { useNavigate } from 'react-router-dom';
import banner1 from '../../asserts/car1.jpg';
import banner2 from '../../asserts/car2.jpg';
import banner3 from '../../asserts/car4.jpg';
import statistics from '../../asserts/statistics.jpg'
import aboutUs from '../../asserts/aboutUS.jpg'
import { CarOutlined, DashboardOutlined } from '@ant-design/icons';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const apiUrl = process.env.REACT_APP_API_URL;
const { Header, Content, Footer, Sider } = Layout;
const { Search } = Input;
const MainPage = () => {
  const [allVehicles, setAllVehicles] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { ref, inView } = useInView({
    triggerOnce: true,  // Trigger only once
    threshold: 0.5,     // Trigger when 10% of the section is in view
  });

  useEffect(() => {
    fetchVehicles(); // Fetch vehicles data when component mounts
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get(`${apiUrl}vehicle`);
      const allVehicle = response.data;
       // Filter vehicles where sold == false
  const unsoldVehicles = allVehicle.filter(vehicle => vehicle.sold === false);
  
  // Further filter vehicles based on the date and limit to 10
  const filteredVehicles = filterVehiclesByDate(unsoldVehicles, 365).slice(0, 10);

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
  
      <div style={{ 
        position: 'relative', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderRadius: '20px',
        overflow: 'hidden',
        width: '100%',
        margin: '0 auto'
      }}>
        <img 
          src={statistics}
          alt="Banner" 
          style={{ 
            width: '100%', 
            height: '10%',
            borderRadius: '20px',
          }} 
        />
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0.8, 0.6, 0.8, 0.8)',
          display: 'flex',
          flexDirection: 'Column',
          alignItems: 'center',
          color: '#fff',
          borderRadius: '20px',
        }}  ref={ref}>
          <div style={{ textAlign:'center', alignItems: 'center',width:"80%" }}>
            <h1 style={{fontSize: '40px', marginBottom:60 ,marginTop:50}}>STATISTICS</h1>
            <p style={{fontSize: '20px', color: '#889', marginBottom:60 ,marginTop:50}}>
          Explore the impressive numbers behind our success: the vast array of vehicles in our collection, our growing community of active customers, and the numerous advertisements we host.<br/> Join us and be part of our ever-expanding journey!
</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'Row', alignItems: 'center', gap: '100px' }}>
            
            <div style={{ fontSize: '44px' }}>
            {inView &&<CountUp end={200} duration={2} />}+
              <p style={{ fontSize: '28px',marginTop:8,fontWeight:700 }}>ACTIVE MEMBERS</p>
            </div>
            <div style={{ fontSize: '44px' }}>
             {inView &&  <CountUp end={500} duration={2} />}+
              <p style={{ fontSize: '28px',marginTop:8, fontWeight:700 }}>VEHICLES</p>
            </div>
            <div style={{ fontSize: '44px' }}>
            {inView &&  <CountUp end={30} duration={2} />}+
              <p style={{ fontSize: '28px',marginTop:8 ,fontWeight:700  }}>ADVERTIESMENTS</p>
            </div>
            <div style={{ fontSize: '44px' }}>
            {inView &&  <CountUp end={5} duration={2} />}+
              <p style={{ fontSize: '28px',marginTop:8 ,fontWeight:700  }}>VEHICLE CATEGORIES</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  

    <div style={{ textAlign: 'center', marginTop: 100 }}>
    <h1 style={{fontSize: '40px'}}>ABOUT BUSSINESS</h1>
    <div style={{alignItems: 'center',display:"felx"}}>
    <p style={{fontSize: '20px', 
  color: '#889', 
  marginBottom: '60px', 
  marginTop: '50px',
  width: '80%', // Define the width
  marginLeft: 'auto', 
  marginRight: 'auto', // Center the paragraph
  textAlign: 'center' }}>
    We are dedicated to providing a diverse collection of vehicles to meet the needs of our growing community.  
    With a commitment to quality and customer satisfaction, we continuously expand our offerings and services. 
</p>
</div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <div style={{ 
        position: 'relative', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderRadius: '20px',
        overflow: 'hidden',
        width: '100%',
        margin: '0 auto',
        height: '400px' // Set a fixed height for the container
      }}>
        <div style={{ 
          flex: 1,
          height: '100%'
        }}>
          <img 
            src={aboutUs}
            alt="Banner" 
            style={{ 
              width: '100%', 
              height: '100%',
              objectFit: 'cover', // Ensure the image covers the div
              borderRadius: '20px 0 0 20px', // Round only the left side corners
            }} 
          />
        </div>
        <div style={{
          flex: 1,
          position: 'relative',
          height: '100%',
          backgroundColor: 'rgba(0.8, 0.6, 0.8, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: '#fff',
          borderRadius: '0 20px 20px 0', // Round only the right side corners
          padding: '10px'
        }} >
          <div style={{ textAlign:'center', alignItems: 'center', width:"80%" }}>
            <h1>STORY  OF  <span style={{color:"#79D56F"}}>DINUJAYA  CAR  SALE</span> </h1>
            <div>
            </div>
            </div>
           <span style={{
  flex: 1,
  fontSize:17,
          position: 'relative',
          height: '100%',
  padding: '0px 90px 0px 90px',

  textAlign: 'justify',
  }}> Welcome to DinuJaya Car Sale, your trusted destination for a diverse selection of high-quality vehicles. 
  We pride ourselves on offering a wide range of cars to meet the unique needs of our valued customers.
  <br/> <br/>
  With a steadfast commitment to excellence, we ensure that every vehicle in our collection meets the highest standards of quality and performance. 
  Our dedicated team is here to provide exceptional customer service, guiding you through every step of your car-buying journey. 
  Whether you're looking for a sleek sedan, a rugged SUV, or a family-friendly minivan, <br/> <br/> DinuJaya Car Sale has the perfect vehicle for you. 
  Join our growing community of satisfied customers and experience the difference with DinuJaya Car Sale.
  </span>
            </div>
         
          
        
      </div>
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
