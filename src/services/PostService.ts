import type { Tag } from "../types/post";

const API = "http://localhost:3001";

export async function obtenerPostsPorUsuario(userId: number) {
  const res = await fetch(`${API}/posts?userId=${userId}`);

  if (!res.ok) {
    throw new Error("No se pudieron obtener los posts");
  }

  return await res.json();
}

export async function crearPost(data: {
  description: string;
  userId: number;
  tags: number[];
}) {
  const res = await fetch(`${API}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("No se pudo crear el post");
  }

  return await res.json();
}

export async function obtenerTags(): Promise<Tag[]> {
  const res = await fetch(`${API}/tags`);

  if (!res.ok) {
    throw new Error("No se pudieron obtener las etiquetas");
  }

  return await res.json();
}

export async function crearImagen(
  url: string,
  postId: number
) {
  const res = await fetch(`${API}/postimages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      postId,
    }),
  });

  if (!res.ok) {
    throw new Error("No se pudo guardar la imagen");
  }

  return await res.json();
}