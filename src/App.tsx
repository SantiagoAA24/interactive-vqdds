import { Route, Routes } from 'react-router-dom'
import Design from './pages/Design.tsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Hola</h1>} />
      <Route path="/diseno" element={<Design />} />
    </Routes>
  )
}

export default App
