import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Form from './components/Form'
import TicketDetail from './components/TicketDetail'
import Report from './components/Report'
import Drag from './components/Drag'



const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/form" element={<Form />} />
      <Route path="/ticket/:id" element={<TicketDetail />} />

      <Route path="/report" element={<Report />} />
      <Route path="/drag" element={<Drag />} />

    </Routes>
  )
}

export default App
