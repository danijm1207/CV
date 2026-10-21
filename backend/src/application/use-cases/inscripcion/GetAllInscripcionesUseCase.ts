import { IInscripcionRepository } from '../../../domain/repositories/IInscripcionRepository';
import { Inscripcion } from '../../../domain/models/Inscripcion';

export class GetAllInscripcionesUseCase {
  constructor(private inscripcionRepository: IInscripcionRepository) {}

  async execute(): Promise<Inscripcion[]> {
    return this.inscripcionRepository.findAll();
  }
}
