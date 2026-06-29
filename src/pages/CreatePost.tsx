import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  crearImagen,
  crearPost,
  obtenerTags,
} from "../services/PostService";
import type { Tag } from "../types/post";
import { TagSelector } from "../components/TagSelector";

export function CreatePost() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [description, setDescription] =
    useState("");

  const [images, setImages] = useState([
    "",
  ]);

  const [tags, setTags] = useState<Tag[]>(
    []
  );

  const [
    selectedTags,
    setSelectedTags,
  ] = useState<number[]>([]);

  useEffect(() => {
    obtenerTags().then(setTags);
  }, []);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!user) return;

    const post = await crearPost({
      description,
      userId: user.id,
      tags: selectedTags,
    });

    for (const img of images) {
      if (img.trim() !== "") {
        await crearImagen(
          img,
          post.id
        );
      }
    }

    navigate("/mi-perfil");
  }

  return (
    <Container className="py-5">
      <h2>Nueva publicación</h2>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>
            Descripción
          </Form.Label>

          <Form.Control
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
            Imágenes
          </Form.Label>

          {images.map((img, index) => (
            <Form.Control
              key={index}
              className="mb-2"
              value={img}
              placeholder="URL de imagen"
              onChange={(e) => {
                const copy = [
                  ...images,
                ];

                copy[index] =
                  e.target.value;

                setImages(copy);
              }}
            />
          ))}

          <Button
            type="button"
            onClick={() =>
              setImages([
                ...images,
                "",
              ])
            }
          >
            Agregar imagen
          </Button>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
            Etiquetas
          </Form.Label>

          <TagSelector
            tags={tags}
            selectedTags={
              selectedTags
            }
            onChange={
              setSelectedTags
            }
          />
        </Form.Group>

        <Button type="submit">
          Crear publicación
        </Button>
      </Form>
    </Container>
  );
}