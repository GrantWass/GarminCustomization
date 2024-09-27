import React from 'react';
import './interface.css';

const SmallMap = ({ coordinates }) => {
  // Find min and max values for x and y coordinates
  const minX = Math.min(...coordinates.map(coordinate => coordinate[0]));
  const minY = Math.min(...coordinates.map(coordinate => coordinate[1]));
  const maxX = Math.max(...coordinates.map(coordinate => coordinate[0]));
  const maxY = Math.max(...coordinates.map(coordinate => coordinate[1]));

  const rangeX = maxX - minX;
  const rangeY = maxY - minY;

  // Calculate scale factors
  const scaleFactorX = 100 / rangeX;
  const scaleFactorY = 100 / rangeY;
  
  // Use the smaller scale factor to maintain aspect ratio
  const scaleFactor = Math.min(scaleFactorX, scaleFactorY);
  
  // Calculate offset to center the map within the container
  const offsetX = (scaleFactorX - scaleFactor) / 2 * rangeX;
  const offsetY = (scaleFactorY - scaleFactor) / 2 * rangeY;

  return (
    <div className="small-map">
      {coordinates.map((coordinate, index) => (
        <div
          key={index}
          className="marker"
          style={{
            bottom: `${(coordinate[1] - minY) * scaleFactor + offsetY}%`,
            left: `${(coordinate[0] - minX) * scaleFactor + offsetX -10}%`,
          }}
        />
      ))}
    </div>
  );
};

export default SmallMap;
