'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../../common/components/Modal';
import { Input } from '../../common/components/Input';
import { Textarea } from '../../common/components/Textarea';
import { Select } from '../../common/components/Select';
import { Button } from '../../common/components/Button';
import { Alert } from '../../common/components/Alert';
import { Materia } from '../domain/types';
import { materiaService } from '../services/materiaService';

interface MateriaFormModalProps {
  isOpen: boolean;
  materiaToEdit: Materia | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const MateriaFormModal: React.FC<MateriaFormModalProps> = ({
  isOpen,
  materiaToEdit,
  onClose,
  onSuccess,
}) => {
  const isEditing = !!materiaToEdit;

  const [formData, setFormData] = useState({
    nombreMateria: '',
    descripcion: '',
    precio: '',
    foto: '',
    tutor: '',
    categoria: 'Matemáticas',
    modalidad: 'Virtual y Presencial',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  useEffect(() => {
    if (materiaToEdit) {
      setFormData({
        nombreMateria: materiaToEdit.nombreMateria,
        descripcion: materiaToEdit.descripcion,
        precio: materiaToEdit.precio.toString(),
        foto: materiaToEdit.foto,
        tutor: materiaToEdit.tutor,
        categoria: materiaToEdit.categoria || 'Matemáticas',
        modalidad: materiaToEdit.modalidad || 'Virtual y Presencial',
      });
      setImagePreview(materiaToEdit.foto);
    } else {
      setFormData({
        nombreMateria: '',
        descripcion: '',
        precio: '',
        foto: '/assets/materias/matematicas.jpg',
        tutor: '',
        categoria: 'Matemáticas',
        modalidad: 'Virtual y Presencial',
      });
      setImagePreview('/assets/materias/matematicas.jpg');
    }
    setSelectedFile(null);
    setErrors({});
    setGeneralError(null);
  }, [materiaToEdit, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombreMateria.trim()) {
      newErrors.nombreMateria = 'El nombre de la materia es obligatorio';
    } else if (formData.nombreMateria.trim().length < 3) {
      newErrors.nombreMateria = 'Debe tener al menos 3 caracteres';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    } else if (formData.descripcion.trim().length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }

    if (!formData.precio) {
      newErrors.precio = 'El precio por hora es obligatorio';
    } else if (Number(formData.precio) <= 0) {
      newErrors.precio = 'El precio debe ser un número positivo';
    }

    if (!formData.tutor.trim()) {
      newErrors.tutor = 'El nombre del tutor es obligatorio';
    }

    if (!formData.foto.trim() && !selectedFile) {
      newErrors.foto = 'Se requiere una URL o archivo de imagen';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    setGeneralError(null);

    try {
      let finalFotoUrl = formData.foto;

      // Si el usuario seleccionó un archivo de su disco, subirlo vía /api/upload (Bonus +4 pts)
      if (selectedFile) {
        setIsUploading(true);
        const uploadRes = await materiaService.uploadImage(selectedFile);
        finalFotoUrl = uploadRes.url;
        setIsUploading(false);
      }

      const payload = {
        nombreMateria: formData.nombreMateria.trim(),
        descripcion: formData.descripcion.trim(),
        precio: Number(formData.precio),
        foto: finalFotoUrl,
        tutor: formData.tutor.trim(),
        categoria: formData.categoria,
        modalidad: formData.modalidad,
      };

      if (isEditing && materiaToEdit) {
        await materiaService.updateMateria(materiaToEdit.id, payload);
      } else {
        await materiaService.createMateria(payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setGeneralError(err.message || 'Error al guardar la materia');
      }
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Materia del Catálogo' : 'Crear Nueva Materia'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {generalError && <Alert type="error" message={generalError} />}

        <Input
          label="Nombre de la materia"
          name="nombreMateria"
          placeholder="Ej: Matemáticas básica, Física..."
          value={formData.nombreMateria}
          onChange={(e) => setFormData({ ...formData, nombreMateria: e.target.value })}
          error={errors.nombreMateria}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Tutor asignado"
            name="tutor"
            placeholder="Ej: Laura Gomez"
            value={formData.tutor}
            onChange={(e) => setFormData({ ...formData, tutor: e.target.value })}
            error={errors.tutor}
            required
          />

          <Input
            label="Precio por hora (COP)"
            name="precio"
            type="number"
            placeholder="Ej: 35000"
            value={formData.precio}
            onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
            error={errors.precio}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Categoría"
            name="categoria"
            value={formData.categoria}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
            options={[
              { value: 'Matemáticas', label: 'Matemáticas' },
              { value: 'Ciencias', label: 'Ciencias' },
              { value: 'Humanidades', label: 'Humanidades' },
              { value: 'Idiomas', label: 'Idiomas' },
              { value: 'General', label: 'General' },
            ]}
          />

          <Select
            label="Modalidad"
            name="modalidad"
            value={formData.modalidad}
            onChange={(e) => setFormData({ ...formData, modalidad: e.target.value })}
            options={[
              { value: 'Virtual y Presencial', label: 'Virtual y Presencial' },
              { value: 'Virtual', label: 'Virtual' },
              { value: 'Presencial', label: 'Presencial' },
            ]}
          />
        </div>

        <Textarea
          label="Descripción pedagógica"
          name="descripcion"
          rows={3}
          placeholder="Escribe los temas y enfoque de la clase..."
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          error={errors.descripcion}
          required
        />

        {/* Sección de Imagen con soporte para archivo (Bonus +4 pts) y URL */}
        <div className="p-3 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-nido-border dark:border-dark-border space-y-3">
          <label className="block text-sm font-semibold text-nido-text dark:text-dark-text">
            Imagen de la materia (Archivo o URL)
          </label>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Vista previa"
                className="w-24 h-20 object-cover rounded-lg border border-nido-border dark:border-dark-border"
              />
            )}
            <div className="flex-1 w-full space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-xs text-nido-textLight dark:text-dark-textLight file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer"
              />
              <span className="text-xs text-nido-textLight dark:text-dark-textLight block">
                O ingresa una URL web directa:
              </span>
              <input
                type="text"
                placeholder="https://ejemplo.com/imagen.jpg o /assets/materias/..."
                value={formData.foto}
                onChange={(e) => {
                  setFormData({ ...formData, foto: e.target.value });
                  setImagePreview(e.target.value);
                }}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-nido-border dark:border-dark-border bg-nido-surface dark:bg-dark-surface text-nido-text dark:text-dark-text"
              />
            </div>
          </div>
          {errors.foto && (
            <span className="text-xs text-red-600 dark:text-red-400 block font-medium">
              {errors.foto}
            </span>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-nido-border dark:border-dark-border">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isSaving || isUploading}>
            {isEditing ? 'Guardar Cambios' : 'Crear Materia'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
