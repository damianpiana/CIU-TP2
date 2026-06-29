import { useEffect, useState } from "react";
import { Container, Spinner, Alert, Badge, Card } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { getPostById, getPostImages, getPostComments } from "../services/PostService";
import type { Post, PostImage, Comment } from "../types/post";
import { CommentForm } from "../components/CommentForm";

export function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [images, setImages] = useState<PostImage[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = async () => {
    if (!id) return;
    try {
      const [postData, imagesData, commentsData] = await Promise.all([
        getPostById(id),
        getPostImages(id).catch(() => []), // Si fallan las imagenes, que al menos traiga el post
        getPostComments(id).catch(() => [])
      ]);
      setPost(postData);
      setImages(imagesData);
      setComments(commentsData);
    } catch (err) {
      setError("No se pudo cargar la publicación. Es posible que no exista.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="light" />
        <p className="text-white-50 mt-3">Cargando detalles de la publicación...</p>
      </Container>
    );
  }

  if (error || !post) {
    return (
      <Container className="py-5 text-center">
        <div className="bg-soft p-5 rounded-4 d-inline-block">
          <i className="bi bi-exclamation-triangle display-1 text-accent mb-3 d-block"></i>
          <h4 className="text-white mb-4">{error || "Publicación no encontrada"}</h4>
          <Link to="/" className="btn btn-outline-light rounded-pill px-4">Volver al Home</Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="mb-4">
        <Link to="/" className="text-accent text-decoration-none fw-semibold">
          <i className="bi bi-arrow-left me-2"></i>Volver al Feed
        </Link>
      </div>
      
      <Card className="bg-soft border-0 rounded-4 shadow-glow mb-5">
        <Card.Body className="p-4 p-md-5">
          <Card.Text className="fs-4 text-white mb-4" style={{ whiteSpace: 'pre-line' }}>
            {post.description}
          </Card.Text>

          {images.length > 0 && (
            <div className="row g-3 mb-4">
              {images.map(img => (
                <div className="col-12 col-md-6 col-lg-4" key={img.id}>
                  <img 
                    src={img.url} 
                    alt="Adjunto de publicación" 
                    className="img-fluid rounded-3 shadow-sm w-100" 
                    style={{ height: '300px', objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="mb-2 border-top border-secondary pt-4">
              <h6 className="text-white-50 mb-3 text-uppercase small tracking-wide">Etiquetas Relacionadas</h6>
              {post.tags.map((tag, idx) => (
                <Badge bg="dark" text="light" className="me-2 border border-secondary p-2 px-3 rounded-pill" key={idx}>
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>

      <div className="comments-section" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h4 className="text-white mb-4 border-bottom border-secondary pb-3">
          Comentarios <Badge bg="brand" className="ms-2 rounded-pill">{comments.length}</Badge>
        </h4>

        {comments.length === 0 ? (
          <div className="text-white-50 text-center py-5 bg-soft rounded-4 mb-4 border border-secondary border-opacity-25">
            <i className="bi bi-chat-square-dots fs-1 mb-2 d-block opacity-50"></i>
            Aún no hay comentarios. ¡Sé el primero en opinar!
          </div>
        ) : (
          <div className="d-flex flex-column gap-3 mb-4">
            {comments.map(comment => (
              <div key={comment.id} className="bg-soft p-3 p-md-4 rounded-4 border-start border-4 border-brand">
                <div className="d-flex justify-content-between mb-2 align-items-center">
                  <span className="text-accent fw-bold d-flex align-items-center">
                    <i className="bi bi-person-circle fs-5 me-2"></i>
                    {comment.User?.nickName ? comment.User.nickName : `Usuario #${comment.UserId || comment.userId}`}
                  </span>
                </div>
                <p className="text-white-75 mb-0 fs-6">{comment.content}</p>
              </div>
            ))}
          </div>
        )}

        <CommentForm postId={post.id} onCommentAdded={fetchDetails} />
      </div>
    </Container>
  );
}
