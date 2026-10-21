import { z } from 'zod';

export const createInscripcionSchema = {
  body: z.object({
    nombreEstudiante: z
      .string({ required_error: 'El nombre del estudiante es obligatorio' })
      .min(3, 'El nombre debe tener al menos 3 caracteres'),
    correoAcudiente: z
      .string({ required_error: 'El correo del acudiente es obligatorio' })
      .email('Ingresa un correo válido (ej: nombre@dominio.com)'),
    telefono: z
      .string({ required_error: 'El teléfono de contacto es obligatorio' })
      .regex(/^[0-9]{7,10}$/, 'Usa solo números (7 a 10 dígitos)'),
    materiaId: z.coerce
      .number({ required_error: 'Debes seleccionar una materia de interés', invalid_type_error: 'ID de materia inválido' })
      .int()
      .positive('Debes seleccionar una materia válida'),
    mensaje: z.string().optional().nullable(),
  }),
};
