import { IMateriaRepository } from '../../../domain/repositories/IMateriaRepository';
import { Materia } from '../../../domain/models/Materia';
import { NotFoundError } from '../../../domain/errors/AppError';

export class GetMateriaByIdUseCase {
  constructor(private materiaRepository: IMateriaRepository) {}

  async execute(id: number): Promise<Materia> {
    const materia = await this.materiaRepository.findById(id);
    if (!materia) {
      throw new NotFoundError(`Materia con ID ${id} no encontrada`);
    }
    return materia;
  }
}
