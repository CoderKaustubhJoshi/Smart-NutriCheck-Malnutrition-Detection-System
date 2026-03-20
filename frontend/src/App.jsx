import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import ChatBot from './components/ChatBot'
import Home from './pages/Home'
import Screening from './pages/Screening'
import Awareness from './pages/Awareness'
import './App.css'

function App() {
  const location = useLocation()

  return (
    <div className="page-layout">
      <Navbar />
      <main className="main-area">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/screening" element={<Screening />} />
            <Route path="/awareness" element={<Awareness />} />
          </Routes>
        </AnimatePresence>
      </main>
      <ChatBot />
    </div>
  )
}

export default App
