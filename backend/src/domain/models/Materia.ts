export interface Materia {
  id: number;
  nombreMateria: string;
  descripcion: string;
  precio: number;
  foto: string;
  tutor: string;
  categoria: string;
  modalidad: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MateriaFilters {
  search?: string;
  categoria?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: T[];
}
