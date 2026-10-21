import { Request, Response, NextFunction } from 'express';
import { CreateInscripcionUseCase } from '../../application/use-cases/inscripcion/CreateInscripcionUseCase';
import { GetMisInscripcionesUseCase } from '../../application/use-cases/inscripcion/GetMisInscripcionesUseCase';
import { GetAllInscripcionesUseCase } from '../../application/use-cases/inscripcion/GetAllInscripcionesUseCase';
import { UnauthorizedError } from '../../domain/errors/AppError';

export class InscripcionController {
  constructor(
    private createInscripcionUseCase: CreateInscripcionUseCase,
    private getMisInscripcionesUseCase: GetMisInscripcionesUseCase,
    private getAllInscripcionesUseCase: GetAllInscripcionesUseCase
  ) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Requisito Rúbrica: El userId se toma exclusivamente del token verificado en req.user
      if (!req.user) {
        throw new UnauthorizedError('Debes iniciar sesión para realizar una inscripción');
      }

      const inscripcion = await this.createInscripcionUseCase.execute(req.user.id, req.body);
      res.status(201).json({
        message: 'Inscripción registrada con éxito',
        data: inscripcion,
      });
    } catch (error) {
      next(error);
    }
  };

  getMine = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Debes iniciar sesión para consultar tus inscripciones');
      }

      const inscripciones = await this.getMisInscripcionesUseCase.execute(req.user.id);
      res.status(200).json({
        data: inscripciones,
      });
    } catch (error) {
      next(error);
    }
  };

  getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const inscripciones = await this.getAllInscripcionesUseCase.execute();
      res.status(200).json({
        data: inscripciones,
      });
    } catch (error) {
      next(error);
    }
  };
}
