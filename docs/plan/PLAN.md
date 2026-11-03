# Plan de implementación (10 pasos)

Proyecto: `interactive-vqdds`, recurso interactivo "Diagramas de decisión", solo frontend. Trabaja un paso a la vez; cada paso termina con lint, typecheck, test y build en verde y un commit.

Estructura objetivo:

```
src/
  main.tsx, App.tsx            rutas con HashRouter
  styles/                      tokens.css, components.css (copias exactas del sistema de diseño), global.css
  components/                  Button, Chip, Panel, PredictCard, Slider, ProbabilityRow, StatTile, NodeDiagram, ModuleCard
  layout/                      PageShell, Nav, Footer, ModulePager
  lib/dd/                      amplitude.ts, nodes.ts, hamiltonian.ts, ansatz.ts, adam.ts (funciones puras)
  workers/train.worker.ts      entrenamiento del módulo 3
  pages/                       Home, Module1, Module2, Module3, Paper
  content/                     textos y glosario como datos tipados
```

## Paso 1. Proyecto base
Node con fnm (`fnm install --lts`, `fnm use`, archivo `.node-version` y `engines` en package.json). Vite + React 18 + TypeScript estricto con `name: interactive-vqdds`, ESLint, Prettier, Vitest, react-router-dom con HashRouter, paquetes con npm. Scripts: dev, build, lint, typecheck, test.
Listo cuando: `fnm use` selecciona la versión correcta, la página inicial dice "Hola" y los cuatro comandos pasan.

## Paso 2. Tokens y estilos globales
Copiar `docs/design-system/tokens.css` a `src/styles/tokens.css` y `components/bundle.css` a `src/styles/components.css`. Cargar las tres fuentes de Google. `global.css` con fondo, color y fuente por variables. Ruta `/diseno` que pinta tokens y estilos de texto.
Listo cuando: `/diseno` coincide con el sistema de diseño y los archivos copiados son idénticos (diff vacío).

## Paso 3. Componentes base
Los nueve componentes de `docs/design-system/components/`, en este orden: Button, Chip, Panel, Slider, StatTile, ProbabilityRow, PredictCard, ModuleCard, NodeDiagram. Ruta `/componentes` con todos sus estados.
Listo cuando: cada componente coincide con su `preview.html` y se opera con teclado con foco visible.

## Paso 4. Estructura de página y navegación
PageShell (barra, contenedor de 1200px con gutter de 32px, pie), ModulePager, rutas `/`, `/modulo-1`, `/modulo-2`, `/modulo-3`, `/paper`, página no encontrada, hook `useDocumentTitle`.
Listo cuando: se navega entre las cinco páginas con teclado y a 400px no hay desplazamiento horizontal.

## Paso 5. Inicio y Paper
Pasar `Main.dc.html` y `Paper.dc.html` a Home y Paper, con los textos en `src/content/`.
Listo cuando: ambas páginas coinciden con los prototipos en secciones, orden, textos y enlaces.

## Paso 6. Módulo 1: leer un estado
`src/lib/dd/amplitude.ts` con pruebas primero; página con `useReducer` (nodo seleccionado, bits, parámetros, respuesta). Probabilidades derivadas en cada render.
Listo cuando: pasan las pruebas de `docs/reference/test-values.md` y el comportamiento coincide con el prototipo.

## Paso 7. Módulo 2: qué estados caben
`src/lib/dd/nodes.ts` (conteo de nodos y fidelidad con iteración de potencias) con pruebas; página con estado `{ estadoElegido, mezcla, respuestaElegida }` y resto con `useMemo`.
Listo cuando: la tabla de estados da los nodos y fidelidades de `test-values.md`.

## Paso 8. Módulo 3: entrenar
8A matemática pura (`hamiltonian.ts`, `ansatz.ts`, `adam.ts`) con pruebas; 8B Web Worker y hook `useTrainer`; 8C interfaz (controles, curva SVG en escala log, métricas, mensaje de estado).
Listo cuando: pasan las pruebas y Z₁Z₂ con 4 qubits llega a error cercano a cero en menos de cinco segundos sin bloquear la interfaz.

## Paso 9. Accesibilidad, móvil y rendimiento
Auditoría de teclado y lector de pantalla, contraste y 400px. Corregir lo de severidad alta y media.
Listo cuando: las cinco páginas pasan la revisión sin hallazgos de severidad alta.

## Paso 10. Publicación
Workflow de GitHub Actions al hosting elegido (sitio estático, HashRouter sin reglas de redirección) y código QR de la URL final.
Listo cuando: el QR abre el sitio en un celular con datos móviles y el módulo 3 entrena.
