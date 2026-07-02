import type { Post, Comment, PostImage, Tag } from "../types/post";

const API_BASE_URL = "http://localhost:3001";

export async function getPosts(): Promise<Post[]> {
  const response = await fetch(`${API_BASE_URL}/posts`);
  if (!response.ok) throw new Error("Error al obtener las publicaciones");
  return await response.json();
}

export async function getPostById(id: string): Promise<Post> {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`);
  if (!response.ok) throw new Error("Error al obtener la publicación");
  return await response.json();
}

export async function getPostComments(postId: string): Promise<Comment[]> {
  const response = await fetch(`${API_BASE_URL}/comments/post/${postId}`);
  if (!response.ok) throw new Error("Error al obtener comentarios");
  return await response.json();
}

export async function getPostImages(postId: string): Promise<PostImage[]> {
  const response = await fetch(`${API_BASE_URL}/postimages/post/${postId}`);
  if (!response.ok) throw new Error("Error al obtener imágenes");
  return await response.json();
}

export async function createComment(data: { postId: number; userId: number; content: string }): Promise<Comment> {
  const response = await fetch(`${API_BASE_URL}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al crear comentario");
  return await response.json();
}

export async function actualizarPost(id: number, data: { description: string }): Promise<Post> {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.status === 404) {
      return { id, ...data } as Post;
    }
    throw new Error("Error al actualizar la publicación");
  }

  return await response.json();
}

export async function eliminarPost(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: "DELETE",
    });

    if (!response.ok && response.status !== 404) {
      throw new Error("Error al borrar la publicación");
    }
  } catch (error) {
    console.warn("Delete post endpoint failed, continuing locally:", error);
  }
}

export async function eliminarComentario(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/comments/${id}`, {
    method: "DELETE",
  });

  if (!response.ok && response.status !== 404) {
    throw new Error("Error al borrar el comentario");
  }
}

export async function obtenerPostsPorUsuario(userId: number): Promise<Post[]> {
  const res = await fetch(`${API_BASE_URL}/posts?userId=${userId}`);
  if (!res.ok) throw new Error("No se pudieron obtener los posts");
  return await res.json();
}

export async function crearPost(data: {
  description: string;
  userId: number;
  tags: number[];
}): Promise<Post> {
  const payload = {
    description: data.description,
    userId: data.userId,
    tagIds: data.tags
  };
  const res = await fetch(`${API_BASE_URL}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("No se pudo crear el post");
  return await res.json();
}

export async function obtenerTags(): Promise<Tag[]> {
  const res = await fetch(`${API_BASE_URL}/tags`);
  if (!res.ok) throw new Error("No se pudieron obtener las etiquetas");
  return await res.json();
}

export async function crearImagen(url: string, postId: number): Promise<PostImage> {
  const res = await fetch(`${API_BASE_URL}/postimages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, postId }),
  });
  if (!res.ok) throw new Error("No se pudo guardar la imagen");
  return await res.json();
}
