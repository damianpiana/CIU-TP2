import { useEffect, useState } from "react";
import { Container, Spinner, Alert, Form, Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPosts, obtenerTags, getPostComments } from "../services/PostService";
import type { Post, Tag } from "../types/post";
import { PostCard } from "../components/PostCard";

export function HomePage() {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedTag, setSelectedTag] = useState<number | "">("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "most_commented">("newest");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const [postsData, tagsData] = await Promise.all([getPosts(), obtenerTags()]);
        
        // Obtener cantidad de comentarios de cada post para poder ordenar
        const postsWithComments = await Promise.all(
          postsData.map(async (post) => {
            try {
              const comments = await getPostComments(post.id.toString());
              return { ...post, commentsCount: comments.length };
            } catch (e) {
              return { ...post, commentsCount: 0 };
            }
          })
        );

        setPosts(postsWithComments);
        setTags(tagsData);
      } catch (err) {
        setError("No se pudieron cargar las publicaciones recientes.");
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // Lógica de filtrado y ordenamiento combinados
  let filteredPosts = [...posts];

  if (selectedTag !== "") {
    filteredPosts = filteredPosts.filter(p => 
      p.Tags?.some(t => t.id === Number(selectedTag)) || 
      p.tags?.some((t: any) => t.id === Number(selectedTag) || t === tags.find(x => x.id === Number(selectedTag))?.name)
    );
  }

  if (sortBy === "newest") {
    filteredPosts.sort((a, b) => b.id - a.id);
  } else if (sortBy === "oldest") {
    filteredPosts.sort((a, b) => a.id - b.id);
  } else if (sortBy === "most_commented") {
    filteredPosts.sort((a, b) => (b.commentsCount || 0) - (a.commentsCount || 0));
  }

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

          <OverlayTrigger
            placement="top"
            overlay={!isAuthenticated ? <Tooltip>Inicia sesión para utilizar los filtros</Tooltip> : <></>}
          >
            <div className={`bg-soft p-3 rounded-4 mb-4 ${!isAuthenticated ? 'opacity-50' : ''}`}>
              <Row>
                <Col md={6} className="mb-2 mb-md-0">
                  <Form.Label className="text-white small fw-bold">Filtrar por Tag</Form.Label>
                  <Form.Select 
                    disabled={!isAuthenticated}
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value === "" ? "" : Number(e.target.value))}
                  >
                    <option value="">Todos los tags</option>
                    {tags.map(tag => (
                      <option key={tag.id} value={tag.id}>{tag.name}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={6}>
                  <Form.Label className="text-white small fw-bold">Ordenar por</Form.Label>
                  <Form.Select 
                    disabled={!isAuthenticated}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                  >
                    <option value="newest">Más recientes</option>
                    <option value="oldest">Más antiguos</option>
                    <option value="most_commented">Más comentados</option>
                  </Form.Select>
                </Col>
              </Row>
            </div>
          </OverlayTrigger>
          
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

          {!loading && !error && filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </Container>
  );
}
