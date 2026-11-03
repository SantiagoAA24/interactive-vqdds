import { cleanup, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import App from '../App'

afterEach(() => {
  cleanup()
})

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

function primaryNav() {
  return screen.getByRole('navigation', { name: 'Navegación principal' })
}

describe('navigation and routes', () => {
  it.each([
    ['/', 'Inicio'],
    ['/modulo-1', 'Módulo 1'],
    ['/modulo-2', 'Módulo 2'],
    ['/modulo-3', 'Módulo 3'],
    ['/paper', 'Paper'],
  ] as const)('renders %s with heading %s', (path, heading) => {
    renderAt(path)
    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeTruthy()
  })

  it('shows not found for an unknown route', () => {
    renderAt('/ruta-que-no-existe')
    expect(
      screen.getByRole('heading', { level: 1, name: 'Página no encontrada' }),
    ).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Volver al inicio' })).toBeTruthy()
  })

  it.each([
    ['/', 'Inicio'],
    ['/modulo-1', 'Módulo 1'],
    ['/modulo-2', 'Módulo 2'],
    ['/modulo-3', 'Módulo 3'],
    ['/paper', 'Paper'],
  ] as const)('marks %s nav link with aria-current=page', (path, label) => {
    renderAt(path)
    const nav = primaryNav()
    const current = within(nav).getByRole('link', { name: label })
    expect(current.getAttribute('aria-current')).toBe('page')

    for (const other of ['Inicio', 'Módulo 1', 'Módulo 2', 'Módulo 3', 'Paper']) {
      if (other === label) continue
      expect(within(nav).getByRole('link', { name: other }).getAttribute('aria-current')).toBeNull()
    }
  })
})
