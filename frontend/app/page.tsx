'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMaterias } from '../src/features/materias/hooks/useMaterias';
import { MateriaGrid } from '../src/features/materias/components/MateriaGrid';
import { MateriaFilters } from '../src/features/materias/components/MateriaFilters';
import { InscripcionForm } from '../src/features/inscripciones/components/InscripcionForm';
import { Materia } from '../src/features/materias/domain/types';

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlPage = Number(searchParams.get('page')) || 1;

  const {
    materias,
    pagination,
    isLoading,
    error,
    changePage,
    applyFilters,
    refetch,
  } = useMaterias({ page: urlPage, limit: 6 });

  const [selectedMateria, setSelectedMateria] = useState<Materia | null>(null);

  // Sincronizar cambios de página con la URL (?page=X) según rúbrica
  const handlePageChange = (newPage: number) => {
    changePage(newPage);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/?${params.toString()}#catalogo`, { scroll: false });
  };

  const handleSelectMateria = (materia: Materia) => {
    setSelectedMateria(materia);
    const contactoElement = document.getElementById('contacto');
    if (contactoElement) {
      contactoElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero idéntico a la Entrega 1 */}
      <section
        id="inicio"
        className="w-full bg-gradient-to-b from-primary/10 via-nido-bg to-nido-bg dark:from-dark-surface dark:via-dark-bg dark:to-dark-bg py-16 md:py-24 border-b border-nido-border dark:border-dark-border"
      >
        <div className="max-w-5xl mx-auto px-4 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <span className="inline-block px-3 py-1 bg-primary/10 dark:bg-primary-light/20 text-primary-dark dark:text-primary-light text-xs font-bold rounded-full uppercase tracking-wider">
              Acompañamiento Escolar Personalizado
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-nido-text dark:text-dark-text tracking-tight leading-tight">
              Clases particulares para niños de colegio, virtuales y presenciales
            </h1>
            <p className="text-base sm:text-lg text-nido-textLight dark:text-dark-textLight max-w-xl">
              Conectamos a tu hijo o hija con tutores especializados en las materias donde más lo necesita.
            </p>
            <div className="flex flex-wrap gap-3 pt-2 justify-center md:justify-start">
              <a
                href="#catalogo"
                className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl shadow-md transition-colors dark:bg-primary-light dark:hover:bg-primary dark:text-dark-bg text-sm"
              >
                Ver catálogo de materias
              </a>
              <a
                href="#contacto"
                className="px-6 py-3 border border-nido-border dark:border-dark-border bg-nido-surface dark:bg-dark-surface text-nido-text dark:text-dark-text font-semibold rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm"
              >
                Inscribirme a una clase
              </a>
            </div>
          </div>

          <div className="w-full md:w-auto flex justify-center">
            <div className="w-64 h-64 md:w-72 md:h-72 rounded-3xl bg-primary/10 dark:bg-primary-light/10 border-2 border-primary/20 dark:border-primary-light/20 p-6 flex flex-col items-center justify-center text-center shadow-inner">
              <span className="text-6xl mb-3">🎓</span>
              <p className="text-sm font-bold text-nido-text dark:text-dark-text">Aprender con confianza</p>
              <p className="text-xs text-nido-textLight dark:text-dark-textLight mt-1">
                Refuerzo escolar flexible adaptado al ritmo de cada estudiante.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Catálogo Dinámico desde la API REST */}
      <section id="catalogo" className="max-w-6xl mx-auto px-4 py-16 w-full">
        <div className="text-center md:text-left mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-nido-text dark:text-dark-text">
            Nuestras materias
          </h2>
          <p className="text-sm text-nido-textLight dark:text-dark-textLight mt-1">
            Explora las áreas académicas disponibles y encuentra el tutor ideal para tu hijo
          </p>
        </div>

        {/* Filtros combinados de búsqueda, categoría y precio (Bonus +2 pts) */}
        <MateriaFilters onFilterChange={applyFilters} />

        {/* Grid de materias con estados de cargando, vacío, error y paginación */}
        <MateriaGrid
          materias={materias}
          pagination={pagination}
          isLoading={isLoading}
          error={error}
          onPageChange={handlePageChange}
          onRetry={refetch}
          onSelectMateria={handleSelectMateria}
        />
      </section>

      {/* 3. Sección Sobre Nosotros idéntica a la Entrega 1 */}
      <section
        id="sobre-nosotros"
        className="w-full bg-nido-surface dark:bg-dark-surface py-16 border-y border-nido-border dark:border-dark-border"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-3xl mb-10 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-nido-text dark:text-dark-text mb-3">
              Sobre nosotros
            </h2>
            <p className="text-base text-nido-textLight dark:text-dark-textLight leading-relaxed">
              En NIDO nos dedicamos a conectar a estudiantes de colegio con tutores apasionados y calificados. Nuestra misión es brindar un acompañamiento personalizado que fortalezca la confianza, el rendimiento académico y el gusto por aprender.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-nido-bg dark:bg-dark-bg rounded-2xl border border-nido-border dark:border-dark-border space-y-2">
              <span className="text-3xl mb-1 block">👨‍🏫</span>
              <h3 className="text-lg font-bold text-primary-dark dark:text-primary-light">
                Tutores Especializados
              </h3>
              <p className="text-sm text-nido-textLight dark:text-dark-textLight">
                Docentes y profesionales seleccionados por su excelencia pedagógica y calidez humana.
              </p>
            </div>

            <div className="p-6 bg-nido-bg dark:bg-dark-bg rounded-2xl border border-nido-border dark:border-dark-border space-y-2">
              <span className="text-3xl mb-1 block">🎯</span>
              <h3 className="text-lg font-bold text-primary-dark dark:text-primary-light">
                Clases Personalizadas
              </h3>
              <p className="text-sm text-nido-textLight dark:text-dark-textLight">
                Adaptamos cada sesión al ritmo, estilo de aprendizaje y necesidades específicas de cada estudiante.
              </p>
            </div>

            <div className="p-6 bg-nido-bg dark:bg-dark-bg rounded-2xl border border-nido-border dark:border-dark-border space-y-2">
              <span className="text-3xl mb-1 block">💻</span>
              <h3 className="text-lg font-bold text-primary-dark dark:text-primary-light">
                Virtual o Presencial
              </h3>
              <p className="text-sm text-nido-textLight dark:text-dark-textLight">
                Ofrecemos flexibilidad de modalidad para adaptarnos a los horarios y comodidad de tu hogar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Formulario de Inscripción conectado de verdad a la base de datos de la API */}
      <section id="contacto" className="max-w-6xl mx-auto px-4 py-16 w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-nido-text dark:text-dark-text">
            Inscríbete a una clase
          </h2>
          <p className="text-sm text-nido-textLight dark:text-dark-textLight mt-1">
            Completa el formulario para reservar tu primera sesión de tutoría con uno de nuestros docentes.
          </p>
        </div>

        <InscripcionForm
          materias={materias}
          selectedMateriaId={selectedMateria ? selectedMateria.id : null}
        />
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex-grow flex items-center justify-center p-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
