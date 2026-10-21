import { IInscripcionRepository } from '../../../domain/repositories/IInscripcionRepository';
import { IMateriaRepository } from '../../../domain/repositories/IMateriaRepository';
import { Inscripcion } from '../../../domain/models/Inscripcion';
import { CreateInscripcionDTO } from '../../dtos/InscripcionDTO';
import { NotFoundError } from '../../../domain/errors/AppError';

export class CreateInscripcionUseCase {
  constructor(
    private inscripcionRepository: IInscripcionRepository,
    private materiaRepository: IMateriaRepository
  ) {}

  // userId SIEMPRE proviene del token JWT validado por el middleware, nunca del body
  async execute(userId: number, dto: CreateInscripcionDTO): Promise<Inscripcion> {
    const materia = await this.materiaRepository.findById(dto.materiaId);
    if (!materia) {
      throw new NotFoundError(`Materia con ID ${dto.materiaId} no encontrada`);
    }

    return this.inscripcionRepository.create({
      nombreEstudiante: dto.nombreEstudiante,
      correoAcudiente: dto.correoAcudiente,
      telefono: dto.telefono,
      mensaje: dto.mensaje,
      materiaId: dto.materiaId,
      userId,
    });
  }
}
