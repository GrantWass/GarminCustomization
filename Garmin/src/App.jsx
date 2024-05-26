import './App.css'
import { Routes, Route, BrowserRouter } from "react-router-dom"
import DateRangePicker from './general/ChooseDate'
import Map from './heatmap/Map'
import Home from './general/Homepage'
import Login from "./general/Login"
import Interface from "./interface/Interface.jsx"
import NavBar from './general/NavBar'
import Footer from './general/Footer'

function App() {
  return (
    <div>
      <BrowserRouter>
      <NavBar />
        <Routes>
          <Route path='/dates' element={<DateRangePicker />} />
          <Route path='/map' element={<Map/>}></Route>
          <Route path='/home' element={<Home/>}></Route>
          <Route path='/' element={<Login/>}></Route>
          {/* <Route path="/machine-learning" element={<MachineLearning />} />*/}
          <Route path="/interface" element={<Interface />} /> 
        </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  )
}

export default App
