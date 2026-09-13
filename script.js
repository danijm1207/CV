/*
mis datos base para inciar el proyecto
como me pidio el profesor en la rubcrica, hay dos entidades
relacionadas: profesor y materias
(una materia tiene un profesorId que la conecta con un profesor
el arreglo de profesores)
*/

const profesores = [
    {
        id: 1,
        nombre: "Laura Gomez",
        foto: "assets/profesores/laura.jpg",
        especialidad: "matematicas y fisica",
        modalidad: "virtual y presencial"
    },

    {
        id: 2,
        nombre: "Carlos Ramirez",
        foto: "assets/profesores/carlos.jpg",
        especialidad: "Lenguaje y Literatura",
        modalidad: "Virtual"
    },
    {
        id: 3,
        nombre: "Ana Torres",
        foto: "assets/profesores/ana.jpg",
        especialidad: "Ciencias Naturales",
        modalidad: "Presencial"
    }
];


const materias = [
    {
        id: 101,
        nombreMateria: "Matemáticas básica",
        descripcion: "Refuerzo en aritmética, fracciones y álgebra inicial para primaria y bachillerato.",
        precio: 35000,
        foto: "assets/materias/matematicas.jpg",
        profesorId: 1
    },
    {
        id: 102,
        nombreMateria: "Física escolar",
        descripcion: "Conceptos de cinemática y energía explicados con ejemplos cotidianos.",
        precio: 40000,
        foto: "assets/materias/fisica.jpg",
        profesorId: 1
    },
    {
        id: 103,
        nombreMateria: "Comprensión lectora",
        descripcion: "Estrategias de lectura crítica y redacción para mejorar el rendimiento escolar.",
        precio: 30000,
        foto: "assets/materias/lenguaje.jpg",
        profesorId: 2
    },
    {
        id: 104,
        nombreMateria: "Ciencias Naturales",
        descripcion: "Biología y ecología con experimentos sencillos aptos para casa.",
        precio: 32000,
        foto: "assets/materias/ciencias.jpg",
        profesorId: 3
    }
];
    
