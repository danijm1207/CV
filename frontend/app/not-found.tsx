import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="w-24 h-24 mb-6 rounded-full bg-primary/10 dark:bg-primary-light/20 flex items-center justify-center text-4xl">
        🪹
      </div>
      <span className="text-sm font-bold text-accent dark:text-accent-light uppercase tracking-wider mb-2">
        Error 404
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-nido-text dark:text-dark-text mb-3">
        Página no encontrada en NIDO
      </h1>
      <p className="text-base text-nido-textLight dark:text-dark-textLight max-w-md mb-8">
        Lo sentimos, la ruta a la que intentas acceder no existe, ha sido movida o requiere permisos especiales.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl shadow transition-colors dark:bg-primary-light dark:hover:bg-primary dark:text-dark-bg"
        >
          Ir a la página de inicio
        </Link>
        <Link
          href="/#catalogo"
          className="px-6 py-2.5 border border-nido-border dark:border-dark-border text-nido-text dark:text-dark-text text-sm font-semibold rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          Ver catálogo de materias
        </Link>
      </div>
    </div>
  );
}
