import { describe, expect, it } from 'vitest'
import {
  energyOfState,
  exactGroundEnergy,
  terms,
  type HamKey,
} from './hamiltonian'

const TOL = 0.001

/** Exact ground energies from docs/reference/test-values.md (Module 3). */
const EXACT: { ham: HamKey; n: number; e0: number }[] = [
  { ham: 'zz', n: 4, e0: -1.0 },
  { ham: 'tfim0', n: 4, e0: -3.0 },
  { ham: 'tfim1', n: 4, e0: -4.7588 },
  { ham: 'heis', n: 4, e0: -6.4641 },
  { ham: 'heis', n: 6, e0: -9.9743 },
]

describe('hamiltonian (module 3)', () => {
  it.each(EXACT)('$ham n=$n → exact ground energy ≈ $e0', ({ ham, n, e0 }) => {
    expect(Math.abs(exactGroundEnergy(ham, n) - e0)).toBeLessThan(TOL)
  })

  it('caches exactGroundEnergy by ham+n', () => {
    const a = exactGroundEnergy('zz', 4)
    const b = exactGroundEnergy('zz', 4)
    expect(b).toBe(a)
  })

  it('|0000⟩ with Z₁Z₂ has energy +1', () => {
    const n = 4
    const N = 1 << n
    const re = new Array(N).fill(0)
    const im = new Array(N).fill(0)
    re[0] = 1
    expect(energyOfState(re, im, terms('zz', n), n)).toBeCloseTo(1, 10)
  })

  it('singlet (|01⟩−|10⟩)/√2 gives XX+YY+ZZ = −3', () => {
    const n = 2
    const inv = 1 / Math.SQRT2
    // basis |00⟩,|01⟩,|10⟩,|11⟩ → indices 0,1,2,3
    const re = [0, inv, -inv, 0]
    const im = [0, 0, 0, 0]
    expect(energyOfState(re, im, terms('heis', n), n)).toBeCloseTo(-3, 10)
  })
})
