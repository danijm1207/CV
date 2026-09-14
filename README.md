# NIDO — Plataforma de clases particulares

## 1. Descripción del proyecto

NIDO es una plataforma web pensada para facilitar la búsqueda de clases particulares para niños de educación básica. Está dirigida principalmente a padres que buscan apoyo académico para sus hijos en diferentes materias escolares.

La idea del proyecto nace de la necesidad de encontrar profesores particulares de una forma más sencilla y organizada. NIDO permite visualizar diferentes profesores y las materias que pueden enseñar, teniendo como objetivo que en el futuro pueda convertirse en una plataforma web más completa.

## 2. Link al sitio

Puedes visitar la página desplegada en Vercel aquí:

**[Ver NIDO en Vercel](PEGAR_AQUÍ_EL_LINK_DE_VERCEL)**

## 3. Capturas del proyecto

### Versión de escritorio

![NIDO en escritorio](./capturas/nido-escritorio.png)

### Versión móvil

![NIDO en móvil](./capturas/nido-movil.png)

## 4. Estructura del proyecto

```text
/
├── index.html
├── styles.css
├── script.js
└── README.md
```

* **index.html:** contiene la estructura principal de la página y sus diferentes secciones.
* **styles.css:** contiene los estilos utilizados para organizar y dar diseño a los elementos de la página.
* **script.js:** contiene la lógica necesaria para las interacciones de la página, como el catálogo de profesores y la validación del formulario.
* **README.md:** contiene la documentación del proyecto y las decisiones tomadas durante su desarrollo.

## 5. Decisiones técnicas

### Flexbox y Grid

Utilicé **Flexbox** principalmente para organizar elementos que necesitan distribuirse en una misma dirección, como los elementos de navegación y algunos grupos de contenido. Me pareció adecuado para estos casos porque permite controlar fácilmente la alineación y el espacio entre los elementos.

Utilicé **Grid** principalmente en el catálogo de profesores, ya que necesitaba organizar las tarjetas en filas y columnas. Grid permite distribuir los profesores de una manera ordenada y facilita que el catálogo se adapte al espacio disponible en la pantalla.

### JavaScript y validación

El JavaScript se utiliza para generar dinámicamente el catálogo de profesores a partir de los datos almacenados en el archivo. Esto permite agregar o modificar profesores sin tener que escribir manualmente todas las tarjetas directamente en el HTML.

También se utiliza para validar el formulario de contacto. Antes de permitir el envío se revisa que los campos obligatorios tengan información, que los datos tengan un formato válido y que se cumplan las condiciones de longitud establecidas. La validación se realiza cuando el usuario intenta enviar el formulario.

Para controlar el envío utilizo `preventDefault()`, evitando que el navegador recargue la página y permitiendo que JavaScript se encargue de procesar la interacción.

### Uso de inteligencia artificial

Durante el desarrollo utilicé herramientas de inteligencia artificial como apoyo para resolver dudas, obtener ideas y entender algunas partes de HTML, CSS y JavaScript.

Sin embargo, el resultado no se utilizó directamente sin modificaciones. Revisé y adapté las propuestas de acuerdo con los requisitos del proyecto, cambiando elementos del diseño, estructura y funcionamiento para construir la versión final de NIDO y comprender cómo funcionaba el código utilizado.

### Dificultades encontradas

Una de las partes más difíciles fue organizar el catálogo de profesores y lograr que se mostrara correctamente sin tener que escribir cada tarjeta directamente en el HTML. Para solucionarlo, utilicé arreglos de objetos en JavaScript y aprendí a recorrer esos datos para generar los elementos de la página dinámicamente.

También fue necesario trabajar en la adaptación del diseño para diferentes tamaños de pantalla. Para solucionarlo utilicé CSS responsive, Flexbox y Grid, haciendo que los elementos se reorganizaran dependiendo del espacio disponible.

## 6. Autor

**Daniel Morales**
Ingeniería de Sistemas — Universidad de Medellín
Proyecto académico — NIDO
2026

