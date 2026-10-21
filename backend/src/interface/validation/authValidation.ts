import { z } from 'zod';

export const registerSchema = {
  body: z.object({
    nombre: z
      .string({ required_error: 'El nombre es obligatorio' })
      .min(3, 'El nombre debe tener al menos 3 caracteres')
      .max(100, 'El nombre no puede exceder 100 caracteres'),
    email: z
      .string({ required_error: 'El correo electrónico es obligatorio' })
      .email('Ingresa un correo electrónico válido (ej: nombre@dominio.com)'),
    password: z
      .string({ required_error: 'La contraseña es obligatoria' })
      .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    role: z.enum(['admin', 'user']).optional(),
  }),
};

export const loginSchema = {
  body: z.object({
    email: z
      .string({ required_error: 'El correo electrónico es obligatorio' })
      .email('Ingresa un correo electrónico válido'),
    password: z
      .string({ required_error: 'La contraseña es obligatoria' })
      .min(1, 'La contraseña es requerida'),
  }),
};
