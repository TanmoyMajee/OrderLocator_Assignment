import { useState } from 'react'
import {Routes ,  Route} from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Map from './pages/Map'

function App() {

  return (
    <>
 
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<Map />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick 
        theme="light"
        toastStyle={{ backgroundColor: '#4A5568', color: '#fff' }} // Custom styles
      />
    </>
  )
}

export default App
