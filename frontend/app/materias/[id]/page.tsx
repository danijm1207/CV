'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { materiaService } from '../../../src/features/materias/services/materiaService';
import { Materia } from '../../../src/features/materias/domain/types';
import { Button } from '../../../src/features/common/components/Button';
import { Alert } from '../../../src/features/common/components/Alert';
import { Skeleton } from '../../../src/features/common/components/Skeleton';
import { API_BASE_URL } from '../../../src/features/common/config';

export default function MateriaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const materiaId = Number(params.id);

  const [materia, setMateria] = useState<Materia | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!materiaId || isNaN(materiaId)) {
      setError('Identificador de materia inválido');
      setIsLoading(false);
      return;
    }

    materiaService
      .getMateriaById(materiaId)
      .then((res) => {
        setMateria(res.data);
      })
      .catch((err) => {
        setError(err.message || 'Error al obtener los detalles de la materia');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [materiaId]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 w-full space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (error || !materia) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <Alert type="error" message={error || 'Materia no encontrada'} className="mb-4" />
        <Link
          href="/#catalogo"
          className="inline-block px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg"
        >
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const imageUrl = materia.foto.startsWith('/uploads/')
    ? `${API_BASE_URL.replace('/api', '')}${materia.foto}`
    : materia.foto;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 w-full space-y-6">
      <Link
        href="/#catalogo"
        className="inline-flex items-center gap-1 text-sm font-semibold text-primary dark:text-primary-light hover:underline"
      >
        ← Volver al catálogo de materias
      </Link>

      <div className="bg-nido-surface dark:bg-dark-surface rounded-2xl overflow-hidden border border-nido-border dark:border-dark-border shadow-md">
        <div className="relative h-64 sm:h-80 w-full bg-gray-100 dark:bg-gray-800">
          <img
            src={imageUrl}
            alt={materia.nombreMateria}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80';
            }}
          />
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-semibold">
            {materia.categoria}
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-nido-text dark:text-dark-text">
                {materia.nombreMateria}
              </h1>
              <p className="text-sm font-semibold text-primary dark:text-primary-light mt-1">
                Tutor pedagógico: {materia.tutor}
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-xs text-nido-textLight dark:text-dark-textLight block">Valor de la hora</span>
              <span className="text-2xl font-black text-accent dark:text-accent-light">
                {materia.precio.toLocaleString('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-nido-border dark:border-dark-border flex flex-wrap gap-4 text-xs">
            <div>
              <strong className="block text-nido-text dark:text-dark-text">Modalidad:</strong>
              <span className="text-nido-textLight dark:text-dark-textLight">{materia.modalidad}</span>
            </div>
            <div>
              <strong className="block text-nido-text dark:text-dark-text">Dirigido a:</strong>
              <span className="text-nido-textLight dark:text-dark-textLight">Primaria y Bachillerato</span>
            </div>
            <div>
              <strong className="block text-nido-text dark:text-dark-text">Disponibilidad:</strong>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Horarios flexibles</span>
            </div>
          </div>

          <div>
            <h2 className="text-base font-bold text-nido-text dark:text-dark-text mb-2">
              Descripción del curso
            </h2>
            <p className="text-sm text-nido-textLight dark:text-dark-textLight leading-relaxed">
              {materia.descripcion}
            </p>
          </div>

          <div className="pt-4 border-t border-nido-border dark:border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-nido-textLight dark:text-dark-textLight">
              ¿Listo para comenzar el refuerzo académico de tu hijo?
            </span>
            <Link
              href={`/?materiaId=${materia.id}#contacto`}
              className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-xl text-center shadow-md transition-colors dark:bg-primary-light dark:hover:bg-primary dark:text-dark-bg"
            >
              Inscribirme en esta materia
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
