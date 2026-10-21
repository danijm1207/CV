import { Materia } from './Materia';
import { SafeUser } from './User';

export interface Inscripcion {
  id: number;
  nombreEstudiante: string;
  correoAcudiente: string;
  telefono: string;
  mensaje?: string | null;
  estado: string;
  userId: number;
  materiaId: number;
  user?: SafeUser;
  materia?: Materia;
  createdAt?: Date;
  updatedAt?: Date;
}
