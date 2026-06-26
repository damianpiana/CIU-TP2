import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold hero-title">UnaHur Anti-Social Net</h1>
        <div className="bg-soft rounded-4 p-4 mx-auto" style={{ maxWidth: 760 }}>
          <p className="lead hero-text mx-auto text-white mb-0">
            La red social para estudiantes de UNAHUR. Comparte ideas, conoce compañeros y crea tu perfil con estilo.
          </p>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="hero-card rounded-4 p-4 shadow-glow">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
              <div>
                <h3 className="fw-bold text-white">Bienvenido a tu nuevo espacio social</h3>
                <p className="text-white-50 mb-3">
                  Diseñado para estudiantes de UNAHUR que quieren conectar, compartir experiencias y crear tu red.
                </p>
              </div>
              <div className="text-center">
                <Link to="/login" className="btn btn-brand me-2 mb-2">
                  Iniciar sesión
                </Link>
                <Link to="/registro" className="btn btn-outline-light mb-2">
                  Registrarme
                </Link>
              </div>
            </div>

            <div className="row mt-4 gy-3">
              <div className="col-md-4">
                <div className="p-3 rounded-4 bg-soft h-100">
                  <h6 className="text-accent">Publica</h6>
                  <p className="text-white-50 small mb-0">
                    Comparte tus ideas, anuncios y actividades universitarias.
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 rounded-4 bg-soft h-100">
                  <h6 className="text-accent">Conecta</h6>
                  <p className="text-white-50 small mb-0">
                    Encuentra compañeros, haz amigos y sigue novedades del campus.
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 rounded-4 bg-soft h-100">
                  <h6 className="text-accent">Comparte</h6>
                  <p className="text-white-50 small mb-0">
                    Comenta publicaciones, responde dudas y participa en la comunidad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
