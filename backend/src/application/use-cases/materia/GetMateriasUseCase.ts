import { IMateriaRepository } from '../../../domain/repositories/IMateriaRepository';
import { Materia, MateriaFilters, PaginatedResult } from '../../../domain/models/Materia';

export class GetMateriasUseCase {
  constructor(private materiaRepository: IMateriaRepository) {}

  async execute(filters: MateriaFilters): Promise<PaginatedResult<Materia>> {
    return this.materiaRepository.findMany(filters);
  }
}
