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
  <li className="item" style={{backgroundColor: "#5a3f40"}}>
    <img className="image" src={method}/>
      <div className="content">
        <img className="displayimage" src={method}/>
        <h2 className="title">Methods</h2>
        <p className="description">
          Detailing the methods, technology stack, and process I went through to create this website.
        </p>
        <button>Read More</button>
      </div>
    </li>
    <li className="item" style={{backgroundColor: "#042426"}}>
      <img className="image" src={user}/>
      <div className="content">
        <img className="displayimage" src={user}/>
        <h2 className="title">Interface</h2>
        <p className="description">
          A simple and purposeful interface surrounded around data that elite runners care about. Allowing runners to gain insight on their training and recent activites.
        </p>
        <button onClick={() => {navigate('/interface')}}>See your data</button>
      </div>
    </li>
    <li className="item" style={{backgroundColor: "#1f2c2e"}}>
      <img className="image" src={map}/>
      <div className="content">
        <img className="displayimage" src={map}/>
        <h2 className="title">Heatmap</h2>
        <p className="description">
          Using each activities's location data to give you an insight on where you run most and where you have yet to explore
        </p>
        <button onClick={() => {navigate('/dates')}}>View your heatmap</button>
      </div>
    </li>
    <li className="item" style={{backgroundColor: "#393335"}}>
      <img className="image" src={machine_learning}/>
      <div className="content"> 
        <img className="displayimage" src={machine_learning}/>
        <h2 className="title">Machine Learning</h2>
        <p className="description">
          An exporatory approach of using training data to predict race times, fatigue levels, and other interesting metrics.
        </p>
        <button>Explore your data</button>
      </div>
    </li>
    <li className="item" style={{backgroundColor: "#6c4041"}}>
      <img className="image" src={graph}/>
      <div className="content">
        <img className="displayimage" src={graph}/>
        <h2 className="title">Graphics </h2>
        <p className="description">
          Using training data to make graphics which are unique or atypical to attempt to gain new insights on training.
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
