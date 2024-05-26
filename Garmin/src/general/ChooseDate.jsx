import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const DateRangePicker = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();


  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  return (
    <div className='date-container'>
    <div className="date-range-picker">
      <div className="date-picker">
        <h3>Start Date</h3>
        <input
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          className="date-input"
        />
      </div>
      <div className="arrow">➔</div>
      <div className="date-picker">
        <h3>End Date</h3>
        <input
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          className="date-input"
        />
      </div>
      </div>
      <button className= "confirm" onClick={() => {navigate('/map', {state: { start: startDate, end: endDate }})}}>Confrim Dates</button>
      </div>
  );
};

export default DateRangePicker;
