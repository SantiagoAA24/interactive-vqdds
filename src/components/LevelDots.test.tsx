import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LevelDots } from './LevelDots'

describe('LevelDots', () => {
  it('exposes the count as accessible name', () => {
    render(<LevelDots count={3} tone="accent" />)
    expect(screen.getByRole('img', { name: '3 nodos' })).toBeTruthy()
  })

  it('renders one dot per count', () => {
    const { container } = render(<LevelDots count={2} tone="violet" />)
    expect(container.querySelectorAll('.dd-level-dot')).toHaveLength(2)
  })
})
