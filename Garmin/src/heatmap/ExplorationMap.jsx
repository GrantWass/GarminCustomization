import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, HeatmapLayer } from '@react-google-maps/api';
import "./heatmap.css"


const libraries = ['visualization'];
const gradient = [
    'rgba(128, 128, 128, 1)',
    'rgba(128, 128, 128, 0.8)',
    'rgba(128, 128, 128, 0.6)',
    'rgba(128, 128, 128, 0.4)',
    'rgba(128, 128, 128, 0.2)', 
    'rgba(128, 128, 128, 0)',
  ];

const Exploration = ({ heatmapData, radius, opacity, containerStyle, center }) => {
  const [map, setMap] = useState(null);

  const {isLoaded} = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyCsLPcTF_lqACeHvVjmJ1xbHZAaMsYvoH8",
    libraries
  });

  const onLoad = useCallback(function callback(map) {
    map.setZoom(13);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);


  return  <>
          {heatmapData.length > 0 && isLoaded && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              onLoad={onLoad}
              onUnmount={onUnmount}
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

export default React.memo(Exploration);

