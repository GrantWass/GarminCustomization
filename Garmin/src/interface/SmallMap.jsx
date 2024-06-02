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

  const scaleFactorX = 100 / rangeX;
  const scaleFactorY = 100 / rangeY;

  const scaleFactor = Math.min(scaleFactorX, scaleFactorY)
  // X is true, Y is false
  const scaleDirection = (scaleFactorX - scaleFactorY) > 0 ? true : false
  const scaleFactorDifference = Math.abs(scaleFactorX - scaleFactorY)

  let offsetX = 0
  let offsetY = 0
  if (scaleDirection){
    offsetX = scaleFactorDifference * 0.8
  } else {
    offsetY = scaleFactorDifference
  }

  return (
    <div className="map">
      {coordinates.map((coordinate, index) => (
        <div
          key={index}
          className="marker"
          style={{
            bottom: `${(coordinate[0] - minX) * scaleFactor + (offsetX/100)}%`,
            left: `${(coordinate[1] - minY) * scaleFactor + (offsetY/100)}%`,
          }}
        />
      ))}
    </div>
  );
};

export default SmallMap;


