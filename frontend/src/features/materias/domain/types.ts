export interface Materia {
  id: number;
  nombreMateria: string;
  descripcion: string;
  precio: number;
  foto: string;
  tutor: string;
  categoria: string;
  modalidad: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MateriaFilter {
  search?: string;
  categoria?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedMaterias {
  pagination: PaginationMeta;
  data: Materia[];
}
