import type { StateKey } from '../lib/dd/nodes'

export const module2Page = {
  documentTitle: 'Módulo 2 · Diagramas de decisión',
  breadcrumbHome: 'Inicio',
  breadcrumbCurrent: 'Módulo 2 de 3',
  title: '¿Qué estados caben en un diagrama?',
  lead: 'Un diagrama exacto necesita más nodos cuanto más entrelazado está el estado. El ansatz Accordion fija 6 nodos para 4 qubits: eso basta para unos estados y deja fuera a otros.',
  slidesNote: 'Conecta con las diapositivas 11 a 13 de la charla.',
  predictEyebrow: '1 · Predice',
  predictQuestion:
    'El GHZ de 4 qubits vale |0000⟩ y |1111⟩ con el mismo peso. ¿Qué fidelidad alcanza el mejor Accordion?',
  predictCorrectId: 'b',
  moveEyebrow: '2 · Mueve',
  moveHeading: 'Elige un estado de 4 qubits',
  mixSliderLabel: 'Del producto (0) al GHZ (1)',
  levelsHeading: 'Nodos por nivel',
  levelsExactCol: 'Diagrama exacto',
  levelsAccCol: 'Accordion',
  levelsSummaryPrefix: 'Exacto:',
  levelsSummaryMiddle: 'nodos · Accordion:',
  levelsSummarySuffix: 'nodos',
  levelsNote:
    'Un nodo cuenta una vez por cada sub-vector distinto, salvo un factor global. Los anillos ámbar marcan niveles donde el exacto necesita más nodos que el Accordion.',
  fidelityHeading: 'Mejor aproximación con Accordion',
  fidelityCaption: 'fidelidad con el estado elegido',
  fitExact: 'Cabe sin pérdida: el Accordion reproduce este estado exactamente.',
  fitAlmost: 'Casi cabe: se pierde una parte pequeña del entrelazamiento.',
  fitPoor:
    'No cabe: el Accordion solo alcanza una parte del estado. Falta entrelazamiento entre los bloques (q1,q2) y (q3,q4).',
  checkEyebrow: '3 · Comprueba',
  checkHeading: 'Estado real frente a aproximación',
  legendChosen: 'Estado elegido',
  legendApprox: 'Mejor Accordion',
  overviewHeading: 'Todos los estados de un vistazo',
  overviewNodesSuffix: 'nodos',
  overviewFidPrefix: 'F =',
  pagerPrevLabel: '← Módulo 1',
  pagerNextLabel: 'Módulo 3 →',
  pagerNote:
    'Material didáctico: el conteo de nodos y la fidelidad son cálculos exactos sobre estos ejemplos, no resultados del paper. Aquí se usan amplitudes reales.',
} as const

export type PredictAnswerId = 'a' | 'b' | 'c'

export const module2PredictOptions: ReadonlyArray<{
  id: PredictAnswerId
  label: string
}> = [
  { id: 'a', label: '1,00: cabe exacto' },
  { id: 'b', label: '0,50' },
  { id: 'c', label: '0,25' },
]

export const module2PredictFeedback: Record<
  PredictAnswerId,
  { verdict: string; detail: string }
> = {
  a: {
    verdict: 'No cabe.',
    detail:
      'El GHZ une los cuatro qubits con una sola correlación. Un nivel con un único nodo parte el estado en dos bloques independientes, y eso no puede reproducir |0000⟩ + |1111⟩.',
  },
  b: {
    verdict: 'Correcto.',
    detail:
      'El mejor Accordion se queda con la mitad: reproduce |00⟩⊗|00⟩ o |11⟩⊗|11⟩, pero no la superposición. El estado de abajo ya está en GHZ; mira las barras.',
  },
  c: {
    verdict: 'Más de lo que crees.',
    detail:
      'La mejor aproximación es mejor que eso: alcanza 0,50. Mira las barras del estado GHZ en la sección 3.',
  },
}

export const module2Presets: ReadonlyArray<{
  key: StateKey
  name: string
  desc: string
}> = [
  {
    key: 'prod',
    name: 'Producto',
    desc: 'Cuatro qubits en |+⟩, sin ningún entrelazamiento.',
  },
  {
    key: 'bb',
    name: 'Bell ⊗ Bell',
    desc: 'Dos pares de Bell: qubits 1-2 y 3-4. Entrelazamiento solo dentro de cada par.',
  },
  {
    key: 'b23',
    name: 'Bell en 2-3',
    desc: 'Los qubits 2 y 3 forman un par de Bell; el 1 y el 4 quedan libres. El par cruza la frontera entre bloques.',
  },
  {
    key: 'ghz',
    name: 'GHZ',
    desc: '|0000⟩ y |1111⟩ con el mismo peso.',
  },
  {
    key: 'w',
    name: 'W',
    desc: 'Una sola excitación repartida entre los cuatro qubits.',
  },
  {
    key: 'mix',
    name: 'Producto ↔ GHZ',
    desc: 'Una mezcla continua entre el estado producto y el GHZ; muévela con el control.',
  },
  {
    key: 'rnd',
    name: 'Estado genérico',
    desc: 'Amplitudes fijas sin estructura especial: cada qubit está entrelazado con los demás.',
  },
]

export const module2Ideas: ReadonlyArray<{ title: string; description: string }> = [
  {
    title: 'Pocos nodos, estado con estructura',
    description:
      'El producto cabe con 4 nodos y Bell⊗Bell con 6. El estado tiene estructura y el diagrama la aprovecha.',
  },
  {
    title: 'El cuello de botella es un nodo',
    description:
      'En el Accordion hay niveles con un solo nodo. Ahí el estado se parte en bloques de dos qubits, y el entrelazamiento entre bloques se pierde.',
  },
  {
    title: 'Menos nodos, parámetros más fáciles',
    description:
      'Restringir el diagrama reduce los parámetros. A cambio, el estado que buscas debe parecerse a algo que cabe. Lo pruebas en el módulo 3.',
  },
]
