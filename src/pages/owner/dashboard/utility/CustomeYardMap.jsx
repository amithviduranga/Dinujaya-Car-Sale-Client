import React, { useState } from 'react';
import { MapContainer, TileLayer, Rectangle, Popup, Marker ,Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Define the bounds (coordinates) for each yard (rectangle)
const yards = [
  { name: 'A', bounds: [[7.8723, 80.7719], [7.8735, 80.7722]] },
  { name: 'B', bounds: [[7.8723, 80.7725], [7.8735, 80.7729]] },
  { name: 'C', bounds: [[7.8736, 80.7714], [7.8740, 80.7722]] },
  { name: 'D', bounds: [[7.8736, 80.7725], [7.8740, 80.7729]] },
  { name: 'E', bounds: [[7.8736, 80.7700], [7.8740, 80.7709]] }, // Below A
  { name: 'F', bounds: [[7.8723, 80.7694], [7.8727, 80.7705]] }, // Below B
  // New yards left of the road next to A and C
  { name: 'G', bounds: [[7.8730, 80.7694], [7.8733, 80.7706]] }, // Left of A
  { name: 'H', bounds: [[7.8723, 80.7714], [7.8735, 80.7718]] }
  // Add more yards as needed
];

// Function to calculate the center of the rectangle (bounds)
const calculateCenter = (bounds) => {
  const lat = (bounds[0][0] + bounds[1][0]) / 2;
  const lng = (bounds[0][1] + bounds[1][1]) / 2;
  return [lat, lng];
};

const CustomYardMap = ({ setSelectedYard }) => {
  const [activeYard, setActiveYard] = useState(null);

  // Handle yard selection
  const handleYardClick = (yard) => {
    setActiveYard(yard.name);       // Mark the selected yard visually
    setSelectedYard(yard.name);     // Send selected yard to parent
  };

  // Custom icon with a transparent image for text labels
  const customIcon = (label) =>
    L.divIcon({
      className: 'yard-label-icon',
      html: `<div style="color: black; font-weight: bold;">${label}</div>`,
      iconSize: [30, 12], // Adjust the size of the label box
      iconAnchor: [15, 6], // Anchor the icon to the center
    });
    const entrancePosition = [7.87219, 80.77063];
  return (
    <MapContainer
      center={[7.8731, 80.7718]}  // Adjust the center of the map
      zoom={18}                    // Set zoom level to focus on the yard
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Render the rectangles for each yard */}
      {yards.map((yard) => (
        <React.Fragment key={yard.name}>
          <Rectangle
            bounds={yard.bounds}
            eventHandlers={{
              click: () => handleYardClick(yard),
            }}
            pathOptions={{
              color: activeYard === yard.name ? 'blue' : 'green', // Change color if selected
              fillOpacity: 0.4,
            }}
          >
            <Popup>{`Yard ${yard.name}`}</Popup>
          </Rectangle>

          {/* Add a marker with the yard name in the middle */}
          <Marker
            position={calculateCenter(yard.bounds)}
            icon={customIcon(yard.name)}
            interactive={false} // Disable interaction for the label
          />
        </React.Fragment>
      ))}
        <Circle
        center={entrancePosition}
        radius={10} // You can adjust the radius as needed
        color="red"
        fillColor="red"
        fillOpacity={0.5}
      >
        <Popup>Main Entrance</Popup> {/* Label for the entrance */}
      </Circle>
    </MapContainer>
  );
};

export default CustomYardMap;
