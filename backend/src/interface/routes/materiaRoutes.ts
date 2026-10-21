import { Router } from 'express';
import { MateriaController } from '../controllers/MateriaController';
import { GetMateriasUseCase } from '../../application/use-cases/materia/GetMateriasUseCase';
import { GetMateriaByIdUseCase } from '../../application/use-cases/materia/GetMateriaByIdUseCase';
import { CreateMateriaUseCase } from '../../application/use-cases/materia/CreateMateriaUseCase';
import { UpdateMateriaUseCase } from '../../application/use-cases/materia/UpdateMateriaUseCase';
import { DeleteMateriaUseCase } from '../../application/use-cases/materia/DeleteMateriaUseCase';
import { PrismaMateriaRepository } from '../../infrastructure/repositories/PrismaMateriaRepository';
import { authMiddleware } from '../middlewares/authMiddleware';
import { soloAdmin } from '../middlewares/roleMiddleware';
import { validate } from '../middlewares/validate';
import {
  materiaQuerySchema,
  materiaIdParamSchema,
  createMateriaSchema,
  updateMateriaSchema,
} from '../validation/materiaValidation';

const materiaRepository = new PrismaMateriaRepository();

const getMateriasUseCase = new GetMateriasUseCase(materiaRepository);
const getMateriaByIdUseCase = new GetMateriaByIdUseCase(materiaRepository);
const createMateriaUseCase = new CreateMateriaUseCase(materiaRepository);
const updateMateriaUseCase = new UpdateMateriaUseCase(materiaRepository);
const deleteMateriaUseCase = new DeleteMateriaUseCase(materiaRepository);

const materiaController = new MateriaController(
  getMateriasUseCase,
  getMateriaByIdUseCase,
  createMateriaUseCase,
  updateMateriaUseCase,
  deleteMateriaUseCase
);

export const materiaRouter = Router();

// Rutas públicas
materiaRouter.get('/', validate(materiaQuerySchema), materiaController.getAll);
materiaRouter.get('/:id', validate(materiaIdParamSchema), materiaController.getById);

// Rutas protegidas exclusivas para administrador
materiaRouter.post(
  '/',
  authMiddleware,
  soloAdmin,
  validate(createMateriaSchema),
  materiaController.create
);

materiaRouter.put(
  '/:id',
  authMiddleware,
  soloAdmin,
  validate(updateMateriaSchema),
  materiaController.update
);

materiaRouter.delete(
  '/:id',
  authMiddleware,
  soloAdmin,
  validate(materiaIdParamSchema),
  materiaController.delete
);
