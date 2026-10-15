import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PublicLayout from './components/PublicLayout'
import RequireAuth from './components/RequireAuth'
import Home from './pages/Home'
import Servicios from './pages/Servicios'
import ServicioDetalle from './pages/ServicioDetalle'
import Portafolio from './pages/Portafolio'
import Encuesta from './pages/Encuesta'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Carrito from './pages/Carrito'
import PanelCliente from './pages/PanelCliente'
import PanelVendedor from './pages/PanelVendedor'
import PanelAdmin from './pages/PanelAdmin'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/servicios/:id" element={<ServicioDetalle />} />
          <Route path="/portafolio" element={<Portafolio />} />
          <Route path="/encuesta" element={<Encuesta />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route
            path="/panel/cliente"
            element={
              <RequireAuth roles={['cliente', 'administrador']}>
                <PanelCliente />
              </RequireAuth>
            }
          />
          <Route
            path="/panel/vendedor"
            element={
              <RequireAuth roles={['vendedor', 'administrador']}>
                <PanelVendedor />
              </RequireAuth>
            }
          />
          <Route
            path="/panel/admin"
            element={
              <RequireAuth roles={['administrador']}>
                <PanelAdmin />
              </RequireAuth>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
