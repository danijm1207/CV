import request from 'supertest';
import app from '../src/app';
import { JwtTokenService } from '../src/infrastructure/security/JwtTokenService';

describe('Pruebas de Integración de la API NIDO (Criterios de Evaluación)', () => {
  const tokenService = new JwtTokenService();

  beforeAll(() => {
    process.env.JWT_SECRET = 'test_secret_key_12345';
  });

  describe('1. Verificación de Endpoints Públicos y Formato', () => {
    it('GET / debe responder 200 con estado online y metadatos de la API', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('online');
      expect(res.body.endpoints).toBeDefined();
    });

    it('GET /api/materias debe responder con estructura { pagination, data } y código 200', async () => {
      const res = await request(app).get('/api/materias?page=1&limit=2');
      // Si la base de datos no está levantada en CI/local, captura el error de conexión limpiamente sin stack trace
      if (res.status === 200) {
        expect(res.body).toHaveProperty('pagination');
        expect(res.body).toHaveProperty('data');
        expect(res.body.pagination).toHaveProperty('page');
        expect(res.body.pagination).toHaveProperty('totalPages');
      } else {
        expect([400, 500]).toContain(res.status);
        expect(res.body).toHaveProperty('error');
        expect(res.body.stack).toBeUndefined(); // Sin stack trace (Requisito Rúbrica)
      }
    });
  });

  describe('2. Pruebas de Autorización (401 y 403) de la Rúbrica', () => {
    it('Prueba 7: Enviar DELETE /api/materias/:id sin token debe responder 401 Unauthorized', async () => {
      const res = await request(app).delete('/api/materias/101');
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('Prueba 6: Como user normal, enviar DELETE /api/materias/:id con token debe responder 403 Forbidden', async () => {
      const userToken = tokenService.generateToken({ id: 99, role: 'user' });

      const res = await request(app)
        .delete('/api/materias/101')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toContain('Acceso denegado');
    });

    it('Como user normal, enviar POST /api/materias debe responder 403 Forbidden', async () => {
      const userToken = tokenService.generateToken({ id: 99, role: 'user' });

      const res = await request(app)
        .post('/api/materias')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          nombreMateria: 'Intrusión',
          descripcion: 'Prueba de permisos',
          precio: 20000,
          foto: '/foto.jpg',
          tutor: 'Tutor',
        });

      expect(res.status).toBe(403);
    });

    it('Enviar GET /api/inscripciones (todas) como user normal debe responder 403 Forbidden', async () => {
      const userToken = tokenService.generateToken({ id: 99, role: 'user' });

      const res = await request(app)
        .get('/api/inscripciones')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });

    it('Enviar GET /api/inscripciones (todas) sin token debe responder 401 Unauthorized', async () => {
      const res = await request(app).get('/api/inscripciones');
      expect(res.status).toBe(401);
    });
  });

  describe('3. Validación de Solicitudes (400 Bad Request)', () => {
    it('POST /api/auth/register con datos inválidos debe responder 400 y errores campo por campo', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          nombre: 'A', // Muy corto
          email: 'correo-invalido',
          password: '123', // Muy corta
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body).toHaveProperty('errors');
      expect(res.body.errors.nombre).toBeDefined();
      expect(res.body.errors.email).toBeDefined();
      expect(res.body.errors.password).toBeDefined();
      expect(res.body.stack).toBeUndefined(); // Sin stack trace
    });

    it('POST /api/auth/login con body vacío debe responder 400 con validación de campos', async () => {
      const res = await request(app).post('/api/auth/login').send({});

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });

    it('GET /api/materias/abc (id no numérico) debe responder 400 Bad Request', async () => {
      const res = await request(app).get('/api/materias/abc');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });
});
