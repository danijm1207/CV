import { IMateriaRepository } from '../../../domain/repositories/IMateriaRepository';
import { NotFoundError } from '../../../domain/errors/AppError';

export class DeleteMateriaUseCase {
  constructor(private materiaRepository: IMateriaRepository) {}

  async execute(id: number): Promise<void> {
    const existing = await this.materiaRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Materia con ID ${id} no encontrada`);
    }

    await this.materiaRepository.delete(id);
  }
}
