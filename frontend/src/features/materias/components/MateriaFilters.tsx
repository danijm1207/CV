'use client';

import React, { useState } from 'react';
import { MateriaFilter } from '../domain/types';

interface MateriaFiltersProps {
  onFilterChange: (filters: Partial<MateriaFilter>) => void;
  categories?: string[];
}

export const MateriaFilters: React.FC<MateriaFiltersProps> = ({
  onFilterChange,
  categories = ['Todas', 'Matemáticas', 'Ciencias', 'Humanidades', 'Idiomas'],
}) => {
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({
      search: search.trim() || undefined,
      categoria: categoria !== 'Todas' ? categoria : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
  };

  const handleReset = () => {
    setSearch('');
    setCategoria('Todas');
    setMinPrice('');
    setMaxPrice('');
    onFilterChange({
      search: undefined,
      categoria: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    });
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="p-4 mb-6 bg-nido-surface dark:bg-dark-surface rounded-xl border border-nido-border dark:border-dark-border shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-end flex-wrap"
    >
      {/* 1. Búsqueda por texto */}
      <div className="flex-1 min-w-[200px]">
        <label
          htmlFor="search-input"
          className="block text-xs font-semibold text-nido-textLight dark:text-dark-textLight mb-1"
        >
          Buscar materia o tutor
        </label>
        <input
          id="search-input"
          type="text"
          placeholder="Ej: Matemáticas, Física..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg border border-nido-border dark:border-dark-border bg-nido-surface dark:bg-dark-surface text-nido-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light"
        />
      </div>

      {/* 2. Filtro por categoría */}
      <div className="min-w-[150px]">
        <label
          htmlFor="category-select"
          className="block text-xs font-semibold text-nido-textLight dark:text-dark-textLight mb-1"
        >
          Categoría
        </label>
        <select
          id="category-select"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg border border-nido-border dark:border-dark-border bg-nido-surface dark:bg-dark-surface text-nido-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* 3. Filtro por rango de precio */}
      <div className="flex gap-2 min-w-[200px]">
        <div className="flex-1">
          <label
            htmlFor="min-price"
            className="block text-xs font-semibold text-nido-textLight dark:text-dark-textLight mb-1"
          >
            Precio mín.
          </label>
          <input
            id="min-price"
            type="number"
            placeholder="$ 0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-nido-border dark:border-dark-border bg-nido-surface dark:bg-dark-surface text-nido-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light"
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor="max-price"
            className="block text-xs font-semibold text-nido-textLight dark:text-dark-textLight mb-1"
          >
            Precio máx.
          </label>
          <input
            id="max-price"
            type="number"
            placeholder="$ 100k"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-nido-border dark:border-dark-border bg-nido-surface dark:bg-dark-surface text-nido-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light"
          />
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg transition-colors dark:bg-primary-light dark:hover:bg-primary dark:text-dark-bg"
        >
          Filtrar
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-3 py-2 text-sm font-semibold text-nido-textLight dark:text-dark-textLight hover:text-nido-text dark:hover:text-dark-text border border-nido-border dark:border-dark-border rounded-lg transition-colors"
        >
          Limpiar
        </button>
      </div>
    </form>
  );
};
