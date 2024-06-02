import React, { useState } from 'react';
import './interface.css'

const MileageGraph = ({ data, setDateIndex }) => {
  const distances = data.map(item => item.distance_miles);
  const maxDistance = Math.max(...distances);
  const [dateIndexLocal, setDateIndexLocal] = useState(0);

  const handleBarClick = (index) => {
    setDateIndex(index);
    setDateIndexLocal(index)
  }

  return (
    <div className='mileage-graph'>
      <p> Last Seven Runs </p>
      {distances.map((distance, index) => (
        <div
          key={index}
          className="mileage-bar"
          style={{
            width: `${(distance / maxDistance) * 100}%`,
            backgroundColor: dateIndexLocal === index ? 'gray' : 'red',
            cursor: 'pointer'
          }}
          onClick={() => handleBarClick(index)}
        />
      ))}
    </div>
  );
}

export default MileageGraph;
