import jwt from 'jsonwebtoken';
import { ITokenService, TokenPayload } from '../../application/ports/ISecurityServices';
import { UnauthorizedError } from '../../domain/errors/AppError';

export class JwtTokenService implements ITokenService {
  private getSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET no está configurado en las variables de entorno');
    }
    return secret;
  }

  private getExpiresIn(): string {
    return process.env.JWT_EXPIRES_IN || '24h';
  }

  generateToken(payload: TokenPayload): string {
    const secret = this.getSecret();
    const expiresIn = this.getExpiresIn();

    // Payload mínimo según rúbrica: SOLO id y role, sin datos sensibles
    return jwt.sign({ id: payload.id, role: payload.role }, secret, {
      expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
    });
  }

  verifyToken(token: string): TokenPayload {
    try {
      const secret = this.getSecret();
      const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

      if (!decoded || typeof decoded.id !== 'number' || typeof decoded.role !== 'string') {
        throw new UnauthorizedError('Token no válido');
      }

      return {
        id: decoded.id,
        role: decoded.role,
      };
    } catch (err: unknown) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('El token ha expirado. Por favor inicia sesión nuevamente');
      }
      throw new UnauthorizedError('Token inválido o malformado');
    }
  }
}
