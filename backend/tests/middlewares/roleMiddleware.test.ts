import { Request, Response, NextFunction } from 'express';
import { soloAdmin, requireRole } from '../../src/interface/middlewares/roleMiddleware';
import { ForbiddenError, UnauthorizedError } from '../../src/domain/errors/AppError';

describe('roleMiddleware y soloAdmin (Pruebas Automatizadas)', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it('debe lanzar UnauthorizedError (401) si no existe req.user', () => {
    mockRequest.user = undefined;

    expect(() => {
      soloAdmin(mockRequest as Request, mockResponse as Response, nextFunction);
    }).toThrow(UnauthorizedError);

    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('debe lanzar ForbiddenError (403) si el rol es "user" y se requiere "admin"', () => {
    mockRequest.user = { id: 10, role: 'user' };

    expect(() => {
      soloAdmin(mockRequest as Request, mockResponse as Response, nextFunction);
    }).toThrow(ForbiddenError);

    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('debe llamar a next() sin error si el usuario tiene rol "admin"', () => {
    mockRequest.user = { id: 1, role: 'admin' };

    soloAdmin(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith();
  });

  it('requireRole debe permitir el acceso si el rol del usuario está dentro de la lista permitida', () => {
    const middleware = requireRole(['editor', 'admin']);
    mockRequest.user = { id: 5, role: 'editor' };

    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith();
  });
});
