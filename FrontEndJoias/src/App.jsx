import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom' 
import { Login } from './modules/Login'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<h1 className='bg-red-100 text-center font-bold'>Homepage</h1>} />
        <Route path='/about' element={<h1>Divino case comigo ?</h1>} />
        <Route path='/contact' element={<h1>S ou N ?</h1>} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App
