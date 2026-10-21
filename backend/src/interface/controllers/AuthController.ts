import { Request, Response, NextFunction } from 'express';
import { RegisterUseCase } from '../../application/use-cases/auth/RegisterUseCase';
import { LoginUseCase } from '../../application/use-cases/auth/LoginUseCase';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UnauthorizedError } from '../../domain/errors/AppError';

export class AuthController {
  constructor(
    private registerUseCase: RegisterUseCase,
    private loginUseCase: LoginUseCase,
    private userRepository: IUserRepository
  ) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.registerUseCase.execute(req.body);
      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.loginUseCase.execute(req.body);
      res.status(200).json({
        message: 'Inicio de sesión exitoso',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Usuario no autenticado');
      }
      const user = await this.userRepository.findById(req.user.id);
      if (!user) {
        throw new UnauthorizedError('Usuario no encontrado');
      }
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  };
}
