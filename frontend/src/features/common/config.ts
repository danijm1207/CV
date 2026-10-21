/**
 * Configuración centralizada de URLs de la API
 * Lee la URL base desde la variable de entorno NEXT_PUBLIC_API_HOST
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:4000/api';
