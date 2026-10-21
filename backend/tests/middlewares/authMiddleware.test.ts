import { Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../../src/interface/middlewares/authMiddleware';
import { JwtTokenService } from '../../src/infrastructure/security/JwtTokenService';
import { UnauthorizedError } from '../../src/domain/errors/AppError';

describe('authMiddleware (Pruebas Automatizadas)', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test_secret_key_12345';
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it('debe lanzar UnauthorizedError (401) si no se envía el header Authorization', () => {
    mockRequest.headers = {};

    expect(() => {
      authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);
    }).toThrow(UnauthorizedError);

    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('debe lanzar UnauthorizedError (401) si el formato no es "Bearer <token>"', () => {
    mockRequest.headers = {
      authorization: 'Basic token123',
    };

    expect(() => {
      authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);
    }).toThrow(UnauthorizedError);

    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('debe llamar a next() con error 401 si el token es inválido o malformado', () => {
    mockRequest.headers = {
      authorization: 'Bearer token_invalido_xyz',
    };

    authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });

  it('debe llamar a next() sin error y asignar req.user con el payload id y role si el token es válido', () => {
    const tokenService = new JwtTokenService();
    const validToken = tokenService.generateToken({ id: 42, role: 'user' });

    mockRequest.headers = {
      authorization: `Bearer ${validToken}`,
    };

    authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith();
    expect(mockRequest.user).toBeDefined();
    expect(mockRequest.user?.id).toBe(42);
    expect(mockRequest.user?.role).toBe('user');
  });
});
