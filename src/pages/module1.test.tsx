import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { module1Page, module1PredictOptions } from '../content/module1'
import App from '../App'

afterEach(() => {
  cleanup()
})

function renderModule1() {
  return render(
    <MemoryRouter initialEntries={['/modulo-1']}>
      <App />
    </MemoryRouter>,
  )
}

describe('Module1 page', () => {
  it('toggles a bit and updates the highlighted path in the diagram aria-label', () => {
    renderModule1()

    const before = screen.getByRole('img', {
      name: /Camino 1-0-1/,
    })
    expect(before.getAttribute('aria-label')).toContain('Camino 1-0-1')

    fireEvent.click(screen.getByRole('button', { name: 'q1 = 1' }))

    const after = screen.getByRole('img', {
      name: /Camino 0-0-1/,
    })
    expect(after.getAttribute('aria-label')).toContain('Camino 0-0-1')
  })

  it('shows Correcto. when the right predict option is chosen', () => {
    renderModule1()

    const correct = module1PredictOptions.find((o) => o.id === module1Page.predictCorrectId)!
    fireEvent.click(screen.getByRole('button', { name: correct.label }))

    expect(screen.getByText('Correcto.')).toBeTruthy()
  })

  it('exposes the three sliders by their labels', () => {
    renderModule1()

    expect(screen.getByLabelText(/r \(reparte la probabilidad\)/)).toBeTruthy()
    expect(screen.getByLabelText(/ω \(fase de la arista 0\)/)).toBeTruthy()
    expect(screen.getByLabelText(/φ \(fase de la arista 1\)/)).toBeTruthy()
  })

  it('announces the verdict with aria-live polite', () => {
    renderModule1()

    const correct = module1PredictOptions.find((o) => o.id === module1Page.predictCorrectId)!
    fireEvent.click(screen.getByRole('button', { name: correct.label }))

    const live = screen.getByText('Correcto.').closest('[aria-live]')
    expect(live).toBeTruthy()
    expect(live?.getAttribute('aria-live')).toBe('polite')
  })
})
