export type HowToStep = {
  number: string
  title: string
  description: string
  accent: 'accent' | 'violet'
}

export const howToSteps: HowToStep[] = [
  {
    number: '1',
    title: 'Predice',
    description: 'Antes de tocar nada, piensa qué crees que va a pasar.',
    accent: 'accent',
  },
  {
    number: '2',
    title: 'Mueve',
    description: 'Cambia un parámetro, un estado o una tasa de aprendizaje.',
    accent: 'violet',
  },
  {
    number: '3',
    title: 'Comprueba',
    description:
      'Compara con tu predicción y lee la explicación corta que acompaña cada resultado.',
    accent: 'accent',
  },
]
