'use client';

import { useState, useEffect, useCallback } from 'react';
import { Materia, MateriaFilter, PaginationMeta } from '../domain/types';
import { materiaService } from '../services/materiaService';

export function useMaterias(initialFilters: MateriaFilter = {}) {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: initialFilters.page || 1,
    limit: initialFilters.limit || 6,
    total: 0,
    totalPages: 1,
  });
  const [filters, setFilters] = useState<MateriaFilter>(initialFilters);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMaterias = useCallback(async (currentFilters: MateriaFilter) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await materiaService.getMaterias(currentFilters);
      setMaterias(response.data || []);
      setPagination(response.pagination || { page: 1, limit: 6, total: 0, totalPages: 1 });
    } catch (err: any) {
      setError(err?.message || 'Error al cargar las materias desde la API.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMaterias(filters);
  }, [filters, fetchMaterias]);

  const changePage = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const applyFilters = (newFilters: Partial<MateriaFilter>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const refetch = () => {
    return fetchMaterias(filters);
  };

  return {
    materias,
    pagination,
    isLoading,
    error,
    filters,
    changePage,
    applyFilters,
    refetch,
  };
}
