import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../assets/css/styles.css"
import "../assets/css/noticias.css"
import NavbarApp from "../components/NavbarApp.jsx"

function Noticias() {
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    confirmText: "",
  })

  const abrirModal = (tipo) => {
    const config = {
      actualizar: {
        title: "Actualizar noticia",
        message:
          "¿Estás seguro de que deseas actualizar esta noticia? Esta acción modificará el registro permanentemente.",
        confirmText: "Actualizar",
      },
      eliminar: {
        title: "Eliminar noticia",
        message:
          "¿Estás seguro de que deseas eliminar esta noticia? Todos los datos serán eliminados permanentemente. Esta acción no se puede deshacer.",
        confirmText: "Eliminar",
      },
    }

    setModalContent(config[tipo] || { title: "", message: "", confirmText: "" })
    setModalOpen(true)
  }

  const cerrarModal = () => {
    setModalOpen(false)
  }

  const handleConfirm = () => {
    if (modalContent.confirmText === "Actualizar") {
      cerrarModal()
      alert("Noticia actualizada correctamente")
    } else if (modalContent.confirmText === "Eliminar") {
      cerrarModal()
      alert("Noticia eliminada")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="noticias-page">
      <NavbarApp onLogout={handleLogout} />
      <h1>NOTICIAS</h1>

      <div className="grid-noticias">
        <div className="a-noticia">
          <legend>Agregar Noticia</legend>
          <hr />
          <label className="form-label">Archivo de la noticia</label>
          <input type="file" className="input" />
          <hr />
          <label className="form-label">Fecha de publicación</label>
          <input type="datetime-local" className="input" />
          <hr />
          <button type="button" className="btn-success" onClick={() => alert("Noticia publicada correctamente")}>
            Publicar
          </button>
          <p>
            <i>Recuerda que la noticia genera un ID a la hora de ser publicada</i>
          </p>
        </div>

        <div className="a-noticia">
          <h6>¿Deseas buscar una noticia?</h6>
          <hr />
          <label className="form-label">Agrega el ID de la noticia para buscarla</label>
          <hr />
          <input type="text" placeholder="#12345" className="input" />
          <hr />
          <button type="button" className="btn-success" onClick={() => alert("Buscando noticia...")}>
            Buscar
          </button>
        </div>

        <div className="a-noticia">
          <h6>¿Deseas actualizar alguna noticia?</h6>
          <hr />
          <div className="radio-group">
            <label className="container">
              Si
              <input name="opcion1" type="radio" />
              <div className="checkmark" />
            </label>
            <label className="container">
              No
              <input name="opcion1" defaultChecked type="radio" />
              <div className="checkmark" />
            </label>
          </div>
          <hr />
          <label className="form-label">ID de la noticia</label>
          <input type="text" placeholder="#12345" className="input" />
          <hr />
          <label className="form-label">Nuevo archivo de la noticia</label>
          <input type="file" className="input" />
          <hr />
          <button type="button" className="btn-success" onClick={() => abrirModal("actualizar")}>
            Actualizar
          </button>
        </div>

        <div className="a-noticia">
          <h6>¿Deseas eliminar alguna noticia?</h6>
          <hr />
          <div className="radio-group">
            <label className="container">
              Si
              <input name="opcion2" type="radio" />
              <div className="checkmark" />
            </label>
            <label className="container">
              No
              <input name="opcion2" defaultChecked type="radio" />
              <div className="checkmark" />
            </label>
          </div>
          <hr />
          <label className="form-label">ID de la noticia</label>
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

export default Noticias