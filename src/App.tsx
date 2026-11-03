import { Route, Routes } from 'react-router-dom'
import Components from './pages/Components.tsx'
import Design from './pages/Design.tsx'
import Home from './pages/Home.tsx'
import Module1 from './pages/Module1.tsx'
import Module2 from './pages/Module2.tsx'
import Module3 from './pages/Module3.tsx'
import NotFound from './pages/NotFound.tsx'
import Paper from './pages/Paper.tsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/modulo-1" element={<Module1 />} />
      <Route path="/modulo-2" element={<Module2 />} />
      <Route path="/modulo-3" element={<Module3 />} />
      <Route path="/paper" element={<Paper />} />
      <Route path="/diseno" element={<Design />} />
      <Route path="/componentes" element={<Components />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
