export type PaperComparisonRow = {
  topic: string
  paper: string
  demo: string
}

export const paperPage = {
  breadcrumbHome: 'Inicio',
  breadcrumbCurrent: 'Acerca del paper',
  title:
    'Variational decision diagrams for quantum-inspired machine learning applications',
  lead: 'Este recurso acompaña la charla sobre ese trabajo. Aquí tienes cómo citarlo, qué aporta y qué partes de la página son material didáctico y no resultados del artículo.',
  citeHeading: 'Léelo y cítalo',
  arxivId: 'arXiv:2502.04271',
  doi: 'DOI: 10.48550/arXiv.2502.04271',
  authors:
    'Autores: Acevedo-Mancera, Vargas-Calderón y Vinck-Posada. Si citas una versión publicada, usa los datos de la revista en lugar de los de arXiv.',
  arxivUrl: 'https://arxiv.org/abs/2502.04271',
  pdfUrl: 'https://arxiv.org/pdf/2502.04271',
  openArxivLabel: 'Abrir en arXiv',
  pdfLabel: 'PDF',
  contributesHeading: 'Qué aporta',
  comparisonHeading: 'Paper y material didáctico',
  comparisonColumns: {
    topic: 'Tema',
    paper: 'En el paper',
    demo: 'En esta página',
  },
  limitsHeading: 'Límites que conviene tener presentes',
  limitsBody:
    'Los módulos simulan sistemas de 4 y 6 qubits en tu navegador y no reproducen los experimentos del artículo. El ansatz Accordion limita el entrelazamiento entre bloques, como muestran los módulos 2 y 3. Para conclusiones, usa los resultados y figuras del paper.',
  pagerPrevLabel: '← Módulo 3',
  pagerNextLabel: 'Inicio →',
  pagerNote: 'Recurso preparado para el Qiskit Fall Fest Colombia.',
} as const

export const paperContributions: string[] = [
  'Un diagrama de decisión cuyos nodos llevan parámetros (r, ω, φ) y que queda normalizado por construcción.',
  'El ansatz Accordion, con niveles de uno y dos nodos que se alternan.',
  'Un análisis de la varianza del gradiente, para estudiar las mesetas estériles.',
  'Estimación de estados base con minimización variacional y el optimizador Adam, hasta unos 10 qubits.',
]

export const paperComparisonRows: PaperComparisonRow[] = [
  {
    topic: 'Representación',
    paper:
      'Diagrama de decisión con parámetros por nodo y normalización por construcción.',
    demo: 'Módulo 1: tres qubits y cuatro nodos para leer amplitudes.',
  },
  {
    topic: 'Ansatz',
    paper: 'Accordion: niveles alternos de uno y dos nodos (Figura 1, ecuación 2).',
    demo: 'Módulo 2: conteo exacto de nodos y fidelidad para 4 qubits.',
  },
  {
    topic: 'Optimización',
    paper: 'Adam, tasa 0,01, 10 000 épocas, hasta unos 10 qubits.',
    demo: 'Módulo 3: Adam con tasa mayor, 4 o 6 qubits, gradiente por diferencias finitas.',
  },
  {
    topic: 'Hamiltonianos',
    paper: 'Z₁Z₂, Ising de campo transversal, Heisenberg XYZ.',
    demo: 'Los mismos tipos, con parámetros fijos para que corran en el navegador.',
  },
  {
    topic: 'Mesetas estériles',
    paper: 'Varianza del gradiente frente al tamaño del sistema.',
    demo: 'Solo la intuición: la norma del gradiente que ves en el módulo 3.',
  },
]
