'use client';

import React from 'react';
import Link from 'next/link';
import { Inscripcion } from '../domain/types';
import { Skeleton } from '../../common/components/Skeleton';
import { Alert } from '../../common/components/Alert';
import { Button } from '../../common/components/Button';

interface MisInscripcionesListProps {
  inscripciones: Inscripcion[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export const MisInscripcionesList: React.FC<MisInscripcionesListProps> = ({
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
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 bg-nido-surface dark:bg-dark-surface rounded-xl border border-nido-border dark:border-dark-border space-y-2"
          >
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (!inscripciones || inscripciones.length === 0) {
    return (
      <div className="text-center p-12 bg-nido-surface dark:bg-dark-surface rounded-2xl border border-dashed border-nido-border dark:border-dark-border">
        <span className="text-4xl mb-3 block">🎒</span>
        <h3 className="text-lg font-bold text-nido-text dark:text-dark-text mb-2">
          No tienes inscripciones activas
        </h3>
        <p className="text-sm text-nido-textLight dark:text-dark-textLight max-w-md mx-auto mb-6">
          Explora nuestro catálogo de materias y selecciona una clase para brindar apoyo académico a tus hijos.
        </p>
        <Link
          href="/#catalogo"
          className="inline-flex items-center justify-center font-medium rounded-lg px-4 py-2 text-sm bg-primary hover:bg-primary-dark text-white transition-colors dark:bg-primary-light dark:hover:bg-primary dark:text-dark-bg"
        >
          Explorar catálogo de materias
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {inscripciones.map((ins) => (
        <div
          key={ins.id}
          className="p-5 bg-nido-surface dark:bg-dark-surface rounded-xl border border-nido-border dark:border-dark-border shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-bold text-base text-nido-text dark:text-dark-text">
                {ins.materia?.nombreMateria || 'Materia'}
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                {ins.estado}
              </span>
            </div>

            <p className="text-xs text-primary dark:text-primary-light font-medium mb-3">
              Tutor: {ins.materia?.tutor || 'Por asignar'}
            </p>

            <div className="text-xs text-nido-textLight dark:text-dark-textLight space-y-1 mb-3">
              <p>
                <strong>Estudiante:</strong> {ins.nombreEstudiante}
              </p>
              <p>
                <strong>Teléfono registrado:</strong> {ins.telefono}
              </p>
              {ins.mensaje && (
                <p className="italic">
                  <strong>Nota:</strong> "{ins.mensaje}"
                </p>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-nido-border dark:border-dark-border flex items-center justify-between text-xs text-nido-textLight dark:text-dark-textLight">
            <span>
              {ins.createdAt ? new Date(ins.createdAt).toLocaleDateString('es-CO') : ''}
            </span>
            <span className="font-bold text-accent dark:text-accent-light text-sm">
              {ins.materia?.precio
                ? ins.materia.precio.toLocaleString('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    maximumFractionDigits: 0,
                  })
                : ''} / hora
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
