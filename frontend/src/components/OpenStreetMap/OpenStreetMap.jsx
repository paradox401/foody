import React, { useRef, useEffect, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Icon, Style } from 'ol/style';
import { Modify } from 'ol/interaction';
import { fromLonLat, toLonLat } from 'ol/proj';
import './OpenStreetMap.css';
import { assets } from '../../assets/assets';

const OpenStreetMap = ({ center = [85.0322, 27.4291], onLocationSelect }) => {
  const mapElement = useRef(null);
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState([85.0322, 27.4291]);
  const [userMarker, setUserMarker] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!mapElement.current) return;

    const mapInstance = new Map({
      target: mapElement.current,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat(userLocation),
        zoom: 12
      })
    });

    setMap(mapInstance);

    return () => {
      if (mapInstance) {
        mapInstance.setTarget(null);
      }
    };
  }, [userLocation]);

  useEffect(() => {
    if (!map || !userLocation) return;

    const marker = new Feature({
      geometry: new Point(fromLonLat(userLocation))
    });

    const markerLayer = new VectorLayer({
      source: new VectorSource({
        features: [marker]
      }),
      style: new Style({
        image: new Icon({
          src: assets.marker, // Ensure this path is correct
          scale: 0.5
        })
      })
    });

    if (userMarker) {
      map.removeLayer(userMarker);
    }

    map.addLayer(markerLayer);
    setUserMarker(markerLayer);

    map.getView().animate({
      center: fromLonLat(userLocation),
      zoom: 12
    });

    const modify = new Modify({
      source: markerLayer.getSource(),
    });

    map.addInteraction(modify);

    modify.on('modifyend', (event) => {
      const newCoords = event.features.item(0).getGeometry().getCoordinates();
      const location = toLonLat(newCoords);
      setUserLocation(location);
      onLocationSelect(location); // Notify parent component
    });
  }, [map, userLocation, onLocationSelect]);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = [longitude, latitude];
        setUserLocation(location);
        onLocationSelect(location);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
          case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
        }
        console.error('Error getting user location:', error);
      }
    );
  };
  
  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        searchQuery
      )}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        return response.json();
      })
      .then((data) => {
        if (data.length > 0) {
          const result = data[0];
          const location = [parseFloat(result.lon), parseFloat(result.lat)];
          setUserLocation(location);
          onLocationSelect(location);
        } else {
          console.log('No results found');
        }
      })
      .catch((error) => {
        console.error('Error fetching search results:', error);
      });
  };

  return (
    <div className="map-container">
      <div ref={mapElement} className="map" style={{ height: '500px', width: '100%' }} />
      <div className="controls">
        <button onClick={getUserLocation}>Get My Location</button>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a location..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
};

export default OpenStreetMap;
