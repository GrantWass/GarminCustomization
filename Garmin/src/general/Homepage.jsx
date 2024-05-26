import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "./general.css"
import map from "/map.svg";
import graph from "/graph.svg";
import user from "/interface.svg";
import machine_learning from "/machine_learning.svg";
import method from "/method.svg";


const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const slider = document.querySelector('.slider');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    
    const activate = (e) => {
      const items = document.querySelectorAll('.item');
      if (e.target.matches('.next')) {
        slider.append(items[0]);
      } else if (e.target.matches('.prev')) {
        slider.prepend(items[items.length - 1]);
      }
    }

    prevButton.addEventListener('click', activate);
    nextButton.addEventListener('click', activate);

    return () => {
      prevButton.removeEventListener('click', activate);
      nextButton.removeEventListener('click', activate);
    };
  }, []);

return (
  <>
<div className="main">
  <ul className="slider">
    <li
      className="item"
      style={{ 
        backgroundColor: "#393335"
       }}
    >
      <img className="image" src={machine_learning}/>
      <div className="content"> 
        <img className="displayimage" src={machine_learning}/>
        <h2 className="title">Machine Learning</h2>
        <p className="description">
          Using my garmin data to predict future races, fitness, and other interesting metrics
        </p>
        <button>Explore your data</button>
      </div>
    </li>
    <li
      className="item"
      style={{
        backgroundColor: "#042426"
      }}
    >
      <img className="image" src={user}/>
      <div className="content">
        <img className="displayimage" src={user}/>
        <h2 className="title">Interface</h2>
        <p className="description">
          An updated interface for elite runners. Using only metrics you care about and presenting them in a way that is easily digestable
        </p>
        <button onClick={() => {navigate('/interface')}}>See your data</button>
      </div>
    </li>
    <li
      className="item"
      style={{
        backgroundColor: "#5a3f40"
      }}
    >
    <img className="image" src={method}/>
      <div className="content">
        <img className="displayimage" src={method}/>
        <h2 className="title">Methods</h2>
        <p className="description">
          Detailing the methods, technology stack, and process I went through to create this website
        </p>
        <button>Read More</button>
      </div>
    </li>
    <li
      className="item"
      style={{
        backgroundColor: "#1f2c2e"
      }}
    >
      <img className="image" src={map}/>
      <div className="content">
        <img className="displayimage" src={map}/>
        <h2 className="title">Heatmap</h2>
        <p className="description">
          Using your running data over a chosen period of time to display where you have ran most frequently.
        </p>
        <button onClick={() => {navigate('/dates')}}>View your heatmap</button>
      </div>
    </li>
    <li
      className="item"
      style={{
        backgroundColor: "#6c4041"
      }}
    >
      <img className="image" src={graph}/>
      <div className="content">
        <img className="displayimage" src={graph}/>
        <h2 className="title">Graphics </h2>
        <p className="description">
          Exploratory approach to viewing your data in ways that are atypical. 
        </p>
        <button>Explore graphics</button>
      </div>
    </li>
  </ul>
  <div className="move">
  <button className="btn prev arrow ">➔</button>
<button className="btn next arrow ">➔</button>
  </div>
</div>
</>
)}

export default Home;
