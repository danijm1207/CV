import { IInscripcionRepository } from '../../../domain/repositories/IInscripcionRepository';
import { Inscripcion } from '../../../domain/models/Inscripcion';

export class GetMisInscripcionesUseCase {
  constructor(private inscripcionRepository: IInscripcionRepository) {}

  async execute(userId: number): Promise<Inscripcion[]> {
    return this.inscripcionRepository.findByUserId(userId);
  }
}
