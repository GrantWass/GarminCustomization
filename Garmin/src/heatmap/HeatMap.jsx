import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, HeatmapLayer } from '@react-google-maps/api';
import "./heatmap.css"
import config from '../../config';

const libraries = ['visualization'];
const gradient = [
  'rgba(0,0,0,0)',
  'rgba(255, 255, 0, 1)',
  'rgba(255, 229, 0, 1)',
  'rgba(255, 204, 0, 1)',
  'rgba(255, 279, 0, 1)',
  'rgba(255, 153, 0, 1)',
  'rgba(255, 128, 0, 1)',
  'rgba(255, 102, 0, 1)',
  'rgba(255, 76, 0, 1)',
  'rgba(255, 51, 0, 1)',
  'rgba(255, 25, 0, 1)',
  'rgba(255, 0, 0, 1)',
];

// const gradient = [
//   'rgba(0,0,0,0)',       //(fully transparent)
//   'rgba(255,255,255,1)', // White (fully opaque)
//   'rgba(255,109,0,1)',   // Orange
//   'rgba(255,171,73,1)',  // Orange
//   'rgba(255,234,131,1)', // Light yellow
//   'rgba(254,254,191,1)', // Yellow
//   'rgba(249,251,236,1)', // Light yellow
//   'rgba(254,254,190,1)', // Pale yellow
//   'rgba(253,208,162,1)', // Light orange
//   'rgba(252,157,154,1)', // Orange-pink
//   'rgba(212,90,162,1)',  // Pink
//   'rgba(155,61,179,1)',  // Light purple
//   'rgba(98,37,139,1)',   // Purple
//   'rgba(39,18,82,1)',    // Dark purple
// ];

const Heat = ({ heatmapData, radius, opacity, containerStyle, center, mapStyle}) => {
  const [map, setMap] = useState(null);

  const {isLoaded} = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: config.googleApiKey,
    libraries
  });

  const onLoad = useCallback(function callback(map) {
    map.setZoom(11);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  return <>
      {heatmapData.length > 0 && isLoaded && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={{
                styles: mapStyle
              }}
            >
                <HeatmapLayer
                    data={heatmapData.map((point) => new window.google.maps.LatLng(point[0], point[1]))}
                    options={{
                        radius: radius,
                        opacity: opacity,
                        weight: 5,
                        maxIntensity: 25,
                        gradient: gradient
                    }}
                />
            </GoogleMap>
        )}
      </>
}

export default React.memo(Heat);

