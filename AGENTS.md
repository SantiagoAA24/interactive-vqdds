# interactive-vqdds — Diagramas de decisión, recurso interactivo

Sitio web educativo (solo frontend, sin backend) que acompaña la charla sobre el paper arXiv:2502.04271 en el Qiskit Fall Fest Colombia. Tres módulos interactivos (leer un estado, qué estados caben, entrenar) más una página de inicio y una de "Acerca del paper".

## Stack
Vite, React 18, TypeScript estricto, React Router con HashRouter, Vitest. CSS plano con variables de token. Sin librerías de UI, sin backend.
El nombre del proyecto y del paquete es `interactive-vqdds`. La versión de Node se gestiona con fnm (archivo `.node-version`; usa `fnm use`) y los paquetes se instalan con npm.

## Dónde está cada cosa
- Sistema de diseño (fuente única de colores, tipografía y componentes): `docs/design-system/`
- Prototipos de las páginas (referencia de estructura, textos y lógica): `docs/prototypes/` (lee `docs/prototypes/README.md`)
- Plan de diez pasos y prompts: `docs/plan/`
- Valores numéricos conocidos para pruebas: `docs/reference/test-values.md`

## Reglas
- Interfaz y textos en español de Colombia; identificadores y comentarios de código en inglés.
- Nada de colores, tamaños ni radios literales en `src/`: usa variables de `src/styles/tokens.css` y clases `dd-*` de `src/styles/components.css`.
- La matemática vive en `src/lib/dd/` como funciones puras sin React, con pruebas.
- No añadas dependencias sin pedirlo antes.
- Trabaja un paso de `docs/plan/PLAN.md` a la vez. Al terminar: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`.
