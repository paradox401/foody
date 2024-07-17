import React, { useRef, useEffect } from 'react';
import 'ol/ol.css'; // Import OpenLayers CSS
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import './OpenStreetMap.css'; // Import external CSS file

const OpenStreetMap = ({ center }) => {
  const mapElement = useRef(null);

  useEffect(() => {
    if (!mapElement.current) return;

    const map = new Map({
      target: mapElement.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: center,
        zoom: 13,
      }),
    });

    return () => map.dispose(); // Clean up when component unmounts
  }, [center]);

  return <div ref={mapElement} className="map-container" />;
};

export default OpenStreetMap;
