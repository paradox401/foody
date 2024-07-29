import React, { useRef, useEffect, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Icon, Style } from 'ol/style';
import { Modify } from 'ol/interaction';
import './OpenStreetMap.css';
import { assets } from '../../assets/assets';

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

    return () => {
      if (mapInstance) {
        mapInstance.setTarget(null);
      }
    };
  }, []);

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
          src: assets.marker,
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

    // Add interactions for dragging the marker
    const modify = new Modify({
      source: markerLayer.getSource(),
    });

    map.addInteraction(modify);

    modify.on('modifyend', (event) => {
      const newCoords = event.features.item(0).getGeometry().getCoordinates();
      setUserLocation(toLonLat(newCoords));
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

  const saveUserLocation = () => {
    if (!userLocation) {
      alert('No location selected');
      return;
    }

    // Replace this with actual save logic, e.g., saving to a backend or local storage
    console.log('User location saved:', userLocation);
    alert(`Location saved: ${userLocation[1]}, ${userLocation[0]}`);
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
      <button onClick={saveUserLocation} className='save_location' >Save Location</button>
    </div>
  );
};

export default OpenStreetMap;
