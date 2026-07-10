import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import "../assets/css/styles.css"
import "../assets/css/alquiler.css"
import NavbarApp from "../components/NavbarApp.jsx"

function Alquiler() {

  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const [formData, setFormData] = useState({
    nombreSolicitante: "",
    tipoAlquiler: "",
    cantidadSillas: "",
    fechaInicio: "",
    fechaFin: ""
  })

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [searchId, setSearchId] = useState("")
  const [searchDate, setSearchDate] = useState("")
  const [searchResult, setSearchResult] = useState(null)
  const [loading, setLoading] = useState(false)

  // Confirmación "¿Deseas actualizar una reserva?" -> Si/No (por defecto No)
  const [confirmUpdate, setConfirmUpdate] = useState(false)
  const [updateId, setUpdateId] = useState("")
  const [updateData, setUpdateData] = useState({
    tipoAlquiler: "",
    cantidadSillas: "",
    fechaInicio: "",
    fechaFin: ""
  })
  const [updateSuccess, setUpdateSuccess] = useState("")
  const [updateError, setUpdateError] = useState("")

  // Confirmación "¿Deseas eliminar una reserva?" -> Si/No (por defecto No)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleteId, setDeleteId] = useState("")
  const [deleteSuccess, setDeleteSuccess] = useState("")
  const [deleteError, setDeleteError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess("")
    setError("")

    if (!formData.nombreSolicitante || !formData.tipoAlquiler || !formData.fechaInicio || !formData.fechaFin) {
      setError("Complete todos los campos obligatorios")
      return
    }

    try {
      const res = await api.post("/reservas", {
        nombreSolicitante: formData.nombreSolicitante,
        tipoAlquiler: formData.tipoAlquiler,
        cantidadSillas: formData.cantidadSillas,
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin
      })

      const id = res.data && (res.data.id || res.data._id || res.data.idReserva)
      const createdId = id || (typeof res.data === "object" ? res.data.userId || res.data.id || res.data._id : null)
      setSuccess(createdId ? `Reserva generada con éxito (ID: ${createdId})` : "Reserva generada con éxito")

      setFormData({ nombreSolicitante: "", tipoAlquiler: "", cantidadSillas: "", fechaInicio: "", fechaFin: "" })
    } catch (err) {
      console.error("Error creating reservation:", err)
      const serverMsg = err.response?.data?.message || err.response?.data || err.message
      setError(typeof serverMsg === "string" ? serverMsg : JSON.stringify(serverMsg))
    }
  }

  const handleSearch = async () => {
    setSearchResult(null)
    setError("")
    setLoading(true)
    try {
      let res
      if (searchId && searchId.trim() !== "") {

        res = await api.get(`/reservas/${encodeURIComponent(searchId)}`)
      } else if (searchDate) {

        res = await api.get(`/reservas`, { params: { date: searchDate } })
      } else {
        setError("Ingrese ID o fecha para buscar")
        setLoading(false)
        return
      }

      setSearchResult(res.data)
    } catch (err) {
      setError("No se encontró la reserva. Verifica el ID o la fecha e intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    setUpdateSuccess("")
    setUpdateError("")

    if (!confirmUpdate) {
      setUpdateError("Confirma que deseas actualizar una reserva seleccionando 'Si'")
      return
    }

    if (!updateId.trim()) {
      setUpdateError("Ingrese el ID de la reserva para actualizar")
      return
    }

    const payload = {}
    if (updateData.tipoAlquiler) payload.tipoAlquiler = updateData.tipoAlquiler
    if (updateData.cantidadSillas) payload.cantidadSillas = updateData.cantidadSillas
    if (updateData.fechaInicio) payload.fechaInicio = updateData.fechaInicio
    if (updateData.fechaFin) payload.fechaFin = updateData.fechaFin

    if (Object.keys(payload).length === 0) {
      setUpdateError("Ingrese al menos un campo para actualizar")
      return
    }

    try {
      const res = await api.put(`/reservas/${encodeURIComponent(updateId)}`, payload)
      const id = res.data && (res.data.id || res.data._id || res.data.idReserva)
      setUpdateSuccess(id ? `Reserva actualizada correctamente (ID: ${id})` : "Reserva actualizada correctamente")
      setUpdateId("")
      setUpdateData({ tipoAlquiler: "", cantidadSillas: "", fechaInicio: "", fechaFin: "" })
    } catch (err) {
      console.error("Error updating reservation:", err)
      const serverMsg = err.response?.data?.message || err.response?.data || err.message
      setUpdateError(typeof serverMsg === "string" ? serverMsg : JSON.stringify(serverMsg))
    }
  }

  const handleDelete = async () => {
    setDeleteSuccess("")
    setDeleteError("")

    if (!confirmDelete) {
      setDeleteError("Confirma que deseas eliminar una reserva seleccionando 'Si'")
      return
    }

    if (!deleteId.trim()) {
      setDeleteError("Ingrese el ID de la reserva para eliminar")
      return
    }

    try {
      await api.delete(`/reservas/${encodeURIComponent(deleteId)}`)
      setDeleteSuccess("Reserva eliminada correctamente")
      setDeleteId("")
    } catch (err) {
      console.error("Error deleting reservation:", err)
      const serverMsg = err.response?.data?.message || err.response?.data || err.message
      setDeleteError(typeof serverMsg === "string" ? serverMsg : JSON.stringify(serverMsg))
    }
  }

  return (
    <>
      <NavbarApp onLogout={handleLogout} />
      <div className="alquiler-page">
        <div className="titulo">
          <h1>ALQUILER</h1>
        </div>

        <div className="subtitulo">
          <span className="subtitulo-banda">Salón Comunal y Sillas</span>
        </div>

        <div className="grid-noticias">
          <form className="a-noticia" onSubmit={handleSubmit}>
            <legend>Nueva Reserva</legend>
            <hr />
            <label className="form-label">Nombre del solicitante</label>
            <input type="text" placeholder="Ej: Juan Pérez" className="input" value={formData.nombreSolicitante} onChange={(e) => setFormData({...formData, nombreSolicitante: e.target.value})} />
            <hr />
            <label className="form-label">Tipo de alquiler</label>
            <select className="input" required value={formData.tipoAlquiler} onChange={(e) => setFormData({...formData, tipoAlquiler: e.target.value})}>
              <option value="">Seleccionar...</option>
              <option value="salon">Salón Comunal</option>
              <option value="sillas">Sillas</option>
              <option value="ambos">Salón + Sillas</option>
            </select>
            <hr />
            <label className="form-label">Cantidad de sillas</label>
            <input type="number" placeholder="Ej: 20" min="1" className="input" value={formData.cantidadSillas} onChange={(e) => setFormData({...formData, cantidadSillas: e.target.value})} />
            <hr />
            <label className="form-label">Fecha y hora de inicio</label>
            <input type="datetime-local" className="input" required value={formData.fechaInicio} onChange={(e) => setFormData({...formData, fechaInicio: e.target.value})} />
            <hr />
            <label className="form-label">Fecha y hora de fin</label>
            <input type="datetime-local" className="input" required value={formData.fechaFin} onChange={(e) => setFormData({...formData, fechaFin: e.target.value})} />
            <hr />
            <button type="submit" className="btn-success">Reservar</button>
            {success && <p className="success">{success}</p>}
            {error && <p className="error">{error}</p>}
            <p><i>La reserva genera un ID al ser registrada</i></p>
          </form>

          <div className="a-noticia">
            <h6>¿Deseas buscar una reserva?</h6>
            <hr />
            <label className="form-label">ID de la reserva</label>
            <input type="text" placeholder="#12345" className="input" value={searchId} onChange={(e) => setSearchId(e.target.value)} />
            <hr />
            <label className="form-label">O buscar por fecha</label>
            <input type="date" className="input" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
            <hr />
            <button type="button" onClick={handleSearch}>Buscar</button>
            {loading && <p>Buscando...</p>}
            {error && <p className="error">{error}</p>}
            {searchResult && (
              <div className="search-result">
                <p>ID: {searchResult.id || searchResult._id}</p>
                <p>Solicitante: {searchResult.nombreSolicitante}</p>
                <p>Tipo: {searchResult.tipoAlquiler}</p>
                <p>Fecha inicio: {searchResult.fechaInicio}</p>
                <p>Fecha fin: {searchResult.fechaFin}</p>
              </div>
            )}
          </div>

          <div className="a-noticia">
            <h6>¿Deseas actualizar una reserva?</h6>
            <hr />
            <div className="radio-group">
              <label className="container">
                Si
                <input name="opcion1" type="radio" checked={confirmUpdate} onChange={() => setConfirmUpdate(true)} />
                <div className="checkmark"></div>
              </label>
              <label className="container">
                No
                <input name="opcion1" type="radio" checked={!confirmUpdate} onChange={() => setConfirmUpdate(false)} />
                <div className="checkmark"></div>
              </label>
            </div>
            <hr />
            <label className="form-label">ID de la reserva</label>
            <input type="text" placeholder="#12345" className="input" disabled={!confirmUpdate} value={updateId} onChange={(e) => setUpdateId(e.target.value)} />
            <hr />
            <label className="form-label">Nuevo tipo de alquiler</label>
            <select className="input" disabled={!confirmUpdate} value={updateData.tipoAlquiler} onChange={(e) => setUpdateData({...updateData, tipoAlquiler: e.target.value})}>
              <option value="">Seleccionar...</option>
              <option value="salon">Salón Comunal</option>
              <option value="sillas">Sillas</option>
              <option value="ambos">Salón + Sillas</option>
            </select>
            <hr />
            <label className="form-label">Nueva cantidad de sillas</label>
            <input type="number" placeholder="Ej: 20" min="1" className="input" disabled={!confirmUpdate} value={updateData.cantidadSillas} onChange={(e) => setUpdateData({...updateData, cantidadSillas: e.target.value})} />
            <hr />
            <label className="form-label">Nueva fecha y hora de inicio</label>
            <input type="datetime-local" className="input" disabled={!confirmUpdate} value={updateData.fechaInicio} onChange={(e) => setUpdateData({...updateData, fechaInicio: e.target.value})} />
            <hr />
            <label className="form-label">Nueva fecha y hora de fin</label>
            <input type="datetime-local" className="input" disabled={!confirmUpdate} value={updateData.fechaFin} onChange={(e) => setUpdateData({...updateData, fechaFin: e.target.value})} />
            <hr />
            <button type="button" className="btn-success" disabled={!confirmUpdate} onClick={handleUpdate}>Actualizar</button>
            {updateSuccess && <p className="success">{updateSuccess}</p>}
            {updateError && <p className="error">{updateError}</p>}
          </div>

          <div className="a-noticia">
            <h6>¿Deseas eliminar una reserva?</h6>
            <hr />
            <div className="radio-group">
              <label className="container">
                Si
                <input name="opcion2" type="radio" checked={confirmDelete} onChange={() => setConfirmDelete(true)} />
                <div className="checkmark"></div>
              </label>
              <label className="container">
                No
                <input name="opcion2" type="radio" checked={!confirmDelete} onChange={() => setConfirmDelete(false)} />
                <div className="checkmark"></div>
              </label>
            </div>
            <hr />
            <label className="form-label">ID de la reserva</label>
            <input type="text" placeholder="#12345" className="input" disabled={!confirmDelete} value={deleteId} onChange={(e) => setDeleteId(e.target.value)} />
            <hr />
            <button type="button" className="btn-danger" disabled={!confirmDelete} onClick={handleDelete}>Eliminar</button>
            {deleteSuccess && <p className="success">{deleteSuccess}</p>}
            {deleteError && <p className="error">{deleteError}</p>}
          </div>
        </div>
      </div>
    </>
  )
}

export default Alquiler