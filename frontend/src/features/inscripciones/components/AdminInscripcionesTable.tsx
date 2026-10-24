'use client';

import React from 'react';
import { Inscripcion } from '../domain/types';
import { Skeleton } from '../../common/components/Skeleton';
import { Alert } from '../../common/components/Alert';
import { Button } from '../../common/components/Button';

interface AdminInscripcionesTableProps {
  inscripciones: Inscripcion[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export const AdminInscripcionesTable: React.FC<AdminInscripcionesTableProps> = ({
  inscripciones,
  isLoading,
  error,
  onRetry,
}) => {
  if (error) {
    return (
      <div className="p-6 bg-nido-surface dark:bg-dark-surface rounded-xl border border-nido-border dark:border-dark-border text-center">
        <Alert type="error" message={error} className="mb-4" />
        <Button onClick={onRetry} variant="primary">
          Reintentar
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!inscripciones || inscripciones.length === 0) {
    return (
      <div className="text-center p-8 bg-nido-surface dark:bg-dark-surface rounded-xl border border-dashed border-nido-border dark:border-dark-border text-nido-textLight dark:text-dark-textLight">
        Aún no hay inscripciones registradas en el sistema.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-nido-border dark:border-dark-border">
      <table className="w-full text-left text-sm text-nido-text dark:text-dark-text">
        <thead className="bg-gray-50 dark:bg-gray-900/60 text-xs uppercase font-bold text-nido-textLight dark:text-dark-textLight border-b border-nido-border dark:border-dark-border">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Estudiante</th>
            <th className="px-4 py-3">Materia</th>
            <th className="px-4 py-3">Acudiente</th>
            <th className="px-4 py-3">Teléfono</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Fecha</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-nido-border dark:divide-dark-border bg-nido-surface dark:bg-dark-surface">
          {inscripciones.map((ins) => (
            <tr key={ins.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <td className="px-4 py-3 font-semibold text-xs text-nido-textLight dark:text-dark-textLight">
                #{ins.id}
              </td>
              <td className="px-4 py-3 font-medium">
                {ins.nombreEstudiante}
              </td>
              <td className="px-4 py-3">
                <span className="font-semibold text-primary dark:text-primary-light">
                  {ins.materia?.nombreMateria || 'N/A'}
                </span>
                <span className="block text-xs text-nido-textLight dark:text-dark-textLight">
                  Tutor: {ins.materia?.tutor || 'N/A'}
                </span>
              </td>
              <td className="px-4 py-3">
                {ins.correoAcudiente}
                {ins.user && (
                  <span className="block text-xs text-nido-textLight dark:text-dark-textLight">
                    ({ins.user.nombre})
                  </span>
                )}
              </td>
              <td className="px-4 py-3">{ins.telefono}</td>
              <td className="px-4 py-3">
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                  {ins.estado}
                </span>
              </td>
              <td className="px-4 py-3 text-xs text-nido-textLight dark:text-dark-textLight">
                {ins.createdAt ? new Date(ins.createdAt).toLocaleDateString('es-CO') : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
