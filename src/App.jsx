import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import NetflixHome from './components/NetflixHome'
import ShowDetail from './components/ShowDetail'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NetflixHome />} />
        <Route path="/show/:id" element={<ShowDetail />} />
      </Routes>
    </Router>
  )
}

export default App