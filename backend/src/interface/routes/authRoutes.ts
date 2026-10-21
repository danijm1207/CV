import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { RegisterUseCase } from '../../application/use-cases/auth/RegisterUseCase';
import { LoginUseCase } from '../../application/use-cases/auth/LoginUseCase';
import { PrismaUserRepository } from '../../infrastructure/repositories/PrismaUserRepository';
import { BcryptPasswordHasher } from '../../infrastructure/security/BcryptPasswordHasher';
import { JwtTokenService } from '../../infrastructure/security/JwtTokenService';
import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema } from '../validation/authValidation';
import { authMiddleware } from '../middlewares/authMiddleware';

const userRepository = new PrismaUserRepository();
const passwordHasher = new BcryptPasswordHasher();
const tokenService = new JwtTokenService();

const registerUseCase = new RegisterUseCase(userRepository, passwordHasher, tokenService);
const loginUseCase = new LoginUseCase(userRepository, passwordHasher, tokenService);

const authController = new AuthController(registerUseCase, loginUseCase, userRepository);

export const authRouter = Router();

authRouter.post('/register', validate(registerSchema), authController.register);
authRouter.post('/login', validate(loginSchema), authController.login);
authRouter.get('/me', authMiddleware, authController.me);
