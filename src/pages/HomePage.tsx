import { useEffect, useState } from "react";
import { Container, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPosts } from "../services/PostService";
import type { Post } from "../types/post";
import { PostCard } from "../components/PostCard";

export function HomePage() {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getPosts();
        const sortedPosts = [...data].sort((a, b) => b.id - a.id);
        setPosts(sortedPosts);
      } catch (err) {
        setError("No se pudieron cargar las publicaciones recientes.");
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

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

      {!isAuthenticated && (
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8">
            <div className="hero-card rounded-4 p-4 shadow-glow">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                <div>
                  <h3 className="fw-bold text-white">Bienvenido a tu nuevo espacio social</h3>
                  <p className="text-white-50 mb-3">
                    Regístrate o inicia sesión para participar en la comunidad.
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
            </div>
          </div>
        </div>
      )}

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="text-white fw-bold mb-0">Publicaciones Recientes</h4>
          </div>
          
          {loading && (
            <div className="text-center py-5">
              <Spinner animation="border" variant="light" />
              <p className="text-white-50 mt-3">Cargando publicaciones...</p>
            </div>
          )}

          {error && <Alert variant="danger" className="rounded-4">{error}</Alert>}

          {!loading && !error && posts.length === 0 && (
            <div className="text-center text-white-50 py-5 bg-soft rounded-4">
              <i className="bi bi-journal-x display-1 mb-3 d-block"></i>
              <p className="lead">No hay publicaciones para mostrar.</p>
              <p>¡Sé el primero en publicar algo interesante!</p>
            </div>
          )}

          {!loading && !error && posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </Container>
  );
}
