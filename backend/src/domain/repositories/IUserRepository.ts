import { User, SafeUser } from '../models/User';

export interface CreateUserData {
  nombre: string;
  email: string;
  password: string;
  role?: string;
}

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<SafeUser | null>;
  create(data: CreateUserData): Promise<SafeUser>;
}
