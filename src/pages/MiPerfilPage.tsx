import { Button, Card, Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import {
  obtenerPostsPorUsuario,
  getPostComments,
} from "../services/PostService";
import type { Post } from "../types/post";

type PostConComentarios = Post & {
  commentsCount: number;
};

export function MiPerfilPage() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [posts, setPosts] = useState<PostConComentarios[]>([]);

  useEffect(() => {
    if (!user) return;

    async function cargarPosts() {
      try {
        const postsUsuario = await obtenerPostsPorUsuario(user!.id);

        const postsConComentarios = await Promise.all(
          postsUsuario.map(async (post: Post) => {
            const comments = await getPostComments(post.id.toString()).catch(
              () => [],
            );

            return {
              ...post,
              commentsCount: comments.length,
            };
          }),
        );

        setPosts(postsConComentarios);
      } catch (error) {
        console.error(error);
      }
    }

    cargarPosts();
  }, [user]);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <Container className="py-5">
      <h2>Mi Perfil</h2>

      <p>
        <strong>Nick:</strong> {user?.nickName}
      </p>

      <Button variant="danger" onClick={handleLogout}>
        Cerrar sesión
      </Button>

      <Button className="ms-2" onClick={() => navigate("/crear-post")}>
        Crear publicación
      </Button>

      <hr />

      <h4>Mis publicaciones</h4>

      {posts.length === 0 ? (
        <p>Todavía no tenés publicaciones.</p>
      ) : (
        posts.map((post) => (
          <Card key={post.id} className="profile-post-card mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-3">{post.description}</h5>

                  <p className="text-secondary mb-2">
                    💬 Comentarios: {post.commentsCount}
                  </p>
                </div>

                <Link to={`/post/${post.id}`}>
                  <Button variant="outline-primary">Ver más →</Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
}
