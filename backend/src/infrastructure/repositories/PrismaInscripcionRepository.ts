import prisma from '../database/prisma';
import {
  IInscripcionRepository,
  CreateInscripcionData,
} from '../../domain/repositories/IInscripcionRepository';
import { Inscripcion } from '../../domain/models/Inscripcion';

export class PrismaInscripcionRepository implements IInscripcionRepository {
  async create(data: CreateInscripcionData): Promise<Inscripcion> {
    const inscripcion = await prisma.inscripcion.create({
      data: {
        nombreEstudiante: data.nombreEstudiante.trim(),
        correoAcudiente: data.correoAcudiente.toLowerCase().trim(),
        telefono: data.telefono.trim(),
        mensaje: data.mensaje ? data.mensaje.trim() : null,
        materiaId: data.materiaId,
        userId: data.userId,
      },
      include: {
        materia: true,
        user: {
          select: {
            id: true,
            nombre: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return inscripcion;
  }

  async findByUserId(userId: number): Promise<Inscripcion[]> {
    return prisma.inscripcion.findMany({
      where: { userId },
      include: {
        materia: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(): Promise<Inscripcion[]> {
    return prisma.inscripcion.findMany({
      include: {
        materia: true,
        user: {
          select: {
            id: true,
            nombre: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number): Promise<Inscripcion | null> {
    return prisma.inscripcion.findUnique({
      where: { id },
      include: {
        materia: true,
        user: {
          select: {
            id: true,
            nombre: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }
}
