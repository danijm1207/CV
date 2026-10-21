export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errors?: Record<string, string>;

  constructor(message: string, statusCode = 500, errors?: Record<string, string>) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'El recurso ya existe') {
    super(message, 409);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'No autorizado o credenciales inválidas') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Acceso denegado: permisos insuficientes') {
    super(message, 403);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Error de validación en la solicitud', errors?: Record<string, string>) {
    super(message, 400, errors);
  }
}
