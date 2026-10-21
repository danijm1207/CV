'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../auth/hooks/useAuth';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Inicializar modo oscuro respetando la Entrega 1
  useEffect(() => {
    const savedTheme = localStorage.getItem('tema');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-mode');
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    localStorage.setItem('tema', nextDark ? 'dark' : 'light');

    if (nextDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-mode');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-nido-surface dark:bg-dark-surface border-b border-nido-border dark:border-dark-border shadow-sm transition-colors">
      <nav
        className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4"
        aria-label="Navegación principal"
      >
        {/* Logo / Marca NIDO */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-primary-dark dark:text-primary-light flex items-center gap-1.5"
        >
          <span className="text-2xl">🪺</span>
          <span>NIDO</span>
        </Link>

        {/* Links principales (Desktop) */}
        <ul className="hidden md:flex items-center gap-6 list-none m-0 p-0 text-sm font-medium text-nido-text dark:text-dark-text">
          <li>
            <Link
              href="/#catalogo"
              className="hover:text-primary dark:hover:text-primary-light transition-colors"
            >
              Catálogo
            </Link>
          </li>
          <li>
            <Link
              href="/#sobre-nosotros"
              className="hover:text-primary dark:hover:text-primary-light transition-colors"
            >
              Sobre nosotros
            </Link>
          </li>
          <li>
            <Link
              href="/#contacto"
              className="hover:text-primary dark:hover:text-primary-light transition-colors"
            >
              Inscripción
            </Link>
          </li>

          {/* Si el usuario tiene sesión activa */}
          {isAuthenticated && (
            <li>
              <Link
                href="/mis-inscripciones"
                className="hover:text-primary dark:hover:text-primary-light transition-colors font-semibold"
              >
                Mis Clases
              </Link>
            </li>
          )}

          {/* Si el usuario es administrador (Requisito Rúbrica) */}
          {isAdmin && (
            <li>
              <Link
                href="/admin"
                className="px-2.5 py-1 rounded-md bg-primary/10 dark:bg-primary-light/20 text-primary-dark dark:text-primary-light font-bold text-xs uppercase tracking-wider hover:bg-primary/20 transition-colors"
              >
                Administración
              </Link>
            </li>
          )}
        </ul>

        {/* Controles de Sesión y Modo Oscuro */}
        <div className="flex items-center gap-3">
          {/* Botón de cambio de tema (Dark Mode) idéntico a Entrega 1 */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-nido-border dark:border-dark-border text-xs font-semibold text-nido-text dark:text-dark-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {isDarkMode ? '☀️ Claro' : '🌙 Oscuro'}
          </button>

          {/* Estado dinámico de sesión según rúbrica:
              - Invitado ve "Ingresar"
              - Usuario ve su nombre y "Salir"
              - Admin ve además "Administración" */}
          {isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs font-medium text-nido-textLight dark:text-dark-textLight">
                Hola, <strong className="text-nido-text dark:text-dark-text">{user?.nombre.split(' ')[0]}</strong>
              </span>
              <button
                type="button"
                onClick={logout}
                className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline px-2 py-1"
              >
                Salir
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-nido-border dark:border-dark-border text-nido-text dark:text-dark-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Ingresar
              </Link>
              <Link
                href="/registro"
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-dark text-white dark:bg-primary-light dark:hover:bg-primary dark:text-dark-bg transition-colors"
              >
                Registrarse
              </Link>
            </div>
          )}

          {/* Botón menú móvil */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-nido-text dark:text-dark-text hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Abrir menú"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Menú desplegable móvil */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 border-t border-nido-border dark:border-dark-border bg-nido-surface dark:bg-dark-surface space-y-3">
          <ul className="list-none m-0 p-0 space-y-2 text-sm font-medium">
            <li>
              <Link
                href="/#catalogo"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-1 hover:text-primary dark:hover:text-primary-light"
              >
                Catálogo
              </Link>
            </li>
            <li>
              <Link
                href="/#sobre-nosotros"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-1 hover:text-primary dark:hover:text-primary-light"
              >
                Sobre nosotros
              </Link>
            </li>
            <li>
              <Link
                href="/#contacto"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-1 hover:text-primary dark:hover:text-primary-light"
              >
                Inscripción
              </Link>
            </li>

            {isAuthenticated && (
              <li>
                <Link
                  href="/mis-inscripciones"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-1 font-semibold text-primary dark:text-primary-light"
                >
                  Mis Clases
                </Link>
              </li>
            )}

            {isAdmin && (
              <li>
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-1 font-bold text-accent dark:text-accent-light"
                >
                  Panel de Administración
                </Link>
              </li>
            )}
          </ul>

          <div className="pt-3 border-t border-nido-border dark:border-dark-border">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <span className="text-xs text-nido-textLight dark:text-dark-textLight">
                  Sesión: <strong>{user?.nombre}</strong> ({user?.role})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="text-xs font-semibold text-red-600 dark:text-red-400"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-xs font-semibold rounded-lg border border-nido-border dark:border-dark-border"
                >
                  Ingresar
                </Link>
                <Link
                  href="/registro"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-xs font-semibold rounded-lg bg-primary text-white"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
