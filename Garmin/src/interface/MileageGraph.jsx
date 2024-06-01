import React from 'react';
import './interface.css'

const MileageGraph = ({ data }) => {
  const distances = data.map(item => item.distance_miles);
  const maxDistance = Math.max(...distances);

  return (
    <div className='mileage-graph'>
      {distances.map((distance, index) => (
        <div
        key={index}
        className = "mileage-bar"
        style={{
          width: `${(distance / maxDistance) * 100}%`,
          backgroundColor: index === distances.length - 1 ? 'gray' : 'red' 
        }}
      />
      ))}
    </div>
  );
}

export default MileageGraph;
