import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IPasswordHasher, ITokenService } from '../../ports/ISecurityServices';
import { LoginDTO, AuthResponseDTO } from '../../dtos/AuthDTO';
import { UnauthorizedError } from '../../../domain/errors/AppError';

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher,
    private tokenService: ITokenService
  ) {}

  async execute(dto: LoginDTO): Promise<AuthResponseDTO> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user || !user.password) {
      // Mensaje genérico para no revelar si falló el email o la contraseña (Requisito Rúbrica)
      throw new UnauthorizedError('Credenciales inválidas');
    }

    const isValid = await this.passwordHasher.compare(dto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    // El payload lleva solo lo necesario: id y role (Requisito Rúbrica)
    const token = this.tokenService.generateToken({
      id: user.id,
      role: user.role,
    });

    const safeUser = {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      token,
      user: safeUser,
    };
  }
}
