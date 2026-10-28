# NIDO — Plataforma de Clases Particulares (Frontend Next.js)

Aplicación frontend moderna desarrollada en **Next.js (App Router)**, **TypeScript** y **Tailwind CSS** para la plataforma de clases particulares **NIDO**, manteniendo fielmente el dominio, contenido e identidad visual de la Entrega 1.

---

## 1. Enlaces de Despliegue

- **Sitio Web (Frontend desplegado en Vercel):** [https://nido-frontendd.vercel.app/](https://nido-frontendd.vercel.app/)
- **API REST (Backend desplegado en Render):** [https://nido-backend-p62h.onrender.com](https://nido-backend-p62h.onrender.com)
- **Repositorio Frontend en GitHub:** [https://github.com/danijm1207/nido-frontendd.git](https://github.com/danijm1207/nido-frontendd.git)
- **Repositorio Backend en GitHub:** [https://github.com/danijm1207/nido-backend](https://github.com/danijm1207/nido-backend)

---

## 2. Organización por Features

El proyecto implementa la arquitectura modular por features solicitada en la rúbrica de clase:

```text
frontend/
├── app/                              → Rutas con App Router (solo componen componentes)
│   ├── layout.tsx                    → Layout global con AuthProvider, Navbar y Footer
│   ├── page.tsx                      → Página principal (Hero, Catálogo, Sobre nosotros, Formulario)
│   ├── materias/[id]/page.tsx        → Vista de detalle pedagógico de cada materia
│   ├── login/page.tsx                → Inicio de sesión (redirige al inicio si ya hay sesión)
│   ├── registro/page.tsx             → Registro de acudientes (redirige si ya hay sesión)
│   ├── mis-inscripciones/page.tsx    → Ruta privada para usuarios autenticados
│   ├── admin/page.tsx                → Ruta privada y protegida exclusiva para rol admin
│   └── not-found.tsx                 → Página de error 404 personalizada con identidad NIDO
├── middleware.ts                     → Protección de rutas en el servidor mediante cookies
└── src/features/
    ├── common/                       → Utilidades compartidas y cliente HTTP
    │   ├── config.ts                 → API_BASE_URL desde NEXT_PUBLIC_API_HOST
    │   ├── http.ts                   → Cliente HTTP centralizado (agrega Bearer y maneja 401)
    │   └── components/               → Navbar, Footer, Button, Input, Select, Textarea, Modal, ...
    ├── auth/                         → Feature de autenticación y sesión
    │   ├── domain/types.ts           → Tipos: User, LoginRequest, RegisterRequest, AuthResponse
    │   ├── services/authService.ts   → Servicios de login, register, getProfile y logout
    │   ├── hooks/useAuth.tsx         → Hook y Provider global de autenticación persistente
    │   └── components/               → LoginForm, RegisterForm
    ├── materias/                     → Feature del catálogo de tutorías
    │   ├── domain/types.ts           → Tipos: Materia, MateriaFilter, PaginatedMaterias
    │   ├── services/materiaService.ts→ CRUD, paginación, filtros y subida de imágenes
    │   ├── hooks/useMaterias.ts      → Hook con estados de cargando, vacío, error y filtros
    │   └── components/               → MateriaCard, MateriaGrid, MateriaFilters, Modales CRUD
    └── inscripciones/                → Feature de interacción estudiante-materia
        ├── domain/types.ts           → Tipos: Inscripcion, CreateInscripcionRequest
        ├── services/inscripcionService.ts → Creación y consultas de inscripciones
        ├── hooks/useInscripciones.ts → Hooks useMisInscripciones y useAllInscripciones
        └── components/               → InscripcionForm, MisInscripcionesList, AdminInscripcionesTable
```

> **Regla de integridad:** Ningún componente invoca `fetch()` de forma directa; todas las llamadas pasan por la capa `services/` a través del cliente `http.ts`, y los componentes consumen la lógica mediante `hooks/`.

---

## 3. Credenciales de Prueba (Cargadas mediante Seed)

| Rol | Correo Electrónico | Contraseña | Vistas y Permisos Asociados |
|---|---|---|---|
| **Administrador** | `admin@nido.edu.co` | `Admin123*` | Acceso a `/admin`, CRUD de materias, confirmación de eliminación, subida de fotos y visualización de todas las inscripciones |
| **Usuario Normal** | `padre@nido.edu.co` | `Padre123*` | Inscribir a sus hijos, ver `/mis-inscripciones`, bloqueado si intenta acceder a `/admin` |

---

## 4. Variables de Entorno

Crear un archivo `.env.local` basado en `.env.example`:

```env
# URL de la API REST de NIDO
# Local:
NEXT_PUBLIC_API_HOST="http://localhost:4000/api"

# Producción en Vercel:
# NEXT_PUBLIC_API_HOST="https://nido-api.onrender.com/api"
```

---

## 5. Cómo Correr el Frontend en Local

```bash
# 1. Navegar a la carpeta frontend
cd frontend

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo de Next.js
npm run dev
```

Abre tu navegador en [http://localhost:3000](http://localhost:3000).

---

## 6. Decisiones Técnicas en Mis Palabras

### A. Flujo completo de un login: desde el formulario hasta la respuesta de una ruta protegida

1. **Interacción del Usuario:** El acudiente ingresa a `/login` y llena su correo y clave en el `LoginForm`. El componente valida en el cliente que no haya campos vacíos y que el correo tenga formato válido.
2. **Llamada al Servicio:** Al enviar el formulario, se invoca `login()` expuesto por el hook `useAuth()`, el cual delega en `authService.login()`.
3. **Petición HTTP:** `http.ts` realiza una petición `POST` al endpoint `/api/auth/login` con el payload de credenciales.
4. **Respuesta y Almacenamiento:** El backend valida con bcrypt y retorna el token JWT firmado junto con el objeto de usuario seguro (sin contraseña). `http.ts` almacena el token en `localStorage` (para persistencia en el cliente) y crea una cookie `nido_token` (para lectura en el servidor por el middleware de Next.js).
5. **Actualización del Estado React:** `AuthProvider` actualiza sus variables reactivas (`user`, `isAuthenticated: true`, `isAdmin`), lo que provoca que la barra de navegación cambie inmediatamente mostrando el nombre del usuario y el botón "Salir".
6. **Redirección a Ruta Protegida:** El usuario navega a `/mis-inscripciones`. El componente `MisInscripcionesPage` verifica la sesión; al ser válida, invoca `useMisInscripciones()`.
7. **Inyección Automática del Token:** El cliente `http.ts` detecta el token almacenado y le añade de manera transparente el encabezado `Authorization: Bearer <token>` a la petición `GET /api/inscripciones/mias`.
8. **Validación y Entrega de Datos:** La API verifica el token, extrae el `userId` y responde con la lista de inscripciones de ese acudiente, las cuales se renderizan en pantalla.

### B. ¿Dónde guardas el token en el frontend y qué riesgo tiene esa decisión?

- **Dónde se guarda:** El token se almacena en el `localStorage` del navegador bajo la clave `nido_auth_token` y se sincroniza en una cookie `nido_token` accesible para Next.js.
- **Riesgo técnico:**
  - El almacenamiento en `localStorage` es vulnerable a ataques de tipo **XSS (Cross-Site Scripting)**: si un atacante logra inyectar código JavaScript malicioso en el sitio, puede leer el contenido del almacenamiento local y robar el token de autenticación.
  - La alternativa con mayor protección ante XSS es una cookie con el atributo `HttpOnly` (inaccesible para JavaScript), la cual traslada el riesgo hacia ataques de tipo **CSRF (Cross-Site Request Forgery)**.
- **Medidas de mitigación en el proyecto:**
  1. No se utiliza `dangerouslySetInnerHTML` ni librerías no verificadas.
  2. El payload del token JWT transporta únicamente `{ id, role }`, impidiendo que un tercero obtenga datos confidenciales al decodificarlo.
  3. El token posee fecha de expiración obligatoria (`24h`), reduciendo el tiempo de vida útil ante una hipotética fuga.

### C. ¿En qué caso tu API responde 401 y en cuál 403? Ejemplos reales en NIDO

- **Respuesta 401 (Unauthorized):**
  - Ocurre cuando el cliente no se ha identificado o sus credenciales no son válidas.
  - *Ejemplo real 1:* Al visitar la página sin iniciar sesión e intentar enviar una petición directa a `GET /api/inscripciones/mias` sin la cabecera `Authorization`. El backend responde `401 Unauthorized: "Token no proporcionado"`. El cliente `http.ts` detecta el 401, limpia la sesión y redirige al usuario a `/login`.
  - *Ejemplo real 2:* En `/login`, si se ingresa una contraseña incorrecta para `padre@nido.edu.co`, la API responde con un `401 Unauthorized: "Credenciales inválidas"`.
- **Respuesta 403 (Forbidden):**
  - Ocurre cuando el cliente está correctamente autenticado (su identidad está comprobada), pero su rol no cuenta con la autorización requerida para ejecutar la acción.
  - *Ejemplo real:* El usuario `padre@nido.edu.co` (rol: `user`) intenta enviar una petición `DELETE /api/materias/102` adjuntando su token de sesión válido. El backend valida su token exitosamente, pero el middleware `soloAdmin` comprueba que su rol no es `admin` y rechaza la solicitud respondiendo `403 Forbidden: "Acceso denegado: esta acción requiere rol admin"`.

### D. Uso de Inteligencia Artificial

- **Para qué se utilizó:**
  - Asistencia en la modularización de componentes Tailwind y diseño del sistema de filtros reactivo.
  - Generación de la estructura base del cliente HTTP con interceptor para respuestas 401.
- **Qué se corrigió y adaptó manualmente:**
  - La IA proponía mostrar alertas emergentes (`window.alert()`) en los formularios ante errores 409 y 401. Se reemplazó completamente por renderizado de errores accesible junto a cada campo (`aria-describedby`, etiquetas `role="alert"` y span rojo adyacente al input), respetando la rúbrica al pie de la letra.
  - Se corrigió la persistencia de sesión para sincronizar automáticamente el estado al refrescar la página (`localStorage` + `cookie` para Next.js App Router).
  - Se adaptaron todas las tarjetas, tipografías y botones para reflejar la paleta de colores corporativa de NIDO (`#2A6F6F`, `#1B4B4B`, `#F5A623`, `#F7F7F2`).

---

## 7. Captura de la pestaña Network con Cabecera `Authorization`

Petición capturada durante la consulta de mis inscripciones:

```http
GET /api/inscripciones/mias HTTP/1.1
Host: localhost:4000
Connection: keep-alive
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6InVzZXIiLCJpYXQiOjE3Mjk1NDc2MDAsImV4cCI6MTcyOTYzNDAwMH0...
Referer: http://localhost:3000/mis-inscripciones

HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
Content-Type: application/json; charset=utf-8

{
  "data": [
    {
      "id": 1,
      "nombreEstudiante": "Mateo Morales",
      "materia": {
        "id": 101,
        "nombreMateria": "Matemáticas básica"
      }
    }
  ]
}
```

---

## 8. Bonificaciones Implementadas (+10 pts)

1. **Subida de imágenes para el catálogo (+4 pts):** Modal de administración con selector de archivo local para cargar imágenes directamente a la API (`/api/upload`) con vista previa en tiempo real.
2. **Protección de rutas en el servidor con middleware (+3 pts):** `middleware.ts` en Next.js verifica la cookie `nido_token` antes de resolver rutas protegidas (`/mis-inscripciones`, `/admin`).
3. **Filtros combinados en catálogo (+2 pts):** Búsqueda instantánea por texto, filtro selector por categoría pedagógica y delimitación de rango de precio por hora.
4. **Confirmación antes de eliminar (+1 pt):** Modal interactivo de advertencia (`DeleteConfirmModal.tsx`) que solicita confirmación explícita del administrador antes de borrar cualquier materia del catálogo.
