import { http } from '../../common/http';
import { Materia, MateriaFilter, PaginatedMaterias } from '../domain/types';

export const materiaService = {
  async getMaterias(filters: MateriaFilter = {}): Promise<PaginatedMaterias> {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search && filters.search.trim() !== '') params.append('search', filters.search.trim());
    if (filters.categoria && filters.categoria !== 'Todas') params.append('categoria', filters.categoria);
    if (filters.minPrice !== undefined && filters.minPrice > 0) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined && filters.maxPrice > 0) params.append('maxPrice', filters.maxPrice.toString());

    const queryString = params.toString();
    const endpoint = `/materias${queryString ? `?${queryString}` : ''}`;

    return http.get<PaginatedMaterias>(endpoint);
  },

  async getMateriaById(id: number): Promise<{ data: Materia }> {
    return http.get<{ data: Materia }>(`/materias/${id}`);
  },

  async createMateria(data: Omit<Materia, 'id'>): Promise<{ message: string; data: Materia }> {
    return http.post<{ message: string; data: Materia }>('/materias', data);
  },

  async updateMateria(id: number, data: Partial<Materia>): Promise<{ message: string; data: Materia }> {
    return http.put<{ message: string; data: Materia }>(`/materias/${id}`, data);
  },

  async deleteMateria(id: number): Promise<{ message: string }> {
    return http.delete<{ message: string }>(`/materias/${id}`);
  },

  async uploadImage(file: File): Promise<{ message: string; url: string }> {
    const formData = new FormData();
    formData.append('image', file);
    return http.upload<{ message: string; url: string }>('/upload', formData);
  },
};
