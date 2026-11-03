import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { module2Page, module2PredictOptions, module2Presets } from '../content/module2'
import App from '../App'

afterEach(() => {
  cleanup()
})

function renderModule2() {
  return render(
    <MemoryRouter initialEntries={['/modulo-2']}>
      <App />
    </MemoryRouter>,
  )
}

/** Expected exact level counts and fidelity text (3 decimals, comma) per preset at mix 0.5. */
const PRESET_EXPECTATIONS: Record<
  string,
  { levels: [number, number, number, number]; fid: string }
> = {
  Producto: { levels: [1, 1, 1, 1], fid: '1,000' },
  'Bell ⊗ Bell': { levels: [1, 2, 1, 2], fid: '1,000' },
  'Bell en 2-3': { levels: [1, 1, 2, 1], fid: '0,500' },
  GHZ: { levels: [1, 2, 2, 2], fid: '0,500' },
  W: { levels: [1, 2, 2, 2], fid: '0,500' },
  'Producto ↔ GHZ': { levels: [1, 2, 3, 3], fid: '0,794' },
  'Estado genérico': { levels: [1, 2, 4, 8], fid: '0,518' },
}

describe('Module2 page', () => {
  it('updates level dots, fidelity and bars when each preset is chosen', () => {
    renderModule2()

    for (const preset of module2Presets) {
      const expected = PRESET_EXPECTATIONS[preset.name]!
      fireEvent.click(screen.getByRole('button', { name: preset.name }))

      for (let i = 0; i < 4; i++) {
        const q = `q${i + 1}`
        const n = expected.levels[i]!
        expect(
          screen.getByRole('img', { name: `Exacto ${q}: ${n} nodos` }),
        ).toBeTruthy()
      }

      expect(screen.getByTestId('m2-fidelity').textContent).toBe(expected.fid)

      const chosenBar = screen.getByTestId('m2-bar-chosen-0000')
      expect(chosenBar.getAttribute('style')).toMatch(/width:\s*[\d.]+%/)
      expect(screen.getByTestId('m2-fid-bar').getAttribute('style')).toMatch(
        /width:\s*[\d.]+%/,
      )
    }
  })

  it('shows the mix slider only for Producto ↔ GHZ', () => {
    renderModule2()

    const mixLabel = /Del producto \(0\) al GHZ \(1\)/

    expect(screen.queryByLabelText(mixLabel)).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Producto ↔ GHZ' }))
    expect(screen.getByLabelText(mixLabel)).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'GHZ' }))
    expect(screen.queryByLabelText(mixLabel)).toBeNull()
  })

  it('announces the predict verdict with aria-live polite', () => {
    renderModule2()

    const correct = module2PredictOptions.find(
      (o) => o.id === module2Page.predictCorrectId,
    )!
    fireEvent.click(screen.getByRole('button', { name: correct.label }))

    const live = screen.getByText('Correcto.').closest('[aria-live]')
    expect(live).toBeTruthy()
    expect(live?.getAttribute('aria-live')).toBe('polite')
  })
})
