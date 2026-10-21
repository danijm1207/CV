import { PrismaClient } from '@prisma/client';

// PrismaClient singleton: Prisma SOLO vive en la capa de infrastructure (Requisito Rúbrica)
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

export default prisma;
