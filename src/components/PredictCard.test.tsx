import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PredictCard } from './PredictCard'

const OPTIONS = [
  { id: 'paths', label: 'Solo las de los caminos que pasan por ese nodo' },
  { id: 'all', label: 'Las ocho, siempre' },
  { id: 'none', label: 'Ninguna: r solo cambia la fase' },
]

describe('PredictCard', () => {
  it('shows the verdict text and marks data-state correct', () => {
    const { getByText, getByRole, unmount } = render(
      <PredictCard
        eyebrow="1 · Predice"
        question="¿Qué cambia?"
        options={OPTIONS}
        correctId="paths"
        selectedId="paths"
        onSelect={vi.fn()}
        feedback={{
          verdict: 'Correcto.',
          detail: 'El nodo C solo está en los caminos que empiezan en 1.',
        }}
      />,
    )

    expect(getByText('Correcto.')).toBeTruthy()
    const correct = getByRole('button', {
      name: 'Solo las de los caminos que pasan por ese nodo',
    })
    expect(correct.getAttribute('data-state')).toBe('correct')
    expect(correct.getAttribute('aria-pressed')).toBe('true')
    unmount()
  })

  it('marks data-state wrong on an incorrect choice', () => {
    const { getByText, getByRole, unmount } = render(
      <PredictCard
        eyebrow="1 · Predice"
        question="¿Qué cambia?"
        options={OPTIONS}
        correctId="paths"
        selectedId="all"
        onSelect={vi.fn()}
        feedback={{
          verdict: 'No siempre.',
          detail: 'r en C solo afecta los caminos que pasan por ese nodo.',
        }}
      />,
    )

    expect(getByText('No siempre.')).toBeTruthy()
    const wrong = getByRole('button', { name: 'Las ocho, siempre' })
    expect(wrong.getAttribute('data-state')).toBe('wrong')
    expect(wrong.getAttribute('aria-pressed')).toBe('true')
    unmount()
  })
})

