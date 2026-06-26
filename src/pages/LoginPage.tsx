import { useState } from "react";
import { Alert, Button, Card, Container, Form, Spinner } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [nickName, setNickName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const resultado = await login({
        nickName,
        password,
      });

      if (resultado.success) {
        navigate("/mi-perfil");
      } else {
        setError(resultado.error || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("Error inesperado al conectar con el servidor");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  if (isAuthenticated) {
    return <Navigate to="/mi-perfil" replace />;
  }

  return (
    <Container className="py-5">
      <div className="text-center text-white mb-4">
        <p className="small text-accent mb-2">Bienvenido de nuevo</p>
        <h2 className="fw-bold">Inicia sesión en tu cuenta</h2>
        <p className="text-white-50 mb-0">Ingresa tus datos y vuelve a la comunidad de UNAHUR.</p>
      </div>

      <Card className="mx-auto auth-card rounded-4 p-4" style={{ maxWidth: "480px" }}>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold text-white">Nick Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresá tu nick name"
                value={nickName}
                onChange={(event) => setNickName(event.target.value)}
                disabled={isLoading}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold text-white">Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingresá tu contraseña"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isLoading}
                required
              />
              <Form.Text className="text-muted">Contraseña: 123456</Form.Text>
            </Form.Group>

            <Button type="submit" className="btn-brand w-100 mb-3" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Ingresando...
                </>
              ) : (
                "Ingresar"
              )}
            </Button>

            <div className="d-grid gap-2">
              <Button
                type="button"
                variant="outline-light"
                className="w-100"
                onClick={() => navigate("/registro")}
                disabled={isLoading}
              >
                ¿No tienes cuenta? Regístrate
              </Button>
              <Button
                type="button"
                variant="link"
                className="text-white text-decoration-none"
                onClick={() => navigate("/")}
                disabled={isLoading}
              >
                Volver al inicio
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
