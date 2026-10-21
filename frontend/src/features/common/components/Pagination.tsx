import React from 'react';

interface PaginationProps {
  page: number;
  totalPages: number;
  total?: number;
  onPageChange: (newPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  total,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 w-full"
      aria-label="Paginación del catálogo"
    >
      {total !== undefined && (
        <span className="text-sm text-nido-textLight dark:text-dark-textLight">
          Mostrando página <strong className="text-nido-text dark:text-dark-text">{page}</strong> de{' '}
          <strong className="text-nido-text dark:text-dark-text">{totalPages}</strong> ({total} resultados)
        </span>
      )}

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1.5 rounded-lg border border-nido-border dark:border-dark-border text-sm font-medium text-nido-text dark:text-dark-text bg-nido-surface dark:bg-dark-surface hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Página anterior"
        >
          ← Anterior
        </button>

        <div className="flex items-center gap-1 mx-1">
          {pages.map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
                p === page
                  ? 'bg-primary text-white dark:bg-primary-light dark:text-dark-bg'
                  : 'text-nido-text dark:text-dark-text hover:bg-black/5 dark:hover:bg-white/5'
              }`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1.5 rounded-lg border border-nido-border dark:border-dark-border text-sm font-medium text-nido-text dark:text-dark-text bg-nido-surface dark:bg-dark-surface hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Página siguiente"
        >
          Siguiente →
        </button>
      </div>
    </nav>
  );
};
