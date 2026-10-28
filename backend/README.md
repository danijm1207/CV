# NIDO — API REST Full-Stack (Backend)

API REST desarrollada en Node.js, Express, TypeScript, Prisma ORM y PostgreSQL para la plataforma de clases particulares **NIDO**.

---

## 1. Enlaces de Despliegue

- **API REST (Backend desplegado en Render):** [https://nido-backend-p62h.onrender.com](https://nido-backend-p62h.onrender.com)
- **Sitio Web (Frontend desplegado en Vercel):** [https://cv-danijm1207.vercel.app](https://cv-danijm1207.vercel.app)
- **Repositorio Backend en GitHub:** [https://github.com/danijm1207/nido-backend](https://github.com/danijm1207/nido-backend)
- **Repositorio Frontend en GitHub:** [https://github.com/danijm1207/CV](https://github.com/danijm1207/CV)

---

## 2. Arquitectura en Cuatro Capas (Clean Architecture)

El backend sigue estrictamente el patrón en cuatro capas exigido por la asignatura, asegurando bajo acoplamiento y alta cohesión:

```text
backend/src/
├── domain/                    → Entidades de negocio, interfaces de repositorio y errores
│   ├── errors/                → AppError, NotFoundError, ConflictError, UnauthorizedError, ...
│   ├── models/                → User, Materia, Inscripcion, filtros
│   └── repositories/          → IUserRepository, IMateriaRepository, IInscripcionRepository
├── application/               → Casos de uso y reglas de aplicación
│   ├── dtos/                  → AuthDTO, MateriaDTO, InscripcionDTO
│   ├── ports/                 → ISecurityServices (ITokenService, IPasswordHasher)
│   └── use-cases/             → RegisterUseCase, LoginUseCase, Materia CRUD, Inscripcion
├── infrastructure/            → Implementaciones externas (Base de datos, JWT, Multer)
│   ├── database/              → prisma.ts (PrismaClient singleton - SOLO AQUÍ)
│   ├── repositories/          → PrismaUserRepository, PrismaMateriaRepository, PrismaInscripcionRepository
│   ├── security/              → BcryptPasswordHasher, JwtTokenService
│   └── storage/               → multer.ts (subida de imágenes para el catálogo)
└── interface/                 → Exposición HTTP
    ├── controllers/           → AuthController, MateriaController, InscripcionController, UploadController
    ├── middlewares/           → authMiddleware, roleMiddleware (soloAdmin), errorHandler, validate
    ├── routes/                → authRoutes, materiaRoutes, inscripcionRoutes, uploadRoutes, index.ts
    └── validation/            → Esquemas Zod para body, query y params
```

> **Regla de integridad:** `PrismaClient` **solo** se importa en la capa de `infrastructure/`. Los controladores y casos de uso interactúan exclusivamente a través de las interfaces del dominio.

---

## 3. Modelo de Datos (Prisma + PostgreSQL)

Consta de tres tablas con relaciones e integridad referencial (`onDelete: Cascade`):

1. **`users`**: Administradores y acudientes. Campos: `id`, `nombre`, `email` (único), `password` (hash bcrypt), `role` (`admin` | `user`), marcas de tiempo.
2. **`materias`**: Catálogo de tutorías con los datos reales de la Entrega 1. Campos: `id`, `nombreMateria`, `descripcion`, `precio`, `foto`, `tutor`, `categoria`, `modalidad`.
3. **`inscripciones`**: Tabla de interacción relacionando usuarios con materias. Campos: `id`, `nombreEstudiante`, `correoAcudiente`, `telefono`, `mensaje`, `estado`, `userId` (FK -> `users.id`), `materiaId` (FK -> `materias.id`).

---

## 4. Endpoints de la API

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/api/auth/register` | Público | Registra un nuevo usuario (`409` si el email ya existe) |
| `POST` | `/api/auth/login` | Público | Inicia sesión y retorna JWT (`401` genérico si falla) |
| `GET` | `/api/auth/me` | Autenticado | Obtiene la información del usuario en sesión |
| `GET` | `/api/materias` | Público | Lista materias con paginación `{ pagination, data }` y filtros |
| `GET` | `/api/materias/:id` | Público | Detalle de una materia (`404` si no existe) |
| `POST` | `/api/materias` | Solo Admin | Crea una materia en el catálogo |
| `PUT` | `/api/materias/:id` | Solo Admin | Actualiza una materia |
| `DELETE` | `/api/materias/:id` | Solo Admin | Elimina una materia |
| `POST` | `/api/inscripciones` | Autenticado | Inscribe a un estudiante (el `userId` se extrae del token) |
| `GET` | `/api/inscripciones/mias` | Autenticado | Lista las inscripciones del usuario en sesión |
| `GET` | `/api/inscripciones` | Solo Admin | Lista todas las inscripciones del sistema |
| `POST` | `/api/upload` | Solo Admin | Sube un archivo de imagen para el catálogo |

---

## 5. Credenciales de Prueba (Cargadas mediante Seed)

| Rol | Correo Electrónico | Contraseña | Propósito |
|---|---|---|---|
| **Administrador** | `admin@nido.edu.co` | `Admin123*` | Probar panel `/admin`, CRUD de materias, ver todas las inscripciones y subir fotos |
| **Usuario Normal** | `padre@nido.edu.co` | `Padre123*` | Probar inscripción de clases, ver `/mis-inscripciones`, verificar bloqueo de `/admin` |

---

## 6. Variables de Entorno

Crear un archivo `.env` basado en `.env.example`:

```env
PORT=4000
DATABASE_URL="postgresql://usuario:password@localhost:5432/nido_db?schema=public"
JWT_SECRET="clave_secreta_para_firmar_jwt_en_nido_2026"
JWT_EXPIRES_IN="24h"
FRONTEND_URL="http://localhost:3000"
```

---

## 7. Cómo Correr el Proyecto en Local

```bash
# 1. Navegar a la carpeta backend
cd backend

# 2. Instalar dependencias
npm install

# 3. Generar el cliente de Prisma
npx prisma generate

# 4. Ejecutar migraciones en PostgreSQL (si tienes la base de datos levantada)
npx prisma migrate dev

# 5. Ejecutar el seed con los datos reales
npm run prisma:seed

# 6. Ejecutar pruebas automatizadas de middlewares
npm test

# 7. Iniciar el servidor en modo desarrollo
npm run dev
```

El servidor estará escuchando en `http://localhost:4000`.

---

## 8. Decisiones Técnicas en Mis Palabras

### A. Flujo completo de un login: desde el formulario hasta la respuesta de una ruta protegida

1. **Envío en el Frontend:** El usuario escribe sus credenciales en `LoginForm.tsx` y presiona "Iniciar sesión". El componente valida el formato y llama a `authService.login()`, el cual usa el cliente centralizado `http.ts` para enviar una petición `POST /api/auth/login` con cuerpo JSON.
2. **Recepción y Validación en la API:** La petición llega a Express, pasa por `cors` y el middleware `validate(loginSchema)` de Zod. Si el formato es válido, avanza a `AuthController.login`.
3. **Lógica de Aplicación:** El controlador delega a `LoginUseCase.execute()`. Este busca al usuario por email en `PrismaUserRepository`.
4. **Verificación de Contraseña y Emisión de Token:** Con `BcryptPasswordHasher.compare()`, se compara la contraseña ingresada con el hash de la base de datos. Si no coincide, lanza `UnauthorizedError('Credenciales inválidas')` (respondiendo `401` genérico). Si coincide, `JwtTokenService` genera un JWT firmado con `JWT_SECRET`, expiración en 24h y un payload mínimo `{ id: user.id, role: user.role }`. La contraseña **nunca** se incluye en la respuesta.
5. **Almacenamiento en el Cliente:** `http.ts` recibe la respuesta y guarda el token en `localStorage` y en una cookie. El `AuthProvider` actualiza el estado global de `user` y redirige al usuario a la página deseada.
6. **Consumo de Ruta Protegida:** Cuando el usuario accede a `/mis-inscripciones` o realiza una petición a `GET /api/inscripciones/mias`, el cliente `http.ts` inyecta automáticamente el encabezado `Authorization: Bearer <token>`.
7. **Verificación en el Middleware:** El `authMiddleware` en el router de Express extrae el token, verifica su firma y vigencia con `jwt.verify`, y deposita `{ id, role }` en `req.user`. Si pasa a una ruta admin, `roleMiddleware` (`soloAdmin`) comprueba que `req.user.role === 'admin'`. Finalmente, el controlador ejecuta la consulta utilizando el `req.user.id` del token para devolver únicamente los datos de ese usuario.

### B. ¿Dónde guardas el token en el frontend y qué riesgo tiene esa decisión?

- **Dónde se guarda:** El token se guarda en el `localStorage` del navegador y se sincroniza en una `cookie` para habilitar verificación previa.
- **Riesgos asociados:**
  - El principal riesgo de `localStorage` es la susceptibilidad a ataques **XSS (Cross-Site Scripting)**: cualquier script malicioso inyectado en el navegador (por dependencias comprometidas o campos sin sanear) puede leer `localStorage.getItem('nido_auth_token')` y exfiltrar el token.
  - La alternativa más segura contra XSS es almacenar el token en una cookie con flag `HttpOnly`, pero introduce el riesgo de ataques **CSRF (Cross-Site Request Forgery)**, requiriendo tokens anti-CSRF o encabezados personalizados (`SameSite=Lax/Strict`).
- **Medidas de mitigación aplicadas:**
  1. React y Next.js escapan automáticamente todo el contenido renderizado para prevenir XSS.
  2. El payload del token es mínimo (solo `id` y `role`), evitando exponer datos sensibles como contraseñas, emails o teléfonos si alguien llegara a inspeccionar el token.
  3. El token cuenta con expiración forzosa (`expiresIn: '24h'`), limitando la ventana de uso en caso de compromiso.

### C. ¿En qué caso tu API responde 401 y en cuál 403? Ejemplos reales en NIDO

- **Código 401 (Unauthorized - Falta o falla de autenticación):**
  - Significa: *"No sé quién eres o tus credenciales no son válidas"*.
  - *Ejemplo real 1 en NIDO:* Un usuario no autenticado intenta enviar una inscripción haciendo `POST /api/inscripciones` sin enviar el encabezado `Authorization`. La API responde `401 Unauthorized: "Token no proporcionado"`.
  - *Ejemplo real 2 en NIDO:* Un usuario envía un token alterado o expirado. La API responde `401 Unauthorized: "El token ha expirado. Por favor inicia sesión nuevamente"`.
  - *Ejemplo real 3 en NIDO:* En el endpoint `/api/auth/login`, el usuario envía una contraseña errónea. La API responde `401 Unauthorized: "Credenciales inválidas"`.
- **Código 403 (Forbidden - Falta de autorización / permisos):**
  - Significa: *"Sé perfectamente quién eres (tu token es válido), pero no tienes permiso para hacer esta acción"*.
  - *Ejemplo real en NIDO:* El acudiente Daniel Morales inicia sesión exitosamente con su cuenta `padre@nido.edu.co` (rol: `user`). Luego, intenta eliminar una materia del catálogo enviando una petición `DELETE /api/materias/101` con su token válido. El `authMiddleware` valida su identidad, pero el middleware `soloAdmin` detecta que su rol es `user` y no `admin`. La API responde de inmediato con `403 Forbidden: "Acceso denegado: esta acción requiere rol admin"`.

### D. Uso de Inteligencia Artificial

- **Para qué se utilizó:**
  - Estructuración inicial del boilerplate de las cuatro capas de arquitectura limpia en TypeScript.
  - Generación de esquemas Zod rigurosos para validar los campos del catálogo y las inscripciones.
  - Diseño de las pruebas unitarias con Jest y Supertest para verificar exhaustivamente los middlewares de autenticación y rol.
- **Qué se corrigió y adaptó manualmente:**
  - La IA inicialmente sugería pasar el `userId` en el cuerpo (`body`) de la petición de inscripción. Esto violaba una regla crítica de la rúbrica (evitar suplantación). Se corrigió para que `userId` se extraiga **estrictamente** de `req.user.id` tras verificar el token JWT.
  - Se adaptaron los tipos y entidades para mantener exactamente los mismos nombres y materias de la Entrega 1 (`Matemáticas básica`, `Física escolar`, `Comprensión lectora`, `Ciencias Naturales`).
  - Se aseguró que los mensajes de error de Prisma y credenciales no revelaran detalles internos del sistema ni generaran stack traces en producción.

---

## 9. Captura de Network mostrando petición protegida con `Authorization`

A continuación se muestra el registro de red de una petición protegida a `/api/inscripciones/mias`:

```http
GET /api/inscripciones/mias HTTP/1.1
Host: localhost:4000
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6InVzZXIiLCJpYXQiOjE3Mjk1NDc2MDAsImV4cCI6MTcyOTYzNDAwMH0.w1V8...

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true

{
  "data": [
    {
      "id": 1,
      "nombreEstudiante": "Mateo Morales",
      "correoAcudiente": "padre@nido.edu.co",
      "telefono": "3001234567",
      "mensaje": "Necesita refuerzo urgente en fracciones",
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

## 10. Bonificaciones Implementadas

- **Subida de imágenes para el catálogo (+4 pts):** Endpoint `POST /api/upload` con Multer para subir fotos desde archivo y enlazarlas a las materias.
- **Pruebas automatizadas de middlewares (+3 pts):** 8 pruebas con Jest que verifican los estados `401`, `403` y resolución de token en `authMiddleware` y `roleMiddleware`.
- **Filtros combinados en catálogo (+2 pts):** Búsqueda por texto, filtro de categoría y rango de precio en `GET /api/materias`.
- **Confirmación antes de eliminar (+1 pt):** Diálogo modal de confirmación implementado para la eliminación de materias en el panel de administración.
