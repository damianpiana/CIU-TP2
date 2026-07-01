import { useEffect, useState } from "react";
import { Card, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import type { Post, PostImage } from "../types/post";
import { getPostImages, getPostComments } from "../services/PostService";
import { obtenerUsuarioPorId } from "../services/UsuarioService";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [images, setImages] = useState<PostImage[]>([]);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const fallbackAuthorName = post.userId || post.UserId ? `Usuario #${post.userId ?? post.UserId}` : "Usuario";
  const authorFromPost = post.User?.nickName || post.user?.nickName || post.author?.nickName;
  const [authorName, setAuthorName] = useState<string>(authorFromPost || fallbackAuthorName);

  useEffect(() => {
    const nextAuthorName = authorFromPost || fallbackAuthorName;
    setAuthorName(nextAuthorName);

    getPostImages(post.id.toString()).then(setImages).catch(() => {});
    if (post.commentsCount === undefined) {
      getPostComments(post.id.toString())
        .then((comments) => setCommentsCount(comments.length))
        .catch(() => {});
    }

    const authorId = post.User?.id || post.user?.id || post.author?.id || post.UserId || post.userId;

    if (!authorFromPost && authorId) {
      obtenerUsuarioPorId(authorId)
        .then((user) => {
          setAuthorName(user?.nickName || fallbackAuthorName);
        })
        .catch(() => {
          setAuthorName(fallbackAuthorName);
        });
    }
  }, [authorFromPost, fallbackAuthorName, post.author, post.commentsCount, post.id, post.User, post.UserId, post.user, post.userId]);

  return (
    <Card className="mb-4 bg-soft rounded-4 border-0 text-white shadow-glow">
      <Card.Body className="p-4">
        <div className="d-flex align-items-center gap-2 mb-3">
          <span className="text-white-50 small fw-semibold">Publicado por</span>
          <span className="fw-bold text-white">{authorName}</span>
        </div>
        <Card.Text className="fs-5">{post.description}</Card.Text>
        
        {images.length > 0 && (
          <div className="d-flex gap-2 overflow-auto mb-3 pb-2 custom-scrollbar">
            {images.map(img => (
              <img 
                key={img.id} 
                src={img.url} 
                alt="Adjunto de publicación" 
                className="img-fluid rounded-3" 
                style={{ maxHeight: "150px", objectFit: "cover" }}

              />
            ))}
          </div>
        )}
        
        {post.tags && post.tags.length > 0 && (
          <div className="mb-3">
            {post.tags.map((tag, idx) => (
              <Badge bg="dark" text="light" className="me-2 border border-secondary" key={idx}>
                #{tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="d-flex justify-content-between align-items-center mt-4">
          <span className="text-white-50 small fw-semibold">
            <i className="bi bi-chat-text me-1"></i>
            {commentsCount} comentarios
          </span>
          <Link to={`/post/${post.id}`} className="btn btn-outline-light btn-sm rounded-pill px-4">
            Ver más
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
}
