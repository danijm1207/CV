'use client';

import React from 'react';
import { Modal } from '../../common/components/Modal';
import { Button } from '../../common/components/Button';
import { Materia } from '../domain/types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  materia: Materia | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  materia,
  onClose,
  onConfirm,
  isDeleting,
}) => {
  if (!materia) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmar eliminación de materia"
      maxWidth="sm"
    >
      <div className="space-y-4">
        <p className="text-sm text-nido-textLight dark:text-dark-textLight">
          ¿Estás seguro de que deseas eliminar permanentemente la materia{' '}
          <strong className="text-nido-text dark:text-dark-text">"{materia.nombreMateria}"</strong>?
        </p>

        <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-2.5 rounded-lg border border-red-200 dark:border-red-900">
          ⚠️ Esta acción no se puede deshacer y también eliminará las inscripciones vinculadas a esta materia.
        </p>

        <div className="flex justify-end gap-2 pt-2 border-t border-nido-border dark:border-dark-border">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={onConfirm}
            isLoading={isDeleting}
          >
            Sí, eliminar materia
          </Button>
        </div>
      </div>
    </Modal>
  );
};
