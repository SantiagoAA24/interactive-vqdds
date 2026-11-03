Fila de anillos que representan el conteo de nodos en un nivel del diagrama (exacto o Accordion). Cada anillo es un punto; el tono `accent` marca niveles donde el exacto necesita más nodos que el Accordion, y `violet` el resto.

**Qué aporta quien lo usa:** el `count` (número de puntos) y el `tone`. El número mono al lado lo pinta la página.

- Accesible con `role="img"` y `aria-label` que diga el conteo (p. ej. «3 nodos»).
- Sin literales de color: usa `--accent` / `--violet` / `--bg`.
- Tamaño del punto: `--space-20`.
