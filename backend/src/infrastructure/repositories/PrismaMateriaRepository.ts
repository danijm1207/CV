import prisma from '../database/prisma';
import {
  IMateriaRepository,
  CreateMateriaData,
  UpdateMateriaData,
} from '../../domain/repositories/IMateriaRepository';
import { Materia, MateriaFilters, PaginatedResult } from '../../domain/models/Materia';
import { Prisma } from '@prisma/client';

export class PrismaMateriaRepository implements IMateriaRepository {
  async findMany(filters: MateriaFilters): Promise<PaginatedResult<Materia>> {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Math.min(50, Number(filters.limit) || 6));
    const skip = (page - 1) * limit;

    const where: Prisma.MateriaWhereInput = {};

    if (filters.search && filters.search.trim() !== '') {
      const search = filters.search.trim();
      where.OR = [
        { nombreMateria: { contains: search, mode: 'insensitive' } },
        { descripcion: { contains: search, mode: 'insensitive' } },
        { tutor: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (filters.categoria && filters.categoria.trim() !== '' && filters.categoria !== 'Todas') {
      where.categoria = { equals: filters.categoria.trim(), mode: 'insensitive' };
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.precio = {};
      if (filters.minPrice !== undefined && !isNaN(Number(filters.minPrice))) {
        where.precio.gte = Number(filters.minPrice);
      }
      if (filters.maxPrice !== undefined && !isNaN(Number(filters.maxPrice))) {
        where.precio.lte = Number(filters.maxPrice);
      }
    }

    const [total, data] = await Promise.all([
      prisma.materia.count({ where }),
      prisma.materia.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'asc' },
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      data,
    };
  }

  async findById(id: number): Promise<Materia | null> {
    return prisma.materia.findUnique({
      where: { id },
    });
  }

  async create(data: CreateMateriaData): Promise<Materia> {
    return prisma.materia.create({
      data: {
        nombreMateria: data.nombreMateria,
        descripcion: data.descripcion,
        precio: data.precio,
        foto: data.foto,
        tutor: data.tutor,
        categoria: data.categoria || 'General',
        modalidad: data.modalidad || 'Virtual y Presencial',
      },
    });
  }

  async update(id: number, data: UpdateMateriaData): Promise<Materia> {
    return prisma.materia.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.materia.delete({
      where: { id },
    });
  }
}
