import { useEffect, useState } from "react";
import { Card, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import type { Post, PostImage } from "../types/post";
import { getPostImages, getPostComments } from "../services/PostService";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [images, setImages] = useState<PostImage[]>([]);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);

  useEffect(() => {
    getPostImages(post.id.toString()).then(setImages).catch(() => {});
    if (post.commentsCount === undefined) {
      getPostComments(post.id.toString())
        .then(comments => setCommentsCount(comments.length))
        .catch(() => {});
    }
  }, [post.id, post.commentsCount]);

  return (
    <Card className="mb-4 bg-soft rounded-4 border-0 text-white shadow-glow">
      <Card.Body className="p-4">
        <Card.Text className="fs-5">{post.description}</Card.Text>
        
        {images.length > 0 && (
          <div className="d-flex gap-2 overflow-auto mb-3 pb-2 custom-scrollbar">
            {images.map(img => (
              <img 
                key={img.id} 
                src={img.url} 
                alt="Adjunto de publicación" 
                className="img-fluid rounded-3" 
                style={{ maxHeight: "250px", objectFit: "cover" }}
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
