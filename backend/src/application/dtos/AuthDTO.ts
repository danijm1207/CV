import { SafeUser } from '../../domain/models/User';

export interface RegisterDTO {
  nombre: string;
  email: string;
  password: string;
  role?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  token: string;
  user: SafeUser;
}
