export interface User {
  id: number;
  nombre: string;
  email: string;
  role: 'admin' | 'user' | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}
