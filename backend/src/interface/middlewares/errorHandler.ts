import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../domain/errors/AppError';
import { Prisma } from '@prisma/client';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // 1. Errores operacionales controlados de la aplicación (AppError y subclases)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      ...(err.errors ? { errors: err.errors } : {}),
    });
    return;
  }

  // 2. Errores conocidos de Prisma capturados
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      // Violación de restricción única (ej. email ya registrado)
      const target = Array.isArray(err.meta?.target)
        ? (err.meta?.target as string[]).join(', ')
        : 'campo único';
      res.status(409).json({
        error: `Ya existe un registro con ese valor en: ${target}`,
      });
      return;
    }

    if (err.code === 'P2025') {
      // Registro no encontrado para actualización o eliminación
      res.status(404).json({
        error: 'El registro solicitado no fue encontrado en la base de datos',
      });
      return;
    }

    if (err.code === 'P2003') {
      // Violación de llave foránea
      res.status(400).json({
        error: 'La entidad referenciada no existe en el sistema',
      });
      return;
    }

    res.status(400).json({
      error: 'Error en la operación de base de datos',
    });
    return;
  }

  // 3. Error de sintaxis en JSON del body
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      error: 'El cuerpo de la petición contiene un formato JSON malformado',
    });
    return;
  }

  // 4. Log del error en servidor para monitoreo (sin exponerlo al cliente)
  console.error('[Unhandled Server Error]:', err.message);

  // 5. Respuesta segura al cliente: SIN stack trace según rúbrica
  res.status(500).json({
    error: 'Ocurrió un error interno en el servidor. Por favor intente más tarde',
  });
}
