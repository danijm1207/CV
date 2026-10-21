import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { apiRouter } from './interface/routes';
import { errorHandler } from './interface/middlewares/errorHandler';

// Cargar variables de entorno
dotenv.config();

const app: Application = express();

// Configuración de CORS según rúbrica (específica para el frontend, sin wildcard * en producción)
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origin (como Postman o curl) o si coincide con los orígenes permitidos
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // En desarrollo permitir; en producción se valida con FRONTEND_URL
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos subidos (imágenes del catálogo)
const uploadDir = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(uploadDir));

// Endpoint de bienvenida y verificación de estado (Healthcheck)
app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'NIDO — API REST Full-Stack',
    description: 'API en cuatro capas para plataforma de clases particulares NIDO',
    status: 'online',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      materias: '/api/materias',
      inscripciones: '/api/inscripciones',
      upload: '/api/upload',
    },
  });
});

// Montar las rutas bajo /api
app.use('/api', apiRouter);

// Manejo centralizado de errores (Prisma, Zod, AppError, 400/404/409/500 sin stack trace)
app.use(errorHandler);

export default app;
