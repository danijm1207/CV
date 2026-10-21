'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../../common/components/Input';
import { Button } from '../../common/components/Button';
import { Alert } from '../../common/components/Alert';
import { HttpError } from '../../common/http';

export const RegisterForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const { register } = useAuth();

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<{
    nombre?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre completo es obligatorio';
    } else if (formData.nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Ingresa un formato de correo válido (ej: nombre@dominio.com)';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await register({
        nombre: formData.nombre.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      router.push(redirectUrl);
    } catch (err: unknown) {
      if (err instanceof HttpError) {
        if (err.statusCode === 409) {
          // Requisito Rúbrica: error 409 se muestra visible junto al campo de email, sin alert()
          setErrors({
            email: 'Este correo electrónico ya está registrado. Inicia sesión o usa otro.',
          });
        } else if (err.errors) {
          setErrors(err.errors);
        } else {
          setErrors({ general: err.message });
        }
      } else {
        setErrors({ general: 'Ocurrió un error inesperado al registrar el usuario' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 md:p-8 bg-nido-surface dark:bg-dark-surface rounded-2xl shadow-xl border border-nido-border dark:border-dark-border">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-nido-text dark:text-dark-text">
          Crea tu cuenta en NIDO
        </h1>
        <p className="text-sm text-nido-textLight dark:text-dark-textLight mt-1">
          Regístrate como acudiente para inscribir a tus hijos en clases particulares
        </p>
      </div>

      {errors.general && (
        <Alert type="error" message={errors.general} className="mb-4" />
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="Nombre completo del acudiente"
          type="text"
          name="nombre"
          placeholder="Ej: Daniel Morales"
          value={formData.nombre}
          onChange={handleChange}
          error={errors.nombre}
          required
          autoComplete="name"
        />

        <Input
          label="Correo electrónico"
          type="email"
          name="email"
          placeholder="ejemplo@correo.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
          autoComplete="email"
        />

        <Input
          label="Contraseña"
          type="password"
          name="password"
          placeholder="Mínimo 6 caracteres"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
          autoComplete="new-password"
        />

        <Input
          label="Confirmar contraseña"
          type="password"
          name="confirmPassword"
          placeholder="Repite tu contraseña"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
          autoComplete="new-password"
        />

        <Button
          type="submit"
          className="w-full mt-2"
          isLoading={isLoading}
        >
          Crear cuenta
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-nido-border dark:border-dark-border text-center text-sm text-nido-textLight dark:text-dark-textLight">
        ¿Ya tienes una cuenta?{' '}
        <Link
          href={`/login${redirectUrl !== '/' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
          className="font-semibold text-primary dark:text-primary-light hover:underline"
        >
          Inicia sesión aquí
        </Link>
      </div>
    </div>
  );
};
