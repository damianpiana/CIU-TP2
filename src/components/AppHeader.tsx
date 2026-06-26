import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function AppHeader() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="mb-4">
      <nav className="navbar navbar-expand-lg navbar-dark navbar-glass sticky-top py-3">
        <div className="container">
          <Link className="navbar-brand brand-title text-white" to="/">
            UnaHur <span className="text-accent">Anti-Social</span>
          </Link>

          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#basic-navbar-nav"
            aria-controls="basic-navbar-nav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="basic-navbar-nav">
            <div className="navbar-nav ms-auto align-items-lg-center nav-links-header">
              <Link className="nav-link text-white" to="/">
                Inicio
              </Link>

              {isAuthenticated ? (
                <>
                  <Link className="nav-link text-white" to="/mi-perfil">
                    Perfil ({user?.nickName})
                  </Link>
                  <button
                    className="nav-link btn btn-link text-decoration-none text-white"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link className="nav-link text-white" to="/login">
                    Iniciar sesión
                  </Link>
                  <Link className="nav-link text-white" to="/registro">
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
