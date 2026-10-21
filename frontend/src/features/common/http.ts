import { API_BASE_URL } from './config';

export class HttpError extends Error {
  public statusCode: number;
  public errors?: Record<string, string>;

  constructor(message: string, statusCode: number, errors?: Record<string, string>) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

const TOKEN_KEY = 'nido_auth_token';
const USER_KEY = 'nido_auth_user';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  // También guardar en cookie para permitir validaciones en servidor (Bonus de middleware/proxy)
  document.cookie = `nido_token=${token}; path=/; max-age=604800; SameSite=Lax`;
}

export function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = 'nido_token=; path=/; max-age=0; SameSite=Lax';
}

export function getStoredUser(): any | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredUser(user: any): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Cliente HTTP centralizado.
 * Inyecta Authorization: Bearer <token> automáticamente.
 * Si recibe 401, cierra la sesión y redirige a /login (Requisito Rúbrica).
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Si no se envía FormData, se asume Content-Type: application/json
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  // Inyección automática del token de autenticación
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Manejo del error 401: expiración o token inválido
  if (response.status === 401) {
    removeToken();
    if (typeof window !== 'undefined') {
      // Disparar evento para que useAuth actualice su estado
      window.dispatchEvent(new Event('nido-auth-expired'));

      // Redirigir a login si la ruta actual no es pública
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/registro') {
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }
    }

    let errorData: any = {};
    try {
      errorData = await response.json();
    } catch {
      // ignorar error de parseo
    }
    throw new HttpError(
      errorData.error || 'Sesión expirada o credenciales inválidas. Por favor ingresa nuevamente.',
      401,
      errorData.errors
    );
  }

  // Si la respuesta no es exitosa (400, 403, 404, 409, 500)
  if (!response.ok) {
    let errorData: any = {};
    try {
      errorData = await response.json();
    } catch {
      errorData = { error: response.statusText || 'Error en la petición' };
    }

    throw new HttpError(
      errorData.error || `Error ${response.status}: Ocurrió un error en el servidor`,
      response.status,
      errorData.errors
    );
  }

  // Si la respuesta no tiene contenido (204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const http = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),

  upload: <T>(endpoint: string, formData: FormData, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
    }),
};
