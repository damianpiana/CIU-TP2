export type User = {
  id: number;
  nickName: string;
  email?: string;
};

export type LoginData = {
  nickName: string;
  password: string;
};

export type RegisterData = {
  nickName: string;
  email?: string;
};

export type ApiResponse<T> = {
  data?: T;
  error?: string;
  message?: string;
};

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
};
