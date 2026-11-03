import type { HamKey } from '../lib/dd/hamiltonian'

export const module3Page = {
  documentTitle: 'Módulo 3 · Diagramas de decisión',
  breadcrumbHome: 'Inicio',
  breadcrumbCurrent: 'Módulo 3 de 3',
  title: 'Entrena el diagrama para encontrar el estado base',
  lead: 'Elige un Hamiltoniano y deja que el optimizador mueva los parámetros del Accordion para bajar la energía. Verás cuándo llega al estado base y cuándo se atasca.',
  slidesNote: 'Conecta con las diapositivas 14 a 19 de la charla.',
  predictEyebrow: '1 · Predice',
  predictQuestion:
    '¿Con cuál Hamiltoniano esperas que el Accordion no llegue al estado base?',
  predictCorrectId: 'c',
  moveEyebrow: '2 · Mueve',
  moveHeading: 'Configura y entrena',
  hamLabel: 'Hamiltoniano',
  nLabel: 'Número de qubits',
  lrLabel: 'Tasa de aprendizaje',
  lrHelp:
    'El paper usa 0,01 durante 10 000 épocas; aquí subimos el valor para ver el resultado en segundos.',
  trainLabel: 'Entrenar',
  pauseLabel: 'Pausar',
  step50Label: '+50 épocas',
  newSeedLabel: 'Nueva semilla',
  chartHeading: 'Error de energía por época (escala log)',
  chartEpochPrefix: 'época',
  statEpoch: 'Época',
  statEnergy: 'Energía actual',
  statExact: 'Energía exacta',
  statError: 'Error',
  statGrad: 'Norma del gradiente',
  statusIdle:
    'Aún no entrenaste. Pulsa Entrenar para empezar con parámetros aleatorios.',
  statusConverged: 'Llegó al estado base: el error es menor que 0,001.',
  statusFlatPrefix: 'El gradiente es casi cero y el error sigue en ',
  statusFlatSuffix:
    '. El ansatz llegó a su límite o a un mínimo local; prueba otra semilla.',
  statusRunning: 'Entrenando…',
  statusPaused: 'En pausa. Sigue entrenando o cambia la configuración.',
  checkEyebrow: '3 · Comprueba',
  checkHeading: 'Qué te dice la curva',
  pagerPrevLabel: '← Módulo 2',
  pagerNextLabel: 'Sobre el paper →',
  pagerNote:
    'Material didáctico: usa 4 o 6 qubits, parametriza r = cos θ y calcula el gradiente por diferencias finitas. No reproduce los experimentos del paper (hasta 10 qubits).',
} as const

export type PredictAnswerId = 'a' | 'b' | 'c'

export const module3PredictOptions: ReadonlyArray<{
  id: PredictAnswerId
  label: string
}> = [
  { id: 'a', label: 'Z₁Z₂, el más simple' },
  { id: 'b', label: 'Ising g=10, con campo fuerte' },
  { id: 'c', label: 'Heisenberg, muy entrelazado' },
]

export const module3PredictFeedback: Record<
  PredictAnswerId,
  { verdict: string; detail: string }
> = {
  a: {
    verdict: 'No, ese es el fácil.',
    detail:
      'Su estado base es un producto, así que el Accordion lo representa exacto. Pruébalo y mira cómo el error baja a cero.',
  },
  b: {
    verdict: 'Tampoco.',
    detail:
      'Con campo fuerte el estado base casi es un producto: el error queda pequeño (cerca de 0,03 con 4 qubits), pero no llega a cero. Compruébalo con g=10.',
  },
  c: {
    verdict: 'Es la mejor apuesta.',
    detail:
      'Los singletes entre qubits vecinos cruzan las fronteras entre bloques, y ahí el Accordion pierde entrelazamiento. Entrénalo y mira dónde se queda el error.',
  },
}

export const module3Hamiltonians: ReadonlyArray<{
  key: HamKey
  name: string
  desc: string
}> = [
  {
    key: 'zz',
    name: 'Z₁Z₂',
    desc: 'Un solo término: el estado base es un producto y la energía exacta es −1.',
  },
  {
    key: 'tfim0',
    name: 'Ising g=0',
    desc: 'Σ Z·Z entre vecinos, sin campo. Estados base clásicos.',
  },
  {
    key: 'tfim1',
    name: 'Ising g=1',
    desc: 'Σ Z·Z + Σ X: punto crítico, con entrelazamiento a todas las escalas.',
  },
  {
    key: 'tfim10',
    name: 'Ising g=10',
    desc: 'Campo transversal fuerte: el estado base casi es un producto.',
  },
  {
    key: 'heis',
    name: 'Heisenberg',
    desc: 'Σ (XX + YY + ZZ) entre vecinos: estado base muy entrelazado.',
  },
]

export const module3QubitOptions = [4, 6] as const

export const module3Ideas: ReadonlyArray<{ title: string; description: string }> = [
  {
    title: 'Error que baja hasta cero',
    description:
      'El estado base cabe en el ansatz y el optimizador lo encontró. Es lo que ocurre cuando no hay entrelazamiento entre bloques.',
  },
  {
    title: 'Error que se queda plano',
    description:
      'Si el gradiente es casi cero pero el error no, el ansatz llegó a su límite o a un mínimo local. Prueba otra semilla: si el valor se repite, es el límite del Accordion.',
  },
  {
    title: 'Gradiente pequeño desde el inicio',
    description:
      'Con más qubits el gradiente se hace más chico y la curva avanza más lento: es la intuición de las mesetas estériles. El paper mide cómo cambia la varianza con el tamaño.',
  },
]
