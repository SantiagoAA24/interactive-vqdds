import { describe, expect, it } from 'vitest'
import {
  ACCORDION_LEVELS,
  ACCORDION_TOTAL,
  analyzeState,
  levelNodeCounts,
  stateAmplitudes,
  type StateKey,
} from './nodes'

const TOL = 0.001

type TableRow = {
  key: StateKey
  mix: number
  levels: [number, number, number, number]
  total: number
  fidelity: number
}

/** Full table from docs/reference/test-values.md (Module 2). */
const TABLE: TableRow[] = [
  { key: 'prod', mix: 0.5, levels: [1, 1, 1, 1], total: 4, fidelity: 1.0 },
  { key: 'bb', mix: 0.5, levels: [1, 2, 1, 2], total: 6, fidelity: 1.0 },
  { key: 'b23', mix: 0.5, levels: [1, 1, 2, 1], total: 5, fidelity: 0.5 },
  { key: 'ghz', mix: 0.5, levels: [1, 2, 2, 2], total: 7, fidelity: 0.5 },
  { key: 'w', mix: 0.5, levels: [1, 2, 2, 2], total: 7, fidelity: 0.5 },
  { key: 'mix', mix: 0.5, levels: [1, 2, 3, 3], total: 9, fidelity: 0.7938 },
  { key: 'rnd', mix: 0.5, levels: [1, 2, 4, 8], total: 15, fidelity: 0.5181 },
]

function norm(v: number[]): number {
  return Math.sqrt(v.reduce((a, x) => a + x * x, 0))
}

describe('nodes (module 2)', () => {
  it('ACCORDION_LEVELS is the fixed [1,2,1,2] ansatz (6 nodes)', () => {
    expect(ACCORDION_LEVELS).toEqual([1, 2, 1, 2])
    expect(ACCORDION_TOTAL).toBe(6)
  })

  it.each(TABLE)(
    '$key at mix=$mix → levels $levels, total $total, fidelity ≈ $fidelity',
    ({ key, mix, levels, total, fidelity }) => {
      const result = analyzeState(key, mix)
      expect(result.levels).toEqual(levels)
      expect(result.total).toBe(total)
      expect(Math.abs(result.fidelity - fidelity)).toBeLessThan(TOL)
      expect(levelNodeCounts(result.amplitudes)).toEqual(levels)
    },
  )

  it('every preset amplitude vector is L2-normalized', () => {
    const keys: StateKey[] = ['prod', 'bb', 'b23', 'ghz', 'w', 'mix', 'rnd']
    for (const key of keys) {
      const v = stateAmplitudes(key, 0.5)
      expect(v).toHaveLength(16)
      expect(norm(v)).toBeCloseTo(1, 10)
    }
  })

  describe('mix (product ↔ GHZ)', () => {
    it('value 0 → 1,1,1,1 and fidelity 1', () => {
      const result = analyzeState('mix', 0)
      expect(result.levels).toEqual([1, 1, 1, 1])
      expect(result.fidelity).toBeCloseTo(1, 4)
    })

    it('value 0.01 → 1,2,3,3 and fidelity ≈ 0.9998', () => {
      const result = analyzeState('mix', 0.01)
      expect(result.levels).toEqual([1, 2, 3, 3])
      expect(Math.abs(result.fidelity - 0.9998)).toBeLessThan(TOL)
    })

    it('value 1 → 1,2,2,2 and fidelity 0.5', () => {
      const result = analyzeState('mix', 1)
      expect(result.levels).toEqual([1, 2, 2, 2])
      expect(Math.abs(result.fidelity - 0.5)).toBeLessThan(TOL)
    })
  })
})
