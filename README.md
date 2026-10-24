# NIDO — Plataforma de Clases Particulares (Full-Stack)

> **Desarrollo Web · Semestre 2026-2**  
> **Entrega 3 — Tu sitio web, ahora full-stack**  
> **Autor:** Daniel Morales · Ingeniería de Sistemas · Universidad de Medellín  

---

## 1. De Dónde Partimos y Evolución del Proyecto

En la **Entrega 1**, NIDO era un sitio web estático construido en HTML5, CSS3 y JavaScript puro, donde el catálogo de materias vivía en un arreglo estático en memoria y el formulario de contacto solo validaba y mostraba un JSON en el navegador.

En esta **Entrega 3**, NIDO ha evolucionado a una solución profesional de arquitectura desacoplada full-stack:

| En la Entrega 1 | En la Entrega 3 |
|---|---|
| HTML, CSS y JavaScript plano | **Next.js (App Router)** + **TypeScript** + **Tailwind CSS** |
| Catálogo estático en arreglo de JS | Catálogo dinámico en **PostgreSQL**, gestionado con **Prisma ORM** y servido vía **API REST** con paginación |
| Formulario solo mostraba mensaje | Formulario de inscripción **guarda registros reales en base de datos** relacionando al acudiente con la materia |
| Acceso libre sin control de usuarios | **Autenticación con JWT** y contraseñas hasheadas con **bcrypt**, con roles (`admin` y `user`) y rutas protegidas |

---

## 2. Enlaces del Proyecto

