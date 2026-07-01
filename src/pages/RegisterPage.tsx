import { useState } from "react";
import { Alert, Button, Card, Container, Form, Spinner } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  const [nickName, setNickName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  function validarFormulario(): boolean {
    const errores: string[] = [];

    if (!nickName.trim()) {
      errores.push("El nick name es requerido");
    } else if (nickName.trim().length < 3) {
      errores.push("El nick name debe tener al menos 3 caracteres");
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errores.push("Email no válido");
    }

    setValidationErrors(errores);
    return errores.length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!validarFormulario()) {
      return;
    }

    setIsLoading(true);

    try {
      const resultado = await register({
        nickName: nickName.trim(),
        email: email.trim() || undefined,
      });

      if (resultado.success) {
        setSuccess(
          "Registro exitoso. Serás redirigido a tu perfil en un momento..."
        );
        setTimeout(() => {
          navigate("/mi-perfil");
        }, 1500);
      } else {
        setError(resultado.error || "No se pudo crear el usuario");
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
        <p className="small text-accent mb-2">Únete a la red</p>
        <h2 className="fw-bold">Crea tu cuenta en UnaHur</h2>
        <p className="text-white-50 mb-0">Regístrate y comparte tus experiencias con otros estudiantes.</p>
      </div>

      <Card className="mx-auto auth-card rounded-4 p-4" style={{ maxWidth: "520px" }}>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          {validationErrors.length > 0 && (
            <Alert variant="warning">
              <ul className="mb-0">
                {validationErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold text-white">Nick Name *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresá tu nick name"
                value={nickName}
                onChange={(event) => {
                  setNickName(event.target.value);
                  setValidationErrors([]);
                }}
                disabled={isLoading}
                required
              />
              <Form.Text className="text-muted">
                Será tu nombre único en la red social.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold text-white">Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresá tu email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setValidationErrors([]);
                }}
                disabled={isLoading}
              />
            </Form.Group>

            <div className="mb-4 text-white-50">
              Nota: Tu contraseña será <strong>123456</strong> automáticamente.
            </div>

            <Button type="submit" className="btn-brand w-100 mb-3" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Registrando...
                </>
              ) : (
                "Registrarse"
              )}
            </Button>

            <div className="d-flex flex-column gap-2">
              <Button
                type="button"
                variant="outline-light"
                className="w-100"
                onClick={() => navigate("/login")}
                disabled={isLoading}
              >
                ¿Ya tienes cuenta? Inicia sesión
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
