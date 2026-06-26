import { Button, Card, Container, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function MiPerfilPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <Container className="py-5">
      <Card className="mx-auto profile-card rounded-4 p-4 shadow-glow" style={{ maxWidth: "720px" }}>
        <Card.Body>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
            <div>
              <Card.Title className="fw-bold mb-1">Mi perfil</Card.Title>
              <Card.Subtitle className="text-white-50">
                Información de usuario y acceso rápido.
              </Card.Subtitle>
            </div>
            <Button variant="outline-light" size="sm" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </div>

          <div className="row gx-4 gy-4">
            <div className="col-md-5">
              <div className="bg-soft rounded-4 p-4 h-100">
                <h6 className="text-accent">Datos del perfil</h6>
                <ListGroup variant="flush">
                  <ListGroup.Item className="bg-transparent text-white border-0 px-0 py-2">
                    <strong>Nick Name:</strong> {user?.nickName}
                  </ListGroup.Item>
                  {user?.email && (
                    <ListGroup.Item className="bg-transparent text-white border-0 px-0 py-2">
                      <strong>Email:</strong> {user.email}
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </div>
            </div>
            <div className="col-md-7">
              <div className="bg-soft rounded-4 p-4 h-100">
                <h6 className="text-accent">Bienvenido de nuevo</h6>
                <p className="text-white-50">
                  Aquí podrás ver tus publicaciones, amigos y actividad de la comunidad.
                </p>
                <div className="mt-3">
                  <Button variant="brand" className="btn-brand me-2">
                    Ver publicaciones
                  </Button>
                  <Button variant="outline-light">Editar perfil</Button>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
