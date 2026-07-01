import { Button, Card, Container, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import {
  obtenerPostsPorUsuario,
  getPostComments,
  eliminarPost,
} from "../services/PostService";
import type { Post } from "../types/post";

type PostConComentarios = Post & {
  commentsCount: number;
};

export function MiPerfilPage() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [posts, setPosts] = useState<PostConComentarios[]>([]);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

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

  const canManagePosts = Boolean(user);

  async function handleDeletePost(postId: number) {
    try {
      await eliminarPost(postId);
    } catch (error) {
      console.error(error);
    } finally {
      setPosts((prev) => prev.filter((post) => post.id !== postId));
      setPostToDelete(null);
    }
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

                <div className="d-flex flex-wrap gap-2 justify-content-end ms-auto">
                  {canManagePosts && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="rounded-pill px-3"
                      onClick={() => setPostToDelete(post.id)}
                    >
                      Borrar post
                    </Button>
                  )}
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="rounded-pill px-3"
                    onClick={() => navigate(`/post/${post.id}`)}
                  >
                    Ver más →
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))
      )}

      <Modal show={postToDelete !== null} onHide={() => setPostToDelete(null)} centered>
        <Modal.Body className="bg-soft rounded-4 border-0 p-4 text-white">
          <h5 className="mb-3">¿Borrar esta publicación?</h5>
          <p className="text-white-50 mb-4">Esta acción no se puede deshacer.</p>
          <div className="d-flex justify-content-end gap-2">
            <Button variant="outline-light" onClick={() => setPostToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={() => postToDelete && handleDeletePost(postToDelete)}>
              Borrar
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
