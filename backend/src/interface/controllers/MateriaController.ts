import { Request, Response, NextFunction } from 'express';
import { GetMateriasUseCase } from '../../application/use-cases/materia/GetMateriasUseCase';
import { GetMateriaByIdUseCase } from '../../application/use-cases/materia/GetMateriaByIdUseCase';
import { CreateMateriaUseCase } from '../../application/use-cases/materia/CreateMateriaUseCase';
import { UpdateMateriaUseCase } from '../../application/use-cases/materia/UpdateMateriaUseCase';
import { DeleteMateriaUseCase } from '../../application/use-cases/materia/DeleteMateriaUseCase';

export class MateriaController {
  constructor(
    private getMateriasUseCase: GetMateriasUseCase,
    private getMateriaByIdUseCase: GetMateriaByIdUseCase,
    private createMateriaUseCase: CreateMateriaUseCase,
    private updateMateriaUseCase: UpdateMateriaUseCase,
    private deleteMateriaUseCase: DeleteMateriaUseCase
  ) {}

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getMateriasUseCase.execute(req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const materia = await this.getMateriaByIdUseCase.execute(id);
      res.status(200).json({ data: materia });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const materia = await this.createMateriaUseCase.execute(req.body);
      res.status(201).json({
        message: 'Materia creada exitosamente',
        data: materia,
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const materia = await this.updateMateriaUseCase.execute(id, req.body);
      res.status(200).json({
        message: 'Materia actualizada exitosamente',
        data: materia,
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      await this.deleteMateriaUseCase.execute(id);
      res.status(200).json({
        message: 'Materia eliminada exitosamente',
      });
    } catch (error) {
      next(error);
    }
  };
}
