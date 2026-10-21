import { Router } from 'express';
import { InscripcionController } from '../controllers/InscripcionController';
import { CreateInscripcionUseCase } from '../../application/use-cases/inscripcion/CreateInscripcionUseCase';
import { GetMisInscripcionesUseCase } from '../../application/use-cases/inscripcion/GetMisInscripcionesUseCase';
import { GetAllInscripcionesUseCase } from '../../application/use-cases/inscripcion/GetAllInscripcionesUseCase';
import { PrismaInscripcionRepository } from '../../infrastructure/repositories/PrismaInscripcionRepository';
import { PrismaMateriaRepository } from '../../infrastructure/repositories/PrismaMateriaRepository';
import { authMiddleware } from '../middlewares/authMiddleware';
import { soloAdmin } from '../middlewares/roleMiddleware';
import { validate } from '../middlewares/validate';
import { createInscripcionSchema } from '../validation/inscripcionValidation';

const inscripcionRepository = new PrismaInscripcionRepository();
const materiaRepository = new PrismaMateriaRepository();

const createInscripcionUseCase = new CreateInscripcionUseCase(
  inscripcionRepository,
  materiaRepository
);
const getMisInscripcionesUseCase = new GetMisInscripcionesUseCase(inscripcionRepository);
const getAllInscripcionesUseCase = new GetAllInscripcionesUseCase(inscripcionRepository);

const inscripcionController = new InscripcionController(
  createInscripcionUseCase,
  getMisInscripcionesUseCase,
  getAllInscripcionesUseCase
);

export const inscripcionRouter = Router();

// 1. Crear interacción: usuario autenticado (se asocia al id del token)
inscripcionRouter.post(
  '/',
  authMiddleware,
  validate(createInscripcionSchema),
  inscripcionController.create
);

// 2. Consultar interacciones propias: usuario autenticado (solo las suyas)
inscripcionRouter.get('/mias', authMiddleware, inscripcionController.getMine);

// 3. Consultar todas las interacciones: solo administrador
inscripcionRouter.get('/', authMiddleware, soloAdmin, inscripcionController.getAll);
