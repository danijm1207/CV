'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../src/features/auth/hooks/useAuth';
import { useMisInscripciones } from '../../src/features/inscripciones/hooks/useInscripciones';
import { MisInscripcionesList } from '../../src/features/inscripciones/components/MisInscripcionesList';

export default function MisInscripcionesPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { inscripciones, isLoading: isDataLoading, error, refetch } = useMisInscripciones();

  // Requisito Rúbrica: solo usuarios con sesión; sin sesión → redirige a /login
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/login?redirect=/mis-inscripciones');
    }
  }, [isAuthenticated, isAuthLoading, router]);

  if (isAuthLoading) {
    return (
      <div className="flex-grow flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // El useEffect ya ejecuta la redirección
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 w-full">
      <div className="mb-8">
        <span className="text-xs font-bold text-primary dark:text-primary-light uppercase tracking-wider block mb-1">
          Panel de Estudiante / Acudiente
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-nido-text dark:text-dark-text">
          Mis Clases e Inscripciones
        </h1>
        <p className="text-sm text-nido-textLight dark:text-dark-textLight mt-1">
          Consulta y haz seguimiento a las tutorías solicitadas por {user?.nombre}.
        </p>
      </div>

      <MisInscripcionesList
        inscripciones={inscripciones}
        isLoading={isDataLoading}
        error={error}
        onRetry={refetch}
      />
    </div>
  );
}
