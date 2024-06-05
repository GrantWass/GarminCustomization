import React, { useState, useEffect } from 'react';
import MileageGraph from './MileageGraph';
import LastRun from './LastRun'
import axios from 'axios';
import Loading from '../general/Loading';
import WeeklyMileage from './WeeklyMileage'

  
  const Interface = () => {
    const [lastWeekData, setLastWeekData] = useState({});
    const [weeklyMileage, setWeeklyMileage] = useState([]);
    const [dateIndex, setDateIndex] = useState(0);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.post('http://127.0.0.1:5000/last_week_data', {
            username: localStorage.getItem("email"),
          });
          setLastWeekData(response.data)
        } catch (error) {
          console.error(error);
        }
      };
      const fetchWeeklyData = async () => {
        try {
          const response = await axios.post('http://127.0.0.1:5000/weekly_mileage', {
            username: localStorage.getItem("email"),
          });
          setWeeklyMileage(response.data)
          console.log(response.data)
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
      fetchWeeklyData();
    }, []);

    return (
      <>
        {lastWeekData.length > 0 ? (
          <div className="grid-container">
            <div className="grid_spot last-run">
              <LastRun run={lastWeekData[dateIndex]}/>
            </div>
            <div className="grid_spot weekly-mileage">
              <WeeklyMileage data = {weeklyMileage}/>
            </div>
            <div className="grid_spot mileage-graph">
              <MileageGraph data={lastWeekData.slice(0, 8)} setDateIndex={setDateIndex} />
            </div>
            <div className="grid_spot item4">
              Stats/Workout Recommendation
            </div>
            <div className="grid_spot item5">
              Performance Analysis
            </div>
          </div>
        ) : (
          <Loading/>
        )}
      </>
    );
    
  };
  
  export default Interface;
