export type GlossaryEntry = {
  term: string
  definition: string
}

export const glossary: GlossaryEntry[] = [
  {
    term: 'Amplitud',
    definition:
      'Número complejo asociado a cada cadena de bits. Su módulo al cuadrado es la probabilidad de medirla.',
  },
  {
    term: 'Ansatz',
    definition:
      'Forma que fijamos de antemano para el estado de prueba, con parámetros que se ajustan.',
  },
  {
    term: 'Hamiltoniano',
    definition: 'Operador cuya energía más baja, la del estado base, queremos encontrar.',
  },
  {
    term: 'Barren plateau',
    definition:
      'Región plana de la función de costo: el gradiente casi desaparece y el optimizador no avanza.',
  },
]
