import { IMateriaRepository } from '../../../domain/repositories/IMateriaRepository';
import { Materia } from '../../../domain/models/Materia';
import { CreateMateriaDTO } from '../../dtos/MateriaDTO';

export class CreateMateriaUseCase {
  constructor(private materiaRepository: IMateriaRepository) {}

  async execute(dto: CreateMateriaDTO): Promise<Materia> {
    return this.materiaRepository.create({
      nombreMateria: dto.nombreMateria,
      descripcion: dto.descripcion,
      precio: dto.precio,
      foto: dto.foto,
      tutor: dto.tutor,
      categoria: dto.categoria || 'General',
      modalidad: dto.modalidad || 'Virtual y Presencial',
    });
  }
}
