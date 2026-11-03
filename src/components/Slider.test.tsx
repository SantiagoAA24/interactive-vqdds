import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Slider } from './Slider'

describe('Slider', () => {
  it('associates the label with the range control via getByLabelText', () => {
    render(
      <Slider
        id="slider-r"
        label="r (reparte la probabilidad)"
        value={0.3}
        min={0}
        max={1}
        step={0.01}
        formattedValue="0,30"
        onChange={vi.fn()}
      />,
    )

    const control = screen.getByLabelText(/r \(reparte la probabilidad\)/)
    expect(control).toBeTruthy()
    expect(control.getAttribute('type')).toBe('range')
    expect(control.getAttribute('id')).toBe('slider-r')
  })
})
