export interface CreateInscripcionDTO {
  nombreEstudiante: string;
  correoAcudiente: string;
  telefono: string;
  mensaje?: string | null;
  materiaId: number;
}
