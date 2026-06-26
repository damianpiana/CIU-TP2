import { createContext, useContext, useState, useEffect } from "react";
import type { AuthContextType, LoginData, RegisterData, User } from "../types/auth";
import { obtenerUsuarios, crearUsuario } from "../services/UsuarioService";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "auth_user";
const PASSWORD_FIJA = "123456";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar usuario del localStorage al iniciar
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem(STORAGE_KEY);
    if (usuarioGuardado) {
      try {
        setUser(JSON.parse(usuarioGuardado));
      } catch (error) {
        console.error("Error al cargar usuario del localStorage:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  async function login(
    data: LoginData
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Obtener lista de usuarios
      const usuarios = await obtenerUsuarios();

      // Buscar usuario con el nickName
      const usuarioEncontrado = usuarios.find(
        (u) => u.nickName === data.nickName
      );

      if (!usuarioEncontrado) {
        return {
          success: false,
          error: "Usuario no encontrado",
        };
      }

      // Validar contraseña (es la contraseña fija)
      if (data.password !== PASSWORD_FIJA) {
        return {
          success: false,
          error: "Contraseña incorrecta",
        };
      }

      // Guardar usuario en contexto y localStorage
      setUser(usuarioEncontrado);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarioEncontrado));

      return { success: true };
    } catch (error) {
      console.error("Error en login:", error);
      return {
        success: false,
        error: "Error al conectar con el servidor",
      };
    }
  }

  async function register(
    data: RegisterData
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const resultado = await crearUsuario(data);

      if (!resultado.success) {
        return {
          success: false,
          error: resultado.error || "No se pudo crear el usuario",
        };
      }

      // Guardar usuario automáticamente después del registro
      if (resultado.user) {
        setUser(resultado.user);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resultado.user));
      }

      return { success: true };
    } catch (error) {
      console.error("Error en register:", error);
      return {
        success: false,
        error: "Error al conectar con el servidor",
      };
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: user !== null,
    login,
    register,
    logout,
  };

  // No renderizar mientras se carga el usuario
  if (isLoading) {
    return <div className="container py-5 text-center">Cargando...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }

  return context;
}
