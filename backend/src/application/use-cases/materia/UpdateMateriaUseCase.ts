import { IMateriaRepository } from '../../../domain/repositories/IMateriaRepository';
import { Materia } from '../../../domain/models/Materia';
import { UpdateMateriaDTO } from '../../dtos/MateriaDTO';
import { NotFoundError } from '../../../domain/errors/AppError';

export class UpdateMateriaUseCase {
  constructor(private materiaRepository: IMateriaRepository) {}

  async execute(id: number, dto: UpdateMateriaDTO): Promise<Materia> {
    const existing = await this.materiaRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Materia con ID ${id} no encontrada`);
    }

    return this.materiaRepository.update(id, dto);
  }
}
