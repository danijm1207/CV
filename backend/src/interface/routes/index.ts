import { Router } from 'express';
import { authRouter } from './authRoutes';
import { materiaRouter } from './materiaRoutes';
import { inscripcionRouter } from './inscripcionRoutes';
import { uploadRouter } from './uploadRoutes';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/materias', materiaRouter);
apiRouter.use('/inscripciones', inscripcionRouter);
apiRouter.use('/upload', uploadRouter);
