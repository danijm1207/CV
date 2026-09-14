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
        foto: "assets/materias/lectura.jpg",
        profesorId: 2
    },
    {
        id: 104,
        nombreMateria: "Ciencias Naturales",
        descripcion: "Biología y ecología con experimentos sencillos aptos para casa.",
        precio: 32000,
        foto: "assets/materias/cienciasnaturales.jpg",
        profesorId: 3
    }
];


/*
catalogo dinamico: generamos las tarjetas de materias a partir del arreglo
"materias", relacionandolas con su profesor en "profesores"
*/

function crearTarjetaMateria(materia) {
  // Relación entre las dos entidades: buscamos el profesor
  // cuyo id coincide con el profesorId de esta materia.
  const profesor = profesores.find((p) => p.id === materia.profesorId);
  const nombreProfesor = profesor ? profesor.nombre : "Por asignar";
 
  const precioFormateado = materia.precio.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  });
 
  return `
    <article class="tarjeta-materia">
      <img src="${materia.foto}" alt="${materia.nombreMateria}">
      <div class="tarjeta-materia__body">
        <h3>${materia.nombreMateria}</h3>
        <p>${materia.descripcion}</p>
        <p class="tarjeta-materia__profesor">Tutor: ${nombreProfesor}</p>
        <p class="tarjeta-materia__precio">${precioFormateado} / hora</p>
      </div>
    </article>
  `;
}
 
function renderCatalogo() {
  const contenedor = document.getElementById("catalogo-container");
 
  if (!contenedor) return;
 
  // .map() transforma cada objeto materia en su HTML correspondiente
  // y .join("") une todos los strings en uno solo.
  const tarjetasHTML = materias.map(crearTarjetaMateria).join("");
 
  contenedor.innerHTML = tarjetasHTML;
}
 
// Esperamos a que el DOM esté completamente cargado antes de pintar
document.addEventListener("DOMContentLoaded", renderCatalogo);

/* =========================================================
   PASO 4: Formulario de inscripción
   Grupo B: validación en tiempo real con mensajes junto al campo
   Grupo C: manejo del evento "submit" del formulario
   ========================================================= */
 
// Reutilizamos el arreglo "materias" (Paso 1) para llenar el <select>
function poblarSelectMaterias() {
  const select = document.getElementById("materiaInteres");
  if (!select) return;
 
  materias.forEach((materia) => {
    const opcion = document.createElement("option");
    opcion.value = materia.id;
    opcion.textContent = materia.nombreMateria;
    select.appendChild(opcion);
  });
}
 
// Una función de validación por cada campo. Cada una devuelve
// un string con el mensaje de error, o "" si el campo es válido.
const validadores = {
  nombre: (valor) => {
    if (valor.trim() === "") return "El nombre es obligatorio.";
    if (valor.trim().length < 3) return "Debe tener al menos 3 caracteres.";
    return "";
  },
  correo: (valor) => {
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (valor.trim() === "") return "El correo es obligatorio.";
    if (!regexCorreo.test(valor)) return "Ingresa un correo válido (ej: nombre@dominio.com).";
    return "";
  },
  telefono: (valor) => {
    const regexTelefono = /^[0-9]{7,10}$/;
    if (valor.trim() === "") return "El teléfono es obligatorio.";
    if (!regexTelefono.test(valor)) return "Usa solo números (7 a 10 dígitos).";
    return "";
  },
  materiaInteres: (valor) => {
    if (valor === "") return "Selecciona una materia.";
    return "";
  }
};
 
function mostrarError(campoId, mensajeError) {
  const spanError = document.getElementById(`error-${campoId}`);
  if (spanError) spanError.textContent = mensajeError;
}
 
// Valida un solo campo y actualiza su mensaje de error en el DOM
function validarCampo(campoId) {
  const input = document.getElementById(campoId);
  if (!input || !validadores[campoId]) return true;
 
  const mensajeError = validadores[campoId](input.value);
  mostrarError(campoId, mensajeError);
  return mensajeError === "";
}
 
function inicializarFormulario() {
  const form = document.getElementById("form-inscripcion");
  if (!form) return;
 
  const camposAValidar = Object.keys(validadores);
 
  // --- Grupo B: validación en tiempo real por campo ---
  camposAValidar.forEach((campoId) => {
    const input = document.getElementById(campoId);
    if (!input) return;
 
    input.addEventListener("blur", () => validarCampo(campoId));
    input.addEventListener("input", () => validarCampo(campoId));
  });
 
  // --- Grupo C: manejo del evento submit del formulario ---
  form.addEventListener("submit", (evento) => {
    evento.preventDefault(); // Evita que la página se recargue
 
    const todosValidos = camposAValidar
      .map((campoId) => validarCampo(campoId))
      .every((valido) => valido === true);
 
    const mensajeExito = document.getElementById("mensaje-exito");
 
    if (todosValidos) {
      mensajeExito.hidden = false;
      form.reset();
    } else {
      mensajeExito.hidden = true;
    }
  });
}
 
/* =========================================================
   PASO 5: Modo Oscuro (Dark Mode)
   Manejo de preferencia del usuario y persistencia en localStorage
   ========================================================= */

function actualizarBotonTema(esOscuro) {
  const btnToggle = document.getElementById("theme-toggle");
  if (!btnToggle) return;

  if (esOscuro) {
    btnToggle.innerHTML = `☀️ <span>Modo claro</span>`;
    btnToggle.setAttribute("aria-label", "Cambiar a modo claro");
  } else {
    btnToggle.innerHTML = `🌙 <span>Modo oscuro</span>`;
    btnToggle.setAttribute("aria-label", "Cambiar a modo oscuro");
  }
}

function inicializarModoOscuro() {
  const btnToggle = document.getElementById("theme-toggle");
  if (!btnToggle) return;

  const temaGuardado = localStorage.getItem("tema");
  const prefiereOscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const esModoOscuro = temaGuardado === "dark" || (!temaGuardado && prefiereOscuro);

  if (esModoOscuro) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }

  actualizarBotonTema(esModoOscuro);

  btnToggle.addEventListener("click", () => {
    const estaEnOscuro = document.body.classList.toggle("dark-mode");
    localStorage.setItem("tema", estaEnOscuro ? "dark" : "light");
    actualizarBotonTema(estaEnOscuro);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  poblarSelectMaterias();
  inicializarFormulario();
  inicializarModoOscuro();
});