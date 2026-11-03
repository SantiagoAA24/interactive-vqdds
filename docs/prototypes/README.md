# Cómo leer los prototipos

Los archivos `.dc.html` son prototipos de la dirección A hechos en un lienzo de diseño. Son HTML con un formato propio y **no se abren de forma útil en el navegador** (falta el archivo `support.js` del lienzo). Úsalos como referencia de lectura.

Cada archivo tiene dos partes:

1. **Marcado** dentro de `<x-dc> … </x-dc>`: estructura, textos y estilos en línea.
   - `{{ nombre }}` es un hueco que se llena con un valor calculado (en React: una expresión `{valor}`).
   - `<sc-for list="{{ lista }}" as="x">…</sc-for>` repite su contenido (en React: `lista.map(x => …)`).
   - `<sc-if value="{{ cond }}">…</sc-if>` muestra su contenido si se cumple (en React: `{cond && …}`).
   - `onClick="{{ fn }}"` y `onChange="{{ fn }}"` son manejadores (en React: `onClick={fn}`).
2. **Script** `<script type="text/x-dc">`: una clase `Component` con `this.state`, métodos de cálculo y `renderVals()`, que devuelve todos los valores del marcado. Ahí está la lógica que hay que portar a `src/lib/dd/` y a los hooks de cada página.

Los colores y medidas en línea corresponden a tokens del sistema de diseño (`docs/design-system/tokens.json`). En el código real usa el token, no el valor literal.

Archivos: `Main` (inicio), `Modulo-1`, `Modulo-2`, `Modulo-3`, `Paper`.
