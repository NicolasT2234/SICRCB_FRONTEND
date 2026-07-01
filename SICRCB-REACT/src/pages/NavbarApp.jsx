import { Navbar, Container, Nav, Form } from "react-bootstrap"
import { useNavigate, useLocation } from "react-router-dom"
import logo from "../assets/img/Logo_SICRCB.png"
import "../assets/css/NavbarApp.css"

function NavbarApp({ onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location.pathname === path
  const handleLogout = onLogout || (() => navigate("/login"))

  const handleSearchSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <Navbar expand="lg" className="sicrcb-navbar">
      <Container fluid>
        <Navbar.Brand href="#" onClick={() => navigate("/dashboard")}>
          <img src={logo} alt="Logo" width="30" height="24" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarSupportedContent" />
        <Navbar.Collapse id="navbarSupportedContent">
          <Nav className="me-auto mb-2 mb-lg-0">
            <Nav.Link
              className={isActive("/multas") ? "active" : ""}
              onClick={() => navigate("/multas")}
            >
              Multas
            </Nav.Link>
            <Nav.Link
              className={isActive("/noticias") ? "active" : ""}
              onClick={() => navigate("/noticias")}
            >
              Noticias
            </Nav.Link>
            <Nav.Link
              className={isActive("/alquiler") ? "active" : ""}
              onClick={() => navigate("/alquiler")}
            >
              Alquiler
            </Nav.Link>
            <Nav.Link
              className={isActive("/pqrs") ? "active" : ""}
              onClick={() => navigate("/pqrs")}
            >
              PQRS
            </Nav.Link>
            <Nav.Link
              className={isActive("/perfil") ? "active" : ""}
              onClick={() => navigate("/perfil")}
            >
              Perfil
            </Nav.Link>
            <Nav.Link onClick={handleLogout}>Cerrar Sesion</Nav.Link>
          </Nav>
          <Form className="d-flex" role="search" onSubmit={handleSearchSubmit}>
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavbarApp