import React from 'react'
import { Routes, Route } from 'react-router-dom'
import FamilyTree from './components/FamilyTree'
import AddMember from './components/AddMember'
import Navbar from './components/Navbar'
import { FamilyProvider } from './context/FamilyContext'

function App() {
  return (
    <FamilyProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<FamilyTree />} />
            <Route path="/add" element={<AddMember />} />
          </Routes>
        </main>
      </div>
    </FamilyProvider>
  )
}

export default App 