- **Sitio Web Desplegado (Frontend en Vercel):** [https://cv-danijm1207.vercel.app](https://cv-danijm1207.vercel.app)
- **API REST Desplegada (Backend en Render):** [https://nido-api.onrender.com](https://nido-api.onrender.com)
- **Repositorio Backend:** [https://github.com/danijm1207/CV/tree/main/backend](https://github.com/danijm1207/CV/tree/main/backend)
- **Repositorio Frontend:** [https://github.com/danijm1207/CV/tree/main/frontend](https://github.com/danijm1207/CV/tree/main/frontend)

---

## 3. Credenciales de Prueba (Ambiente de Entrega)

Ambos usuarios han sido precargados mediante el script de seed (`prisma/seed.ts`) con contraseñas encriptadas mediante **bcrypt**:

| Rol | Correo Electrónico | Contraseña | Capacidades en el Sistema |
|---|---|---|---|
| **Administrador** | `admin@nido.edu.co` | `Admin123*` | Acceso a `/admin`, CRUD completo de materias (crear, editar, eliminar con modal), subida de imágenes y visualización de todas las inscripciones |
| **Usuario Normal (Acudiente)** | `padre@nido.edu.co` | `Padre123*` | Inscribir estudiantes a tutorías, ver `/mis-inscripciones`. Acceso bloqueado a `/admin` (redirección automática y 403 en API) |

---

## 4. Arquitectura del Proyecto

El proyecto está dividido en dos aplicaciones independientes y desacopladas escritas en **TypeScript estricto** (sin uso de `any`):

### A. Backend — API REST en Cuatro Capas (`backend/`)

Desarrollada con **Node.js**, **Express**, **TypeScript**, **Prisma** y **PostgreSQL**:

```text
backend/src/
├── domain/                    → Capa de Dominio (Entidades de negocio y contratos)
│   ├── models/                → User, Materia, Inscripcion, filtros
│   ├── repositories/          → IUserRepository, IMateriaRepository, IInscripcionRepository
│   └── errors/                → AppError, NotFoundError (404), ConflictError (409), UnauthorizedError (401), ForbiddenError (403)
├── application/               → Capa de Aplicación (Casos de uso y reglas de negocio)
│   ├── dtos/                  → AuthDTO, MateriaDTO, InscripcionDTO
│   ├── ports/                 → ISecurityServices (ITokenService, IPasswordHasher)
│   └── use-cases/             → RegisterUseCase, LoginUseCase, Materia CRUD, Inscripcion
├── infrastructure/            → Capa de Infraestructura (Base de datos y servicios externos)
│   ├── database/prisma.ts     → PrismaClient singleton (PRISMA VIVE SOLO AQUÍ)
│   ├── repositories/          → PrismaUserRepository, PrismaMateriaRepository, PrismaInscripcionRepository
│   ├── security/              → BcryptPasswordHasher, JwtTokenService
│   └── storage/multer.ts      → Multer para subida de fotos del catálogo
└── interface/                 → Capa de Interfaz / Presentación (Controladores y Rutas HTTP)
    ├── controllers/           → AuthController, MateriaController, InscripcionController, UploadController
    ├── middlewares/           → authMiddleware, roleMiddleware (soloAdmin), errorHandler, validate
    ├── routes/                → authRoutes, materiaRoutes, inscripcionRoutes, uploadRoutes, index.ts
    └── validation/            → Esquemas de validación Zod (body, params, query con 400)
```

### B. Frontend — Next.js App Router por Features (`frontend/`)

Desarrollada con **Next.js 14**, **React**, **TypeScript** y **Tailwind CSS**:

```text
frontend/
├── app/                       → Rutas de Next.js (page.tsx: solo componen)
│   ├── layout.tsx             → Layout principal con AuthProvider, Navbar y Footer
│   ├── page.tsx               → Página principal (Hero, Catálogo, Sobre nosotros, Formulario)
│   ├── materias/[id]/page.tsx → Detalle de la materia
│   ├── login/page.tsx         → Formulario de ingreso (redirige a / si ya hay sesión)
│   ├── registro/page.tsx      → Formulario de registro (redirige a / si ya hay sesión)
│   ├── mis-inscripciones/     → Ruta privada (redirige a /login si no hay sesión)
│   ├── admin/page.tsx         → Panel administrativo (protegido para rol admin)
│   └── not-found.tsx          → Página 404 personalizada
├── middleware.ts              → Protección de rutas en servidor (Bonus +3 pts)
└── src/features/
    ├── common/                → config.ts, http.ts (agrega Bearer y maneja 401), Navbar, Button, Input, Modal, ...
    ├── auth/                  → domain, services, hooks (useAuth con sesión persistente), components (LoginForm, RegisterForm)
    ├── materias/              → domain, services, hooks (useMaterias con paginación/filtros), components (MateriaCard, MateriaGrid, ...)
    └── inscripciones/         → domain, services, hooks, components (InscripcionForm, MisInscripcionesList, ...)
```

---

## 5. Endpoints de la API REST

| Método | Ruta | Acceso | Respuesta Exitosa | Códigos de Error |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Público | `201 Created` (`{ token, user }`) | `400` (validación), `409` (email duplicado) |
| `POST` | `/api/auth/login` | Público | `200 OK` (`{ token, user }`) | `400` (validación), `401` (credenciales inválidas) |
| `GET` | `/api/auth/me` | Autenticado | `200 OK` (`{ user }`) | `401` (sin token o expirado) |
| `GET` | `/api/materias` | Público | `200 OK` (`{ pagination, data }`) | `400` (parámetros de consulta inválidos) |
| `GET` | `/api/materias/:id`| Público | `200 OK` (`{ data: materia }`) | `400` (id no numérico), `404` (no encontrada) |
| `POST` | `/api/materias` | Solo Admin | `201 Created` | `401` (sin sesión), `403` (rol user), `400` (validación) |
| `PUT` | `/api/materias/:id`| Solo Admin | `200 OK` | `401` (sin sesión), `403` (rol user), `404` (no existe) |
| `DELETE`| `/api/materias/:id`| Solo Admin | `200 OK` | `401` (sin sesión), `403` (rol user), `404` (no existe) |
| `POST` | `/api/inscripciones`| Autenticado | `201 Created` (userId tomado de token) | `401` (sin sesión), `400` (validación), `404` (materia no existe) |
| `GET` | `/api/inscripciones/mias` | Autenticado | `200 OK` (solo las del usuario) | `401` (sin sesión) |
| `GET` | `/api/inscripciones` | Solo Admin | `200 OK` (todas las inscripciones) | `401` (sin sesión), `403` (rol user) |
| `POST` | `/api/upload` | Solo Admin | `201 Created` (`{ url }`) | `401` (sin sesión), `403` (rol user), `400` (archivo no imagen) |

---

## 6. Decisiones Técnicas en Mis Palabras

### A. Flujo completo de un login: desde que envías el formulario hasta que una ruta protegida responde

1. **Interacción en el cliente:** El usuario completa su email y contraseña en `LoginForm.tsx` y presiona el botón "Iniciar sesión". Antes de enviar la petición, se validan los campos en el cliente para verificar obligatoriedad y formato.
2. **Consumo mediante el servicio:** El formulario invoca `login()` del hook `useAuth()`. Este a su vez llama a `authService.login()`, el cual utiliza el cliente HTTP centralizado `http.ts` para enviar una petición `POST` hacia `/api/auth/login`.
3. **Validación y Casos de Uso en Express:** La API intercepta la petición en `authRoutes.ts`. El middleware `validate(loginSchema)` de Zod comprueba la estructura del body. El controlador delega la ejecución a `LoginUseCase.execute()`.
4. **Verificación de Credenciales:** `PrismaUserRepository` busca el usuario en la base de datos por email. Con `BcryptPasswordHasher.compare()`, se valida el hash de la contraseña. Si el usuario no existe o la contraseña no coincide, se lanza un `UnauthorizedError('Credenciales inválidas')`, respondiendo con un código `401` genérico que no revela si falló el correo o la clave.
5. **Generación del Token JWT:** Si la autenticación es exitosa, `JwtTokenService` genera un token firmado con `JWT_SECRET` y expiración (`24h`). El payload contiene **únicamente** `{ id: user.id, role: user.role }`, sin contraseñas ni información sensible.
6. **Persistencia en el Frontend:** `http.ts` recibe la respuesta y guarda el token en `localStorage` y en una cookie (`nido_token`). El `AuthProvider` actualiza el estado global de React. La barra de navegación se actualiza mostrando el saludo y el botón de salida.
7. **Petición a Ruta Protegida:** Cuando el usuario ingresa a `/mis-inscripciones`, el cliente `http.ts` añade automáticamente la cabecera `Authorization: Bearer <token>` a la petición `GET /api/inscripciones/mias`.
8. **Autorización en el Router:** El `authMiddleware` valida la firma del token con `jwt.verify` y deja los datos del usuario en `req.user`. El caso de uso consulta la base de datos usando `req.user.id` y devuelve únicamente las inscripciones de ese usuario con código `200 OK`.

### B. ¿Dónde guardas el token en el frontend y qué riesgo tiene esa decisión?

- **Ubicación:** El token se guarda en el `localStorage` del navegador y se sincroniza en una cookie para habilitar la protección previa en el middleware de Next.js.
- **Riesgo:** El almacenamiento en `localStorage` es vulnerable a ataques de **XSS (Cross-Site Scripting)**. Si un atacante consigue ejecutar un script malicioso en la aplicación, puede acceder a `localStorage.getItem('nido_auth_token')` y sustraer el token de sesión.
- **Alternativa y compromisos:** La alternativa es guardar el token en una cookie `HttpOnly`, lo cual impide el acceso desde JavaScript pero expone la aplicación a ataques de tipo **CSRF (Cross-Site Request Forgery)** si no se implementan tokens anti-CSRF o configuraciones `SameSite=Lax/Strict`.
- **Mitigaciones aplicadas:**
  1. Next.js escapa automáticamente cualquier variable renderizada en el DOM.
  2. El payload del token no contiene información confidencial (solo `id` y `role`).
  3. El token expira automáticamente en 24 horas (`JWT_EXPIRES_IN=24h`).

### C. ¿En qué caso tu API responde 401 y en cuál 403? Ejemplos reales del proyecto

- **Código 401 Unauthorized (Falta de autenticación o credenciales erróneas):**
  - Significa: *"No te has identificado o tus credenciales no son válidas"*.
  - *Ejemplo 1:* Un visitante intenta consultar `/api/inscripciones/mias` sin enviar el encabezado `Authorization: Bearer <token>`. La API responde `401 Unauthorized: "Token no proporcionado"`. El cliente `http.ts` lo detecta y redirige al visitante a `/login`.
  - *Ejemplo 2:* Un usuario intenta iniciar sesión con una contraseña equivocada en `/api/auth/login`. La API responde `401 Unauthorized: "Credenciales inválidas"`.
- **Código 403 Forbidden (Falta de permisos o autorización):**
  - Significa: *"Sé quién eres, pero tu rol no tiene autorización para realizar esta acción"*.
  - *Ejemplo real:* El usuario con cuenta `padre@nido.edu.co` (rol: `user`) inicia sesión correctamente y obtiene su token válido. Luego intenta eliminar una materia enviando `DELETE /api/materias/101`. El `authMiddleware` valida su token, pero el middleware `soloAdmin` comprueba que `req.user.role !== 'admin'` y rechaza la petición con `403 Forbidden: "Acceso denegado: esta acción requiere rol admin"`.

### D. Uso de Inteligencia Artificial

- **Para qué se usó:**
  - Estructuración de las cuatro capas de arquitectura limpia y definición de los esquemas Zod en backend.
  - Implementación de las pruebas unitarias automatizadas con Jest y Supertest para los middlewares de autorización.
  - Configuración del cliente HTTP con interceptor automático para errores 401 y redirección a login.
- **Qué se tuvo que corregir:**
  - Inicialmente la IA sugería recibir el `userId` en el cuerpo (`body`) del endpoint de creación de inscripción. Se corrigió inmediatamente para extraer el `userId` **exclusivamente de `req.user.id`**, cumpliendo con la exigencia de seguridad de la rúbrica para evitar que un usuario cree inscripciones a nombre de otro.
  - Se corrigió el manejo de errores en los formularios para que los códigos 409 y 401 muestren mensajes amigables junto a cada campo específico (y no en `window.alert()`).
  - Se verificó y aseguró la integridad del catálogo de la Entrega 1, manteniendo los nombres, precios y tutores exactos de las materias originales.

---

## 7. Captura de Network de Petición Protegida con `Authorization`

```http
GET /api/inscripciones/mias HTTP/1.1
Host: localhost:4000
Connection: keep-alive
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
      "correoAcudiente": "padre@nido.edu.co",
      "telefono": "3001234567",
      "estado": "PENDIENTE",
      "materiaId": 101,
      "userId": 2,
      "materia": {
        "id": 101,
        "nombreMateria": "Matemáticas básica",
        "precio": 35000,
        "tutor": "Laura Gomez"
      }
    }
  ]
}
```

---

## 8. Bonificaciones Implementadas (+10 pts)

- [x] **Subida de imágenes para el catálogo (+4 pts):** Endpoint `POST /api/upload` con Multer y selector de archivos en el modal del panel `/admin` con vista previa instantánea.
- [x] **Protección de rutas en el servidor con middleware de Next.js (+3 pts):** `middleware.ts` valida la cookie `nido_token` antes de resolver rutas protegidas.
- [x] **Filtros combinados en el catálogo (+2 pts):** Búsqueda reactiva por texto, filtro selector por categoría pedagógica y delimitación de rango de precio por hora.
- [x] **Pruebas automatizadas de middlewares de autenticación y rol (+3 pts):** 8 pruebas automatizadas con Jest cubriendo casos de error 401, 403 y paso exitoso.
- [x] **Confirmación antes de eliminar en administración (+1 pt):** Modal interactivo `DeleteConfirmModal.tsx` que previene borrados accidentales de materias.

---

## 9. Instrucciones para Ejecutar en Local

### 1. Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
npm test
npm run dev
```
La API estará disponible en `http://localhost:4000`.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
La aplicación web estará disponible en `http://localhost:3000`.
