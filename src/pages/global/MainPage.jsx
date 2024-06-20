// MainPage.js
import React, { useEffect, useState } from 'react';
import { Carousel, List, Card, Spin } from 'antd';
import axios from 'axios';
import './Carousal.css'
import banner1 from '../../asserts/car1.jpg';
import banner2 from '../../asserts/car2.jpg';
import banner3 from '../../asserts/car4.jpg';

const MainPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('YOUR_ENDPOINT_HERE')
      .then(response => {
        setVehicles(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("There was an error fetching the vehicles!", error);
        setLoading(false);
      });
  }, []);



  const carouselData = [
    { image: banner1, text: 'Welcome to DHANUJAYA CAR SALE', subText: 'Explore our wide range of vehicles' },
    { image: banner2, text: 'Best Deals on Used Cars', subText: 'Find great prices on reliable used cars' },
    { image: banner3, text: 'Find Your Perfect Vehicle', subText: 'Discover the car that fits your needs' },
  ];

  return (
    <div>
       <Carousel style={{borderRadius:20}} autoplay>
      {carouselData.map((item, index) => (
        <div key={index}>
        <div className="carousel-image" style={{ backgroundImage: `url(${item.image})` }}>
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
      <div style={{ padding: '20px 0' }}>
        {loading ? (
          <Spin size="large" />
        ) : (
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={vehicles}
            renderItem={item => (
              <List.Item>
                <Card
                  title={item.make}
                  cover={<img alt={item.model} src={item.imageUrl} />}
                >
                  <p>Model: {item.model}</p>
                  <p>Year: {item.year}</p>
                  <p>Price: ${item.price}</p>
                </Card>
              </List.Item>
            )}
          />
        )}
      </div>
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
