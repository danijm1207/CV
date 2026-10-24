import { http } from '../../common/http';
import { Inscripcion, CreateInscripcionRequest } from '../domain/types';

export const inscripcionService = {
  async create(data: CreateInscripcionRequest): Promise<{ message: string; data: Inscripcion }> {
    return http.post<{ message: string; data: Inscripcion }>('/inscripciones', data);
  },

  async getMisInscripciones(): Promise<{ data: Inscripcion[] }> {
    return http.get<{ data: Inscripcion[] }>('/inscripciones/mias');
  },

  async getAll(): Promise<{ data: Inscripcion[] }> {
    return http.get<{ data: Inscripcion[] }>('/inscripciones');
  },
};
