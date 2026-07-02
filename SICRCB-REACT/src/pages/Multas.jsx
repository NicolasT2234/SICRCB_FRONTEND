import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import "../assets/css/styles.css"
import "../assets/css/multas.css"
import NavbarApp from "../components/NavbarApp.jsx"

function Multas() {
  const navigate = useNavigate()
  const [correo, setCorreo] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState(null)
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    confirmText: "",
  })

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    try {
      await api.post("/login", { email: correo, password })
      navigate("/multas")
    } catch (err) {
      setError("Correo o contraseña incorrectos")
    }
  }

  const abrirModal = (tipo) => {
    const config = {
      actualizar: {
        title: "Actualizar estado de multa",
        message:
          "¿Estás seguro de que deseas cambiar el estado? Esta acción modificará el registro permanentemente.",
        confirmText: "Actualizar",
      },
      eliminar: {
        title: "Eliminar multa",
        message:
          "¿Estás seguro de que deseas eliminar esta multa? Todos los datos serán eliminados permanentemente. Esta acción no se puede deshacer.",
        confirmText: "Eliminar",
      },
      cerrarSesion: {
        title: "Cerrar sesión",
        message: "¿Estás seguro de que deseas cerrar sesión?",
        confirmText: "Cerrar sesión",
      },
    }

    setModalType(tipo)
    setModalContent(config[tipo] || { title: "", message: "", confirmText: "" })
    setModalOpen(true)
  }

  const cerrarModal = () => {
    setModalOpen(false)
  }

  const handleConfirm = () => {
    if (modalType === "actualizar") {
      cerrarModal()
      alert("Estado actualizado correctamente")
    } else if (modalType === "eliminar") {
      cerrarModal()
      alert("Multa eliminada")
    } else if (modalType === "cerrarSesion") {
      cerrarModal()
      handleLogout()
    }
  }

  return (
    <div className="multas-page">
      <NavbarApp onLogout={handleLogout} />

      <h1>MULTAS</h1>

      <div className="grid-noticias">
        <div className="a-noticia">
          <legend>Agregar Multa</legend>
          <hr />
          <label className="form-label">Factura de la Multa</label>
          <input type="file" className="input" />
          <hr />
          <label className="form-label">Fecha de publicación</label>
          <input type="datetime-local" className="input" />
          <hr />
          <button type="button" className="btn-success" onClick={() => alert("Multa agregada correctamente")}>
            Agregar
          </button>
          <p><i>Recuerda que la multa genera un ID a la hora de ser publicada</i></p>
        </div>

        <div className="a-noticia">
          <h6>¿Deseas buscar una multa?</h6>
          <hr />
          <label className="form-label">Agrega el ID de la multa para buscarla</label>
          <hr />
          <input type="text" placeholder="#12345" className="input" />
          <hr />
          <button type="button" className="btn-success" onClick={() => alert("Buscando multa...")}>
            Buscar
          </button>
        </div>

        <div className="a-noticia">
          <h6>¿Deseas cambiar el estado de la multa?</h6>
          <hr />
          <div className="radio-group">
            <label className="container">
              Sí
              <input name="opcion1" type="radio" />
              <div className="checkmark"></div>
            </label>
            <label className="container">
              No
              <input name="opcion1" checked type="radio" />
              <div className="checkmark"></div>
            </label>
          </div>
          <hr />
          <label className="form-label">ID de la multa</label>
          <input type="text" placeholder="#12345" className="input" />
          <hr />
          <label className="form-label">Nuevo estado de la multa</label>
          <input type="file" className="input" />
          <hr />
          <button type="button" className="btn-success" onClick={() => abrirModal("actualizar")}>
            Actualizar
          </button>
        </div>

        <div className="a-noticia">
          <h6>¿Deseas eliminar alguna Multa?</h6>
          <hr />
          <div className="radio-group">
            <label className="container">
              Sí
              <input name="opcion2" type="radio" />
              <div className="checkmark"></div>
            </label>
            <label className="container">
              No
              <input name="opcion2" checked type="radio" />
              <div className="checkmark"></div>
            </label>
          </div>
          <hr />
          <label className="form-label">ID de la multa</label>
          <input type="text" placeholder="#12345" className="input" />
          <hr />
          <button type="button" className="btn-danger" onClick={() => abrirModal("eliminar")}>
            Eliminar
          </button>
        </div>
      </div>

      <div
        id="modalOverlay"
        style={{
          display: modalOpen ? "flex" : "none",
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 9999,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="card">
          <div className="header">
            <div className="image">
              <svg aria-hidden="true" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                ></path>
              </svg>
            </div>
            <div className="content">
              <span className="title">{modalContent.title}</span>
              <p className="message">{modalContent.message}</p>
            </div>
            <div className="actions">
              <button className="desactivate" type="button" onClick={handleConfirm}>
                {modalContent.confirmText}
              </button>
              <button className="cancel" type="button" onClick={cerrarModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Multas