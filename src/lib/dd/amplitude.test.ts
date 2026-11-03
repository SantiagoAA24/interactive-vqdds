import { describe, expect, it } from 'vitest'
import {
  amp,
  defaultParameters,
  edge,
  path,
  probabilities,
  type DiagramParams,
  type NodeParams,
} from './amplitude'

const TOL = 0.001

const INITIAL_PROBS = [0.113, 0.118, 0.201, 0.209, 0.016, 0.017, 0.161, 0.167]
const PROBS_C_R_09 = [0.113, 0.118, 0.201, 0.209, 0.143, 0.149, 0.034, 0.035]

/** Seeded PRNG (mulberry32) for property tests — never Math.random without a seed. */
function mulberry32(seed: number): () => number {
  let t = seed >>> 0
  return () => {
    t = (t + 0x6d2b79f5) >>> 0
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function randomNodeParams(rand: () => number): NodeParams {
  return {
    r: rand(),
    w: rand() * 2 * Math.PI,
    f: rand() * 2 * Math.PI,
  }
}

function randomParameters(seed: number): DiagramParams {
  const rand = mulberry32(seed)
  return {
    A: randomNodeParams(rand),
    B: randomNodeParams(rand),
    C: randomNodeParams(rand),
    D: randomNodeParams(rand),
  }
}

describe('amplitude (module 1)', () => {
  it('defaultParameters match test-values.md initials', () => {
    const p = defaultParameters()
    expect(p.A).toEqual({ r: 0.8, w: 0, f: 0 })
    expect(p.B).toEqual({ r: 0.6, w: 0.5, f: 1.2 })
    expect(p.C).toEqual({ r: 0.3, w: 0, f: 2.0 })
    expect(p.D).toEqual({ r: 0.7, w: 0.4, f: 1.57 })
  })

  it('path follows A → B|C → D from q1', () => {
    expect(path([0, 1, 0])).toEqual(['A', 'B', 'D'])
    expect(path([1, 0, 1])).toEqual(['A', 'C', 'D'])
  })

  it('edge 0 uses r and ω; edge 1 uses √(1−r²) and φ', () => {
    const node = { r: 0.6, w: 0.5, f: 1.2 }
    expect(edge(node, 0)).toEqual({ m: 0.6, ph: 0.5 })
    const e1 = edge(node, 1)
    expect(e1.m).toBeCloseTo(Math.sqrt(1 - 0.36), 10)
    expect(e1.ph).toBe(1.2)
  })

  it('amp for path 101 has modulus ≈ 0.129 and probability ≈ 0.017', () => {
    const a = amp(defaultParameters(), [1, 0, 1])
    expect(a.m).toBeCloseTo(0.129, 2)
    expect(a.m * a.m).toBeCloseTo(0.017, 2)
  })

  it('initial probabilities match the eight known values and sum to 1', () => {
    const probs = probabilities(defaultParameters())
    expect(probs).toHaveLength(8)
    for (let i = 0; i < 8; i++) {
      expect(Math.abs(probs[i]! - INITIAL_PROBS[i]!)).toBeLessThan(TOL)
    }
    const sum = probs.reduce((acc, p) => acc + p, 0)
    expect(Math.abs(sum - 1)).toBeLessThan(TOL)
  })

  it('with C.r = 0.9 only states starting with 1 change', () => {
    const p = defaultParameters()
    p.C = { ...p.C, r: 0.9 }
    const probs = probabilities(p)
    for (let i = 0; i < 8; i++) {
      expect(Math.abs(probs[i]! - PROBS_C_R_09[i]!)).toBeLessThan(TOL)
    }
    for (let i = 0; i < 4; i++) {
      expect(Math.abs(probs[i]! - INITIAL_PROBS[i]!)).toBeLessThan(TOL)
    }
  })

  it('changing only C.r alters only probabilities for states with q1 = 1', () => {
    const base = probabilities(defaultParameters())
    const nextParams = defaultParameters()
    nextParams.C = { ...nextParams.C, r: 0.9 }
    const next = probabilities(nextParams)

    for (let i = 0; i < 4; i++) {
      expect(Math.abs(next[i]! - base[i]!)).toBeLessThan(TOL)
    }
    for (let i = 4; i < 8; i++) {
      expect(Math.abs(next[i]! - base[i]!)).toBeGreaterThan(TOL)
    }
  })

  it('changing ω or φ does not change any probability', () => {
    const base = probabilities(defaultParameters())

    const withOmega = defaultParameters()
    withOmega.B = { ...withOmega.B, w: 2.5 }
    withOmega.C = { ...withOmega.C, w: 1.1 }
    withOmega.D = { ...withOmega.D, w: 0.9 }
    const afterOmega = probabilities(withOmega)

    const withPhi = defaultParameters()
    withPhi.A = { ...withPhi.A, f: 3.1 }
    withPhi.B = { ...withPhi.B, f: 0.2 }
    withPhi.C = { ...withPhi.C, f: 4.5 }
    const afterPhi = probabilities(withPhi)

    for (let i = 0; i < 8; i++) {
      expect(Math.abs(afterOmega[i]! - base[i]!)).toBeLessThan(TOL)
      expect(Math.abs(afterPhi[i]! - base[i]!)).toBeLessThan(TOL)
    }
  })

  it('probabilities sum to 1 for seeded random parameters', () => {
    for (const seed of [1, 42, 99, 12345]) {
      const probs = probabilities(randomParameters(seed))
      const sum = probs.reduce((acc, p) => acc + p, 0)
      expect(Math.abs(sum - 1)).toBeLessThan(TOL)
    }
  })
})
