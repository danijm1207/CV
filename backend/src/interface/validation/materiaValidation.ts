import { z } from 'zod';

export const materiaIdParamSchema = {
  params: z.object({
    id: z.coerce
      .number({ invalid_type_error: 'El ID de la materia debe ser un número entero' })
      .int('El ID debe ser un entero')
      .positive('El ID debe ser un número positivo'),
  }),
};

export const createMateriaSchema = {
  body: z.object({
    nombreMateria: z
      .string({ required_error: 'El nombre de la materia es obligatorio' })
      .min(3, 'El nombre debe tener al menos 3 caracteres')
      .max(120, 'El nombre no puede exceder 120 caracteres'),
    descripcion: z
      .string({ required_error: 'La descripción es obligatoria' })
      .min(10, 'La descripción debe tener al menos 10 caracteres'),
    precio: z.coerce
      .number({ required_error: 'El precio es obligatorio', invalid_type_error: 'El precio debe ser un número' })
      .positive('El precio debe ser mayor a 0'),
    foto: z
      .string({ required_error: 'La foto o URL de imagen es obligatoria' })
      .min(1, 'La ruta o URL de la imagen es requerida'),
    tutor: z
      .string({ required_error: 'El nombre del tutor es obligatorio' })
      .min(3, 'El tutor debe tener al menos 3 caracteres'),
    categoria: z.string().optional(),
    modalidad: z.string().optional(),
  }),
};

export const updateMateriaSchema = {
  params: materiaIdParamSchema.params,
  body: z.object({
    nombreMateria: z.string().min(3).max(120).optional(),
    descripcion: z.string().min(10).optional(),
    precio: z.coerce.number().positive().optional(),
    foto: z.string().min(1).optional(),
    tutor: z.string().min(3).optional(),
    categoria: z.string().optional(),
    modalidad: z.string().optional(),
  }),
};

export const materiaQuerySchema = {
  query: z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().optional().default(6),
    search: z.string().optional(),
    categoria: z.string().optional(),
    minPrice: z.coerce.number().positive().optional(),
    maxPrice: z.coerce.number().positive().optional(),
  }),
};
