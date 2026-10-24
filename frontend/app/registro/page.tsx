'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../src/features/auth/hooks/useAuth';
import { RegisterForm } from '../../src/features/auth/components/RegisterForm';

function RegistroContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Requisito Rúbrica: Con sesión activa, /registro redirige al inicio
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex-grow flex items-center justify-center px-4 py-12 md:py-16">
      <RegisterForm />
    </div>
  );
}

export default function RegistroPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-grow flex items-center justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      }
    >
      <RegistroContent />
    </Suspense>
  );
}
