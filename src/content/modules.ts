export type ModuleTeaser = {
  id: string
  eyebrow: string
  title: string
  description: string
  prompt: string
  to: string
  linkLabel: string
  ariaLabel: string
}

export const modules: ModuleTeaser[] = [
  {
    id: 'modulo-1',
    eyebrow: '01',
    title: 'Lee un estado en el diagrama',
    description:
      'Recorre el camino de una cadena de bits y comprueba que la amplitud es el producto de las aristas. Mueve r, ω y φ y mira cómo cambian las probabilidades.',
    prompt: 'Si cambias r en un nodo, ¿qué amplitudes se modifican?',
    to: '/modulo-1',
    linkLabel: 'Abrir módulo 1 →',
    ariaLabel: 'Pequeño diagrama de decisión con un camino resaltado',
  },
  {
    id: 'modulo-2',
    eyebrow: '02',
    title: '¿Qué estados caben?',
    description:
      'Elige un estado objetivo y compara su diagrama exacto con lo que logra representar el ansatz Accordion con pocos parámetros.',
    prompt: '¿Cuáles estados representa el Accordion y cuáles solo aproxima?',
    to: '/modulo-2',
    linkLabel: 'Abrir módulo 2 →',
    ariaLabel: 'Barras de un estado objetivo en ámbar y de su aproximación en violeta',
  },
  {
    id: 'modulo-3',
    eyebrow: '03',
    title: 'Entrena un diagrama',
    description:
      'Escoge un Hamiltoniano, ajusta la tasa de aprendizaje y observa cómo la energía baja hacia la del estado base.',
    prompt: '¿La energía siempre llega hasta E₀?',
    to: '/modulo-3',
    linkLabel: 'Abrir módulo 3 →',
    ariaLabel: 'Curva de energía que baja hacia una línea punteada que marca la energía del estado base',
  },
]
