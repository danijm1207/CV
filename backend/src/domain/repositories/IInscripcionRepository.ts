import { Inscripcion } from '../models/Inscripcion';

export interface CreateInscripcionData {
  nombreEstudiante: string;
  correoAcudiente: string;
  telefono: string;
  mensaje?: string | null;
  materiaId: number;
  userId: number;
}

export interface IInscripcionRepository {
  create(data: CreateInscripcionData): Promise<Inscripcion>;
  findByUserId(userId: number): Promise<Inscripcion[]>;
  findAll(): Promise<Inscripcion[]>;
  findById(id: number): Promise<Inscripcion | null>;
}
