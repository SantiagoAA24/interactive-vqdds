import { Route, Routes } from 'react-router-dom'
import Components from './pages/Components.tsx'
import Design from './pages/Design.tsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Hola</h1>} />
      <Route path="/diseno" element={<Design />} />
      <Route path="/componentes" element={<Components />} />
    </Routes>
  )
}

export default App
