'use client';

import React from 'react';
import { Materia, PaginationMeta } from '../domain/types';
import { MateriaCard } from './MateriaCard';
import { Pagination } from '../../common/components/Pagination';
import { Skeleton } from '../../common/components/Skeleton';
import { Alert } from '../../common/components/Alert';
import { Button } from '../../common/components/Button';

interface MateriaGridProps {
  materias: Materia[];
  pagination: PaginationMeta;
  isLoading: boolean;
  error: string | null;
  onPageChange: (newPage: number) => void;
  onRetry: () => void;
  onSelectMateria?: (materia: Materia) => void;
}

export const MateriaGrid: React.FC<MateriaGridProps> = ({
  materias,
  pagination,
  isLoading,
  error,
  onPageChange,
  onRetry,
  onSelectMateria,
}) => {
  // 1. Estado de error visible con botón de reintento (Requisito Rúbrica)
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-nido-surface dark:bg-dark-surface rounded-xl border border-nido-border dark:border-dark-border text-center">
        <Alert type="error" message={error} className="mb-4 max-w-md" />
        <p className="text-sm text-nido-textLight dark:text-dark-textLight mb-4">
          No fue posible conectar con el catálogo de la API. Verifica que el backend esté ejecutándose.
        </p>
        <Button onClick={onRetry} variant="primary">
          Reintentar cargar catálogo
        </Button>
      </div>
    );
  }

  // 2. Estado de cargando visible (Skeletons) (Requisito Rúbrica)
  if (isLoading) {
    return (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-nido-surface dark:bg-dark-surface rounded-xl border border-nido-border dark:border-dark-border p-4 space-y-3"
            >
              <Skeleton className="h-44 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-12 w-full" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. Estado de vacío visible (Requisito Rúbrica)
  if (!materias || materias.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-nido-surface dark:bg-dark-surface rounded-xl border border-dashed border-nido-border dark:border-dark-border text-center">
        <span className="text-4xl mb-3">📚</span>
        <h3 className="text-lg font-bold text-nido-text dark:text-dark-text mb-1">
          No se encontraron materias
        </h3>
        <p className="text-sm text-nido-textLight dark:text-dark-textLight max-w-md mb-4">
          Actualmente no hay materias que coincidan con los criterios de búsqueda o filtros aplicados.
        </p>
      </div>
    );
  }

  // 4. Renderizado exitoso del catálogo con paginación
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {materias.map((materia) => (
          <MateriaCard
            key={materia.id}
            materia={materia}
            onSelect={onSelectMateria}
          />
        ))}
      </div>

      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        onPageChange={onPageChange}
      />
    </div>
  );
};
