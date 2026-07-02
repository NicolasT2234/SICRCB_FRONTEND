import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../assets/css/styles.css"
import "../assets/css/multas.css"
import "../assets/css/pqrs.css"
import NavbarApp from "../components/NavbarApp.jsx"
import ConfirmModal from "../components/ConfirmModal.jsx"

function Pqrs() {
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

  const abrirModal = (tipo) => {
    const config = {
      actualizar: {
        title: "Actualizar estado de PQR",
        message:
          "¿Estás seguro de que deseas cambiar el estado? Esta acción modificará el registro permanentemente.",
        confirmText: "Actualizar",
      },
      eliminar: {
        title: "Eliminar PQR",
        message:
          "¿Estás seguro de que deseas eliminar este registro? Todos los datos serán eliminados permanentemente. Esta acción no se puede deshacer.",
        confirmText: "Eliminar",
      },
      cerrarSesion: {
        title: "Cerrar sesión",
        message: "¿Estás seguro de que deseas cerrar sesión?",
        confirmText: "Cerrar sesión",
      },
    }

    setModalContent(config[tipo] || { title: "", message: "", confirmText: "" })
    setModalType(tipo)
    setModalOpen(true)
  }

  const cerrarModal = () => {
    setModalOpen(false)
  }

  const handleConfirm = () => {
    if (modalType === "actualizar") {
      cerrarModal()
      alert("Estado de PQR actualizado correctamente")
    } else if (modalType === "eliminar") {
      cerrarModal()
      alert("PQR eliminado")
    } else if (modalType === "cerrarSesion") {
      cerrarModal()
      handleLogout()
    }
  }

  return (
    <div className="pqrs-page">
      <NavbarApp onLogout={handleLogout} />

      <h1>PQR</h1>

      <div className="grid-noticias">
        <div className="a-noticia">
          <legend>Registrar PQR</legend>
          <hr />
          <label className="form-label">Documento adjunto</label>
          <input type="file" className="input" />
          <hr />
          <label className="form-label">Fecha de envío</label>
          <input type="datetime-local" className="input" />
          <hr />
          <button type="button" className="btn-success" onClick={() => alert("PQR registrada correctamente")}>
            Agregar
          </button>
          <p><i>Recuerda que el PQR genera un ID al momento de ser registrado</i></p>
        </div>

        <div className="a-noticia">
          <h6>¿Deseas buscar un PQR?</h6>
          <hr />
          <label className="form-label">Agrega el ID de la PQR para buscarla</label>
          <hr />
          <input type="text" placeholder="#12345" className="input" />
          <hr />
          <button type="button" className="btn-success" onClick={() => alert("Buscando PQR...")}>
            Buscar
          </button>
        </div>

        <div className="a-noticia">
          <h6>¿Deseas cambiar el estado del PQR?</h6>
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
          <label className="form-label">ID de la PQR</label>
          <input type="text" placeholder="#12345" className="input" />
          <hr />
          <label className="form-label">Nuevo estado del PQR</label>
          <input type="text" className="input" />
          <hr />
          <button type="button" className="btn-success" onClick={() => abrirModal("actualizar")}>
            Actualizar
          </button>
        </div>

        <div className="a-noticia">
          <h6>¿Deseas eliminar algún PQR?</h6>
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
          <label className="form-label">ID de la PQR</label>
          <input type="text" placeholder="#12345" className="input" />
          <hr />
          <button type="button" className="btn-danger" onClick={() => abrirModal("eliminar")}>
            Eliminar
          </button>
        </div>
      </div>

      {modalOpen && (
        <ConfirmModal
          show={modalOpen}
          title={modalContent.title}
          message={modalContent.message}
          confirmText={modalContent.confirmText}
          onConfirm={handleConfirm}
          onCancel={cerrarModal}
        />
      )}
    </div>
  )
}

export default Pqrs