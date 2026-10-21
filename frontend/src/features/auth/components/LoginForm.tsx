'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../../common/components/Input';
import { Button } from '../../common/components/Button';
import { Alert } from '../../common/components/Alert';
import { HttpError } from '../../common/http';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Ingresa un formato de correo válido (ej: nombre@dominio.com)';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
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
      await login(formData);
      router.push(redirectUrl);
    } catch (err: unknown) {
      if (err instanceof HttpError) {
        if (err.statusCode === 401) {
          // Error 401 genérico: se muestra sin alert, directamente en la interfaz (Requisito Rúbrica)
          setErrors({
            general: 'Credenciales inválidas. Verifica tu correo y contraseña.',
          });
        } else if (err.errors) {
          setErrors(err.errors);
        } else {
          setErrors({ general: err.message });
        }
      } else {
        setErrors({ general: 'Ocurrió un error inesperado al intentar iniciar sesión' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 md:p-8 bg-nido-surface dark:bg-dark-surface rounded-2xl shadow-xl border border-nido-border dark:border-dark-border">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-nido-text dark:text-dark-text">
          Bienvenido de nuevo a NIDO
        </h1>
        <p className="text-sm text-nido-textLight dark:text-dark-textLight mt-1">
          Ingresa a tu cuenta para gestionar tus clases particulares
        </p>
      </div>

      {errors.general && (
        <Alert type="error" message={errors.general} className="mb-4" />
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
          autoComplete="current-password"
        />

        <Button
          type="submit"
          className="w-full mt-2"
          isLoading={isLoading}
        >
          Iniciar sesión
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-nido-border dark:border-dark-border text-center text-sm text-nido-textLight dark:text-dark-textLight">
        ¿Aún no tienes una cuenta?{' '}
        <Link
          href={`/registro${redirectUrl !== '/' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
          className="font-semibold text-primary dark:text-primary-light hover:underline"
        >
          Regístrate aquí
        </Link>
      </div>

      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-xs text-nido-textLight dark:text-dark-textLight">
        <p className="font-semibold mb-1">Cuentas de prueba (Seed):</p>
        <p>• <strong>Admin:</strong> admin@nido.edu.co / Admin123*</p>
        <p>• <strong>Usuario:</strong> padre@nido.edu.co / Padre123*</p>
      </div>
    </div>
  );
};
