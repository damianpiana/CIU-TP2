import { useEffect, useState } from "react";
import { Container, Spinner, Alert, Badge, Card, Modal, Button, Form } from "react-bootstrap";
import { useLocation, useParams, Link, useNavigate } from "react-router-dom";
import { getPostById, getPostImages, getPostComments, actualizarPost, eliminarComentario } from "../services/PostService";
import { useAuth } from "../context/AuthContext";
import type { Post, PostImage, Comment } from "../types/post";
import { CommentForm } from "../components/CommentForm";

export function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [images, setImages] = useState<PostImage[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState("");
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

  const getOwnerId = (currentPost: Post | null) => {
    if (!currentPost) return null;

    const candidates = [
      (currentPost as Post & { userId?: unknown }).userId,
      (currentPost as Post & { UserId?: unknown }).UserId,
      (currentPost as Post & { user?: { id?: unknown } }).user?.id,
    ];

    const match = candidates.find((candidate) => candidate != null && candidate !== "");
    return match == null ? null : Number(match);
  };

  const isOwner = Boolean(user && post && getOwnerId(post) !== null && getOwnerId(post) === Number(user.id));

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

  useEffect(() => {
    if (post) {
      setDescriptionDraft(post.description);
      if ((location.state?.editMode || location.state?.fromProfile) && isOwner) {
        setIsEditing(true);
      }
    }
  }, [post, location.state?.editMode, location.state?.fromProfile, user?.id]);

  async function handleSaveDescription() {
    if (!post || !descriptionDraft.trim()) return;

    try {
      const updatedPost = await actualizarPost(post.id, { description: descriptionDraft.trim() });
      setPost({ ...post, description: updatedPost.description });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert("No se pudo actualizar la publicación.");
    }
  }

  async function handleDeleteComment(commentId: number) {
    try {
      await eliminarComentario(commentId);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      setCommentToDelete(null);
    } catch (error) {
      console.error(error);
      alert("No se pudo borrar el comentario.");
    }
  }

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
    <Container className="py-5 d-flex justify-content-center">
      <div className="w-100" style={{ maxWidth: "900px" }}>
        <div className="mb-4">
          <Link to="/" className="text-accent text-decoration-none fw-semibold">
            <i className="bi bi-arrow-left me-2"></i>Volver al Feed
          </Link>
        </div>
      
        <Card className="bg-soft border-0 rounded-4 shadow-glow mb-5">
          <Card.Body className="p-4 p-md-5">
            {isOwner && !isEditing && (
              <div className="d-flex justify-content-end mb-3">
                <Button
                  variant="primary"
                  size="sm"
                  className="rounded-pill px-3 btn-brand"
                  onClick={() => setIsEditing(true)}
                >
                  Editar publicación
                </Button>
              </div>
            )}

            {isOwner && isEditing && (
              <div className="d-flex justify-content-end mb-3">
                <Button
                  variant="outline-light"
                  size="sm"
                  className="rounded-pill px-3"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar edición
                </Button>
              </div>
            )}

            {isEditing ? (
              <div className="mb-4">
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={descriptionDraft}
                  onChange={(e) => setDescriptionDraft(e.target.value)}
                  className="mb-3"
                />
                <div className="d-flex gap-2">
                  <Button variant="light" className="rounded-pill px-3" onClick={handleSaveDescription}>
                    Guardar cambios
                  </Button>
                  <Button variant="outline-light" className="rounded-pill px-3" onClick={() => {
                    setIsEditing(false);
                    setDescriptionDraft(post.description);
                  }}>
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <Card.Text className="fs-4 text-white mb-4" style={{ whiteSpace: 'pre-line' }}>
                {post.description}
              </Card.Text>
            )}

          {images.length > 0 && (
            <div className="row g-3 mb-4">
              {images.map(img => (
                <div className="col-12 col-md-6 col-lg-4" key={img.id}>
                  <button
                    type="button"
                    className="p-0 border-0 bg-transparent w-100"
                    onClick={() => setSelectedImage(img.url)}
                  >
                    <img 
                      src={img.url} 
                      alt="Adjunto de publicación" 
                      className="img-fluid rounded-3 shadow-sm w-100" 
                      style={{ height: '300px', objectFit: 'cover' }}
                    />
                  </button>
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
                    {isOwner && (
                      <Button variant="outline-danger" size="sm" className="rounded-pill px-3" onClick={() => setCommentToDelete(comment.id)}>
                        Borrar
                      </Button>
                    )}
                  </div>
                  <p className="text-white-75 mb-0 fs-6">{comment.content}</p>
                </div>
              ))}
            </div>
          )}

          <CommentForm postId={post.id} onCommentAdded={fetchDetails} />
        </div>
      </div>

      <Modal show={commentToDelete !== null} onHide={() => setCommentToDelete(null)} centered>
        <Modal.Body className="bg-soft rounded-4 border-0 p-4 text-white">
          <h5 className="mb-3">¿Borrar este comentario?</h5>
          <p className="text-white-50 mb-4">Esta acción no se puede deshacer.</p>
          <div className="d-flex justify-content-end gap-2">
            <Button variant="outline-light" onClick={() => setCommentToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={() => commentToDelete && handleDeleteComment(commentToDelete)}>
              Borrar
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={!!selectedImage} onHide={() => setSelectedImage(null)} centered size="lg">
        <Modal.Body className="p-0 rounded-4 overflow-hidden" style={{ background: 'rgba(15, 23, 42, 0.98)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Imagen completa"
              className="img-fluid w-100"
              style={{ maxHeight: '80vh', objectFit: 'contain' }}
            />
          )}
        </Modal.Body>
        <Modal.Footer className="border-0" style={{ background: 'rgba(15, 23, 42, 0.98)' }}>
          <Button variant="outline-light" onClick={() => setSelectedImage(null)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
