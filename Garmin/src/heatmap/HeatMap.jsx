import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, HeatmapLayer } from '@react-google-maps/api';
import "./heatmap.css"
import config from '../../config';

const libraries = ['visualization'];

const Heat = ({ heatmapData, radius, opacity, containerStyle, center}) => {
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
            >
                <HeatmapLayer
                    data={heatmapData.map((point) => new window.google.maps.LatLng(point[0], point[1]))}
                    options={{
                        radius: radius,
                        opacity: opacity,
                        weight: 5,
                        maxIntensity: 25,
                    }}
                />
            </GoogleMap>
        )}
      </>
}

export default React.memo(Heat);

