import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware de Next.js en el servidor (Bonus +3 pts)
 * Valida la existencia del token JWT en la cookie "nido_token"
 * antes de servir las rutas privadas (/mis-inscripciones, /admin).
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('nido_token')?.value;

  // 1. Proteger ruta privada de inscripciones del usuario
  if (pathname.startsWith('/mis-inscripciones')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Proteger ruta privada del panel de administración
  if (pathname.startsWith('/admin')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Si ya tiene sesión activa y visita /login o /registro, redirigir a inicio
  if ((pathname === '/login' || pathname === '/registro') && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/mis-inscripciones/:path*', '/admin/:path*', '/login', '/registro'],
};
