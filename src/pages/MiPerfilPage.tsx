import {
  Button,
  Card,
  Container,
} from "react-bootstrap";
import {
  useEffect,
  useState,
} from "react";
import {
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { obtenerPostsPorUsuario } from "../services/PostService";
import type { Post } from "../types/post";

export function MiPerfilPage() {
  const { user, logout } =
    useAuth();

  const navigate = useNavigate();

  const [posts, setPosts] =
    useState<Post[]>([]);

  useEffect(() => {
    if (!user) return;

    obtenerPostsPorUsuario(user.id)
      .then(setPosts)
      .catch(console.error);
  }, [user]);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <Container className="py-5">
      <h2>Mi Perfil</h2>

      <p>
        <strong>Nick:</strong>{" "}
        {user?.nickName}
      </p>

      <Button
        variant="danger"
        onClick={handleLogout}
      >
        Cerrar sesión
      </Button>

      <Button
        className="ms-2"
        onClick={() =>
          navigate(
            "/crear-post"
          )
        }
      >
        Crear publicación
      </Button>

      <hr />

      <h4>
        Mis publicaciones
      </h4>

      {posts.map((post) => (
        <Card
          key={post.id}
          className="mb-3"
        >
          <Card.Body>
            <Card.Text>
              {
                post.description
              }
            </Card.Text>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}
