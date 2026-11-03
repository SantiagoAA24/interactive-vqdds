import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useDocumentTitle } from './useDocumentTitle'

function TitleProbe({ title }: { title: string }) {
  useDocumentTitle(title)
  return null
}

describe('useDocumentTitle', () => {
  it('updates document.title and restores on unmount', () => {
    document.title = 'título previo'
    const { unmount, rerender } = render(<TitleProbe title="Inicio · Diagramas de decisión" />)
    expect(document.title).toBe('Inicio · Diagramas de decisión')

    rerender(<TitleProbe title="Módulo 1 · Diagramas de decisión" />)
    expect(document.title).toBe('Módulo 1 · Diagramas de decisión')

    unmount()
    expect(document.title).toBe('título previo')
  })
})
