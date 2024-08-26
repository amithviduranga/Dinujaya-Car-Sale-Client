import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Carousel, Card } from 'antd';

const AdvertisementDetail = () => {
  const { id } = useParams();
  const [advertisement, setAdvertisement] = useState(null);

  useEffect(() => {
    axios.get(`/api/advertisements/${id}`)
      .then(response => setAdvertisement(response.data))
      .catch(error => console.error('Error fetching advertisement details:', error));
  }, [id]);

  if (!advertisement) {
    return <p>Loading...</p>;
  }

  return (
    <Card title={advertisement.model}>
      <Carousel>
        {advertisement.images.map((image, index) => (
          <div key={index}>
            <img src={image} alt={`Advertisement ${index + 1}`} style={{ width: '100%' }} />
          </div>
        ))}
      </Carousel>
      <p><strong>Price:</strong> ${advertisement.price}</p>
      <p><strong>Location:</strong> {advertisement.location}</p>
      <p><strong>Color:</strong> {advertisement.color}</p>
      <p><strong>Description:</strong> {advertisement.description}</p>
      {/* Add more details as needed */}
    </Card>
  );
};

export default AdvertisementDetail;
