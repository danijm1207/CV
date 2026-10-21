import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../../domain/errors/AppError';

export function requireRole(allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('Usuario no autenticado');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError(
        `Acceso denegado: esta acción requiere uno de los siguientes roles: ${allowedRoles.join(', ')}`
      );
    }

    next();
  };
}

export const soloAdmin = requireRole(['admin']);
