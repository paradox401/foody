import React, { useRef, useEffect, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Icon, Style } from 'ol/style';
import './OpenStreetMap.css';
import { assets } from '../../assets/assets';

// Sample marker icon URL


const OpenStreetMap = () => {
  const mapElement = useRef(null);
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMarker, setUserMarker] = useState(null);

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
        center: fromLonLat([0, 0]),
        zoom: 2
      })
    });

    setMap(mapInstance);

    // Clean up map on component unmount
    return () => {
      if (mapInstance) {
        mapInstance.setTarget(null);
      }
    };
  }, []);

  useEffect(() => {
    if (!map || !userLocation) return;

    // Clear previous marker if exists
    if (userMarker) {
      map.removeLayer(userMarker);
    }

    // Create new marker
    const markerLayer = new VectorLayer({
      source: new VectorSource({
        features: [
          new Feature({
            geometry: new Point(fromLonLat(userLocation))
          })
        ]
      }),
      style: new Style({
        image: new Icon({
          src: assets.marker,
          scale: 0.5
        })
      })
    });

    map.addLayer(markerLayer);
    setUserMarker(markerLayer);

    // Center map to user location
    map.getView().animate({
      center: fromLonLat(userLocation),
      zoom: 12
    });
  }, [map, userLocation]);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([longitude, latitude]);
      },
      (error) => {
        console.error('Error getting user location:', error);
        alert('Error getting your location');
      }
    );
  };

  const handleSearch = () => {
    if (!map || !searchQuery.trim()) return;

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
          setUserLocation([parseFloat(result.lon), parseFloat(result.lat)]);
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
      <div ref={mapElement} className="map" />
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
