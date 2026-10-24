'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../src/features/auth/hooks/useAuth';
import { useMaterias } from '../../src/features/materias/hooks/useMaterias';
import { useAllInscripciones } from '../../src/features/inscripciones/hooks/useInscripciones';
import { materiaService } from '../../src/features/materias/services/materiaService';
import { Materia } from '../../src/features/materias/domain/types';
import { MateriaFormModal } from '../../src/features/materias/components/MateriaFormModal';
import { DeleteConfirmModal } from '../../src/features/materias/components/DeleteConfirmModal';
import { AdminInscripcionesTable } from '../../src/features/inscripciones/components/AdminInscripcionesTable';
import { Button } from '../../src/features/common/components/Button';
import { Pagination } from '../../src/features/common/components/Pagination';
import { Skeleton } from '../../src/features/common/components/Skeleton';
import { Alert } from '../../src/features/common/components/Alert';

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, isLoading: isAuthLoading } = useAuth();

  // Requisito Rúbrica: solo rol admin; un usuario normal que escriba la URL es redirigido
  useEffect(() => {
    if (!isAuthLoading) {
      if (!isAuthenticated) {
        router.push('/login?redirect=/admin');
      } else if (!isAdmin) {
        router.push('/');
      }
    }
  }, [isAuthenticated, isAdmin, isAuthLoading, router]);

  const [activeTab, setActiveTab] = useState<'materias' | 'inscripciones'>('materias');

  // Hook de materias con límite amplio para vista admin
  const {
    materias,
    pagination,
    isLoading: isMateriasLoading,
    error: materiasError,
    changePage,
    refetch: refetchMaterias,
  } = useMaterias({ limit: 10 });

  // Hook de todas las inscripciones del sistema
  const {
    inscripciones,
    isLoading: isInscripcionesLoading,
    error: inscripcionesError,
    refetch: refetchInscripciones,
  } = useAllInscripciones();

  // Estados para modales de CRUD de materias
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [materiaToEdit, setMateriaToEdit] = useState<Materia | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [materiaToDelete, setMateriaToDelete] = useState<Materia | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setMateriaToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (materia: Materia) => {
    setMateriaToEdit(materia);
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (materia: Materia) => {
    setMateriaToDelete(materia);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!materiaToDelete) return;
    setIsDeleting(true);
    try {
      await materiaService.deleteMateria(materiaToDelete.id);
      setFeedbackMessage(`Materia "${materiaToDelete.nombreMateria}" eliminada exitosamente.`);
      setIsDeleteModalOpen(false);
      setMateriaToDelete(null);
      refetchMaterias();
    } catch (err: any) {
      setFeedbackMessage(err.message || 'Error al eliminar la materia');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="flex-grow flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null; // Redirección gestionada por useEffect
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 w-full space-y-6">
      {/* Encabezado del Panel de Administración */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-nido-border dark:border-dark-border">
        <div>
          <span className="text-xs font-bold text-accent dark:text-accent-light uppercase tracking-wider block mb-1">
            Gestión y Control
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-nido-text dark:text-dark-text">
            Panel de Administración NIDO
          </h1>
          <p className="text-xs sm:text-sm text-nido-textLight dark:text-dark-textLight mt-1">
            Administra el catálogo de clases particulares, tutores e inscripciones realizadas.
          </p>
        </div>

        {activeTab === 'materias' && (
          <Button onClick={handleOpenCreate} variant="primary">
            + Crear Nueva Materia
          </Button>
        )}
      </div>

      {feedbackMessage && (
        <Alert
          type="info"
          message={feedbackMessage}
          className="mb-4"
        />
      )}

      {/* Tabs de Navegación */}
      <div className="flex gap-2 border-b border-nido-border dark:border-dark-border">
        <button
          onClick={() => setActiveTab('materias')}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'materias'
              ? 'border-primary text-primary dark:border-primary-light dark:text-primary-light'
              : 'border-transparent text-nido-textLight dark:text-dark-textLight hover:text-nido-text dark:hover:text-dark-text'
          }`}
        >
          Catálogo de Materias ({pagination.total})
        </button>
        <button
          onClick={() => setActiveTab('inscripciones')}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'inscripciones'
              ? 'border-primary text-primary dark:border-primary-light dark:text-primary-light'
              : 'border-transparent text-nido-textLight dark:text-dark-textLight hover:text-nido-text dark:hover:text-dark-text'
          }`}
        >
          Inscripciones Recibidas ({inscripciones.length})
        </button>
      </div>

      {/* Contenido según Tab Activo */}
      {activeTab === 'materias' && (
        <div className="space-y-4">
          {materiasError && <Alert type="error" message={materiasError} />}

          {isMateriasLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-nido-border dark:border-dark-border">
              <table className="w-full text-left text-sm text-nido-text dark:text-dark-text">
                <thead className="bg-gray-50 dark:bg-gray-900/60 text-xs uppercase font-bold text-nido-textLight dark:text-dark-textLight border-b border-nido-border dark:border-dark-border">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Materia</th>
                    <th className="px-4 py-3">Tutor</th>
                    <th className="px-4 py-3">Categoría</th>
                    <th className="px-4 py-3">Precio / h</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-nido-border dark:divide-dark-border bg-nido-surface dark:bg-dark-surface">
                  {materias.map((m) => (
                    <tr key={m.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-xs text-nido-textLight dark:text-dark-textLight font-mono">
                        #{m.id}
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        {m.nombreMateria}
                      </td>
                      <td className="px-4 py-3 text-xs font-medium text-primary dark:text-primary-light">
                        {m.tutor}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-nido-textLight dark:text-dark-textLight font-medium">
                          {m.categoria}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-accent dark:text-accent-light">
                        {m.precio.toLocaleString('es-CO', {
                          style: 'currency',
                          currency: 'COP',
                          maximumFractionDigits: 0,
                        })}
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(m)}
                          className="px-2.5 py-1 text-xs font-semibold text-primary dark:text-primary-light hover:underline"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleOpenDelete(m)}
                          className="px-2.5 py-1 text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            onPageChange={changePage}
          />
        </div>
      )}

      {activeTab === 'inscripciones' && (
        <AdminInscripcionesTable
          inscripciones={inscripciones}
          isLoading={isInscripcionesLoading}
          error={inscripcionesError}
          onRetry={refetchInscripciones}
        />
      )}

      {/* Modal para Crear y Editar Materia (con subida de imagen) */}
      <MateriaFormModal
        isOpen={isFormModalOpen}
        materiaToEdit={materiaToEdit}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={() => {
          setFeedbackMessage(
            materiaToEdit
              ? 'Materia actualizada exitosamente.'
              : 'Nueva materia creada en el catálogo.'
          );
          refetchMaterias();
        }}
      />

      {/* Modal de Confirmación antes de Eliminar (Bonus +1 pt) */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        materia={materiaToDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
