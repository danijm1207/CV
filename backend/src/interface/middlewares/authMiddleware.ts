import { Request, Response, NextFunction } from 'express';
import { JwtTokenService } from '../../infrastructure/security/JwtTokenService';
import { UnauthorizedError } from '../../domain/errors/AppError';

const tokenService = new JwtTokenService();

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedError('Token no proporcionado. Se requiere encabezado Authorization: Bearer <token>');
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new UnauthorizedError('Formato de autorización inválido. Debe ser: Bearer <token>');
  }

  const token = parts[1];
  if (!token || token.trim() === '') {
    throw new UnauthorizedError('Token no proporcionado');
  }

  try {
    const payload = tokenService.verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
}
