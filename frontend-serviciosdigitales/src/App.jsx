import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PublicLayout from './components/PublicLayout'
import Home from './pages/Home'
import Servicios from './pages/Servicios'
import Portafolio from './pages/Portafolio'
import Encuesta from './pages/Encuesta'
import Login from './pages/Login'
import Registro from './pages/Registro'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/portafolio" element={<Portafolio />} />
          <Route path="/encuesta" element={<Encuesta />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
