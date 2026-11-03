Diagrama de decisión dibujado en SVG con las clases `dd-diagram`. Aristas inactivas en `violet` con opacidad .5 y 3px; el camino activo con clase `on` en `accent` y 6px. Nodo activo con borde `accent`; el nodo que se edita lleva un anillo punteado `ink`.

**Qué aporta quien lo usa:** la lista de nodos y aristas con su estado (`on` o no). Calcula el estado en código, no a mano. El SVG lleva `role="img"` y un `aria-label` que describe el camino activo.

- Etiqueta cada nivel con su qubit (q1, q2, q3).
- No dependas solo del color: el camino activo también es más grueso.
