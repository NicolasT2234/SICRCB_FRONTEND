import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Registro from "./pages/Registro"
import Alquiler from "./pages/Alquiler"
import Multas from "./pages/Multas"
import Noticias from "./pages/Noticias"
import Dashboard from "./pages/Dashboard"
import Pqrs from "./pages/Pqrs"
import Recuperar from "./pages/Recuperar"
import Home from "./pages/Home"
import Perfil from "./pages/Perfil"

function RutaPrivada({ children }) {
  const token = localStorage.getItem("token")
  return token ? children : <Navigate to="/login" />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/alquiler" element={<Alquiler />} />
      <Route path="/multas" element={<RutaPrivada><Multas /></RutaPrivada>} />
      <Route path="/noticias" element={<RutaPrivada><Noticias /></RutaPrivada>} />
      <Route path="/pqrs" element={<RutaPrivada><Pqrs /></RutaPrivada>} />
      <Route path="/recuperar" element={<Recuperar />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/dashboard" element={<RutaPrivada><Dashboard /></RutaPrivada>} />
    </Routes>
  )
}

export default App