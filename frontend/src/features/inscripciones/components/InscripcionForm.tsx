'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../auth/hooks/useAuth';
import { Materia } from '../../materias/domain/types';
import { inscripcionService } from '../services/inscripcionService';
import { Input } from '../../common/components/Input';
import { Select } from '../../common/components/Select';
import { Textarea } from '../../common/components/Textarea';
import { Button } from '../../common/components/Button';
import { Alert } from '../../common/components/Alert';

interface InscripcionFormProps {
  materias: Materia[];
  selectedMateriaId?: number | null;
}

export const InscripcionForm: React.FC<InscripcionFormProps> = ({
  materias,
  selectedMateriaId,
}) => {
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    nombreEstudiante: '',
    correoAcudiente: '',
    telefono: '',
    materiaId: selectedMateriaId ? selectedMateriaId.toString() : '',
    mensaje: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Pre-llenar correo si el acudiente tiene sesión iniciada
  useEffect(() => {
    if (user?.email && !formData.correoAcudiente) {
      setFormData((prev) => ({ ...prev, correoAcudiente: user.email }));
    }
  }, [user]);

  // Actualizar materia si viene preseleccionada
  useEffect(() => {
    if (selectedMateriaId) {
      setFormData((prev) => ({ ...prev, materiaId: selectedMateriaId.toString() }));
    }
  }, [selectedMateriaId]);

  // Reglas de validación idénticas a la Entrega 1 (Grupo B de validaciones)
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'nombreEstudiante':
        if (!value.trim()) return 'El nombre del estudiante es obligatorio.';
        if (value.trim().length < 3) return 'Debe tener al menos 3 caracteres.';
        return '';
      case 'correoAcudiente':
        if (!value.trim()) return 'El correo es obligatorio.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return 'Ingresa un correo válido (ej: nombre@dominio.com).';
        }
        return '';
      case 'telefono':
        if (!value.trim()) return 'El teléfono es obligatorio.';
        if (!/^[0-9]{7,10}$/.test(value.trim())) {
          return 'Usa solo números (7 a 10 dígitos).';
        }
        return '';
      case 'materiaId':
        if (!value) return 'Selecciona una materia.';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const errorMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const errorMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(false);
    setApiError(null);

    // Validar todos los campos antes de enviar
    const newErrors: Record<string, string> = {
      nombreEstudiante: validateField('nombreEstudiante', formData.nombreEstudiante),
      correoAcudiente: validateField('correoAcudiente', formData.correoAcudiente),
      telefono: validateField('telefono', formData.telefono),
      materiaId: validateField('materiaId', formData.materiaId),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((err) => err !== '');
    if (hasErrors) return;

    if (!isAuthenticated) {
      setApiError('Debes iniciar sesión con tu cuenta de acudiente para completar la inscripción');
      return;
    }

    setIsSubmitting(true);

    try {
      await inscripcionService.create({
        nombreEstudiante: formData.nombreEstudiante.trim(),
        correoAcudiente: formData.correoAcudiente.trim(),
        telefono: formData.telefono.trim(),
        materiaId: Number(formData.materiaId),
        mensaje: formData.mensaje.trim() || null,
      });

      setSuccessMessage(true);
      setFormData({
        nombreEstudiante: '',
        correoAcudiente: user?.email || '',
        telefono: '',
        materiaId: '',
        mensaje: '',
      });
      setErrors({});
    } catch (err: any) {
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setApiError(err.message || 'Ocurrió un error al procesar tu inscripción en el servidor');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const optionsMaterias = materias.map((m) => ({
    value: m.id,
    label: `${m.nombreMateria} (${m.tutor})`,
  }));

  return (
    <div className="w-full max-w-xl mx-auto bg-nido-surface dark:bg-dark-surface p-6 md:p-8 rounded-2xl border border-nido-border dark:border-dark-border shadow-md">
      {!isAuthenticated && (
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs sm:text-sm text-amber-800 dark:text-amber-300">
            <strong>¿Quieres inscribir a tu hijo?</strong> Inicia sesión o regístrate para que la inscripción quede registrada a tu nombre.
          </div>
          <Link
            href="/login?redirect=/#contacto"
            className="text-xs font-semibold whitespace-nowrap bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>
      )}

      {apiError && <Alert type="error" message={apiError} className="mb-4" />}

      {successMessage && (
        <div
          id="mensaje-exito"
          className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-sm font-semibold flex items-center gap-2"
          role="status"
          aria-live="polite"
        >
          <span>✓</span>
          <span>¡Gracias! Hemos recibido tu inscripción y te contactaremos pronto.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Nombre del estudiante"
          name="nombreEstudiante"
          placeholder="Ej: Mateo Morales"
          value={formData.nombreEstudiante}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.nombreEstudiante}
          required
        />

        <Input
          label="Correo del acudiente"
          type="email"
          name="correoAcudiente"
          placeholder="ejemplo@correo.com"
          value={formData.correoAcudiente}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.correoAcudiente}
          required
        />

        <Input
          label="Teléfono de contacto"
          type="tel"
          name="telefono"
          placeholder="Ej: 3001234567"
          value={formData.telefono}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.telefono}
          required
        />

        <Select
          label="Materia de interés"
          name="materiaId"
          value={formData.materiaId}
          onChange={handleChange}
          onBlur={handleBlur}
          options={optionsMaterias}
          placeholderOption="Selecciona una materia"
          error={errors.materiaId}
          required
        />

        <Textarea
          label="Mensaje (opcional)"
          name="mensaje"
          rows={3}
          placeholder="Comentarios adicionales o dificultades específicas del estudiante..."
          value={formData.mensaje}
          onChange={handleChange}
        />

        <Button
          type="submit"
          className="w-full"
          isLoading={isSubmitting}
        >
          Enviar inscripción
        </Button>
      </form>
    </div>
  );
};
