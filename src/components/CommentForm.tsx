import { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { createComment } from "../services/PostService";

interface CommentFormProps {
  postId: number;
  onCommentAdded: () => void;
}

export function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const { user, isAuthenticated } = useAuth();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  if (!isAuthenticated) {
    return (
      <Alert variant="info" className="mt-4 rounded-4 bg-soft border-0 text-white-50">
        Debes iniciar sesión para poder dejar un comentario.
      </Alert>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("El comentario no puede estar vacío.");
      return;
    }
    
    setError("");
    setLoading(true);
    
    try {
      await createComment({
        postId,
        userId: user!.id,
        content: text.trim()
      });
      setText("");
      onCommentAdded();
    } catch (err) {
      setError("Ocurrió un error al enviar el comentario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 bg-soft p-4 rounded-4 shadow-sm">
      <h5 className="text-white mb-3">Deja un comentario</h5>
      {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Control 
            as="textarea" 
            rows={3} 
            placeholder="¿Qué piensas de esta publicación?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
            required
            className="bg-dark text-white border-secondary shadow-none"
            style={{ resize: 'none' }}
          />
        </Form.Group>
        <div className="text-end">
          <Button type="submit" className="btn btn-brand px-4 rounded-pill" disabled={loading || !text.trim()}>
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Enviando...
              </>
            ) : "Comentar"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
