import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Loading from "../general/Loading";
import Heatmap from "./HeatMap";
import ExplorationMap from './ExplorationMap';

const containerStyle = { width: '100%', height: '100%', overflow: 'hidden', borderRadius: "20px"};
const center = { lat: 40.8, lng: -96.7 };

function Map() {
  const [heatmapData, setHeatmapData] = useState([]);
  const [radius, setRadius] = useState(30);
  const [opacity, setOpacity] = useState(0.8);
  const [selectedMap, setSelectedMap] = useState('Exploration'); 
  const location = useLocation();
  const { start, end } = location.state || {};


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:5000/get_points', {
          start_date: start,
          end_date: end,
          username: localStorage.getItem("email"),
          password: localStorage.getItem("password"),
        });
        setHeatmapData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [start, end]);

  const changeRadius = () => {
    const newRadius = radius === 10 ? 30 : 10;
    setRadius(newRadius);
  };

  const changeOpacity = () => {
    const newOpacity = opacity === 0.8 ? 0.5 : 0.8;
    setOpacity(newOpacity);
  };

  return <>
      {heatmapData.length > 0 && (
        <>
      <div id="map-selection">
        <button onClick={() => setSelectedMap('Exploration')} title="Exploration Map" className={selectedMap === 'Exploration' ? 'this' : ''}>
          <i className="fas fa-map"></i> 
          <p>Exploration</p>
        </button>
        <button onClick={() => setSelectedMap('HeatMap')} title="Heat Map" className={selectedMap === 'HeatMap' ? "this" : ''}>
          <i className="fas fa-fire"></i> 
          <p>Heatmap</p>
        </button>
        </div>
        <div className="map-container">
          <div id="floating-panel">
            <button onClick={changeRadius} title="Change Radius" >
              <i className="fas fa-circle"></i>
            </button>
            <button onClick={changeOpacity} title="Change Opacity">
              <i className="fas fa-adjust"></i>
            </button>
          </div>
          <div className="map" >
              {selectedMap === 'Exploration' ? (
                  <ExplorationMap heatmapData={heatmapData} containerStyle={containerStyle} center={center} radius={radius} opacity={opacity}/>
                ) : (
                  <Heatmap heatmapData={heatmapData} containerStyle={containerStyle} center={center} radius={radius/6} opacity={opacity}/>
              )}
          </div>
        </div>
        </>
        )}
        {heatmapData.length === 0 && <Loading />}
      </>
}

export default React.memo(Map);

