import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Autocomplete from 'react-google-autocomplete';

const mapContainerStyle = {
  height: "400px",
  width: "800px",
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

const MyMapComponent = () => {
  const [selectedLocation, setSelectedLocation] = React.useState(null);

  const handlePlaceSelected = (place) => {
    const location = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };
    setSelectedLocation(location);
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyBTWbEcdp0JFTmEjqVPZx_WX4Zr12NFxHs">
      <Autocomplete
        apiKey="AIzaSyBTWbEcdp0JFTmEjqVPZx_WX4Zr12NFxHs"
        onPlaceSelected={handlePlaceSelected}
        types={['address']}
        style={{ width: '300px', marginBottom: '20px' }}
      />
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={selectedLocation || center}
        zoom={10}
      >
        {selectedLocation && <Marker position={selectedLocation} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default MyMapComponent;
