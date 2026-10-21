import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IPasswordHasher, ITokenService } from '../../ports/ISecurityServices';
import { RegisterDTO, AuthResponseDTO } from '../../dtos/AuthDTO';
import { ConflictError } from '../../../domain/errors/AppError';

export class RegisterUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher,
    private tokenService: ITokenService
  ) {}

  async execute(dto: RegisterDTO): Promise<AuthResponseDTO> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictError('El correo electrónico ya se encuentra registrado');
    }

    const hashedPassword = await this.passwordHasher.hash(dto.password);

    const safeUser = await this.userRepository.create({
      nombre: dto.nombre,
      email: dto.email,
      password: hashedPassword,
      role: dto.role || 'user',
    });

    const token = this.tokenService.generateToken({
      id: safeUser.id,
      role: safeUser.role,
    });

    return {
      token,
      user: safeUser,
    };
  }
}
