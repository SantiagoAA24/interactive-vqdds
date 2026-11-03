import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProbabilityRow } from './ProbabilityRow'

describe('ProbabilityRow', () => {
  it('sets aria-current on the selected row', () => {
    const { container } = render(
      <>
        <ProbabilityRow
          label="|101⟩"
          probability={0.161}
          formattedValue="0,161"
          tag="camino elegido"
          selected
        />
        <ProbabilityRow label="|100⟩" probability={0.201} formattedValue="0,201" />
      </>,
    )

    const selected = screen.getByText('|101⟩').closest('.dd-row')
    const other = screen.getByText('|100⟩').closest('.dd-row')

    expect(selected?.getAttribute('aria-current')).toBe('true')
    expect(other?.getAttribute('aria-current')).toBeNull()
    expect(container.querySelectorAll('[aria-current="true"]')).toHaveLength(1)
  })
})
