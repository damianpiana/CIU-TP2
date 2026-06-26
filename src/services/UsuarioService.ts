import type { User, RegisterData } from "../types/auth";

const API_URL = "http://localhost:3001/users";

export async function obtenerUsuarios(): Promise<User[]> {
  try {
    const respuesta = await fetch(API_URL);
    if (!respuesta.ok) {
      throw new Error("Error al obtener usuarios");
    }
    return await respuesta.json();
  } catch (error) {
    console.error("Error en obtenerUsuarios:", error);
    throw error;
  }
}

export async function obtenerUsuarioPorId(id: number): Promise<User | null> {
  try {
    const respuesta = await fetch(`${API_URL}/${id}`);
    if (!respuesta.ok) {
      return null;
    }
    return await respuesta.json();
  } catch (error) {
    console.error("Error en obtenerUsuarioPorId:", error);
    return null;
  }
}

export async function crearUsuario(
  data: RegisterData
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const respuesta = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!respuesta.ok) {
      const errorData = await respuesta.json();
      return {
        success: false,
        error: errorData.message || "No se pudo crear el usuario",
      };
    }

    const usuario = await respuesta.json();
    return {
      success: true,
      user: usuario,
    };
  } catch (error) {
    console.error("Error en crearUsuario:", error);
    return {
      success: false,
      error: "Error al conectar con el servidor",
    };
  }
}
