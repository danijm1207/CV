import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed de la base de datos de NIDO...');

  // Limpiar tablas para evitar duplicados en re-seed
  await prisma.inscripcion.deleteMany({});
  await prisma.materia.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Usuarios con contraseñas encriptadas con bcrypt
  const saltRounds = 10;
  const adminPasswordHash = await bcrypt.hash('Admin123*', saltRounds);
  const userPasswordHash = await bcrypt.hash('Padre123*', saltRounds);

  const adminUser = await prisma.user.create({
    data: {
      nombre: 'Administrador NIDO',
      email: 'admin@nido.edu.co',
      password: adminPasswordHash,
      role: 'admin',
    },
  });

  const normalUser = await prisma.user.create({
    data: {
      nombre: 'Daniel Morales',
      email: 'padre@nido.edu.co',
      password: userPasswordHash,
      role: 'user',
    },
  });

  console.log('Usuarios creados:');
  console.log(`- Admin: admin@nido.edu.co (rol: admin)`);
  console.log(`- User: padre@nido.edu.co (rol: user)`);

  // 2. Catálogo de materias de la Entrega 1 con datos reales
  const materiasData = [
    {
      id: 101,
      nombreMateria: 'Matemáticas básica',
      descripcion: 'Refuerzo en aritmética, fracciones y álgebra inicial para primaria y bachillerato.',
      precio: 35000,
      foto: '/assets/materias/matematicas.jpg',
      tutor: 'Laura Gomez',
      categoria: 'Matemáticas',
      modalidad: 'Virtual y Presencial',
    },
    {
      id: 102,
      nombreMateria: 'Física escolar',
      descripcion: 'Conceptos de cinemática y energía explicados con ejemplos cotidianos.',
      precio: 40000,
      foto: '/assets/materias/fisica.jpg',
      tutor: 'Laura Gomez',
      categoria: 'Ciencias',
      modalidad: 'Virtual y Presencial',
    },
    {
      id: 103,
      nombreMateria: 'Comprensión lectora',
      descripcion: 'Estrategias de lectura crítica y redacción para mejorar el rendimiento escolar.',
      precio: 30000,
      foto: '/assets/materias/lectura.jpg',
      tutor: 'Carlos Ramirez',
      categoria: 'Humanidades',
      modalidad: 'Virtual',
    },
    {
      id: 104,
      nombreMateria: 'Ciencias Naturales',
      descripcion: 'Biología y ecología con experimentos sencillos aptos para casa.',
      precio: 32000,
      foto: '/assets/materias/cienciasnaturales.jpg',
      tutor: 'Ana Torres',
      categoria: 'Ciencias',
      modalidad: 'Presencial',
    },
    {
      id: 105,
      nombreMateria: 'Inglés para Niños',
      descripcion: 'Vocabulario, conversación y juegos interactivos para aprender inglés con confianza.',
      precio: 38000,
      foto: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=600&q=80',
      tutor: 'Laura Gomez',
      categoria: 'Idiomas',
      modalidad: 'Virtual',
    },
    {
      id: 106,
      nombreMateria: 'Química Divertida',
      descripcion: 'Introducción a la materia, enlaces y reacciones mediante experimentos visuales.',
      precio: 36000,
      foto: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
      tutor: 'Ana Torres',
      categoria: 'Ciencias',
      modalidad: 'Presencial',
    },
    {
      id: 107,
      nombreMateria: 'Taller de Escritura Creativa',
      descripcion: 'Crea cuentos fascinantes desarrollando narrativa y ortografía.',
      precio: 31000,
      foto: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
      tutor: 'Carlos Ramirez',
      categoria: 'Humanidades',
      modalidad: 'Virtual',
    },
  ];

  for (const m of materiasData) {
    await prisma.materia.create({ data: m });
  }

  console.log(`Catálogo cargado con ${materiasData.length} materias.`);

  // 3. Interacción de prueba (Inscripción)
  await prisma.inscripcion.create({
    data: {
      nombreEstudiante: 'Mateo Morales',
      correoAcudiente: 'padre@nido.edu.co',
      telefono: '3001234567',
      mensaje: 'Necesita refuerzo urgente en fracciones para su examen bimestral.',
      estado: 'PENDIENTE',
      userId: normalUser.id,
      materiaId: 101,
    },
  });

  console.log('Inscripción de prueba creada exitosamente.');
  console.log('Seed completado satisfactoriamente.');
}

main()
  .catch((e) => {
    console.error('Error durante la ejecución del seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
