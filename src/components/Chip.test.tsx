import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { Chip } from './Chip'

function ChipHarness() {
  const [pressed, setPressed] = useState(false)
  return (
    <Chip pressed={pressed} onPressedChange={setPressed}>
      C
    </Chip>
  )
}

describe('Chip', () => {
  it('toggles aria-pressed when clicked', () => {
    render(<ChipHarness />)
    const chip = screen.getByRole('button', { name: 'C' })
    expect(chip.getAttribute('aria-pressed')).toBe('false')

    fireEvent.click(chip)
    expect(chip.getAttribute('aria-pressed')).toBe('true')

    fireEvent.click(chip)
    expect(chip.getAttribute('aria-pressed')).toBe('false')
  })
})
