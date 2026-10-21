import { Materia, MateriaFilters, PaginatedResult } from '../models/Materia';

export interface CreateMateriaData {
  nombreMateria: string;
  descripcion: string;
  precio: number;
  foto: string;
  tutor: string;
  categoria?: string;
  modalidad?: string;
}

export type UpdateMateriaData = Partial<CreateMateriaData>;

export interface IMateriaRepository {
  findMany(filters: MateriaFilters): Promise<PaginatedResult<Materia>>;
  findById(id: number): Promise<Materia | null>;
  create(data: CreateMateriaData): Promise<Materia>;
  update(id: number, data: UpdateMateriaData): Promise<Materia>;
  delete(id: number): Promise<void>;
}
