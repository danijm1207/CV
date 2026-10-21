export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  nombre: string;
  email: string;
  password?: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type SafeUser = Omit<User, 'password'>;
