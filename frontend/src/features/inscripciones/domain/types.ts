import { Materia } from '../../materias/domain/types';
import { User } from '../../auth/domain/types';

export interface Inscripcion {
  id: number;
  nombreEstudiante: string;
  correoAcudiente: string;
  telefono: string;
  mensaje?: string | null;
  estado: string;
  userId: number;
  materiaId: number;
  materia?: Materia;
  user?: User;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInscripcionRequest {
  nombreEstudiante: string;
  correoAcudiente: string;
  telefono: string;
  mensaje?: string | null;
  materiaId: number;
}
