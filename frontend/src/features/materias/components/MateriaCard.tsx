import React from 'react';
import Link from 'next/link';
import { Materia } from '../domain/types';
import { API_BASE_URL } from '../../common/config';

interface MateriaCardProps {
  materia: Materia;
  onSelect?: (materia: Materia) => void;
}

export const MateriaCard: React.FC<MateriaCardProps> = ({ materia, onSelect }) => {
  const precioFormateado = materia.precio.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  });

  // Si la imagen es una subida local del backend, construir la URL completa
  const imageUrl = materia.foto.startsWith('/uploads/')
    ? `${API_BASE_URL.replace('/api', '')}${materia.foto}`
    : materia.foto;

  return (
    <article className="flex flex-col bg-nido-surface dark:bg-dark-surface rounded-xl overflow-hidden border border-nido-border dark:border-dark-border shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-44 w-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <img
          src={imageUrl}
          alt={materia.nombreMateria}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            // Fallback en caso de error cargando la imagen
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80';
          }}
        />
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-medium">
          {materia.categoria}
        </div>
      </div>

      <div className="flex flex-col flex-grow p-4">
        <h3 className="text-lg font-bold text-nido-text dark:text-dark-text mb-1 line-clamp-1">
          {materia.nombreMateria}
        </h3>
        <p className="text-xs font-semibold text-primary dark:text-primary-light mb-2">
          Tutor: {materia.tutor}
        </p>
        <p className="text-sm text-nido-textLight dark:text-dark-textLight mb-4 line-clamp-2 flex-grow">
          {materia.descripcion}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-nido-border dark:border-dark-border mt-auto">
          <div>
            <span className="text-xs text-nido-textLight dark:text-dark-textLight block">Inversión</span>
            <span className="text-base font-bold text-accent dark:text-accent-light">
              {precioFormateado} <span className="text-xs font-normal text-nido-textLight dark:text-dark-textLight">/ hora</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/materias/${materia.id}`}
              className="text-xs font-semibold text-nido-textLight dark:text-dark-textLight hover:text-primary dark:hover:text-primary-light px-2 py-1.5 rounded-lg border border-nido-border dark:border-dark-border transition-colors"
            >
              Detalles
            </Link>
            {onSelect ? (
              <button
                type="button"
                onClick={() => onSelect(materia)}
                className="text-xs font-semibold bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-lg transition-colors dark:bg-primary-light dark:hover:bg-primary dark:text-dark-bg"
              >
                Inscribirme
              </button>
            ) : (
              <a
                href="#contacto"
                className="text-xs font-semibold bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-lg transition-colors dark:bg-primary-light dark:hover:bg-primary dark:text-dark-bg"
              >
                Inscribirme
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
