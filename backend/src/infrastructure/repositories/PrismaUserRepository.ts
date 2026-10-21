import prisma from '../database/prisma';
import { IUserRepository, CreateUserData } from '../../domain/repositories/IUserRepository';
import { User, SafeUser } from '../../domain/models/User';

export class PrismaUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    if (!user) return null;
    return user;
  }

  async findById(id: number): Promise<SafeUser | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) return null;
    return user;
  }

  async create(data: CreateUserData): Promise<SafeUser> {
    const user = await prisma.user.create({
      data: {
        nombre: data.nombre.trim(),
        email: data.email.toLowerCase().trim(),
        password: data.password,
        role: data.role || 'user',
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user;
  }
}
