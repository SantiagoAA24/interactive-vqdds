import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { NodeDiagram } from './NodeDiagram'

describe('NodeDiagram', () => {
  it('exposes role img and an aria-label describing the active path', () => {
    render(
      <NodeDiagram
        root={{ cx: 280, cy: 32, r: 9 }}
        nodes={[
          { id: 'A', x: 280, y: 80, label: 'A', r: 28, labelDy: 9, active: true },
          {
            id: 'C',
            x: 400,
            y: 190,
            label: 'C',
            r: 28,
            labelDy: 9,
            active: true,
            editing: true,
            ringR: 40,
          },
        ]}
        edges={[{ kind: 'line', x1: 280, y1: 32, x2: 280, y2: 80, active: true }]}
        ariaLabel="Diagrama de decisión de tres qubits con el camino 1-0-1 resaltado"
      />,
    )

    const diagram = screen.getByRole('img', {
      name: 'Diagrama de decisión de tres qubits con el camino 1-0-1 resaltado',
    })
    expect(diagram.getAttribute('aria-label')).toContain('camino 1-0-1')
  })
})
