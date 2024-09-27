import React from 'react'
import ReactDOM from 'react-dom/client'
import { Routes, Route, BrowserRouter } from "react-router-dom"
import DateRangePicker from './general/ChooseDate'
import Map from './heatmap/Map'
import Home from './general/Homepage'
import Login from "./general/Login"
import Interface from "./interface/Interface.jsx"
import NavBar from './general/NavBar'
import Footer from './general/Footer'
import Machine_Learning from './machine_learning/Machine_Learning'
import Graphics from './graphics/Graphics'
import Methods from './methods/Methods'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <NavBar />
        <Routes>
          <Route path='/dates' element={<DateRangePicker />} />
          <Route path='/map' element={<Map/>}></Route>
          <Route path='/home' element={<Home/>}></Route>
          <Route path='/' element={<Login/>}></Route>
          <Route path="/machine-learning" element={<Machine_Learning/>} />
          <Route path="/graphics" element={<Graphics/>} />
          <Route path="/methodology" element={<Methods/>} />
          <Route path="/interface" element={<Interface />} /> 
        </Routes>
        <Footer/>
      </BrowserRouter>
  </React.StrictMode>,
)
