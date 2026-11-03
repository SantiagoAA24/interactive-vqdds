Usa este sistema para cualquier pantalla del recurso interactivo «Diagramas de decisión». Es un sistema oscuro de una sola capa: no hay tema claro.

## Fundamentos de contenido

- Escribe en español de Colombia, tuteando: «Mueve el control», «Elige un camino». Frases cortas y directas.
- Cada módulo sigue el orden **Predice, Mueve, Comprueba**, con esas tres etiquetas en `eyebrow` y numeradas 1, 2, 3.
- Los botones dicen qué ocurre: «Entrenar», «Pausar», «+50 épocas», «Nueva semilla», «Restablecer valores».
- Cifras con coma decimal y signo menos tipográfico (−4,533). Las cifras, bits y parámetros van en `value` (mono).
- El veredicto de una predicción empieza con una palabra («Correcto.», «No siempre.», «Revisa la idea.»). Nunca solo color.
- Sin emoji. Los símbolos de física (ω, φ, ⟨ ⟩, ⊗, Σ) son parte del texto.
- Lo que no viene del paper se marca como material didáctico en el pie de la página.

## Fundamentos visuales

- Fondo de página: `bg`. Paneles: `surface` con borde `border` de 1px. Nada de sombras ni degradados.
- Ámbar (`accent`) es para lo que el estudiante debe mirar o pulsar: acción principal, camino activo, valores clave, enlace de siguiente paso. Violeta (`violet`) es para la estructura: aristas inactivas, etiquetas, migas de pan.
- La banda `band` se usa una vez por módulo, para la pregunta de Predice. Dentro, las opciones usan `option`.
- Texto principal en `ink`; apoyo en `ink-muted`. Los títulos usan la familia display (`h1`, `h2`, `h2-band`, `card-title`); el texto corrido, `lead`, `body`, `body-sm`, `caption`; las etiquetas de sección, `eyebrow` en mayúsculas.
- Ancho máximo `container` (1200px) con gutter `space-32`. Separa secciones con `space-64`; bloques dentro de un panel con `space-24`.
- Radios: botones y filas `radius-md`; opciones y mosaicos `radius-lg`; tarjetas `radius-xl`; paneles `radius-2xl`; banda `radius-3xl`.
- Foco: anillo sólido de 3px en `accent`, separado 3px. Cumple 3:1 sobre `bg`, `surface` y `band`.
- Sin animación decorativa. El movimiento es el propio cambio de los datos al mover un control.
- Estado seleccionado: fondo `surface-selected` y borde `accent`. Correcto: borde `success`. Incorrecto: borde `danger`, siempre con el veredicto escrito.
- Móvil (400px): una columna, los controles pasan debajo del diagrama y los botones mantienen 48px de alto mínimo.

## Imágenes e iconografía

- No hay fotografías ni iconos. Los gráficos son diagramas SVG hechos con `NodeDiagram`: discos para nodos, líneas para aristas.
- La marca es un símbolo de tres círculos unidos (un nodo arriba y dos abajo) en `accent` y `violet`, junto al texto «Diagramas de decisión» en `card-title`. No hay logo oficial; si llega uno, cópialo sin modificarlo.

## Cómo usarlo en código

Copia `tokens.css` a `src/styles/tokens.css` y `components/bundle.css` a `src/styles/components.css`. Importa las tres fuentes de Google (Space Grotesk 500-700, IBM Plex Sans 400-600, JetBrains Mono 500). Cada componente de React usa esas clases o las variables `--nombre-del-token`; no escribas colores ni medidas literales.
