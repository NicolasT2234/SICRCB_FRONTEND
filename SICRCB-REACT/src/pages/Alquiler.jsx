import "../assets/css/styles.css"
import "../assets/css/alquiler.css"
import NavbarApp from "../components/NavbarApp.jsx"
import { useNavigate } from "react-router-dom"

function Alquiler() {
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="alquiler-page">
      <NavbarApp onLogout={handleLogout} />

      <h1>ALQUILER</h1>

      <div className="subtitulo">
        <span className="subtitulo-banda">Salón Comunal y Sillas</span>
      </div>

      <div className="grid-noticias">
        <div className="a-noticia">
          <legend>Nueva Reserva</legend>
          <hr />
          <label className="form-label">Nombre del solicitante</label>
          <input type="text" placeholder="Ej: Juan Pérez" className="input" />
          <hr />
          <label className="form-label">Tipo de alquiler</label>
          <select className="input" required>
            <option value="">Seleccionar...</option>
            <option value="salon">Salón Comunal</option>
            <option value="sillas">Sillas</option>
            <option value="ambos">Salón + Sillas</option>
          </select>
          <hr />
          <label className="form-label">Cantidad de sillas</label>
          <input type="number" placeholder="Ej: 20" min="1" className="input" />
          <hr />
          <label className="form-label">Fecha y hora de inicio</label>
          <input type="datetime-local" className="input" required />
          <hr />
          <label className="form-label">Fecha y hora de fin</label>
          <input type="datetime-local" className="input" required />
          <hr />
          <button type="button" className="btn-success">Reservar</button>
          <p><i>La reserva genera un ID al ser registrada</i></p>
        </div>

        <div className="a-noticia">
          <h6>¿Deseas buscar una reserva?</h6>
          <hr />
          <label className="form-label">ID de la reserva</label>
          <input type="text" placeholder="#12345" className="input" />
          <hr />
          <label className="form-label">O buscar por fecha</label>
          <input type="date" className="input" />
          <hr />
          <button type="button" className="btn-success" onClick={() => alert("Buscando reserva...")}>Buscar</button>
        </div>

        <div className="a-noticia">
          <h6>¿Deseas actualizar una reserva?</h6>
          <hr />
          <div className="radio-group">
            <label className="container">
              Si
              <input name="opcion1" type="radio" />
              <div className="checkmark"></div>
            </label>
            <label className="container">
              No
              <input name="opcion1" defaultChecked type="radio" />
              <div className="checkmark"></div>
            </label>
          </div>
          <hr />
          <label className="form-label">ID de la reserva</label>
          <input type="text" placeholder="#12345" className="input" />
          <hr />
          <label className="form-label">Nuevo tipo de alquiler</label>
          <select className="input">
            <option value="">Seleccionar...</option>
            <option value="salon">Salón Comunal</option>
            <option value="sillas">Sillas</option>
            <option value="ambos">Salón + Sillas</option>
          </select>
          <hr />
          <label className="form-label">Nueva fecha y hora de inicio</label>
          <input type="datetime-local" className="input" />
          <hr />
          <label className="form-label">Nueva fecha y hora de fin</label>
          <input type="datetime-local" className="input" />
          <hr />
          <button type="button" className="btn-success" onClick={() => alert("Actualizar reserva")}>Actualizar</button>
        </div>

        <div className="a-noticia">
          <h6>¿Deseas eliminar una reserva?</h6>
          <hr />
          <div className="radio-group">
            <label className="container">
              Si
              <input name="opcion2" type="radio" />
              <div className="checkmark"></div>
            </label>
            <label className="container">
              No
              <input name="opcion2" defaultChecked type="radio" />
              <div className="checkmark"></div>
            </label>
          </div>
          <hr />
          <label className="form-label">ID de la reserva</label>
          <input type="text" placeholder="#12345" className="input" />
          <hr />
          <button type="button" className="btn-danger" onClick={() => alert("Eliminar reserva")}>Eliminar</button>
        </div>
      </div>
    </div>
  )
}

export default Alquiler