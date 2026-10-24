'use client';

import { useState, useEffect, useCallback } from 'react';
import { Inscripcion } from '../domain/types';
import { inscripcionService } from '../services/inscripcionService';

export function useMisInscripciones() {
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMisInscripciones = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await inscripcionService.getMisInscripciones();
      setInscripciones(response.data || []);
    } catch (err: any) {
      setError(err?.message || 'Error al obtener tus inscripciones');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMisInscripciones();
  }, [fetchMisInscripciones]);

  return {
    inscripciones,
    isLoading,
    error,
    refetch: fetchMisInscripciones,
  };
}

export function useAllInscripciones() {
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllInscripciones = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await inscripcionService.getAll();
      setInscripciones(response.data || []);
    } catch (err: any) {
      setError(err?.message || 'Error al obtener la lista de inscripciones');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllInscripciones();
  }, [fetchAllInscripciones]);

  return {
    inscripciones,
    isLoading,
    error,
    refetch: fetchAllInscripciones,
  };
}
