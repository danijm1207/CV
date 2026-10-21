import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-8 bg-primary-dark text-white text-center border-t border-nido-border dark:border-dark-border">
      <div className="max-w-6xl mx-auto px-4 space-y-2">
        <p className="text-sm font-medium tracking-wide">
          &copy; 2026 NIDO. Proyecto académico - Desarrollo Web.
        </p>
        <p className="text-xs text-white/70">
          Diseñado y desarrollado por Daniel Morales · Universidad de Medellín
        </p>
      </div>
    </footer>
  );
};
