export const module1Page = {
  documentTitle: 'Módulo 1 · Diagramas de decisión',
  breadcrumbHome: 'Inicio',
  breadcrumbCurrent: 'Módulo 1 de 3',
  title: 'Lee un estado en el diagrama',
  lead: 'Un diagrama de decisión guarda un estado de tres qubits en cuatro nodos. Para leer la amplitud de una cadena de bits, recorres un camino y multiplicas las aristas que encuentras.',
  slidesNote: 'Conecta con las diapositivas 7 a 10 de la charla.',
  predictEyebrow: '1 · Predice',
  predictQuestion: 'Si mueves r del nodo C, ¿qué probabilidades cambian?',
  predictCorrectId: 'a',
  moveEyebrow: '2 · Mueve',
  moveHeading: 'Elige un camino y un nodo',
  resetLabel: 'Restablecer valores',
  diagramAriaBase:
    'Diagrama de decisión de tres qubits con los nodos A, B, C y D. El camino elegido se resalta en ámbar y el nodo seleccionado tiene un anillo punteado.',
  diagramHint:
    'Cada nodo tiene dos aristas: la izquierda lleva al bit 0 y la derecha al bit 1. B y C envían sus dos aristas al mismo nodo D.',
  bitsHeading: 'Cadena de bits (haz clic para cambiar cada bit)',
  editNodeHeading: 'Nodo a editar',
  sliderR: 'r (reparte la probabilidad)',
  sliderOmega: 'ω (fase de la arista 0)',
  sliderPhi: 'φ (fase de la arista 1)',
  edgeConvention: 'Arista 0: r·e^(iω). Arista 1: √(1−r²)·e^(iφ). Valores en radianes.',
  amplitudePrefix: 'Amplitud de |',
  amplitudeSuffix: '⟩ = producto del camino',
  amplitudePhasesNote: 'Los módulos se multiplican y las fases se suman.',
  checkEyebrow: '3 · Comprueba',
  checkHeading: 'Las ocho probabilidades',
  sumPrefix: 'Suma de las ocho probabilidades = ',
  tagChosenPath: 'camino elegido',
  tagThroughNodePrefix: 'pasa por el nodo ',
  pagerPrevLabel: '← Inicio',
  pagerNextLabel: 'Módulo 2 →',
  pagerNote:
    'Material didáctico: la estructura de cuatro nodos sigue la Figura 1 y la ecuación (2) del paper; los valores iniciales de los parámetros son ilustrativos.',
} as const

export type PredictAnswerId = 'a' | 'b' | 'c'

export const module1PredictOptions: ReadonlyArray<{
  id: PredictAnswerId
  label: string
}> = [
  { id: 'a', label: 'Solo las de los caminos que pasan por ese nodo' },
  { id: 'b', label: 'Las ocho, siempre' },
  { id: 'c', label: 'Ninguna: r solo cambia la fase' },
]

export const module1PredictFeedback: Record<
  PredictAnswerId,
  { verdict: string; detail: string }
> = {
  a: {
    verdict: 'Correcto.',
    detail:
      'El nodo C solo está en los caminos que empiezan en 1, así que solo cambian esas cuatro probabilidades. Los nodos A y D, en cambio, están en los ocho caminos.',
  },
  b: {
    verdict: 'No siempre.',
    detail:
      'Selecciona el nodo C y mueve r: las filas que empiezan en 0 no se mueven. Solo cambian los caminos que pasan por C.',
  },
  c: {
    verdict: 'Revisa la idea.',
    detail:
      'r no es una fase: reparte la probabilidad entre |0⟩ y |1⟩. Las fases son ω y φ. Muévelas y compara con r.',
  },
}

export const module1Ideas: ReadonlyArray<{ title: string; description: string }> = [
  {
    title: 'Las fases no cambian las probabilidades',
    description:
      'Mueve ω o φ: las barras no se mueven. Solo r reparte probabilidad entre |0⟩ y |1⟩.',
  },
  {
    title: 'La suma siempre da 1',
    description:
      'En cada nodo, |izquierda|² + |derecha|² = 1. Por eso el estado queda normalizado sin hacer nada más.',
  },
  {
    title: 'El nodo D es compartido',
    description:
      'B y C llegan al mismo D, así que el qubit 3 se comporta igual sin importar q1 y q2. ¿Qué estados deja fuera esta estructura? Lo exploras en el módulo 2.',
  },
]

export const module1NodeIds = ['A', 'B', 'C', 'D'] as const
