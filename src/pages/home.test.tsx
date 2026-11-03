import { cleanup, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { modules } from '../content/modules'
import App from '../App'

afterEach(() => {
  cleanup()
})

function renderHome() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  )
}

describe('Home page', () => {
  it('renders the three module cards with router links', () => {
    renderHome()

    for (const module of modules) {
      const link = screen.getByRole('link', { name: module.linkLabel })
      expect(link.getAttribute('href')).toBe(module.to)
      expect(screen.getByRole('heading', { level: 3, name: module.title })).toBeTruthy()
      expect(screen.getByText(module.prompt)).toBeTruthy()
    }
  })

  it('opens the arXiv CTA in a new tab with rel=noopener', () => {
    renderHome()

    const external = screen.getByRole('link', { name: 'Leer el paper en arXiv' })
    expect(external.getAttribute('href')).toBe('https://arxiv.org/abs/2502.04271')
    expect(external.getAttribute('target')).toBe('_blank')
    expect(external.getAttribute('rel')).toBe('noopener')
  })

  it('includes the footer citation arXiv link with target and rel', () => {
    renderHome()

    const footer = screen.getByRole('contentinfo')
    const arxiv = within(footer).getByRole('link', { name: 'arXiv:2502.04271' })
    expect(arxiv.getAttribute('href')).toBe('https://arxiv.org/abs/2502.04271')
    expect(arxiv.getAttribute('target')).toBe('_blank')
    expect(arxiv.getAttribute('rel')).toBe('noopener')
  })
})
