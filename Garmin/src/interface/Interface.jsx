import React, { useState, useEffect } from 'react';

const MockData = [
    {
      "date": "2023-05-17",
      "day": "monday",  
      "distance_miles": 5.2,
      "duration_minutes": 45,
      "elevation_gain_feet": 150
    },
    {
      "date": "2023-05-18",
      "day": "tuesday",  
      "distance_miles": 6.5,
      "duration_minutes": 55,
      "elevation_gain_feet": 200
    },
    {
      "date": "2023-05-19",
      "day": "wednesday",  
      "distance_miles": 4.3,
      "duration_minutes": 40,
      "elevation_gain_feet": 120
    },
    {
      "date": "2023-05-20",
      "day": "thursday",  
      "distance_miles": 7.1,
      "duration_minutes": 65,
      "elevation_gain_feet": 250
    },
    {
      "date": "2023-05-21",
      "day": "friday",  
      "distance_miles": 3.8,
      "duration_minutes": 35,
      "elevation_gain_feet": 100
    },
    {
      "date": "2023-05-22",
      "day": "saturday",  
      "distance_miles": 5.9,
      "duration_minutes": 50,
      "elevation_gain_feet": 180
    },
    {
      "date": "2023-05-23",
      "day": "sunday",  
      "distance_miles": 6.2,
      "duration_minutes": 53,
      "elevation_gain_feet": 210
    }
  ]
  
  const Interface = () => {
    return (
      <div>
        <h2>Mock Data</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Day</th>
              <th>Distance (miles)</th>
              <th>Duration (minutes)</th>
              <th>Elevation Gain (feet)</th>
            </tr>
          </thead>
          <tbody>
            {MockData.map((data, index) => (
              <tr key={index}>
                <td>{data.date}</td>
                <td>{data.day}</td>
                <td>{data.distance_miles}</td>
                <td>{data.duration_minutes}</td>
                <td>{data.elevation_gain_feet}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default Interface;
